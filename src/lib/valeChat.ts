import { FunctionsHttpError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export interface ValeChatTurn {
  role: "user" | "model";
  content: string;
}

interface ValeChatSuccess {
  reply: string;
}

interface ValeChatError {
  error: string;
  message?: string;
}

export class ValeChatRequestError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

/** Calls the vale-chat Edge Function. Throws ValeChatRequestError with an
 * in-character message when the function returns a handled error (rate
 * limit, upstream failure, etc). */
export async function sendValeMessage(
  message: string,
  history: ValeChatTurn[],
  moduleId?: string,
): Promise<string> {
  const { data, error } = await supabase.functions.invoke<ValeChatSuccess>(
    "vale-chat",
    { body: { message, history, moduleId } },
  );

  if (error) {
    // Non-2xx responses land here rather than in `data` — unwrap the JSON
    // body the function returned (it always sends { error, message }).
    if (error instanceof FunctionsHttpError) {
      try {
        const body: ValeChatError = await error.context.json();
        throw new ValeChatRequestError(body.error, body.message ?? "Something went wrong. Try again.");
      } catch (parseErr) {
        if (parseErr instanceof ValeChatRequestError) throw parseErr;
        throw new ValeChatRequestError("upstream_error", "Something went wrong. Try again.");
      }
    }
    throw new ValeChatRequestError("network_error", "Couldn't reach Vale. Check your connection and try again.");
  }

  if (!data?.reply) {
    throw new ValeChatRequestError("empty_response", "Didn't get a reply back. Try again.");
  }

  return data.reply;
}
