import { AdminStatsOverview } from "@/shared/components/site-status/AdminStatsOverview";
import { locales, type Locale } from "@/shared/i18n";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

interface AdminDashboardProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminDashboard({ params }: AdminDashboardProps) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <div className="w-full space-y-6">
      <AdminStatsOverview locale={locale} />
    </div>
  );
}