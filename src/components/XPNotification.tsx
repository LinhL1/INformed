import { motion, AnimatePresence } from "framer-motion";
import { Star, Trophy } from "lucide-react";

interface XPNotificationProps {
  xpGained: number | null;
  message?: string;
}

const XPNotification = ({ xpGained, message }: XPNotificationProps) => {
  return (
    <AnimatePresence>
      {xpGained !== null && xpGained > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-accent/30 bg-card px-5 py-3 shadow-lg"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
            <Star className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">+{xpGained} XP</p>
            {message && (
              <p className="text-xs text-muted-foreground">{message}</p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default XPNotification;
