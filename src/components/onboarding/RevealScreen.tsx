import { motion } from "framer-motion";
import { AlertCard, DesktopFrame } from "./shared";

// Gaps between delays shrink so the feed reads as accelerating, then it freezes.
const FEED = [
  { headline: "3,400 shares in the last hour.", detail: "Origin: unverified. Status: spreading.", delay: 0 },
  { headline: "“BREAKING” headline, no byline, no date.", detail: "Origin: unverified. Status: spreading.", delay: 1.2 },
  { headline: "Old footage recirculating as tonight’s news.", detail: "First seen: 2019. Status: spreading.", delay: 1.55 },
];

/** Screen 5 — alerts stack faster and faster in the corner like piling-up
 * desktop notifications, then the stakes line lands. */
export default function RevealScreen() {
  return (
    <DesktopFrame>
      <div className="flex h-full min-h-[26rem] flex-col items-center justify-between gap-6 sm:items-end">
        <div className="flex w-full max-w-xs flex-col gap-2">
          {FEED.map((alert) => (
            <AlertCard key={alert.headline} {...alert} />
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.7, duration: 0.8 }}
          className="text-center text-xl text-foreground"
        >
          This happens every day.{" "}
          <span className="text-muted-foreground">Most of it, no one ever traces.</span>
        </motion.p>
      </div>
    </DesktopFrame>
  );
}
