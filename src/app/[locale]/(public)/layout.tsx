import { Suspense, ReactNode } from "react";
import { Header } from "@/shared/components/Header";
import { Footer } from "@/shared/components/Footer";
import { ScrollToTop } from "@/shared/components/ScrollToTop";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background text-foreground relative flex min-h-screen flex-col">
      {/* 🎯 Scroll reset encapsulated in Suspense for optimal build-time bundle separation */}
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>

      <Header variant="glassmorphic" />

      <main className="w-full flex-1 pt-16">
        {children}
      </main>

      <Footer variant="glassmorphic" />
    </div>
  );
}