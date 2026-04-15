"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
    theme: Theme; toggleTheme: () => void
}>({
    theme: "light",
    toggleTheme: () => { },
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window === "undefined") return "light";
        const saved = localStorage.getItem("theme") as Theme | null;
        if (saved) return saved;
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
        return "light";
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <ThemeContext.Provider
            value={{
                theme,
                toggleTheme: () => setTheme((t) => (t === "light" ? "dark" :
                    "light")),
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
