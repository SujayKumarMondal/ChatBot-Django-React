import React, { createContext, useContext, useState, useEffect } from "react";

export type Theme = "light" | "dark" | "dracula" | "nord" | "solarized" | "material" | "catppuccin";

interface ThemeColors {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
  border: string;
  destructive: string;
}

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  toggleDarkMode: () => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
  warmPalette: boolean;
  setWarmPalette: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const themePresets: Record<Theme, ThemeColors & { label: string; description: string }> = {
  light: {
    label: "Light",
    description: "Clean, bright interface",
    background: "oklch(1 0 0)",
    foreground: "oklch(0.141 0.005 285.823)",
    primary: "oklch(0.21 0.006 285.885)",
    secondary: "oklch(0.967 0.001 286.375)",
    accent: "oklch(0.967 0.001 286.375)",
    muted: "oklch(0.967 0.001 286.375)",
    border: "oklch(0.92 0.004 286.32)",
    destructive: "oklch(0.577 0.245 27.325)",
  },
  dark: {
    label: "Dark",
    description: "Easy on the eyes",
    background: "oklch(0.141 0.005 285.823)",
    foreground: "oklch(0.985 0 0)",
    primary: "oklch(0.92 0.004 286.32)",
    secondary: "oklch(0.274 0.006 286.033)",
    accent: "oklch(0.274 0.006 286.033)",
    muted: "oklch(0.274 0.006 286.033)",
    border: "oklch(1 0 0 / 10%)",
    destructive: "oklch(0.704 0.191 22.216)",
  },
  dracula: {
    label: "Dracula",
    description: "Dark theme with vibrant colors",
    background: "oklch(0.15 0.01 280)",
    foreground: "oklch(0.95 0.01 280)",
    primary: "oklch(0.7 0.2 280)",
    secondary: "oklch(0.5 0.15 300)",
    accent: "oklch(0.75 0.25 20)",
    muted: "oklch(0.35 0.05 280)",
    border: "oklch(0.3 0.05 280)",
    destructive: "oklch(0.7 0.25 0)",
  },
  nord: {
    label: "Nord",
    description: "Arctic, north-bluish color palette",
    background: "oklch(0.18 0.02 260)",
    foreground: "oklch(0.92 0.01 260)",
    primary: "oklch(0.68 0.2 260)",
    secondary: "oklch(0.55 0.15 240)",
    accent: "oklch(0.72 0.22 180)",
    muted: "oklch(0.35 0.05 260)",
    border: "oklch(0.3 0.08 260)",
    destructive: "oklch(0.65 0.25 20)",
  },
  solarized: {
    label: "Solarized",
    description: "Precision colors for dark backgrounds",
    background: "oklch(0.15 0.01 260)",
    foreground: "oklch(0.9 0.01 260)",
    primary: "oklch(0.65 0.15 220)",
    secondary: "oklch(0.55 0.12 250)",
    accent: "oklch(0.72 0.18 40)",
    muted: "oklch(0.4 0.08 260)",
    border: "oklch(0.25 0.05 260)",
    destructive: "oklch(0.68 0.25 10)",
  },
  material: {
    label: "Material Design",
    description: "Google Material Design colors",
    background: "oklch(0.14 0.01 270)",
    foreground: "oklch(0.95 0.01 270)",
    primary: "oklch(0.55 0.25 270)",
    secondary: "oklch(0.5 0.2 300)",
    accent: "oklch(0.75 0.25 50)",
    muted: "oklch(0.35 0.05 270)",
    border: "oklch(0.3 0.08 270)",
    destructive: "oklch(0.65 0.3 20)",
  },
  catppuccin: {
    label: "Catppuccin",
    description: "Soothing pastel color palette",
    background: "oklch(0.16 0.01 280)",
    foreground: "oklch(0.93 0.01 280)",
    primary: "oklch(0.68 0.18 280)",
    secondary: "oklch(0.6 0.15 300)",
    accent: "oklch(0.78 0.22 180)",
    muted: "oklch(0.38 0.06 280)",
    border: "oklch(0.28 0.05 280)",
    destructive: "oklch(0.7 0.25 15)",
  },
};

export const accentColors = [
  { name: "Blue", value: "oklch(0.6 0.2 260)" },
  { name: "Purple", value: "oklch(0.6 0.22 300)" },
  { name: "Green", value: "oklch(0.65 0.2 150)" },
  { name: "Orange", value: "oklch(0.65 0.25 50)" },
  { name: "Pink", value: "oklch(0.7 0.2 20)" },
  { name: "Cyan", value: "oklch(0.65 0.25 200)" },
];

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>("dark");
  const [accentColor, setAccentColor] = useState(accentColors[0].value);
  const [highContrast, setHighContrast] = useState(false);
  const [warmPalette, setWarmPalette] = useState(false);

  // Load preferences from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const savedAccent = localStorage.getItem("accentColor");
    const savedContrast = localStorage.getItem("highContrast");
    const savedWarm = localStorage.getItem("warmPalette");

    if (savedTheme) setCurrentTheme(savedTheme);
    if (savedAccent) setAccentColor(savedAccent);
    if (savedContrast) setHighContrast(JSON.parse(savedContrast));
    if (savedWarm) setWarmPalette(JSON.parse(savedWarm));

    // Check system preference
    if (!savedTheme && window.matchMedia("(prefers-color-scheme: light)").matches) {
      setCurrentTheme("light");
    }
  }, []);

  // Apply theme to DOM
  useEffect(() => {
    const root = document.documentElement;
    const preset = themePresets[currentTheme];

    // Set all CSS variables for the current theme
    Object.entries(preset).forEach(([key, value]) => {
      if (key !== "label" && key !== "description" && typeof value === "string") {
        root.style.setProperty(`--${key}`, value);
      }
    });

    // Set custom variables
    root.style.setProperty("--accent-custom", accentColor);
    root.style.setProperty("--high-contrast", highContrast ? "1" : "0");

    // Apply theme class
    if (currentTheme === "light") {
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
    }

    // Apply high contrast mode
    if (highContrast) {
      root.setAttribute("data-high-contrast", "true");
    } else {
      root.removeAttribute("data-high-contrast");
    }

    // Apply warm palette
    if (warmPalette) {
      root.setAttribute("data-warm-palette", "true");
    } else {
      root.removeAttribute("data-warm-palette");
    }

    // Save to localStorage
    localStorage.setItem("theme", currentTheme);
    localStorage.setItem("accentColor", accentColor);
    localStorage.setItem("highContrast", JSON.stringify(highContrast));
    localStorage.setItem("warmPalette", JSON.stringify(warmPalette));
  }, [currentTheme, accentColor, highContrast, warmPalette]);

  const toggleDarkMode = () => {
    setCurrentTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme: setCurrentTheme,
        toggleDarkMode,
        accentColor,
        setAccentColor,
        highContrast,
        setHighContrast,
        warmPalette,
        setWarmPalette,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
