"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/app/context/ThemeContext";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    return (
        <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-9 h-9 flex items-center justify-center rounded-full border transition-colors"
            style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
        >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
        </button>
    );
}   