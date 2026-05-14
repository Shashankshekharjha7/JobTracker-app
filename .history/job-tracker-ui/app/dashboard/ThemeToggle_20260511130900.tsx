"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      className="w-full justify-start"
      onClick={toggleTheme}
    >
      {theme === "dark" ? (
        <>
          <Sun className="w-5 h-5 mr-3" />
          Light Mode
        </>
      ) : (
        <>
          <Moon className="w-5 h-5 mr-3" />
          Dark Mode
        </>
      )}
    </Button>
  );
}