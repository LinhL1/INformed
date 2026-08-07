import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CHARACTERS, type DesktopNotification, type SceneBeat, type SceneChoiceOption } from "@/data/storyBeats";
import { DesktopFrame, NotificationPopup, PulsingCue } from "@/components/onboarding/shared";

interface SceneRendererProps {
  beats: SceneBeat[];
  onComplete: () => void;
  /** Called when the player picks a choice option, for light state tracking. */
  onChoice?: (choiceId: string, optionId: string) => void;
}

/**
 * Plays a sequence of story beats click-by-click, one beat on screen at a
 * time — same interaction grammar as the onboarding sequence. Choice beats
 * pause advancement until an option is picked; the option's `response` beats
 * are spliced in and every branch converges on the same following beat.
 */
export default function SceneRenderer({ beats, onComplete, onChoice }: SceneRendererProps) {
  const [queue, setQueue] = useState<SceneBeat[]>(beats);
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState<Record<string, string>>({});
  // "Spot it" notification-beat state: decoys clicked away, and whichever
  // popup is mid-shake from a wrong pick. Both reset whenever the beat changes.
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [shakingId, setShakingId] = useState<string | null>(null);
  const [missFlash, setMissFlash] = useState<string | null>(null);

  const beat = queue[index];
  const awaitingChoice = !!beat?.choice && !answered[beat.choice.id];
  const awaitingNotifications = !!beat?.notifications;

  const advance = () => {
    if (awaitingChoice || awaitingNotifications) return;
    if (index < queue.length - 1) setIndex(index + 1);
    else onComplete();
  };

  const pick = (choiceId: string, option: SceneChoiceOption) => {
    const responses = option.response ?? [];
    const nextQueue = [...queue.slice(0, index + 1), ...responses, ...queue.slice(index + 1)];
    setQueue(nextQueue);
    setAnswered((prev) => ({ ...prev, [choiceId]: option.id }));
    onChoice?.(choiceId, option.id);
    if (index + 1 < nextQueue.length) setIndex(index + 1);
    else onComplete();
  };

  const pickNotification = (item: DesktopNotification) => {
    if (!beat.notifications) return;
    if (!item.isTarget) {
      // Wrong pick: shake it, flash its flavor line, then remove it from the
      // board. Never a dead end — worst case the player clears every decoy
      // before the target.
      setShakingId(item.id);
      if (item.missNote) setMissFlash(item.missNote);
      setTimeout(() => setShakingId((cur) => (cur === item.id ? null : cur)), 400);
      setTimeout(() => setDismissed((prev) => [...prev, item.id]), 420);
      setTimeout(() => setMissFlash((cur) => (cur === item.missNote ? null : cur)), 1600);
      return;
    }
    const responses = beat.notifications.response;
    const nextQueue = [...queue.slice(0, index + 1), ...responses, ...queue.slice(index + 1)];
    setQueue(nextQueue);
    if (index + 1 < nextQueue.length) setIndex(index + 1);
    else onComplete();
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") {
        e.preventDefault();
        advance();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  useEffect(() => {
    setDismissed([]);
    setShakingId(null);
    setMissFlash(null);
  }, [index]);

  if (!beat) return null;

  const visibleNotifications = beat.notifications?.items.filter((n) => !dismissed.includes(n.id)) ?? [];

  return (
    <div
      className="relative flex min-h-screen cursor-pointer select-none items-center justify-center bg-background px-6 py-16"
      onClick={advance}
    >
      <DesktopFrame>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full"
          >
            {/* Narration */}
            {!beat.speaker && (
              <p className="text-center text-lg italic leading-relaxed text-muted-foreground">
                {beat.text}
              </p>
            )}

            {/* System / terminal voice */}
            {beat.speaker === "system" && (
              <div className="rounded-lg border border-accent/40 bg-secondary/40 p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent">
                  Signal Desk
                </p>
                <p className="mt-2 text-sm tracking-wide text-foreground">{beat.text}</p>
              </div>
            )}

            {/* Character dialogue */}
            {(beat.speaker === "vale" || beat.speaker === "player") && (
              <div className="space-y-2">
                <p
                  className={`text-xs font-bold uppercase tracking-widest ${
                    beat.speaker === "player" ? "text-muted-foreground" : "text-accent"
                  }`}
                >
                  {CHARACTERS[beat.speaker].name}
                </p>
                <p className="text-xl leading-relaxed text-foreground">{beat.text}</p>
              </div>
            )}

            {/* Choice options */}
            {awaitingChoice && beat.choice && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="mt-8 flex flex-wrap justify-start gap-3"
              >
                {beat.choice.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      pick(beat.choice!.id, option);
                    }}
                    className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent/60 hover:text-accent"
                  >
                    {option.label}
                  </button>
                ))}
              </motion.div>
            )}

            {/* "Spot it" desktop notification moment */}
            {awaitingNotifications && beat.notifications && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="mt-8 space-y-3"
              >
                <AnimatePresence mode="wait">
                  <motion.p
                    key={missFlash ?? "prompt"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`text-center text-xs font-medium tracking-wider ${
                      missFlash ? "italic text-muted-foreground/80" : "uppercase text-muted-foreground"
                    }`}
                  >
                    {missFlash ?? beat.notifications.prompt}
                  </motion.p>
                </AnimatePresence>
                <div className="flex flex-col items-start gap-2 pt-2">
                  <AnimatePresence>
                    {visibleNotifications.map((item, i) => (
                      <div key={item.id} className="w-full max-w-xs">
                        <NotificationPopup
                          app={item.app}
                          headline={item.headline}
                          detail={item.detail}
                          tone={item.tone}
                          index={i}
                          shake={shakingId === item.id}
                          onClick={() => pickNotification(item)}
                        />
                      </div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </DesktopFrame>

      {!awaitingChoice && !awaitingNotifications && <PulsingCue key={index} />}
    </div>
  );
}
