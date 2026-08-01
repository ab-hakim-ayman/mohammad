export const locales = ["en", "bn"] as const;
export const defaultLocale = "en" as const;

export type Locale = (typeof locales)[number];
