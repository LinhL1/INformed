import { motion } from "framer-motion";
import { Shield, BookOpen, Swords, Trophy } from "lucide-react";

export type PhaseType = "story" | "learn" | "practice" | "complete";

interface Phase {
  type: PhaseType;
  label: string;
  icon: React.ReactNode;
}

const PHASES: Phase[] = [
  { type: "story", label: "Briefing", icon: <Shield className="h-4 w-4" /> },
  { type: "learn", label: "Intel", icon: <BookOpen className="h-4 w-4" /> },
  { type: "practice", label: "Training", icon: <Swords className="h-4 w-4" /> },
  { type: "complete", label: "Debrief", icon: <Trophy className="h-4 w-4" /> },
];

interface Props {
  currentPhase: number;
  totalPhases: number;
  activePhases: PhaseType[];
  moduleColor: string;
}

const LessonPhaseIndicator = ({ currentPhase, activePhases, moduleColor }: Props) => {
  const phases = PHASES.filter((p) => activePhases.includes(p.type));

  return (
    <div className="flex items-center gap-1">
      {phases.map((phase, i) => {
        const isActive = i === currentPhase;
        const isCompleted = i < currentPhase;

        return (
          <div key={phase.type} className="flex items-center gap-1">
            {i > 0 && (
              <div
                className="h-0.5 w-4 rounded-full transition-colors duration-300"
                style={{
                  backgroundColor: isCompleted ? moduleColor : "hsl(var(--border))",
                }}
              />
            )}
            <motion.div
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
                isActive
                  ? "text-primary-foreground"
                  : isCompleted
                  ? "bg-transparent text-foreground"
                  : "bg-transparent text-muted-foreground"
              }`}
              style={isActive ? { backgroundColor: moduleColor } : undefined}
              animate={isActive ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {phase.icon}
              <span className="hidden sm:inline">{phase.label}</span>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};

export default LessonPhaseIndicator;
