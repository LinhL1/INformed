import { StaggerLines } from "./shared";

/** Screen 6 — mission statement, one line at a time. */
export default function MissionScreen() {
  return (
    <StaggerLines
      stagger={1.1}
      className="max-w-xl space-y-6 text-center"
      lineClassName="text-2xl leading-relaxed text-foreground sm:text-3xl"
      lines={[
        <>
          Some of what spreads is a mistake.{" "}
          <span className="text-muted-foreground">Some of it is a mistake by design.</span>
        </>,
        <>Someone has to be able to tell the difference.</>,
      ]}
    />
  );
}
