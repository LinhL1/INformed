import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { Module } from "@/data/modules";

interface ModuleCardProps {
  module: Module;
  progress: { completed: number; total: number; percent: number };
  index: number;
}

const ModuleCard = ({ module, progress, index }: ModuleCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link to={`/module/${module.id}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          {/* Module number accent bar */}
          <div
            className="absolute top-0 left-0 h-1 w-full"
            style={{ backgroundColor: module.color }}
          />

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Module {module.number}
                </span>
              </div>

              <h3 className="font-display text-xl font-semibold text-card-foreground leading-tight">
                {module.title}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {module.description}
              </p>

              {/* Progress bar */}
              <div className="pt-2 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{module.subtopics.length} lessons</span>
                  <span>{progress.percent}% complete</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: module.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.percent}%` }}
                    transition={{ duration: 0.6, delay: index * 0.08 + 0.3 }}
                  />
                </div>
              </div>
            </div>

            <ChevronRight className="mt-1 h-5 w-5 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ModuleCard;
