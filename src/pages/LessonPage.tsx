import { useParams, Navigate, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import LessonSectionComponent from "@/components/LessonSection";
import { modules } from "@/data/modules";
import { useProgress } from "@/hooks/useProgress";

const LessonPage = () => {
  const { moduleId, lessonId } = useParams<{ moduleId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { markComplete, isComplete } = useProgress();

  const module = modules.find((m) => m.id === moduleId);
  if (!module) return <Navigate to="/" replace />;

  const subtopicIndex = module.subtopics.findIndex((s) => s.id === lessonId);
  const subtopic = module.subtopics[subtopicIndex];
  if (!subtopic) return <Navigate to={`/module/${moduleId}`} replace />;

  const completed = isComplete(module.id, subtopic.id);
  const nextSubtopic = module.subtopics[subtopicIndex + 1];

  const handleComplete = () => {
    markComplete(module.id, subtopic.id);
    if (nextSubtopic) {
      navigate(`/module/${module.id}/lesson/${nextSubtopic.id}`);
    } else {
      navigate(`/module/${module.id}`);
    }
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-2xl px-4 py-10">
        {/* Lesson header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 space-y-2"
        >
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            <span style={{ color: module.color }}></span>
            <span>Module {module.number}</span>
            <span>·</span>
            <span>Lesson {subtopicIndex + 1} of {module.subtopics.length}</span>
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
                  i === subtopicIndex
                    ? "w-6"
                    : "w-2 hover:scale-125"
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

        {/* Sections */}
        <div className="space-y-6">
          {subtopic.sections.map((section, index) => (
            <LessonSectionComponent key={index} section={section} index={index} />
          ))}
        </div>

        {/* Complete button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex justify-center"
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
                Completed — {nextSubtopic ? "Next Lesson" : "Back to Module"}
              </>
            ) : (
              <>
                Mark Complete & Continue
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default LessonPage;
