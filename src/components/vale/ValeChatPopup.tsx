import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ValeMessage } from "@/hooks/useValeChat";

const GREETING = "Vale. I cover misinformation, sources, manipulated media — that kind of thing. What's on your mind?";

interface ValeChatPopupProps {
  messages: ValeMessage[];
  isSending: boolean;
  error: string | null;
  onSend: (text: string) => void;
  onClose: () => void;
}

const ValeChatPopup = ({ messages, isSending, error, onSend, onClose }: ValeChatPopupProps) => {
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isSending, error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || isSending) return;
    onSend(draft);
    setDraft("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.96 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed bottom-24 right-6 z-50 flex h-[28rem] w-[22rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/30"
      role="dialog"
      aria-label="Chat with Vale"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-border bg-secondary/60 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-sm font-bold text-accent">
            V
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Vale</p>
            <p className="text-[11px] text-muted-foreground">Misinformation literacy mentor</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-3 px-4 py-4">
          <ChatBubble role="model" content={GREETING} />
          {messages.map((m) => (
            <ChatBubble key={m.id} role={m.role} content={m.content} />
          ))}
          {isSending && <TypingBubble />}
          {error && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border p-3">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask Vale something..."
          maxLength={1000}
          disabled={isSending}
          className="h-9"
        />
        <Button type="submit" size="icon" className="h-9 w-9 shrink-0" disabled={isSending || !draft.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </motion.div>
  );
};

function ChatBubble({ role, content }: { role: "user" | "model"; content: string }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
          isUser
            ? "bg-accent text-accent-foreground"
            : "border border-border bg-secondary/50 text-foreground"
        }`}
      >
        {content}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-xl border border-border bg-secondary/50 px-3 py-2.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  );
}

export default ValeChatPopup;
