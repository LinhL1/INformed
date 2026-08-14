import { useCallback, useState } from "react";
import { sendValeMessage, ValeChatRequestError, type ValeChatTurn } from "@/lib/valeChat";

export interface ValeMessage {
  id: string;
  role: "user" | "model";
  content: string;
}

export function useValeChat(moduleId?: string) {
  const [messages, setMessages] = useState<ValeMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isSending) return;

      const userMessage: ValeMessage = { id: crypto.randomUUID(), role: "user", content: trimmed };
      const history: ValeChatTurn[] = messages.map(({ role, content }) => ({ role, content }));

      setMessages((prev) => [...prev, userMessage]);
      setError(null);
      setIsSending(true);

      try {
        const reply = await sendValeMessage(trimmed, history, moduleId);
        setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "model", content: reply }]);
      } catch (err) {
        const message =
          err instanceof ValeChatRequestError ? err.message : "Something went wrong. Try again.";
        setError(message);
      } finally {
        setIsSending(false);
      }
    },
    [messages, isSending, moduleId],
  );

  return { messages, isSending, error, sendMessage };
}
