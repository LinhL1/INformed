import { StaggerLines } from "./shared";

/** Screen 2 — thematic prologue, part two: the response, then the job. */
export default function AssignmentScreen() {
  return (
    <StaggerLines
      stagger={1.3}
      delay={0.5}
      className="max-w-xl space-y-5 text-center"
      lineClassName="text-lg leading-relaxed text-foreground sm:text-xl"
      lines={[
        <>
          None of which makes any single person helpless. It just means the old habit of immediately
          reacting and sharing isn&rsquo;t a neutral habit anymore.{" "}
        </>,
        <>
          Closing the gap isn&rsquo;t about being smarter than the people trying to exploit it. It&rsquo;s
          about a handful of habits, done consistently: pause before reacting,
          before blindly believing, tracing facts to where it actually came from.{" "}
          <span className="text-muted-foreground">
            That&rsquo;s a mindset, not a talent, which is the whole reason it can be trained.
          </span>
        </>,
        <span className="font-bold text-accent">
          That&rsquo;s the job. Officially, you start Monday.
        </span>,
      ]}
    />
  );
}
