import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Lightbulb, BookOpen, Gamepad2 } from "lucide-react";
import type { LessonSection as LessonSectionType } from "@/data/modules";

interface Props {
  section: LessonSectionType;
  index: number;
}

const LessonSectionComponent = ({ section, index }: Props) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const isCorrect = selectedAnswer === section.correctIndex;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.1 }}
      className="space-y-3"
    >
      {section.type === "text" && (
        <div className="space-y-2">
          {section.title && (
            <h3 className="font-display text-lg font-semibold text-foreground">
              {section.title}
            </h3>
          )}
          <p className="text-muted-foreground leading-relaxed text-[15px]">
            {section.content}
          </p>
        </div>
      )}

      {section.type === "callout" && (
        <div className="rounded-xl border border-accent/30 bg-accent/10 p-4 flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-accent mt-0.5 shrink-0" />
          <p className="text-sm text-foreground leading-relaxed">
            {section.content}
          </p>
        </div>
      )}

      {section.type === "activity" && (
        <div className="rounded-xl border-2 border-dashed border-border bg-secondary/50 p-5 space-y-2">
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5 text-muted-foreground" />
            {section.title && (
              <h4 className="font-display text-base font-semibold text-foreground">
                {section.title}
              </h4>
            )}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {section.content}
          </p>
        </div>
      )}

      {section.type === "quiz" && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
            {section.title && (
              <h4 className="font-display text-base font-semibold text-foreground">
                {section.title}
              </h4>
            )}
          </div>
          <p className="text-sm text-foreground">{section.content}</p>
          <div className="grid gap-2">
            {section.options?.map((option, i) => {
              const isSelected = selectedAnswer === i;
              const showResult = selectedAnswer !== null;
              const isCorrectOption = i === section.correctIndex;

              return (
                <button
                  key={i}
                  onClick={() => selectedAnswer === null && setSelectedAnswer(i)}
                  disabled={selectedAnswer !== null}
                  className={`text-left rounded-lg border p-3 text-sm transition-all duration-200 ${
                    showResult && isCorrectOption
                      ? "border-success bg-success/10 text-foreground"
                      : showResult && isSelected && !isCorrectOption
                      ? "border-destructive bg-destructive/10 text-foreground"
                      : "border-border hover:border-accent/50 hover:bg-secondary/50 text-foreground"
                  } ${selectedAnswer !== null ? "cursor-default" : "cursor-pointer"}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && isCorrectOption && (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    )}
                    {showResult && isSelected && !isCorrectOption && (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          {selectedAnswer !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between"
            >
              <p className={`text-sm font-medium ${isCorrect ? "text-success" : "text-destructive"}`}>
                {isCorrect ? "Correct! Well done." : "Not quite. Review the lesson and try again."}
              </p>
              <button
                onClick={() => setSelectedAnswer(null)}
                className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default LessonSectionComponent;
