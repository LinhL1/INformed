import { StaggerLines } from "./shared";

/** Screen 1 — thematic prologue, part one: the threat. No branding, no
 * mentor, no "you" yet — just the stakes, so Screen 4's "Welcome, Analyst"
 * lands on a stage that's already set. */
export default function PrologueScreen() {
  return (
    <StaggerLines
      stagger={1.3}
      delay={0.5}
      className="max-w-xl space-y-5 text-center"
      lineClassName="text-lg leading-relaxed text-foreground sm:text-xl"
      lines={[
        <>
          Nobody sets out to believe something false.{" "}
        </>,
        <>
          The gap between how fast something spreads and how long it takes to verify used to be a
          nuisance. <span className="text-muted-foreground">Now it&rsquo;s a target.</span>
        </>,
        <>
          During a crisis, a single fake alert can move crowds, roil markets, and trigger a financial panic.
        </>,
        <>
          Governments have noticed.{" "}
          <span className="text-muted-foreground">
            Some of them fund entire operations built around exploiting exactly that gap, no
            invasion required if you can just get a population to believe the wrong thing at the
            wrong moment.
          </span>
        </>,
      ]}
    />
  );
}
