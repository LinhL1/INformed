import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Zap } from "lucide-react";

export interface TrueFalseItem {
  statement: string;
  isTrue: boolean;
  explanation: string;
}

interface Props {
  title?: string;
  items: TrueFalseItem[];
  onComplete?: (score: number) => void;
}

const TrueFalseActivity = ({ title, items, onComplete }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(boolean | null)[]>(new Array(items.length).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  const current = items[currentIndex];
  const answered = answers[currentIndex] !== null;
  const isCorrect = answers[currentIndex] === current?.isTrue;

  const handleAnswer = (answer: boolean) => {
    if (answered) return;
    const newAnswers = [...answers];
    newAnswers[currentIndex] = answer;
    setAnswers(newAnswers);
    setShowResult(true);
  };

  const handleNext = () => {
    setShowResult(false);
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setFinished(true);
      const score = answers.filter((a, i) => a === items[i].isTrue).length;
      onComplete?.(score);
    }
  };

  const correctCount = answers.filter((a, i) => a === items[i].isTrue).length;
  const totalAnswered = answers.filter((a) => a !== null).length;

  if (finished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-xl border border-accent/30 bg-card p-6 text-center space-y-3"
      >
        <Zap className="h-8 w-8 text-accent mx-auto" />
        <h4 className="text-lg font-bold text-foreground">Rapid Fire Complete!</h4>
        <p className="text-2xl font-bold text-foreground">
          {correctCount}/{items.length}
        </p>
        <p className="text-sm text-muted-foreground">
          {correctCount === items.length
            ? "Perfect score! Your instincts are sharp."
            : correctCount >= items.length * 0.7
            ? "Good work, agent. Most threats neutralized."
            : "Keep training — review the explanations and try again."}
        </p>
        <button
          onClick={() => {
            setCurrentIndex(0);
            setAnswers(new Array(items.length).fill(null));
            setShowResult(false);
            setFinished(false);
          }}
          className="text-xs font-medium text-accent hover:underline"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-accent" />
          <h4 className="text-base font-semibold text-foreground">
            {title || "Rapid Fire"}
          </h4>
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {currentIndex + 1} / {items.length}
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1">
        {items.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < totalAnswered
                ? answers[i] === items[i].isTrue
                  ? "bg-success"
                  : "bg-destructive"
                : i === currentIndex
                ? "bg-accent"
                : "bg-secondary"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4"
        >
          <p className="text-sm text-foreground font-medium leading-relaxed">
            "{current.statement}"
          </p>

          {!answered ? (
            <div className="flex gap-3">
              <button
                onClick={() => handleAnswer(true)}
                className="flex-1 rounded-lg border border-success/30 bg-success/5 px-4 py-3 text-sm font-semibold text-success hover:bg-success/15 transition-colors"
              >
                ✓ True
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="flex-1 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-semibold text-destructive hover:bg-destructive/15 transition-colors"
              >
                ✗ False
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              <div
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                  isCorrect
                    ? "bg-success/10 text-success"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {isCorrect ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                {isCorrect ? "Correct!" : `Incorrect — the answer is ${current.isTrue ? "True" : "False"}`}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {current.explanation}
              </p>
              <button
                onClick={handleNext}
                className="w-full rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90 transition-opacity"
              >
                {currentIndex < items.length - 1 ? "Next →" : "See Results"}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TrueFalseActivity;
