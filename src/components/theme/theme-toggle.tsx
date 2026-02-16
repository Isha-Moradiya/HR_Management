"use client";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className=" rounded-full border border-black dark:border-white text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
    >
      {isDark ? <Sun className="h-5 w-5 " /> : <Moon className="h-5 w-5 " />}
    </Button>
  );
}
