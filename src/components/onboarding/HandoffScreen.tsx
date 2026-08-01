import { motion } from "framer-motion";
import { StaggerLines } from "./shared";

/** Screen 9 — hands off into Module 1, Submodule 1. */
export default function HandoffScreen() {
  return (
    <div className="flex max-w-xl flex-col items-center gap-10 text-center">
      <StaggerLines
        stagger={1.0}
        className="space-y-4"
        lineClassName="text-xl leading-relaxed text-foreground sm:text-2xl"
        lines={[
          <>Before you can spot disinformation, you need to know what you&rsquo;re even looking at.</>,
          <span className="font-bold text-accent">Here&rsquo;s your first task.</span>,
        ]}
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.6 }}
        className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground"
      >
        Tap anywhere to begin
      </motion.p>
    </div>
  );
}
