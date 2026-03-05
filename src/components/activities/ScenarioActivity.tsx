import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, AlertTriangle, CheckCircle2 } from "lucide-react";

export interface ScenarioChoice {
  text: string;
  outcome: string;
  isOptimal: boolean;
  xpBonus?: number;
}

export interface ScenarioData {
  situation: string;
  choices: ScenarioChoice[];
}

interface Props {
  title?: string;
  scenario: ScenarioData;
  onComplete?: (optimal: boolean) => void;
}

const ScenarioActivity = ({ title, scenario, onComplete }: Props) => {
  const [selected, setSelected] = useState<number | null>(null);

  const handleChoice = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    onComplete?.(scenario.choices[index].isOptimal);
  };

  return (
    <div className="rounded-xl border-2 border-accent/20 bg-gradient-to-br from-card to-accent/5 p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-accent" />
        <h4 className="font-display text-base font-semibold text-foreground">
          {title || "Decision Point"}
        </h4>
      </div>

      <div className="rounded-lg bg-secondary/50 border border-border p-4">
        <p className="text-sm text-foreground leading-relaxed italic">
          {scenario.situation}
        </p>
      </div>

      <div className="space-y-2">
        {scenario.choices.map((choice, i) => (
          <button
            key={i}
            onClick={() => handleChoice(i)}
            disabled={selected !== null}
            className={`w-full text-left rounded-lg border p-3 text-sm transition-all ${
              selected === i
                ? choice.isOptimal
                  ? "border-success bg-success/10"
                  : "border-destructive bg-destructive/10"
                : selected !== null && choice.isOptimal
                ? "border-success/50 bg-success/5"
                : selected !== null
                ? "border-border opacity-50"
                : "border-border hover:border-accent/50 hover:bg-accent/5 cursor-pointer"
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-muted-foreground">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-foreground">{choice.text}</span>
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-lg p-4 text-sm leading-relaxed ${
              scenario.choices[selected].isOptimal
                ? "bg-success/10 border border-success/30"
                : "bg-destructive/5 border border-destructive/20"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {scenario.choices[selected].isOptimal ? (
                <CheckCircle2 className="h-4 w-4 text-success" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-destructive" />
              )}
              <span className="font-semibold text-foreground">
                {scenario.choices[selected].isOptimal ? "Good call, agent." : "Not the best move."}
              </span>
            </div>
            <p className="text-muted-foreground">{scenario.choices[selected].outcome}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScenarioActivity;
