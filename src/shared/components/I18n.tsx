"use client";

import { useTranslations } from "next-intl";

export interface I18nProps {
  children: string;
}

export default function I18n({ children }: I18nProps) {
  const t = useTranslations();

  if (!children) return null;

  try {
    return <>{t(children)}</>;
  } catch (error) {
    return <>{children}</>;
  }
}