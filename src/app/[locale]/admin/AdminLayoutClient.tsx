"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { useCurrentUser } from "@/features/auth";
import { usePathname, useRouter } from "next/navigation";
import { StateScreen } from "@/shared/components";
import { useEffect } from "react";
import { AdminSidebar } from "@/shared/components";
import { AdminHeader } from "@/shared/components";
import { useLocale } from "next-intl";

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const { data, isLoading } = useCurrentUser();
  const isAuthenticated = !!data?.data?.user;
  const userRole = data?.data?.user?.role;

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push(`/${locale}/login`);
      return;
    }



    window.scrollTo(0, 0);
  }, [isLoading, isAuthenticated, userRole, pathname, locale, router]);

  if (isLoading) {
    return (
      <StateScreen
        state="loading"
        variant="glassmorphic"
        title="Loading admin workspace..."
        description="Verifying operational credentials and fetching workspace data."
        className="min-h-[calc(100vh-140px)] w-full bg-transparent"
      />
    );
  }

  if (!isAuthenticated) return null;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="bg-background relative flex h-dvh w-full overflow-hidden">
        <AdminSidebar userRole={userRole} />

        <div className="bg-background relative flex flex-1 flex-col min-w-0 overflow-hidden">
          {/* 🎯 নিউ রিফ্যাক্টরড অ্যাডমিন হেডার */}
          <AdminHeader />

          {/* ড্যাশবোর্ড কন্টেন্ট স্ক্রল কন্টেইনার */}
          <div className="relative flex-1 overflow-x-hidden overflow-y-auto">
            <div className="ui-grid-pattern pointer-events-none absolute inset-x-0 top-0 h-96 [mask-image:linear-gradient(to_bottom,black,transparent)] opacity-15" />
            <main className="relative z-10 w-full p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
