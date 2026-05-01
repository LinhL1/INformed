import { motion } from "framer-motion";
import { BookOpen, Swords, Trophy } from "lucide-react";

export type PhaseType = "story" | "learn" | "practice" | "complete";

interface Phase {
  type: PhaseType;
  label: string;
  icon: React.ReactNode;
}

const PHASES: Phase[] = [
  { type: "story", label: "Briefing", icon:"" },
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
  // Collapse consecutive duplicate phases (e.g., multiple practice pages) into a single indicator step
  const collapsed: { type: PhaseType; count: number; startIndex: number }[] = [];
  activePhases.forEach((type, i) => {
    const last = collapsed[collapsed.length - 1];
    if (last && last.type === type) {
      last.count += 1;
    } else {
      collapsed.push({ type, count: 1, startIndex: i });
    }
  });

  return (
    <div className="flex items-center gap-1">
      {collapsed.map((group, i) => {
        const phase = PHASES.find((p) => p.type === group.type);
        if (!phase) return null;
        const groupEndIndex = group.startIndex + group.count - 1;
        const isActive = currentPhase >= group.startIndex && currentPhase <= groupEndIndex;
        const isCompleted = currentPhase > groupEndIndex;
        const subStep = isActive ? currentPhase - group.startIndex + 1 : 0;

        return (
          <div key={`${phase.type}-${i}`} className="flex items-center gap-1">
            {i > 0 && (
              <div
                className="h-0.5 w-4 rounded-full transition-colors duration-300"
                style={{
                  backgroundColor: isCompleted || isActive ? moduleColor : "hsl(var(--border))",
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
              <span className="hidden sm:inline">
                {phase.label}
                {group.count > 1 && (
                  <span className="ml-1 opacity-80">
                    {isActive ? `${subStep}/${group.count}` : group.count > 1 ? `(${group.count})` : ""}
                  </span>
                )}
              </span>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};

export default LessonPhaseIndicator;
