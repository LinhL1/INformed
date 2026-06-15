import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Radio, LogOut, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const tickerItems = [
  "False information spreads faster, farther, and more broadly than true information",
  "On average, false news is ~70% more likely to be retweeted than true news",
  "False news spreads 6× faster on Twitter than truthful news"
];

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const isModules = location.pathname === "/modules";
  const { signOut, user } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const emailInitial = (user?.email?.[0] ?? "?").toUpperCase();

  useEffect(() => {
    if (!profileOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [profileOpen]);

  const getBackPath = () => {
    if (location.pathname.includes("/lesson/")) {
      return `/module/${location.pathname.split("/module/")[1]?.split("/")[0]}`;
    }
    if (location.pathname.includes("/module/")) {
      return "/modules";
    }
    return "/";
  };

  const handleSignOut = async () => {
    setProfileOpen(false);
    await signOut();
    navigate("/signin");
  };

  const items = [...tickerItems, ...tickerItems];
  const duration = tickerItems.length * 7;

  return (
    <header className="sticky top-0 z-50">
      {/* Ticker + profile row */}
      <div className="relative flex h-11 items-center border-b border-border bg-accent/10 backdrop-blur-md">

        {/* DID YOU KNOW label */}
        <div className="relative z-10 flex shrink-0 items-center gap-2 border-r border-border bg-accent px-4 h-full">
          <Radio className="h-3.5 w-3.5 text-accent-foreground animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-accent-foreground whitespace-nowrap">
            Did You Know
          </span>
        </div>

        {/* Scrolling track */}
        <div className="flex-1 overflow-hidden">
          <motion.div
            className="flex items-center whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration, ease: "linear", repeat: Infinity }}
          >
            {items.map((item, i) => (
              <span key={i} className="inline-flex items-center gap-3 px-6 text-sm font-medium text-foreground/80">
                {item}
                <span className="text-accent opacity-60">◆</span>
              </span>
            ))}
          </motion.div>
        </div>

        {/* Right-edge fade overlay */}
        <div className="pointer-events-none absolute top-0 h-full w-16 bg-gradient-to-r from-transparent to-background/60" />

        {/* Profile button + dropdown */}
        <div ref={menuRef} className="relative z-10 shrink-0 border-l border-border bg-background/80 px-3 h-full flex items-center">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setProfileOpen(v => !v)}
            aria-label="Profile menu"
            aria-expanded={profileOpen}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground hover:opacity-80 transition-opacity"
          >
            {emailInitial}
          </motion.button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-border bg-card shadow-lg overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Signed in as
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-foreground truncate">
                    {user?.email}
                  </p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <User className="h-3.5 w-3.5" />
                  View profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Back nav — only shown on inner pages */}
      {!isHome && !isModules && (
        <div className="border-b border-border bg-background/80 backdrop-blur-md">
          <div className="mx-auto flex h-12 max-w-3xl items-center px-4">
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
              <Link
                to={getBackPath()}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Back</span>
              </Link>
            </motion.div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
