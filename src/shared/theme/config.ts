export const themes = ["light", "dark"] as const;
export type Theme = (typeof themes)[number];

export const THEME_STORAGE_KEY = "theme";
export const defaultTheme: Theme = "light";

export function applyTheme(theme: Theme) {
  if (typeof window === "undefined") return;
  const root = document.documentElement;

  root.classList.toggle("dark", theme === "dark");
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}
