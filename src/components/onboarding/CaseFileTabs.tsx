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
            className={`relative overflow-hidden rounded-lg border p-3 text-left ${unlocked ? "" : "opacity-60"}`}
            style={{
              backgroundColor: `color-mix(in srgb, ${module.color} ${unlocked ? 14 : 8}%, hsl(var(--card)))`,
              borderColor: `color-mix(in srgb, ${module.color} ${unlocked ? 45 : 25}%, hsl(var(--border)))`,
            }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute right-4 -top-2 select-none font-bold leading-none"
              style={{
                fontSize: "6rem",
                color: `color-mix(in srgb, ${module.color} ${unlocked ? 38 : 22}%, transparent)`,
              }}
            >
              {module.number}
            </span>
            <div className="relative flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <span>Case 0{module.number}</span>
              {unlocked ? (
                <FolderOpen className="h-3.5 w-3.5" style={{ color: module.color }} />
              ) : (
                <Lock className="h-3.5 w-3.5" />
              )}
            </div>
            <p
              className={`relative mt-1.5 line-clamp-2 text-xs font-semibold leading-snug ${
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
