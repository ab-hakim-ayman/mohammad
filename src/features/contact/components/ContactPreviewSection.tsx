"use client";

import { Mail, Coffee, Heart, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { FaLinkedin } from "react-icons/fa";
import { Link } from "@/shared/i18n";
import I18n from "@/shared/components/I18n";
import { usePublicSiteInfo } from "@/features/site-info/hooks/useSiteInfo";
import type { SiteInfoRecord } from "@/features/site-info";

export interface ContactPreviewSectionProps {
  email?: string;
  linkedinUrl?: string;
  coffeeUrl?: string;
  paypalUrl?: string;
  onOpenContactForm?: () => void;
  className?: string;
}

export type ExactContactSectionProps = ContactPreviewSectionProps;

export function ContactPreviewSection({
  email,
  linkedinUrl,
  coffeeUrl,
  paypalUrl,
  onOpenContactForm,
  className,
}: ContactPreviewSectionProps) {
  const { data: siteInfoData } = usePublicSiteInfo();
  const siteInfo = (siteInfoData?.data || {}) as Partial<SiteInfoRecord>;

  const finalEmail = email || siteInfo?.email || "abhakim.hstu@gmail.com";
  const finalLinkedinUrl = linkedinUrl || siteInfo?.linkedin || "https://www.linkedin.com/in/ab-hakim-ayman/";

  return (
    <section
      className={cn(
        "relative w-full bg-background py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 text-center font-sans overflow-hidden border-t border-border/40",
        className
      )}
    >
      {/* Background Grid Pattern consistent with website theme */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 dark:opacity-20 pointer-events-none"
      />

      {/* Decorative Blur Orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10 select-none">
        <div className="bg-primary/5 absolute top-1/2 left-1/4 h-72 w-72 -translate-y-1/2 rounded-full blur-3xl" />
        <div className="bg-primary/5 absolute top-1/2 right-1/4 h-72 w-72 -translate-y-1/2 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto space-y-8 z-10">
        {/* Main Heading & Description */}
        <div className="space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
            <I18n>Let's discuss your next project.</I18n>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-medium">
            <I18n>
              Whether it's architecture review, technical leadership, or building secure backend systems — I'm open to the conversation.
            </I18n>
          </p>
        </div>

        {/* Primary Action Buttons (Email, LinkedIn & Extra Contact Form Button) */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {/* Email Button (Primary highlight) */}
          <a
            href={`mailto:${finalEmail}`}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary-hover font-semibold text-sm px-5 py-2.5 rounded-lg transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            <Mail className="h-4 w-4" />
            <span><I18n>Email</I18n></span>
          </a>

          {/* LinkedIn Button */}
          <a
            href={finalLinkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-strong font-semibold text-sm px-5 py-2.5 rounded-lg transition-all shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
          >
            <FaLinkedin className="h-4 w-4" />
            <span><I18n>LinkedIn</I18n></span>
          </a>

          {/* Contact Form Button */}
          <Link
            href="/contact"
            onClick={onOpenContactForm}
            className="inline-flex items-center gap-2 bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-strong font-semibold text-sm px-5 py-2.5 rounded-lg transition-all cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
          >
            <MessageSquare className="h-4 w-4 text-success" />
            <span><I18n>Contact Form</I18n></span>
          </Link>

          {/* Conditionally render Coffee URL if provided */}
          {coffeeUrl && (
            <a
              href={coffeeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-strong font-semibold text-sm px-5 py-2.5 rounded-lg transition-all shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
            >
              <Coffee className="h-4 w-4 text-amber-500" />
              <span><I18n>Coffee</I18n></span>
            </a>
          )}

          {/* Conditionally render Support/Paypal URL if provided */}
          {paypalUrl && (
            <a
              href={paypalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-strong font-semibold text-sm px-5 py-2.5 rounded-lg transition-all shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
            >
              <Heart className="h-4 w-4 text-destructive" />
              <span><I18n>Support</I18n></span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

