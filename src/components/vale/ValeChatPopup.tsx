import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ValeMessage } from "@/hooks/useValeChat";

const GREETING = "Vale here. I'm your mentor to understanding misinformation, sources, manipulated media...What's on your mind?";

interface ValeChatPopupProps {
  messages: ValeMessage[];
  isSending: boolean;
  error: string | null;
  onSend: (text: string) => void;
  onClose: () => void;
}

const MAX_TEXTAREA_HEIGHT = 88; // px, roughly 3-4 lines before it scrolls internally

const ValeChatPopup = ({ messages, isSending, error, onSend, onClose }: ValeChatPopupProps) => {
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isSending, error]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const overflowing = el.scrollHeight > MAX_TEXTAREA_HEIGHT;
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
    // Only reveal the scrollbar once content actually exceeds the cap —
    // overflow-y-auto alone can still reserve a gutter on some platforms.
    el.style.overflowY = overflowing ? "auto" : "hidden";
  }, [draft]);

  const submitDraft = () => {
    if (!draft.trim() || isSending) return;
    onSend(draft);
    setDraft("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitDraft();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitDraft();
    }
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
      <form onSubmit={handleSubmit} className="flex items-end gap-2 border-t border-border p-3">
        <Textarea
          ref={textareaRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Vale something..."
          maxLength={1000}
          disabled={isSending}
          rows={1}
          className="min-h-9 resize-none overflow-y-hidden py-2 leading-relaxed"
          style={{ maxHeight: MAX_TEXTAREA_HEIGHT }}
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
