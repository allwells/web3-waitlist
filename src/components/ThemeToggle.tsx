import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white/10 backdrop-blur-md border border-gray-200 dark:border-gray-800 shadow-lg hover:scale-110 transition-all duration-300 group cursor-pointer"
      aria-label="Toggle Theme"
    >
      <div className="relative w-5 h-5">
        {theme === "dark" ? (
          <Sun className="w-5 h-5 text-yellow-500 absolute inset-0 rotate-0 scale-100 transition-all" />
        ) : (
          <Moon className="w-5 h-5 text-black absolute inset-0 rotate-90 scale-0 transition-all" />
        )}
      </div>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};
