import { useParams, Navigate, useNavigate, Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, ArrowLeft, Star, Shield } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import LessonSectionComponent from "@/components/LessonSection";
import XPNotification from "@/components/XPNotification";
import LessonPhaseIndicator, { type PhaseType } from "@/components/LessonPhaseIndicator";
import { modules, type LessonSection } from "@/data/modules";
import { useProgress } from "@/hooks/useProgress";
import { useXP } from "@/hooks/useXP";

// Classify a section into a phase
function classifySection(section: LessonSection): "story" | "learn" | "practice" {
  switch (section.type) {
    case "quiz":
    case "true-false":
    case "sorting":
    case "fill-blank":
    case "scenario":
    case "activity":
      return "practice";
    default:
      return "learn";
  }
}

// Group sections into ordered phases
function buildPhases(sections: LessonSection[], hasStoryBriefing: boolean) {
  const phases: { type: PhaseType; sections: LessonSection[] }[] = [];

  // Story phase (briefing is rendered separately, but we still track the phase)
  if (hasStoryBriefing) {
    phases.push({ type: "story", sections: [] });
  }

  const learnSections: LessonSection[] = [];
  const practiceSections: LessonSection[] = [];

  for (const section of sections) {
    const phase = classifySection(section);
    if (phase === "learn") learnSections.push(section);
    else practiceSections.push(section);
  }

  if (learnSections.length > 0) {
    phases.push({ type: "learn", sections: learnSections });
  }
  if (practiceSections.length > 0) {
    phases.push({ type: "practice", sections: practiceSections });
  }

  // Always add complete phase
  phases.push({ type: "complete", sections: [] });

  return phases;
}

const PHASE_TITLES: Record<PhaseType, string> = {
  story: "Mission Briefing",
  learn: "Intelligence Report",
  practice: "Field Training",
  complete: "Mission Debrief",
};

const PHASE_DESCRIPTIONS: Record<PhaseType, string> = {
  story: "Review your mission objectives before heading into the field.",
  learn: "Study the intel gathered by HQ. Knowledge is your greatest weapon.",
  practice: "Put your training to the test with hands-on exercises.",
  complete: "Review your performance and collect your rewards.",
};

