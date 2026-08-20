"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Cookie, ShieldCheck, Settings2, Check, X } from "lucide-react";
import { Link } from "@/shared/i18n";
import I18n from "@/shared/components/I18n";
import { cn } from "@/lib/utils";

const COOKIE_CONSENT_KEY = "cookie_consent_choice";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  // Preference Toggles
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    // ১. চেক করি ইউজার আগে কোনো ডিসিশন নিয়েছে কি না
    const consent = Cookies.get(COOKIE_CONSENT_KEY);
    let timer: NodeJS.Timeout | null = null;

    if (!consent) {
      // কিছুটা ডিলে দিয়ে ব্যানার দেখাবো যেন UX স্মুথ মনে হয়
      timer = setTimeout(() => setShowBanner(true), 800);
    } else {
      try {
        const parsed = JSON.parse(consent);
        setAnalytics(parsed.analytics ?? true);
        setMarketing(parsed.marketing ?? false);
      } catch {
        // Fallback for invalid JSON
      }
    }

    // 🟢 ২. কাস্টম ইভেন্ট লিসেনার (ফুটারের Cookie Settings বাটনে ক্লিক করলে রিওপেন করার জন্য)
    const handleReopen = () => {
      setShowPreferences(true);
      setShowBanner(true);
    };

    window.addEventListener("open-cookie-settings", handleReopen);
    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("open-cookie-settings", handleReopen);
    };
  }, []);

  const saveConsent = (
    choice: "all" | "rejected" | "custom",
    analyticsState = false,
    marketingState = false
  ) => {
    const consentData = {
      choice,
      essential: true,
      analytics: choice === "all" ? true : choice === "rejected" ? false : analyticsState,
      marketing: choice === "all" ? true : choice === "rejected" ? false : marketingState,
      timestamp: new Date().toISOString(),
    };

    // ১ বছরের জন্য কাস্টম কনসেন্ট সেভ রাখা
    Cookies.set(COOKIE_CONSENT_KEY, JSON.stringify(consentData), {
      expires: 365,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    setShowBanner(false);
    setShowPreferences(false);

    if (consentData.analytics) {
      // initializeAnalytics();
    }
  };

  if (!showBanner) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 fixed right-4 bottom-4 left-4 z-50 w-full max-w-md duration-300 md:right-6 md:bottom-6 md:left-auto">
      <div className="bg-card/85 border-border/80 text-foreground selection:bg-primary/20 space-y-4 rounded-2xl border p-5 shadow-2xl backdrop-blur-xl md:p-6">
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="text-primary flex items-center gap-2.5">
            <div className="bg-primary/10 border-primary/20 rounded-xl border p-2">
              <Cookie className="h-4 w-4" />
            </div>
            <h3 className="text-foreground text-sm font-bold tracking-tight sm:text-base">
              <I18n>We Value Your Privacy</I18n>
            </h3>
          </div>
          <button
            type="button"
            onClick={() => saveConsent("rejected")}
            className="text-muted-foreground/70 hover:text-foreground hover:bg-muted/60 cursor-pointer rounded-lg p-1 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Description Paragraph */}
        <p className="text-muted-foreground text-xs leading-relaxed font-normal">
          <I18n>
            We use essential cookies to keep our platform secure. With your consent, we also use
            optional cookies for performance analytics and customized experience.
          </I18n>{" "}
          <Link href="/privacy-policy" className="text-primary font-semibold hover:underline">
            <I18n>Privacy Policy</I18n>
          </Link>
        </p>

        {/* Custom Preferences Modal Accordion */}
        {showPreferences && (
          <div className="border-border/60 animate-in fade-in space-y-2.5 border-t pt-3.5 duration-200">
            {/* Essential */}
            <div className="bg-muted/30 border-border/60 flex items-center justify-between rounded-xl border p-2.5 text-xs">
              <div className="min-w-0 space-y-0.5 pr-2">
                <p className="text-foreground flex items-center gap-1.5 text-xs font-bold">
                  <ShieldCheck className="text-success h-3.5 w-3.5 shrink-0" />
                  <I18n>Strictly Necessary</I18n>
                </p>
                <p className="text-muted-foreground truncate text-[11px]">
                  <I18n>Required for security & core functions.</I18n>
                </p>
              </div>
              <span className="text-muted-foreground bg-muted/80 border-border/60 shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                <I18n>Always Active</I18n>
              </span>
            </div>

            {/* Analytics Switch Toggle */}
            <div className="bg-card/60 border-border/60 flex items-center justify-between rounded-xl border p-2.5 text-xs">
              <div className="min-w-0 space-y-0.5 pr-2">
                <p className="text-foreground text-xs font-bold">
                  <I18n>Analytics & Performance</I18n>
                </p>
                <p className="text-muted-foreground truncate text-[11px]">
                  <I18n>Helps us measure site traffic & usage.</I18n>
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={analytics}
                onClick={() => setAnalytics(!analytics)}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                  analytics ? "bg-primary" : "bg-muted"
                )}
              >
                <span
                  className={cn(
                    "bg-background pointer-events-none inline-block h-4 w-4 transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out",
                    analytics ? "translate-x-4" : "translate-x-0"
                  )}
                />
              </button>
            </div>

            {/* Marketing Switch Toggle */}
            <div className="bg-card/60 border-border/60 flex items-center justify-between rounded-xl border p-2.5 text-xs">
              <div className="min-w-0 space-y-0.5 pr-2">
                <p className="text-foreground text-xs font-bold">
                  <I18n>Marketing & Preferences</I18n>
                </p>
                <p className="text-muted-foreground truncate text-[11px]">
                  <I18n>Customizes recommendations & ads.</I18n>
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={marketing}
                onClick={() => setMarketing(!marketing)}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                  marketing ? "bg-primary" : "bg-muted"
                )}
              >
                <span
                  className={cn(
                    "bg-background pointer-events-none inline-block h-4 w-4 transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out",
                    marketing ? "translate-x-4" : "translate-x-0"
                  )}
                />
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons Toolbar */}
        <div className="flex flex-col items-center gap-2 pt-1 sm:flex-row">
          {!showPreferences ? (
            <>
              <button
                type="button"
                onClick={() => saveConsent("all")}
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full cursor-pointer rounded-xl px-4 py-2.5 text-xs font-bold tracking-wide shadow-2xs transition-all sm:flex-1"
              >
                <I18n>Accept All</I18n>
              </button>
              <button
                type="button"
                onClick={() => saveConsent("rejected")}
                className="bg-muted/50 hover:bg-muted/80 border-border/80 text-foreground w-full cursor-pointer rounded-xl border px-4 py-2.5 text-xs font-semibold tracking-wide transition-all sm:flex-1"
              >
                <I18n>Reject Optional</I18n>
              </button>
              <button
                type="button"
                onClick={() => setShowPreferences(true)}
                className="text-muted-foreground hover:text-foreground border-border/80 hover:border-primary/40 bg-card/40 shrink-0 cursor-pointer rounded-xl border p-2.5 transition-colors"
                title="Customize Preferences"
              >
                <Settings2 className="h-4 w-4" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => saveConsent("custom", analytics, marketing)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold tracking-wide shadow-2xs transition-all"
            >
              <Check className="h-4 w-4" />
              <I18n>Save Preferences</I18n>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
