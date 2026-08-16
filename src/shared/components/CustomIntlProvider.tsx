"use client";

import { useMemo } from "react";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";

export interface CustomIntlProviderProps {
  locale: string;
  messages?: AbstractIntlMessages;
  timeZone?: string;
  children: React.ReactNode;
}

/**
  Vercel Style Centralized Formats Object
  এটি পুরো প্রজেক্টের Date, Number এবং Currency এর জন্য গ্লোবাল কন্সিস্টেন্সি নিশ্চিত করে
 */
const defaultFormats = {
  dateTime: {
    short: {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
    long: {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "short",
    },
    time: {
      hour: "numeric",
      minute: "2-digit",
    },
  },
  number: {
    precise: {
      maximumFractionDigits: 2,
    },
    compact: {
      notation: "compact",
    },
    currency: {
      style: "currency",
      currency: "USD",
    },
  },
} as const;

export function CustomIntlProvider({
  locale,
  messages,
  timeZone = "Asia/Dhaka",
  children,
}: CustomIntlProviderProps) {
  const initialNow = useMemo(() => new Date(), []);

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone={timeZone}
      formats={defaultFormats}
      now={initialNow}
      onError={(error) => {
        // Suppress missing translation warnings in production/dev console
        if (error.code === "MISSING_MESSAGE") {
          return;
        }
        if (process.env.NODE_ENV !== "production") {
          console.error("[next-intl error]:", error);
        }
      }}
      getMessageFallback={({ key }) => {
        // Fallback to the last part of the key if translation is missing (e.g. "common.submit" -> "submit")
        return key.split(".").pop() || key;
      }}
    >
      {children}
    </NextIntlClientProvider>
  );
}