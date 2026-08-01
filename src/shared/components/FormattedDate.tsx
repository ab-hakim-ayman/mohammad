"use client";

import { useFormatter } from "next-intl";

type DateTimeFormatOptions = Parameters<
  ReturnType<typeof useFormatter>["dateTime"]
>[1];

interface FormattedDateProps {
  date: string | Date | number | null | undefined;
  formatOptions?: DateTimeFormatOptions;
}

export function FormattedDate({ date, formatOptions }: FormattedDateProps) {
  const format = useFormatter();

  if (!date) return null;

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return null;

  return <>{format.dateTime(parsedDate, formatOptions)}</>;
}