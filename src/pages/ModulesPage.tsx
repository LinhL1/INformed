import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Lock, CheckCircle2, ChevronRight, Star, Shield, Sparkles } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { modules } from "@/data/modules";
import { useProgress } from "@/hooks/useProgress";
import { useXP, getLevel, LEVELS, BADGES } from "@/hooks/useXP";

const ModulesPage = () => {
  const { getModuleProgress } = useProgress();
  const { totalXP, level, earnedBadges } = useXP();

  // Module is unlocked if it's the first, or all lessons in previous module are complete
  const isModuleUnlocked = (index: number) => {
    if (index === 0) return true;
    const prevModule = modules[index - 1];
    const prevProgress = getModuleProgress(prevModule.id, prevModule.subtopics.length);
    return prevProgress.completed === prevProgress.total;
  };

  const isModuleComplete = (index: number) => {
    const mod = modules[index];
    const prog = getModuleProgress(mod.id, mod.subtopics.length);
    return prog.completed === prog.total && prog.total > 0;
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* Detective HQ Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 space-y-4"
        >
          <div className="flex items-center gap-3">
            <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
              Stay Sharp. Stay Informed. 
            </h1>
          </div>
          <p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
            Work through each module to unlock the next. Build your media literacy skills and level up your detective rank.
          </p>

          {/* XP & Level Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-3xl">
                  {level.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rank</p>
                  <p className="font-display text-lg font-bold text-foreground">{level.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-accent" />
                <span className="font-display text-2xl font-bold text-foreground">{totalXP}</span>
                <span className="text-sm text-muted-foreground">XP</span>
              </div>
            </div>

            {/* Level progress */}
            {level.nextLevel && (
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Level {level.level}</span>
                  <span>{level.xpToNext} XP to Level {level.nextLevel.level}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    className="h-full rounded-full bg-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${level.progressPercent}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
            )}

            {/* Badges */}
            {earnedBadges.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {BADGES.filter((b) => earnedBadges.includes(b.id)).map((badge) => (
                  <div
                    key={badge.id}
                    className="flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-foreground"
                    title={badge.description}
                  >
                    <span>{badge.icon}</span>
                    <span>{badge.title}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Detective Map — Vertical Path */}
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute sm:left-10 top-12 bottom-0 w-1 bg-border left-8" />

          <div className="space-y-0">
            {modules.map((module, index) => {
              const unlocked = isModuleUnlocked(index);
              const completed = isModuleComplete(index);
              const progress = getModuleProgress(module.id, module.subtopics.length);

              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="relative flex gap-5 pb-8 sm:gap-7"
                >
                  {/* Map node */}
                  <div className="relative mt-12 z-10 flex flex-col items-center">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-full border-[3px] text-lg font-bold transition-all sm:h-20 sm:w-20 ${
                        completed
                          ? "border-success bg-success text-success-foreground" //completed (nodes)
                          : unlocked
                          ? "border-accent bg-accent text-success-foreground shadow-lg shadow-accent/20" //in progress 
                          : "border-border bg-secondary text-success-foreground" //locked
                      }`}
                    >
                      {completed ? (
                        <CheckCircle2 className="h-7 w-7 sm:h-8 sm:w-8" />
                      ) : unlocked ? (
                        <span className="font-display text-xl sm:text-2xl">{module.number}</span>
                      ) : (
                        <Lock className="h-6 w-6 sm:h-7 sm:w-7" />
                      )}
                    </div>
                  </div>

                  {/* Card */}
                  {unlocked ? (
                    <Link
                      to={`/module/${module.id}`}
                      className="group flex-1 min-w-0"
                    >
                      <div
                        className={`relative overflow-hidden rounded-2xl border bg-card p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
                          completed ? "border-success/30" : "border-border"
                        }`}
                      >
                        {/* Color accent */}
                        <div
                          className="absolute top-0 left-0 h-1 w-full"
                          style={{ backgroundColor: module.color }}
                        />

                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 space-y-2 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                                Case File {module.number}
                              </span>
                              {completed && (
                                <span className="flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-success">
                                  Solved
                                </span>
                              )}
                            </div>
                            <h3 className="font-display text-xl font-semibold text-card-foreground leading-tight">
                              {module.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                              {module.description}
                            </p>

                            {/* Progress */}
                            <div className="pt-2 space-y-1.5">
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>{module.subtopics.length} leads</span>
                                <span>{progress.percent}%</span>
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
                          <ChevronRight className="mt-1 h-5 w-5 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 shrink-0" />
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="flex-1 min-w-0">
                      <div className="relative overflow-hidden rounded-2xl border border-border bg-secondary/50 p-5 opacity-60">
                        <div className="space-y-2">
                          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                            Case File {module.number}
                          </span>
                          <h3 className="font-display text-xl font-semibold text-muted-foreground leading-tight">
                            {module.title}
                          </h3>
                          <p className="text-sm text-muted-foreground/70 leading-relaxed line-clamp-2">
                            Complete the previous case to unlock this investigation.
                          </p>
                          <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                            <Lock className="h-3.5 w-3.5" />
                            <span>Locked</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ModulesPage;
