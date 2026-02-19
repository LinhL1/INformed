import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Sun, Moon, Radio } from "lucide-react";
import { useTheme } from "next-themes";

const tickerItems = [
  "False information spreads faster, farther, deeper, and more broadly than true information",
  "On average, false news is ~70% more likely to be retweeted than true news",
  "False news spreads 6× faster on Twitter than truthful news"
];

const Header = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isModules = location.pathname === "/modules";
  const { theme, setTheme } = useTheme();

  const getBackPath = () => {
    if (location.pathname.includes("/lesson/")) {
      return `/module/${location.pathname.split("/module/")[1]?.split("/")[0]}`;
    }
    if (location.pathname.includes("/module/")) {
      return "/modules";
    }
    return "/";
  };

  const items = [...tickerItems, ...tickerItems];
  const duration = tickerItems.length * 7;

  return (
    <header className="sticky top-0 z-50">
      {/* Ticker + theme toggle row */}
      <div className="relative flex h-11 items-center overflow-hidden border-b border-border bg-accent/10 backdrop-blur-md">

        {/* DID YOU KNOW label */}
        <div className="relative z-10 flex shrink-0 items-center gap-2 border-r border-border bg-accent px-4 h-full">
          <Radio className="h-3.5 w-3.5 text-accent-foreground animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-accent-foreground whitespace-nowrap">
            Did You Know
          </span>
        </div>

        {/* Scrolling track — fade-out on right before the button */}
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

        {/* Right-edge fade overlay so text disappears cleanly before the button */}
        <div className="pointer-events-none absolute right-12 top-0 h-full w-16 bg-gradient-to-r from-transparent to-background/60" />

        {/* Theme toggle — pinned to far right */}
        <div className="relative z-10 shrink-0 border-l border-border bg-background/80 px-3 h-full flex items-center">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </motion.button>
        </div>
      </div>

      {/* Back nav — only shown on inner pages, slim */}
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
