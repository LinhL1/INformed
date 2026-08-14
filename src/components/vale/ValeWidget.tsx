import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useValeChat } from "@/hooks/useValeChat";
import ValeChatPopup from "./ValeChatPopup";

interface ValeWidgetProps {
  /** Scopes Vale to a specific module's concept grounding. Omit for general mode. */
  moduleId?: string;
}

/** Corner-anchored icon that toggles the Vale chat popup. Currently mounted
 * on ModulesPage only — pass `moduleId` when wiring this into a module page
 * later so grounding scopes to that module. */
const ValeWidget = ({ moduleId }: ValeWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const chat = useValeChat(moduleId);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <ValeChatPopup
            messages={chat.messages}
            isSending={chat.isSending}
            error={chat.error}
            onSend={chat.sendMessage}
            onClose={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close chat with Vale" : "Chat with Vale"}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-accent/30 bg-accent text-accent-foreground shadow-lg shadow-accent/20"
      >
        {!isOpen && (
          <motion.span
            className="absolute inset-0 rounded-full bg-accent/40"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </motion.button>
    </>
  );
};

export default ValeWidget;
