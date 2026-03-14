import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-30 dark:border-slate-700 dark:bg-slate-900/50">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="lg:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Overview of your SaaS metrics
          </p>
        </div>
      </div>
      <button
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        className="rounded-lg p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Moon className="h-5 w-5" aria-hidden="true" />
        )}
      </button>
    </header>
  );
}
