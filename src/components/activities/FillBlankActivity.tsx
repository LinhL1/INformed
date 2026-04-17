import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, PenLine } from "lucide-react";

export interface FillBlankItem {
  textBefore: string;
  textAfter: string;
  correctAnswer: string;
  acceptableAnswers?: string[]; // alternative accepted answers
  hint?: string;
}

interface Props {
  title?: string;
  items: FillBlankItem[];
  onComplete?: (score: number) => void;
}

const FillBlankActivity = ({ title, items, onComplete }: Props) => {
  const [answers, setAnswers] = useState<string[]>(new Array(items.length).fill(""));
  const [submitted, setSubmitted] = useState(false);

  const normalize = (s: string) => s.trim().toLowerCase().replace(/[^a-z0-9\s]/g, "");

  const isCorrect = (index: number) => {
    const userAnswer = normalize(answers[index]);
    const correct = normalize(items[index].correctAnswer);
    const alts = items[index].acceptableAnswers?.map(normalize) || [];
    return userAnswer === correct || alts.includes(userAnswer);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const score = items.filter((_, i) => isCorrect(i)).length;
    onComplete?.(score);
  };

  const handleReset = () => {
    setAnswers(new Array(items.length).fill(""));
    setSubmitted(false);
  };

  const score = submitted ? items.filter((_, i) => isCorrect(i)).length : 0;
  const allFilled = answers.every((a) => a.trim().length > 0);

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <PenLine className="h-5 w-5 text-accent" />
        <h4 className="text-base font-semibold text-foreground">
          {title || "Fill in the Blanks"}
        </h4>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="space-y-1">
            <p className="text-sm text-foreground leading-relaxed">
              {item.textBefore}
              <span className="inline-flex items-center mx-1">
                <input
                  type="text"
                  value={answers[index]}
                  onChange={(e) => {
                    if (submitted) return;
                    const newAnswers = [...answers];
                    newAnswers[index] = e.target.value;
                    setAnswers(newAnswers);
                  }}
                  disabled={submitted}
                  placeholder={item.hint || "..."}
                  className={`inline-block w-32 sm:w-40 border-b-2 bg-transparent px-1 py-0.5 text-center text-sm font-medium outline-none transition-colors ${
                    submitted
                      ? isCorrect(index)
                        ? "border-success text-success"
                        : "border-destructive text-destructive"
                      : "border-accent/50 text-foreground focus:border-accent"
                  }`}
                />
                {submitted && (
                  isCorrect(index) ? (
                    <CheckCircle2 className="h-4 w-4 text-success ml-1" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive ml-1" />
                  )
                )}
              </span>
              {item.textAfter}
            </p>
            {submitted && !isCorrect(index) && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-muted-foreground pl-1"
              >
                Correct answer: <span className="font-medium text-foreground">{item.correctAnswer}</span>
              </motion.p>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        {submitted ? (
          <>
            <p
              className={`text-sm font-medium ${
                score === items.length ? "text-success" : "text-destructive"
              }`}
            >
              {score}/{items.length} correct —{" "}
              {score === items.length ? "Intel decoded perfectly!" : "Review the intel and try again."}
            </p>
            <button
              onClick={handleReset}
              className="text-xs font-medium text-muted-foreground hover:text-foreground underline underline-offset-2"
            >
              Try Again
            </button>
          </>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!allFilled}
            className={`ml-auto rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              allFilled
                ? "bg-accent text-accent-foreground hover:opacity-90"
                : "bg-secondary text-muted-foreground cursor-not-allowed"
            }`}
          >
            Submit Answers
          </button>
        )}
      </div>
    </div>
  );
};

export default FillBlankActivity;
