import { motion } from "framer-motion"
import { Star, Mail, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"
import PageTransition from "@/components/PageTransition"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { useXP, BADGES, AVATAR_UPGRADES } from "@/hooks/useXP"
import { useProgress } from "@/hooks/useProgress"
import { modules } from "@/data/modules"

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { totalXP, level, earnedBadges } = useXP()
  const { getModuleProgress } = useProgress()

  const totalMissions = modules.reduce((sum, m) => sum + m.subtopics.length, 0)
  const completedMissions = modules.reduce(
    (sum, m) => sum + getModuleProgress(m.id, m.subtopics.length).completed,
    0,
  )

  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  const handleSignOut = async () => {
    await signOut()
    navigate("/signin")
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-2xl px-4 py-10">

        {/* Agent card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 rounded-2xl border border-border bg-card p-6"
        >
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-accent/15 ring-2 ring-accent/30">
                {typeof level.avatar === "string" &&
                (level.avatar.startsWith("/") || level.avatar.includes(".png")) ? (
                  <img src={level.avatar} alt={level.title} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-4xl">{level.avatar}</span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                {level.level}
              </div>
            </div>

            {/* Rank + email */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Agent Rank
              </p>
              <p className="text-2xl font-bold text-foreground">{level.title}</p>
              <div className="mt-1 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* XP total */}
          <div className="mt-5 flex items-center gap-2 border-t border-border pt-5">
            <Star className="h-5 w-5 text-accent" />
            <span className="text-2xl font-bold text-foreground">{totalXP}</span>
            <span className="text-sm text-muted-foreground">XP total</span>
          </div>

          {/* Level progress bar */}
          {level.nextLevel && (
            <div className="mt-3 space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{level.title}</span>
                <span>
                  {level.xpToNext} XP to {level.nextLevel.title}
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-accent to-accent/70"
                  initial={{ width: 0 }}
                  animate={{ width: `${level.progressPercent}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6 grid grid-cols-2 gap-3"
        >
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-2xl font-bold text-foreground">{completedMissions}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              of {totalMissions} missions complete
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-2xl font-bold text-foreground">{earnedBadges.length}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              of {BADGES.length} badges earned
            </p>
          </div>
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mb-6 rounded-2xl border border-border bg-card p-5"
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Badges
          </p>
          {earnedBadges.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Complete missions to earn badges.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {BADGES.filter(b => earnedBadges.includes(b.id)).map(badge => (
                <div
                  key={badge.id}
                  title={badge.description}
                  className="flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-sm font-medium text-foreground"
                >
                  <span>{badge.icon}</span>
                  <span>{badge.title}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Avatar progression */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-6 rounded-2xl border border-border bg-card p-5"
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Agent Progression
          </p>
          <div className="flex gap-3 flex-wrap">
            {AVATAR_UPGRADES.map(upgrade => {
              const unlocked = level.level >= upgrade.level
              return (
                <div
                  key={upgrade.level}
                  title={
                    unlocked
                      ? `${upgrade.name}: ${upgrade.description}`
                      : `Unlock at Level ${upgrade.level}`
                  }
                  className={`flex h-14 w-14 items-center justify-center rounded-full transition-all ${
                    unlocked
                      ? "bg-accent/15 ring-2 ring-accent/30"
                      : "bg-secondary/50 opacity-30 grayscale"
                  }`}
                >
                  {upgrade.avatar.includes(".png") ? (
                    <img
                      src={upgrade.avatar}
                      alt={upgrade.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl">{upgrade.avatar}</span>
                  )}
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Account */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="rounded-2xl border border-border bg-card p-5"
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Account
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm font-medium text-foreground">{user?.email}</span>
            </div>
            {joinedDate && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Joined</span>
                <span className="text-sm font-medium text-foreground">{joinedDate}</span>
              </div>
            )}
          </div>
          <div className="mt-5 border-t border-border pt-4">
            <Button
              variant="outline"
              className="w-full text-muted-foreground hover:border-destructive hover:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </motion.div>

      </div>
    </PageTransition>
  )
}
