import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

// Canon per module-1-storyline-v2.md; character data lives in src/data/storyBeats.ts.
export const MENTOR_NAME = "Vale";

/** Pulsing "..." advance cue shown at the bottom of onboarding screens. */
export function PulsingCue() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 0.6 }}
      className="pointer-events-none absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-1.5"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.15, 0.9, 0.15] }}
          transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.25, ease: "easeInOut" }}
          className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
        />
      ))}
    </motion.div>
  );
}

/** Reveals text one character at a time, terminal-style, with a blinking
 * cursor. Used for system/OS-voiced beats rather than narration prose. */
export function TypewriterText({
  text,
  speed = 45,
  startDelay = 400,
  className = "",
}: {
  text: string;
  speed?: number;
  startDelay?: number;
  className?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setCount((c) => {
          const next = c + 1;
          if (next >= text.length && interval) clearInterval(interval);
          return next;
        });
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return (
    <span className={className}>
      {text.slice(0, count)}
      <motion.span
        aria-hidden
        animate={{ opacity: [1, 1, 0, 0] }}
        transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1], ease: "linear" }}
        className="ml-0.5 inline-block w-[0.5ch] translate-y-[0.1em] bg-current align-middle"
        style={{ height: "1em" }}
      />
    </span>
  );
}

/** Fades lines in one at a time, top to bottom. */
export function StaggerLines({
  lines,
  stagger = 0.9,
  delay = 0.4,
  className = "",
  lineClassName = "",
}: {
  lines: ReactNode[];
  stagger?: number;
  delay?: number;
  className?: string;
  lineClassName?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      className={className}
    >
      {lines.map((line, i) => (
        <motion.p
          key={i}
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
          }}
          className={lineClassName}
        >
          {line}
        </motion.p>
      ))}
    </motion.div>
  );
}

/** Monitor/browser chrome wrapping the notification screens so flagged-post
 * alerts read as live OS notifications on a desktop, not floating cards. */
export function DesktopFrame({
  children,
  title = "signal-desk.os",
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/30"
    >
      {/* Title bar */}
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-border bg-secondary/60 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
        </div>
        <span className="text-center text-[11px] font-medium tracking-wide text-muted-foreground">
          {title}
        </span>
        <span aria-hidden className="w-[3.75rem]" />
      </div>

      {/* Desktop surface */}
      <div className="relative min-h-[420px] bg-[radial-gradient(circle_at_30%_15%,hsl(var(--accent)/0.08),transparent_60%)] px-6 py-8 sm:px-10 sm:py-10">
        {children}
      </div>
    </motion.div>
  );
}

/** One clickable desktop notification popup used by the story "spot it" beats
 * (SceneRenderer) — tone "flagged" reads as urgent/red, "neutral" as ordinary
 * desktop noise (calendar pings, chat messages) the real signal hides among. */
export function NotificationPopup({
  app,
  headline,
  detail,
  tone = "neutral",
  onClick,
  shake = false,
  index = 0,
}: {
  app: string;
  headline: string;
  detail?: string;
  tone?: "flagged" | "neutral";
  onClick?: () => void;
  shake?: boolean;
  index?: number;
}) {
  const flagged = tone === "flagged";
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={shake ? { x: [0, -6, 6, -4, 4, 0] } : { opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      transition={
        shake
          ? { duration: 0.4, ease: "easeInOut" }
          : { delay: 0.3 + index * 0.35, duration: 0.4, ease: "easeOut" }
      }
      className={`w-full rounded-lg border p-3 text-left shadow-lg transition-colors ${
        flagged
          ? "border-destructive/40 bg-card hover:border-destructive/70"
          : "border-border bg-card hover:border-accent/50"
      }`}
    >
      <div
        className={`flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] ${
          flagged ? "text-destructive" : "text-muted-foreground"
        }`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${flagged ? "bg-destructive" : "bg-muted-foreground/50"}`} />
        {app}
      </div>
      <p className="mt-1.5 text-xs font-medium text-foreground">{headline}</p>
      {detail && <p className="mt-0.5 text-[11px] text-muted-foreground">{detail}</p>}
    </motion.button>
  );
}

/** One flagged-post alert card, shared by the cold open and the reveal feed. */
export function AlertCard({
  headline,
  detail,
  delay = 0,
}: {
  headline: string;
  detail: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: "easeOut" }}
      className="w-full rounded-lg border border-destructive/40 bg-card p-4 text-left"
    >
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-destructive">
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-destructive"
          animate={{ opacity: [1, 0.25, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
        Flagged
      </div>
      <p className="mt-2 text-sm text-foreground">{headline}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>
    </motion.div>
  );
}
