import { create } from "zustand";

interface AppearanceState {
  theme: "System" | "Dark" | "Light";
  setTheme: (theme: "System" | "Dark" | "Light") => void;
}

function applyTheme(theme: "System" | "Dark" | "Light") {
  if (typeof window !== "undefined") {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const isDark = theme === "Dark" || (theme === "System" && prefersDark);
    const html = document.documentElement;

    if (isDark) {
      html.classList.add("dark");
      html.classList.remove("light");
    } else {
      html.classList.add("light");
      html.classList.remove("dark");
    }
  }
}

export const useAppearanceStore = create<AppearanceState>((set) => ({
  theme:
    (typeof window !== "undefined"
      ? (localStorage.getItem("theme") as "System" | "Dark" | "Light")
      : "System") || "System",
  setTheme: (theme) => {
    localStorage.setItem("theme", theme);
    applyTheme(theme);
    set({ theme });
  },
}));
