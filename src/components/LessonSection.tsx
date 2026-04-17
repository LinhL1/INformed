import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Lightbulb, BookOpen, Quote } from "lucide-react";
import type { LessonSection as LessonSectionType } from "@/data/modules";
import TrueFalseActivity from "@/components/activities/TrueFalseActivity";
import SortingActivity from "@/components/activities/SortingActivity";
import FillBlankActivity from "@/components/activities/FillBlankActivity";
import ScenarioActivity from "@/components/activities/ScenarioActivity";

interface Props {
  section: LessonSectionType;
  index: number;
  onQuizCorrect?: () => void;
  onActivityComplete?: (score: number) => void;
}

const LessonSectionComponent = ({ section, index, onQuizCorrect, onActivityComplete }: Props) => {
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
            <h3 className="text-lg font-semibold text-foreground">
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

      {section.type === "bullets" && (
        <div className="space-y-2">
          {section.title && (
            <h3 className="text-lg font-semibold text-foreground">
              {section.title}
            </h3>
          )}
          {section.content && (
            <p className="text-muted-foreground text-sm leading-relaxed">{section.content}</p>
          )}
          {section.items && (
            <ul className="space-y-1.5 pl-4">
              {section.items.map((item, i) => (
                <li key={i} className="text-[15px] text-muted-foreground leading-relaxed flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {section.type === "key-term" && (
        <div className="border-l-4 border-accent bg-accent/5 rounded-r-xl py-3 px-5 space-y-1">
          <p className="text-base font-bold text-foreground italic flex items-start gap-2">
            <Quote className="h-4 w-4 text-accent mt-1 shrink-0" />
            {section.term}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed pl-6">
            {section.content}
          </p>
        </div>
      )}

      {section.type === "image" && (
        <div className="space-y-2">
          {section.title && (
            <h4 className="text-base font-semibold text-foreground">{section.title}</h4>
          )}
          <img
            src={section.src}
            alt={section.alt || (typeof section.content === "string" ? section.content : "Lesson image")}
            className="w-full rounded-xl border border-border object-cover"
            loading="lazy"
          />
          {section.content && (
            <p className="text-xs text-muted-foreground text-center italic">{section.content}</p>
          )}
        </div>
      )}

      {section.type === "video" && (
        <div className="space-y-2">
          {section.title && (
            <h4 className="text-base font-semibold text-foreground">{section.title}</h4>
          )}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border">
            <iframe
              src={section.src}
              title={section.title || "Embedded video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          {section.content && (
            <p className="text-xs text-muted-foreground text-center italic">{section.content}</p>
          )}
        </div>
      )}

      {section.type === "activity" && (
        <div className="rounded-xl border-2 border-dashed border-border bg-secondary/50 p-5 space-y-2">
          <div className="flex items-center gap-2">
            {section.title && (
              <h4 className="text-base font-semibold text-foreground">
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
              <h4 className="text-base font-semibold text-foreground">
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
                  onClick={() => {
                    if (selectedAnswer === null) {
                      setSelectedAnswer(i);
                      if (i === section.correctIndex && onQuizCorrect) {
                        onQuizCorrect();
                      }
                    }
                  }}
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
                {isCorrect ? "Correct! Well done, agent." : "Not quite. Review the intel and try again."}
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

      {/* New interactive section types */}
      {section.type === "true-false" && section.trueFalseItems && (
        <TrueFalseActivity
          title={section.title}
          items={section.trueFalseItems}
          onComplete={(score) => {
            if (score === section.trueFalseItems!.length && onActivityComplete) {
              onActivityComplete(score);
            }
          }}
        />
      )}

      {section.type === "sorting" && section.sortingCategories && section.sortingItems && (
        <SortingActivity
          title={section.title}
          categories={section.sortingCategories}
          items={section.sortingItems}
          onComplete={(score) => {
            if (score === section.sortingItems!.length && onActivityComplete) {
              onActivityComplete(score);
            }
          }}
        />
      )}

      {section.type === "fill-blank" && section.fillBlankItems && (
        <FillBlankActivity
          title={section.title}
          items={section.fillBlankItems}
          onComplete={(score) => {
            if (score === section.fillBlankItems!.length && onActivityComplete) {
              onActivityComplete(score);
            }
          }}
        />
      )}

      {section.type === "scenario" && section.scenarioData && (
        <ScenarioActivity
          title={section.title}
          scenario={section.scenarioData}
          onComplete={(optimal) => {
            if (optimal && onActivityComplete) {
              onActivityComplete(1);
            }
          }}
        />
      )}
    </motion.div>
  );
};

export default LessonSectionComponent;