const LessonPage = () => {
  const { moduleId, lessonId } = useParams<{ moduleId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { markComplete, isComplete } = useProgress();
  const { awardLessonXP, awardQuizXP, awardActivityXP, totalXP, level } = useXP();
  const [xpNotification, setXpNotification] = useState<{ amount: number; message: string } | null>(null);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);

  const module = modules.find((m) => m.id === moduleId);
  const subtopicIndex = module ? module.subtopics.findIndex((s) => s.id === lessonId) : -1;
  const subtopic = module ? module.subtopics[subtopicIndex] : undefined;

  const phases = useMemo(
    () => subtopic ? buildPhases(subtopic.sections, !!subtopic.storyBriefing) : [],
    [subtopic]
  );

  if (!module) return <Navigate to="/" replace />;
  if (!subtopic) return <Navigate to={`/module/${moduleId}`} replace />;

  const completed = isComplete(module.id, subtopic.id);
  const nextSubtopic = module.subtopics[subtopicIndex + 1];

  const activePhaseTypes = phases.map((p) => p.type);
  const currentPhase = phases[currentPhaseIndex];
  const isLastPhase = currentPhaseIndex === phases.length - 1;
  const isFirstPhase = currentPhaseIndex === 0;

  const showXPNotification = (amount: number, message: string) => {
    setXpNotification({ amount, message });
    setTimeout(() => setXpNotification(null), 2500);
  };

  const handleQuizCorrect = (quizKey: string) => {
    const xp = awardQuizXP(quizKey);
    if (xp > 0) showXPNotification(xp, "Quiz bonus!");
  };

  const handleActivityComplete = (activityKey: string) => {
    const xp = awardActivityXP(activityKey);
    if (xp > 0) showXPNotification(xp, "Activity mastered!");
  };

  const handleNext = () => {
    if (isLastPhase) {
      // Complete the lesson
      if (!completed) {
        markComplete(module.id, subtopic.id);
        const xp = awardLessonXP();
        showXPNotification(xp, "Mission complete!");
      }
      setTimeout(() => {
        if (nextSubtopic) {
          navigate(`/module/${module.id}/lesson/${nextSubtopic.id}`);
        } else {
          navigate(`/module/${module.id}`);
        }
      }, completed ? 0 : 800);
    } else {
      setCurrentPhaseIndex((prev) => Math.min(prev + 1, phases.length - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    setCurrentPhaseIndex((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-2xl px-4 py-10">
        {/* XP bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 flex items-center justify-between rounded-xl border border-border bg-card px-4 py-2"
        >
          <div className="flex items-center gap-2">
            {typeof level.avatar === "string" && (level.avatar.startsWith("/") || level.avatar.includes(".png")) ? (
              <img src={level.avatar} alt={level.title} className="h-6 w-6 rounded-full object-cover" />
            ) : (
              <span className="text-xl">{level.avatar}</span>
            )}
            <span className="text-sm font-medium text-muted-foreground">{level.title}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 text-accent" />
            <span className="text-sm font-bold text-foreground">{totalXP} XP</span>
          </div>
        </motion.div>

        {/* Lesson header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 space-y-2"
        >
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            <span style={{ color: module.color }}>●</span>
            <span>{module.chapterTitle}</span>
            <span>·</span>
            <span>Mission {subtopicIndex + 1} of {module.subtopics.length}</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            {subtopic.title}
          </h1>

          {/* Progress dots */}
          <div className="flex items-center gap-1.5 pt-1">
            {module.subtopics.map((s, i) => (
              <Link
                key={s.id}
                to={`/module/${module.id}/lesson/${s.id}`}
                className={`h-2 rounded-full transition-all duration-200 ${
                  i === subtopicIndex ? "w-6" : "w-2 hover:scale-125"
                }`}
                style={{
                  backgroundColor:
                    i === subtopicIndex
                      ? module.color
                      : i < subtopicIndex
                      ? module.color + "80"
                      : "hsl(var(--border))",
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Phase indicator */}
        <div className="mb-6">
          <LessonPhaseIndicator
            currentPhase={currentPhaseIndex}
            totalPhases={phases.length}
            activePhases={activePhaseTypes}
            moduleColor={module.color}
          />
        </div>

        {/* Phase content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhaseIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {/* Phase header */}
            <div className="mb-6 space-y-1">
              <h2 className="font-display text-lg font-semibold text-foreground">
                {PHASE_TITLES[currentPhase.type]}
              </h2>
              <p className="text-sm text-muted-foreground">
                {PHASE_DESCRIPTIONS[currentPhase.type]}
              </p>
            </div>

            {/* Story phase */}
            {currentPhase.type === "story" && subtopic.storyBriefing && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-accent/20 bg-gradient-to-br from-accent/5 to-transparent p-6"
              >
                <div className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-accent mt-0.5 shrink-0" />
                  <div className="space-y-3">
                    <p className="text-foreground leading-relaxed">
                      {subtopic.storyBriefing}
                    </p>
                    <p className="text-sm text-muted-foreground italic">
                      {subtopic.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Learn / Practice phases — render sections */}
            {(currentPhase.type === "learn" || currentPhase.type === "practice") && (
              <div className="space-y-6">
                {currentPhase.sections.map((section, index) => (
                  <LessonSectionComponent
                    key={index}
                    section={section}
                    index={index}
                    onQuizCorrect={
                      section.type === "quiz"
                        ? () => handleQuizCorrect(`${module.id}-${subtopic.id}-${currentPhaseIndex}-${index}`)
                        : undefined
                    }
                    onActivityComplete={
                      ["true-false", "sorting", "fill-blank", "scenario"].includes(section.type)
                        ? () => handleActivityComplete(`${module.id}-${subtopic.id}-${currentPhaseIndex}-${index}`)
                        : undefined
                    }
                  />
                ))}
              </div>
            )}

            {/* Complete phase */}
            {currentPhase.type === "complete" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6 py-8 text-center"
              >
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-full text-4xl"
                  style={{ backgroundColor: module.color + "20" }}
                >
                  {completed ? "🏆" : "🎯"}
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-xl font-bold text-foreground">
                    {completed ? "Mission Already Completed!" : "Ready to Complete Mission?"}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    {completed
                      ? `You've already earned XP for this mission. ${nextSubtopic ? "Proceed to the next mission." : "Return to chapter overview."}`
                      : "You've reviewed the intel and completed your training. Submit your report to earn XP."}
                  </p>
                </div>
                {!completed && (
                  <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
                    <Star className="h-4 w-4" />
                    <span>+25 XP upon completion</span>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex items-center justify-between"
        >
          <button
            onClick={handlePrev}
            disabled={isFirstPhase}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
              isFirstPhase
                ? "invisible"
                : "border border-border text-foreground hover:bg-secondary"
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <button
            onClick={handleNext}
            className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 ${
              isLastPhase
                ? completed
                  ? "bg-success text-success-foreground hover:opacity-90"
                  : "bg-primary text-primary-foreground hover:opacity-90"
                : "text-primary-foreground hover:opacity-90"
            }`}
            style={!isLastPhase ? { backgroundColor: module.color } : undefined}
          >
            {isLastPhase ? (
              completed ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  {nextSubtopic ? "Next Mission" : "Back to Chapter"}
                </>
              ) : (
                <>
                  Complete Mission
                  <Star className="h-4 w-4" />
                </>
              )
            ) : (
              <>
                Continue
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </motion.div>
      </div>

      <XPNotification
        xpGained={xpNotification?.amount ?? null}
        message={xpNotification?.message}
      />
    </PageTransition>
  );
};

export default LessonPage;
