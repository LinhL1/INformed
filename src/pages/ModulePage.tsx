import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, ChevronRight } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import SceneRenderer from "@/components/story/SceneRenderer";
import { modules } from "@/data/modules";
import { storyBeats, getCaseFileEntry, type SceneBeat } from "@/data/storyBeats";
import { useProgress } from "@/hooks/useProgress";
import { useStoryState } from "@/hooks/useStoryState";
import mod1Bg from "@/assets/mod1-bg.png";
import mod2Bg from "@/assets/mod2-bg.png"; 
import mod3Bg from "@/assets/mod3-bg.png";
import mod4Bg from "@/assets/mod4-bg.png";
import mod5Bg from "@/assets/mod5-bg.png";
import mod6Bg from "@/assets/mod6-bg.png"; 



const moduleBackgrounds = {
  introduction: mod1Bg,
  "source-eval": mod2Bg,
  "visual-deception": mod3Bg,
  "national-security": mod4Bg,
  "social-media": mod5Bg,
  "digital-forensics": mod6Bg

};

const moduleColorMap = {
  introduction: 1,
  "source-eval": 2,
  "visual-deception": 3,
  "national-security": 4,
  "social-media": 5,
  "digital-forensics": 6
};

const ModulePage = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const module = modules.find((m) => m.id === moduleId);
  const story = module ? storyBeats[module.id] : undefined;
  const { isComplete, getModuleProgress, isLoading } = useProgress();
  const { hasSeen, markSeen, recordChoice } = useStoryState();
  // Replay state (module already finished, story already watched once): which
  // half of the arc is currently playing, and whether the player skipped out.
  // openingShown/closingShown track whether each scene has already played
  // *during this page visit* — without this, marking a scene seen for the
  // first time (markSeen) flips hasSeen() reactively mid-visit, which would
  // otherwise make the replay condition immediately true again and re-show
  // the same scene the player just finished. All four reset naturally on
  // remount, i.e. every fresh navigation into the module.
  const [replayStep, setReplayStep] = useState<"opening" | "closing">(() =>
    story?.opening ? "opening" : "closing"
  );
  const [skipReplay, setSkipReplay] = useState(false);
  const [openingShown, setOpeningShown] = useState(false);
  const [closingShown, setClosingShown] = useState(false);

  if (!module) return <Navigate to="/" replace />;

  const progress = getModuleProgress(module.id, module.subtopics.length);

  // Story scenes — opening plays before any lesson is complete, closing plays
  // once all are. Both are once-per-user the first time (seen-flags in
  // user_metadata) and wait for the progress fetch so they don't mis-fire on
  // stale zeros. After that first time, clicking back into the module always
  // offers a skippable replay of whatever scene(s) have already unlocked —
  // this doesn't require the module to be fully complete: if you've only
  // seen the opening so far, revisiting replays just the opening; once
  // you've also seen the closing, revisiting replays the full arc.
  const openingKey = `${module.id}:opening`;
  const closingKey = `${module.id}:closing`;
  const moduleComplete = progress.total > 0 && progress.completed === progress.total;
  const closingBeats: SceneBeat[] = story
    ? [...(story.closing ?? []), { speaker: "system", text: `ENTRY LOGGED — ${getCaseFileEntry(module.id)}` }]
    : [];
  const canReplayOpening = !!story?.opening && hasSeen(openingKey) && !openingShown;
  const canReplayClosing = !!story && hasSeen(closingKey) && !closingShown;

  if (!isLoading && story?.opening && !hasSeen(openingKey) && progress.completed === 0 && !openingShown) {
    return (
      <PageTransition>
        <SceneRenderer
          beats={story.opening}
          onComplete={() => {
            markSeen(openingKey);
            setOpeningShown(true);
          }}
          onChoice={(choiceId, optionId) => recordChoice(`${module.id}:${choiceId}`, optionId)}
        />
      </PageTransition>
    );
  }

  if (!isLoading && story && !hasSeen(closingKey) && moduleComplete && !closingShown) {
    return (
      <PageTransition>
        <SceneRenderer
          beats={closingBeats}
          onComplete={() => {
            markSeen(closingKey);
            setClosingShown(true);
          }}
          onChoice={(choiceId, optionId) => recordChoice(`${module.id}:${choiceId}`, optionId)}
        />
      </PageTransition>
    );
  }

  if (!isLoading && story && (canReplayOpening || canReplayClosing) && !skipReplay) {
    const replayingOpening = replayStep === "opening" && canReplayOpening;
    const beats = replayingOpening ? story.opening! : closingBeats;
    return (
      <PageTransition>
        <div className="relative">
          <button
            onClick={() => setSkipReplay(true)}
            className="absolute right-5 top-5 z-10 rounded-full border border-border bg-card/80 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
          >
            Skip replay
          </button>
          <SceneRenderer
            beats={beats}
            onComplete={() => {
              if (replayingOpening) {
                setOpeningShown(true);
                // Only continue into the closing replay if it's actually
                // unlocked — otherwise this would leak closing/case-file
                // content for a module that isn't finished yet.
                if (canReplayClosing) setReplayStep("closing");
                else setSkipReplay(true);
              } else {
                setClosingShown(true);
                setSkipReplay(true);
              }
            }}
            onChoice={(choiceId, optionId) => recordChoice(`${module.id}:${choiceId}`, optionId)}
          />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div
        className="min-h-screen"
        style={
          moduleBackgrounds[module.id]
            ? {
                backgroundImage: `url(${moduleBackgrounds[module.id]})`,
                backgroundSize: "cover",
                backgroundPosition: "top",
              }
            : {}
        }
      >
      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 space-y-3"
        >
          <div className="flex items-center gap-3">
          <span
            style={{
              backgroundColor: `hsl(var(--module-${moduleColorMap[module.id]}))`
            }}
            className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-white"
          >
            {module.chapterTitle}
          </span>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
            {module.title}
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            {module.description}
          </p>

          {/* Story intro */}
          {module.storyIntro && (
            <motion.div
              initial={{ opacity: 1, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border border-accent/20 bg-gradient-to-br from-accent/5 to-transparent p-5"
            >
              <div className="flex items-start gap-3">
                <p className="text-sm text-foreground leading-relaxed italic">
                  {module.storyIntro}
                </p>
              </div>
            </motion.div>
          )}

          {/* Progress */}
          <div className="flex items-center gap-3 pt-2">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: module.color }}
                initial={{ width: 0 }}
                animate={{ width: `${progress.percent}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {progress.completed}/{progress.total} missions
            </span>
          </div>
        </motion.div>

        {/* Missions */}
        <div className="space-y-3">
          {module.subtopics.map((subtopic, index) => {
            const completed = isComplete(module.id, subtopic.id);

            return (
              <motion.div
                key={subtopic.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
              >
                <Link
                  to={`/module/${module.id}/lesson/${subtopic.id}`}
                  className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                      completed
                        ? "bg-success text-success-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {completed ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-base font-semibold text-card-foreground">
                      {subtopic.title}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {subtopic.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{subtopic.estimatedMinutes}m</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ModulePage;
