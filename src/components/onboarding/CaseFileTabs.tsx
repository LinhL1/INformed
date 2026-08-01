import { motion } from "framer-motion";
import { FolderOpen, Lock } from "lucide-react";
import { modules } from "@/data/modules";

/**
 * Lightweight case-file view of the six modules, used by onboarding Screen 5.
 * Intended as the seed of the eventual persistent module-navigation component —
 * extend this rather than duplicating it when that lands (see CLAUDE.md).
 */
export default function CaseFileTabs({ unlockedCount = 1 }: { unlockedCount?: number }) {
  return (
    <div className="grid w-full grid-cols-2 gap-2.5 sm:grid-cols-3">
      {modules.map((module, i) => {
        const unlocked = i < unlockedCount;
        return (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.12, duration: 0.4, ease: "easeOut" }}
            className={`relative overflow-hidden rounded-lg border p-3 text-left ${
              unlocked ? "border-accent/50 bg-card" : "border-border bg-secondary/40 opacity-50"
            }`}
          >
            <div className="absolute left-0 top-0 h-0.5 w-full" style={{ backgroundColor: module.color }} />
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <span>Case 0{module.number}</span>
              {unlocked ? (
                <FolderOpen className="h-3.5 w-3.5 text-accent" />
              ) : (
                <Lock className="h-3.5 w-3.5" />
              )}
            </div>
            <p
              className={`mt-1.5 line-clamp-2 text-xs font-semibold leading-snug ${
                unlocked ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {module.title}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
