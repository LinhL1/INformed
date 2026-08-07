import { motion } from "framer-motion";
import { AlertCard, DesktopFrame } from "./shared";

/** Screen 4 — a welcome into the plot, then the first alert fades in
 * like a real OS notification landing on the analyst's desktop. */
export default function ColdOpenScreen() {
  return (
    <DesktopFrame>
      <div className="flex h-full min-h-[26rem] flex-col justify-between gap-10 text-center sm:text-left">
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xs font-bold uppercase tracking-[0.3em] text-accent"
          >
            INformed &middot; The Signal Desk
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0, ease: "easeOut" }}
            className="mt-3 text-lg text-foreground"
          >
            Welcome, Analyst.{" "}
            <span className="text-muted-foreground">Your feed just went live.</span>
          </motion.p>
        </div>
        <div className="flex justify-center sm:justify-end">
          <div className="w-full max-w-xs">
            <AlertCard
              headline="3,400 shares in the last hour."
              detail="Origin: unverified. Status: spreading."
              delay={2.2}
            />
          </div>
        </div>
      </div>
    </DesktopFrame>
  );
}
