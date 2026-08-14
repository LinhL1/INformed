// Proxies chat turns to Gemini Flash on Vale's behalf. Keeps the Gemini API
// key server-side, assembles the system prompt (persona + scoped grounding)
// per request, and rate-limits per authenticated user via vale_chat_usage.
import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { VALE_PERSONA } from "./persona.ts";
import { GENERAL_SUMMARY, MODULE_SUMMARIES } from "./grounding.ts";

// "-latest" alias avoids per-account entitlement walls on pinned snapshots
// (e.g. "gemini-2.5-flash" 404s as "no longer available to new users" on
// some newer API keys even though it's still listed by ListModels).
// Using the *lite* tier specifically: "gemini-flash-latest" (the newest,
// heaviest release) was returning frequent 503 "high demand" errors under
// real-world load; gemini-flash-lite-latest is lighter-weight, comfortably
// enough for Vale's short chat replies, and was reliably fast (~0.5s) with
// zero failures across repeated real-persona test calls.
const GEMINI_MODEL = Deno.env.get("GEMINI_MODEL") ?? "gemini-flash-lite-latest";
const DAILY_LIMIT = Number(Deno.env.get("VALE_DAILY_LIMIT") ?? "40");
const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY_TURNS = 12;

interface ChatTurn {
  role: "user" | "model";
  content: string;
}

interface ChatRequestBody {
  message: string;
  history?: ChatTurn[];
  moduleId?: string;
}

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "method_not_allowed" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const geminiApiKey = Deno.env.get("GEMINI_API_KEY");

  if (!geminiApiKey) {
    console.error("GEMINI_API_KEY is not set");
    return jsonResponse(
      { error: "server_misconfigured", message: "Vale's offline. Not your fault — try again later." },
      500,
    );
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return jsonResponse({ error: "unauthorized" }, 401);
  }

  const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    return jsonResponse({ error: "unauthorized" }, 401);
  }

  let body: ChatRequestBody;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "invalid_body" }, 400);
  }

  const message = body.message?.trim();
  if (!message) {
    return jsonResponse({ error: "empty_message" }, 400);
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return jsonResponse(
      { error: "message_too_long", message: "Shorter version, please. I'm not reading a novel." },
      400,
    );
  }

  const history = Array.isArray(body.history) ? body.history.slice(-MAX_HISTORY_TURNS) : [];

  // Rate limit: one row per user per day, incremented on every request.
  const today = new Date().toISOString().slice(0, 10);
  const { data: usageRow } = await supabaseClient
    .from("vale_chat_usage")
    .select("request_count")
    .eq("user_id", user.id)
    .eq("usage_date", today)
    .maybeSingle();

  const currentCount = usageRow?.request_count ?? 0;
  if (currentCount >= DAILY_LIMIT) {
    return jsonResponse(
      {
        error: "rate_limited",
        message: "You've hit your limit for today. Even I need a break from you. Back tomorrow.",
      },
      429,
    );
  }

  await supabaseClient
    .from("vale_chat_usage")
    .upsert(
      { user_id: user.id, usage_date: today, request_count: currentCount + 1 },
      { onConflict: "user_id,usage_date" },
    );

  // Assemble grounding: module-scoped if we have a summary for that module,
  // otherwise fall back to the general (all-modules) summary.
  const moduleGrounding = body.moduleId ? MODULE_SUMMARIES[body.moduleId] : undefined;
  const groundingBlock = moduleGrounding
    ? `CURRENT SCOPE: The user is on the "${moduleGrounding.title}" module page. Focus on this module's material below. If they ask about a different module, give a short dry redirect back to this one.\n\n${moduleGrounding.summary}`
    : `CURRENT SCOPE: The user is on the general modules overview page (not a specific module). You can discuss misinformation literacy across the whole course.\n\n${GENERAL_SUMMARY}`;

  const systemPrompt = `${VALE_PERSONA}\n\n${groundingBlock}`;

  const contents = [
    ...history.map((turn) => ({
      role: turn.role,
      parts: [{ text: turn.content }],
    })),
    { role: "user", parts: [{ text: message }] },
  ];

  const geminiRequestBody = JSON.stringify({
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents,
    generationConfig: {
      // Persona enforces an ~80-word hard cap on replies; this ceiling is
      // just headroom against occasional overshoot, not the target length.
      maxOutputTokens: 500,
      temperature: 0.9,
      // No thinkingConfig: gemini-flash-lite-latest 400s on that param entirely,
      // and testing showed it doesn't spend output budget on hidden reasoning
      // tokens by default anyway, so there's nothing to disable here.
    },
  });
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${geminiApiKey}`;

  // Gemini's Flash endpoint returns transient 503s ("high demand") fairly
  // often — worth one quick retry before surfacing an error to the user.
  const MAX_ATTEMPTS = 2;
  let geminiRes: Response | undefined;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      geminiRes = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: geminiRequestBody,
      });
    } catch (err) {
      console.error(`Gemini fetch failed (attempt ${attempt})`, err);
      geminiRes = undefined;
    }

    if (geminiRes && geminiRes.status < 500) break;
    if (attempt < MAX_ATTEMPTS) await new Promise((r) => setTimeout(r, 500));
  }

  if (!geminiRes) {
    return jsonResponse(
      { error: "upstream_unreachable", message: "Couldn't reach the model. Try again in a bit." },
      502,
    );
  }

  if (geminiRes.status === 429) {
    return jsonResponse(
      { error: "upstream_rate_limited", message: "Everyone's asking me things right now. Give it a minute." },
      429,
    );
  }

  if (!geminiRes.ok) {
    const errText = await geminiRes.text();
    console.error("Gemini error", geminiRes.status, errText);
    const busy = geminiRes.status === 503;
    return jsonResponse(
      {
        error: "upstream_error",
        message: busy
          ? "High demand on the model right now. Give it a few seconds and try again."
          : "Something broke on my end, not yours. Try again.",
      },
      502,
    );
  }

  const geminiData = await geminiRes.json();
  const reply: string | undefined = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!reply) {
    return jsonResponse(
      { error: "no_reply", message: "That one didn't land right. Try rephrasing?" },
      502,
    );
  }

  return jsonResponse({ reply: reply.trim() }, 200);
});
