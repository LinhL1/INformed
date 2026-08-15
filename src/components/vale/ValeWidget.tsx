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
  const [isHovered, setIsHovered] = useState(false);
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

      <div
        className="fixed bottom-6 right-6 z-50 flex items-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence>
          {isHovered && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 8, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="mr-3 whitespace-nowrap rounded-xl border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground shadow-lg"
            >
              Got questions about misinformation?
            </motion.div>
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
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent text-accent-foreground shadow-lg"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </motion.button>
      </div>
    </>
  );
};

export default ValeWidget;
