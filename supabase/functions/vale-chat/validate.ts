// Request-body validation for vale-chat, kept free of Deno APIs so it can be
// unit-tested from the Vite app's Vitest suite (src/test/valeChatValidate.test.ts).
// Everything in the body is client-controlled, so shape and size are checked
// here before anything reaches the paid Gemini call.

export const MAX_MESSAGE_LENGTH = 1000;
export const MAX_HISTORY_TURNS = 12;
// Model replies are capped at maxOutputTokens: 500 (~2,000 chars), user turns at
// MAX_MESSAGE_LENGTH; this ceiling leaves headroom for both while bounding how
// much text a single request can push into the prompt.
export const MAX_HISTORY_TURN_LENGTH = 4000;
const MAX_MODULE_ID_LENGTH = 64;

export interface ChatTurn {
  role: "user" | "model";
  content: string;
}

export type ParsedChatRequest =
  | { ok: true; message: string; history: ChatTurn[]; moduleId?: string }
  | { ok: false; error: string; message?: string };

function isChatTurn(value: unknown): value is ChatTurn {
  if (typeof value !== "object" || value === null) return false;
  const { role, content } = value as Record<string, unknown>;
  return (
    (role === "user" || role === "model") &&
    typeof content === "string" &&
    content.length <= MAX_HISTORY_TURN_LENGTH
  );
}

export function parseChatRequest(body: unknown): ParsedChatRequest {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { ok: false, error: "invalid_body" };
  }
  const { message: rawMessage, history: rawHistory, moduleId: rawModuleId } =
    body as Record<string, unknown>;

  if (rawMessage !== undefined && typeof rawMessage !== "string") {
    return { ok: false, error: "invalid_body" };
  }
  const message = typeof rawMessage === "string" ? rawMessage.trim() : "";
  if (!message) {
    return { ok: false, error: "empty_message" };
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return {
      ok: false,
      error: "message_too_long",
      message: "Shorter version, please. I'm not reading a novel.",
    };
  }

  let history: ChatTurn[] = [];
  if (rawHistory !== undefined) {
    if (!Array.isArray(rawHistory)) return { ok: false, error: "invalid_body" };
    const recent = rawHistory.slice(-MAX_HISTORY_TURNS);
    if (!recent.every(isChatTurn)) return { ok: false, error: "invalid_body" };
    // Copy only the known fields so nothing else from the client is forwarded upstream.
    history = recent.map(({ role, content }) => ({ role, content }));
  }

  const moduleId =
    typeof rawModuleId === "string" && rawModuleId.length <= MAX_MODULE_ID_LENGTH
      ? rawModuleId
      : undefined;

  return { ok: true, message, history, moduleId };
}
