import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { MENTOR_NAME, StaggerLines } from "./shared";

/** Screen 7 — the org seal forms, then the mentor introduces the Desk. */
export default function OrgScreen() {
  return (
    <div className="flex max-w-lg flex-col items-center gap-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative flex h-28 w-28 items-center justify-center rounded-full border-2 border-accent/60 bg-accent/10"
      >
        <div className="absolute inset-2 rounded-full border border-accent/30" />
        <Eye className="h-10 w-10 text-accent" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="text-xs font-bold uppercase tracking-[0.3em] text-accent"
      >
        INformed &middot; The Signal Desk
      </motion.p>

      <StaggerLines
        delay={1.1}
        stagger={1.0}
        className="space-y-4"
        lineClassName="text-lg leading-relaxed text-foreground"
        lines={[
          <>Welcome to the Desk. I&rsquo;m {MENTOR_NAME}.</>,
          <>
            You&rsquo;re not here to catch liars, you&rsquo;re here to{" "}
            <span className="text-accent">see clearly</span>.
          </>,
        ]}
      />
    </div>
  );
}
