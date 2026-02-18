import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Sun, Moon, Radio } from "lucide-react";
import { useTheme } from "next-themes";

const tickerItems = [
  "96% of people overestimate their ability to spot fake news",
  "False news spreads 6x faster than the truth on social media",
  "Disinformation campaigns have influenced elections in 27+ countries",
  "Only 2% of students can identify a sponsored news article",
  "The average person encounters up to 10,000 ads & messages daily",
  "Bot accounts generate 66% of tweeted links to fake news sites",
  "Critical thinking is a trainable skill — and your best defense",
  "Deepfakes increased by 900% between 2019 and 2023",
  "Media literacy is now considered a national security priority",
  "60% of people share articles without reading beyond the headline",
];

const TickerBanner = () => {
  // Duplicate items so the loop is seamless
  const items = [...tickerItems, ...tickerItems];
  const totalItems = tickerItems.length;
  // Each item ~280px wide — adjust duration for desired speed
  const duration = totalItems * 12;

  return (
    <div className="relative flex h-8 items-center overflow-hidden border-b border-border bg-accent/10">
      {/* BREAKING label */}
      <div className="relative z-10 flex shrink-0 items-center gap-1.5 border-r border-border bg-accent px-3 py-1 h-full">
        <Radio className="h-3 w-3 text-accent-foreground animate-pulse" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-accent-foreground whitespace-nowrap">
          Did You Know
        </span>
      </div>

      {/* Scrolling track */}
      <div className="flex-1 overflow-hidden">
        <motion.div
          className="flex items-center gap-0 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration, ease: "linear", repeat: Infinity }}
        >
          {items.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-3 px-6 text-xs font-medium text-foreground/80">
              {item}
              <span className="text-accent opacity-60">◆</span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

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

  return (
    <header className="sticky top-0 z-50">
      {/* Ticker banner */}
      <TickerBanner />

      {/* Main nav bar */}
      <div className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-12 max-w-3xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            {!isHome && !isModules && (
              <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
                <Link
                  to={getBackPath()}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="text-sm">Back</span>
                </Link>
              </motion.div>
            )}
            <Link to="/" className="flex items-center gap-2" />
          </div>

          {/* Theme toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Header;
