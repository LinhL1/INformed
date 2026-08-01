import { TypewriterText } from "./shared";

/** Screen 3 — the jump cut from "you start Monday" to Monday: a terminal
 * greeting typing itself out before the cold open's notifications land. */
export default function MondayScreen() {
  return (
    <div className="flex min-h-[26rem] items-center justify-center">
      <p className="font-mono text-2xl text-foreground sm:text-3xl">
        <TypewriterText text="Happy Monday..." />
      </p>
    </div>
  );
}
