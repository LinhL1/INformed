import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Lock, CheckCircle2, ChevronRight, Star, Shield, BookOpen } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { modules } from "@/data/modules";
import { useProgress } from "@/hooks/useProgress";
import { useXP, getLevel, LEVELS, BADGES, AVATAR_UPGRADES, STORY_UNLOCKS } from "@/hooks/useXP";
import modulesBg from "@/assets/modules-bg.png";


const ModulesPage = () => {
  const { getModuleProgress } = useProgress();
  const { totalXP, level, earnedBadges } = useXP();

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

  const unlockedStory = STORY_UNLOCKS.filter((s) => level.level >= s.level);

  return (
    <PageTransition>
    <div
      className="min-h-screen"
      style={{ backgroundImage: `url(${modulesBg})`, backgroundSize: "cover", backgroundPosition: "top" }}
    >
    <div className="mx-auto max-w-3xl px-4 py-10">        
    {/* Story Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 space-y-4"
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
            Stay sharp. Stay informed.
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
            The digital city is under siege. Complete each chapter to unlock the next mission. Build your skills, earn XP, and rise through the ranks.
          </p>

          {/* Agent Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-border bg-card p-5"
          >
          
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="relative">
                 <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 ring-2 ring-accent/30 overflow-hidden">
                {typeof level.avatar === "string" && level.avatar.startsWith("/") || level.avatar.includes(".png") ? (
                  <img src={level.avatar} alt={level.title} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-3xl">{level.avatar}</span>
                )}
              </div>
                  <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                    {level.level}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Agent Rank</p>
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
                  <span>{level.title}</span>
                  <span>{level.xpToNext} XP to {level.nextLevel.title}</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-accent to-accent/70"
                    initial={{ width: 0 }}
                    animate={{ width: `${level.progressPercent}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
            )}

            {/* Avatar Upgrades Row */}
            <div className="mt-4 flex gap-2">
              {AVATAR_UPGRADES.map((upgrade) => {
                const unlocked = level.level >= upgrade.level;
                return (
                  <div
                    key={upgrade.level}
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-lg transition-all ${
                      unlocked
                        ? "bg-accent/15 ring-1 ring-accent/30"
                        : "bg-secondary/50 opacity-30 grayscale"
                    }`}
                    title={unlocked ? `${upgrade.name}: ${upgrade.description}` : `Unlock at Level ${upgrade.level}`}
                  >
                    {upgrade.avatar.includes(".png") ? (
                    <img src={upgrade.avatar} alt={upgrade.name} className="h-full w-full object-cover rounded-full" />
                  ) : (
                    upgrade.avatar
                  )}
                  </div>
                );
              })}
            </div>

            {/* Badges */}
            {earnedBadges.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
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

        <p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
          You're a newly recruited junior analyst at CIPHER, fresh out of university. You got flagged by a professor who noticed your pattern recognition, skepticism, curiosity, and saw potential. 
          You have no field experience. No intelligence background. Just sharp eyes and a willingness to learn.
          Your first assignment is supposed to be low-stakes: monitor youth-facing online spaces, gaming forums, student subreddits, social platforms, for coordinated inauthentic behavior and notice the spreading of misinformation. 
          Across dozens of platforms, social media outlets, digital spaces where people share and gather information, you begin to notice a shift/trend in news and media being pushed and the rise of misinformation being spread. The challenging thing is with the rise of AI and the speeds at which information can spread, there is the concern of how these false stories erode trust among your community. Along with the rise in patterns and behaviors that reward cynicism and punish nuance, you find it harder to look away because looking at the bigger picture, these acts arent targeting systems or servers. They're targeting how people think
          No single piece of content is alarming. But the pattern is.
        </p>

        {/* Story Chapter Map */}
        <div className="relative">
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
                          ? "border-success bg-success text-success-foreground"
                          : unlocked
                          ? "border-accent bg-accent text-accent-foreground shadow-lg shadow-accent/20"
                          : "border-border bg-secondary text-muted-foreground"
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
                        <div
                          className="absolute top-0 left-0 h-1 w-full"
                          style={{ backgroundColor: module.color }}
                        />

                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 space-y-2 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold uppercase tracking-widest text-accent">
                                {module.chapterTitle}
                              </span>
                              {completed && (
                                <span className="flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-success">
                                  Complete
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
                                <span>{module.subtopics.length} missions</span>
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
                          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            {module.chapterTitle}
                          </span>
                          <h3 className="font-display text-xl font-semibold text-muted-foreground leading-tight">
                            {module.title}
                          </h3>
                          <p className="text-sm text-muted-foreground/70 leading-relaxed line-clamp-2">
                            Complete the previous chapter to unlock this mission.
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
      </div>
    </PageTransition>
  );
};

export default ModulesPage;
