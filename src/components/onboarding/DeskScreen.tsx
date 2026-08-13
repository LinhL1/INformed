import CaseFileTabs from "./CaseFileTabs";
import { StaggerLines } from "./shared";

/** Screen 8 — the six-tab case file, only Module 1 unlocked. */
export default function DeskScreen() {
  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-8">
      <CaseFileTabs />
      <StaggerLines
        delay={1.2}
        stagger={1.0}
        className="space-y-2 text-center"
        lineClassName="text-lg text-foreground"
        lines={[
          <span className="text-accent">There are six core areas in misinformation. </span>,
          <>
          Misinformation doesn't spread because people are foolish.
          It spreads because it exploits how we think, who we trust, and what we fear.
          Learn the pattern.
          </>,
          <span className="text-muted-foreground">Start with the fundamentals, everyone does.</span>,
        ]}
      />
    </div>
  );
}
