import { useParams, Navigate, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Star, Shield } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import LessonSectionComponent from "@/components/LessonSection";
import XPNotification from "@/components/XPNotification";
import { modules } from "@/data/modules";
import { useProgress } from "@/hooks/useProgress";
import { useXP } from "@/hooks/useXP";

const LessonPage = () => {
  const { moduleId, lessonId } = useParams<{ moduleId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { markComplete, isComplete } = useProgress();
  const { awardLessonXP, awardQuizXP, awardActivityXP, totalXP, level } = useXP();
  const [xpNotification, setXpNotification] = useState<{ amount: number; message: string } | null>(null);

  const module = modules.find((m) => m.id === moduleId);
  if (!module) return <Navigate to="/" replace />;

  const subtopicIndex = module.subtopics.findIndex((s) => s.id === lessonId);
  const subtopic = module.subtopics[subtopicIndex];
  if (!subtopic) return <Navigate to={`/module/${moduleId}`} replace />;

  const completed = isComplete(module.id, subtopic.id);
  const nextSubtopic = module.subtopics[subtopicIndex + 1];

  const showXPNotification = (amount: number, message: string) => {
    setXpNotification({ amount, message });
    setTimeout(() => setXpNotification(null), 2500);
  };

  const handleQuizCorrect = (quizKey: string) => {
    const xp = awardQuizXP(quizKey);
    if (xp > 0) {
      showXPNotification(xp, "Quiz bonus!");
    }
  };

  const handleActivityComplete = (activityKey: string) => {
    const xp = awardActivityXP(activityKey);
    if (xp > 0) {
      showXPNotification(xp, "Activity mastered!");
    }
  };

  const handleComplete = () => {
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
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-2xl px-4 py-10">
        {/* XP bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 flex items-center justify-between rounded-xl border border-border bg-card px-4 py-2"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">{level.avatar}</span>
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
          className="mb-8 space-y-2"
        >
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            <span style={{ color: module.color }}></span>
            <span>{module.chapterTitle}</span>
            <span>·</span>
            <span>Mission {subtopicIndex + 1} of {module.subtopics.length}</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            {subtopic.title}
          </h1>
          <p className="text-muted-foreground">{subtopic.description}</p>

          {/* Progress dots */}
          <div className="flex items-center gap-1.5 pt-2">
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

        {/* Story briefing */}
        {subtopic.storyBriefing && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8 rounded-xl border border-accent/20 bg-gradient-to-br from-accent/5 to-transparent p-5"
          >
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-accent mt-0.5 shrink-0" />
              <p className="text-sm text-foreground leading-relaxed">
                {subtopic.storyBriefing}
              </p>
            </div>
          </motion.div>
        )}

        {/* Sections */}
        <div className="space-y-6">
          {subtopic.sections.map((section, index) => (
            <LessonSectionComponent
              key={index}
              section={section}
              index={index}
              onQuizCorrect={
                section.type === "quiz"
                  ? () => handleQuizCorrect(`${module.id}-${subtopic.id}-${index}`)
                  : undefined
              }
              onActivityComplete={
                ["true-false", "sorting", "fill-blank", "scenario"].includes(section.type)
                  ? () => handleActivityComplete(`${module.id}-${subtopic.id}-${index}`)
                  : undefined
              }
            />
          ))}
        </div>

        {/* Complete button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex flex-col items-center gap-2"
        >
          <button
            onClick={handleComplete}
            className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 ${
              completed
                ? "bg-success text-success-foreground hover:opacity-90"
                : "bg-primary text-primary-foreground hover:opacity-90"
            }`}
          >
            {completed ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Completed — {nextSubtopic ? "Next Mission" : "Back to Chapter"}
              </>
            ) : (
              <>
                Mission Complete
                <span className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                  <Star className="h-3 w-3" /> +25 XP
                </span>
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
