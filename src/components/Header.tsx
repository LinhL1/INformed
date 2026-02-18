import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

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
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
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
    </header>
  );
};

export default Header;
