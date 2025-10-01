import { Flame, Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function Header() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark" || !localStorage.getItem("theme");
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newDarkMode);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-primary via-primary to-green-600">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Flame className="h-8 w-8 text-primary-foreground" />
          <h1 className="font-display text-2xl font-black text-primary-foreground md:text-3xl">
            Ball Mtaani
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleTheme}
            className="text-primary-foreground hover:bg-white/10"
            data-testid="button-theme-toggle"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-primary-foreground hover:bg-white/10 md:hidden"
            data-testid="button-menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
