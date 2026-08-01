"use client";

import { ArrowUpRight, Clock, Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { PreviewSectionHeader } from "@/shared/components";
import { cn } from "@/lib/utils";
import { ContactForm } from "./ContactForm";
import I18n from "@/shared/components/I18n";

const contactSectionVariants = cva(
  "relative isolate w-full overflow-hidden transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        classic: "bg-background text-foreground",
        glassmorphic: "bg-gradient-to-b from-background/50 to-transparent",
        brutalist: "bg-card border-3 border-foreground shadow-brutal rounded-none",
      },
      size: {
        sm: "py-8 sm:py-10",
        default: "py-12 sm:py-16 lg:py-20 3xl:py-24 5xl:py-32 pb-20 sm:pb-28 lg:pb-36",
        lg: "py-16 sm:py-20 lg:py-24 3xl:py-28 5xl:py-36 pb-24 sm:pb-32 lg:pb-44",
      },
    },
    defaultVariants: {
      variant: "classic",
      size: "default",
    },
  }
);

interface ContactPreviewSectionProps extends VariantProps<typeof contactSectionVariants> {
  hideHeader?: boolean;
  siteInfo?: {
    email?: string | null;
    phone?: string | null;
  } | null;
}

export function ContactPreviewSection({
  variant = "classic",
  size = "default",
  hideHeader = false,
  siteInfo,
}: ContactPreviewSectionProps) {
  const isBrutalist = variant === "brutalist";

  const contactItems = [
    {
      label: "Email us",
      value: siteInfo?.email || "hello@a2icoders.com",
      icon: Mail,
    },
    {
      label: "Call us",
      value: siteInfo?.phone || "+880 123 456 789",
      icon: Phone,
    },
    {
      label: "Availability",
      value: "24/7 Premium Support",
      icon: Clock,
    },
    {
      label: "Working model",
      value: "Remote & onsite collaboration",
      icon: MapPin,
    },
  ];

  return (
    <section className={cn(contactSectionVariants({ variant, size }))}>
      {/* 🔧 container-custom এর সাথে mx-auto এবং w-full যুক্ত করে বড় মনিটরের জন্য সেন্টার করা হলো */}
      <div className="container-custom mx-auto w-full px-4 sm:px-6">
        {/* PREMIUM UPPER HEADER */}
        {!hideHeader && (
          <div
            className={cn(
              "pb-12 lg:pb-16",
              isBrutalist ? "border-border-strong border-b-2" : "border-border border-b"
            )}
          >
            <PreviewSectionHeader
              eyebrow="Contact"
              title="Let’s turn your next idea into something valuable."
              description="Tell us what you are building, where you need support, and what success looks like. Our team will respond with the right next step."
              href="/contact"
              ctaLabel="Open contact page"
              className="mb-0 max-w-3xl"
            />
          </div>
        )}

        {/* 🔧 GRID FIX: fr রেশিও 1fr_1.2fr করে ম্যাক্স উইডথ সেট করা হলো যাতে বড় মনিটরে ডান পাশ খালি না থাকে */}
        <div
          className={cn(
            "mt-12 grid w-full max-w-none grid-cols-1 gap-10 md:gap-12 lg:gap-16 xl:gap-20",
            size === "sm"
              ? "md:grid-cols-2"
              : "3xl:grid-cols-2 lg:grid-cols-[1fr_1.2fr] xl:grid-cols-[1fr_1.25fr]"
          )}
        >
          {/* LEFT SIDE: CONTEXT PANEL */}
          <aside className="flex h-full flex-col justify-between space-y-10 lg:space-y-0">
            <div className="max-w-xl space-y-6">
              <div
                className={cn(
                  "bg-surface-elevated text-foreground flex h-10 w-10 items-center justify-center",
                  isBrutalist
                    ? "border-border-strong rounded-none border-2 shadow-sm"
                    : "border-border rounded-xl border"
                )}
              >
                <MessageSquare className="h-4 w-4" />
              </div>

              <div className="space-y-3">
                <p className="text-primary text-xs font-bold tracking-[0.2em] uppercase select-none">
                  <I18n>Start a conversation</I18n>
                </p>
                <h3
                  className={cn(
                    "text-foreground text-2xl leading-tight font-black tracking-tight sm:text-3xl lg:text-4xl",
                    isBrutalist && "font-mono uppercase"
                  )}
                >
                  <I18n>Bring the challenge.</I18n>
                  <br />
                  <I18n>We will bring clarity.</I18n>
                </h3>
              </div>

              <p className="text-muted-foreground max-w-md text-xs leading-relaxed font-medium sm:text-sm">
                <I18n>
                  Share the essentials through the form. For consulting, partnerships, product
                  development, or long-term technical support, our team will guide the next step.
                </I18n>
              </p>
            </div>

            {/* LOWER COMMUNICATIONS CARD METRICS */}
            <div
              className={cn(
                "grid grid-cols-1 gap-4 pt-8 sm:grid-cols-2 lg:pt-12",
                isBrutalist ? "border-border-strong border-t-2" : "border-border border-t"
              )}
            >
              {contactItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className={cn(
                      "flex flex-col justify-between gap-3 p-6 transition-all duration-300",
                      variant === "glassmorphic" &&
                        "border-border bg-card/30 hover:bg-card/50 rounded-none border backdrop-blur-md sm:rounded-lg",
                      variant === "classic" &&
                        "border-border bg-card/40 hover:bg-card rounded-none border shadow-2xs sm:rounded-lg",
                      variant === "brutalist" &&
                        "bg-card border-border-strong rounded-none border-2"
                    )}
                  >
                    <div
                      className={cn(
                        "bg-background text-primary flex h-8 w-8 shrink-0 items-center justify-center",
                        isBrutalist
                          ? "border-border-strong rounded-none border-2"
                          : "border-border rounded-md border"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-muted-foreground text-xs font-black tracking-wider uppercase select-none">
                        {item.label}
                      </p>
                      <p className="text-foreground mt-1 truncate text-xs font-bold tracking-tight">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* RIGHT SIDE: SECURE CONTACT FORM CONTAINER */}
          <div
            className={cn(
              "relative h-full w-full transition-all duration-300",
              variant === "glassmorphic" &&
                "border-border bg-card/40 rounded-none border p-6 shadow-xl backdrop-blur-lg sm:rounded-lg sm:p-10",
              variant === "classic" &&
                "border-border bg-card/40 hover:bg-card/60 rounded-none border p-6 shadow-2xs transition-colors sm:rounded-lg sm:p-10",
              variant === "brutalist" &&
                "bg-card shadow-brand border-border-strong border-2 p-6 sm:p-10"
            )}
          >
            <div className="space-y-6">
              <div
                className={cn(
                  "flex items-center justify-between pb-4 select-none",
                  isBrutalist ? "border-border-strong border-b-2" : "border-border border-b"
                )}
              >
                <p className="text-muted-foreground text-xs font-black tracking-[0.2em] uppercase">
                  <I18n>Send an inquiry</I18n>
                </p>
                <ArrowUpRight className="text-primary h-4 w-4" />
              </div>

              <div className="space-y-2">
                <h3
                  className={cn(
                    "text-foreground text-xl font-black tracking-tight sm:text-2xl",
                    isBrutalist && "font-mono uppercase"
                  )}
                >
                  <I18n>Tell us what you need.</I18n>
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed font-medium">
                  <I18n>
                    A few details are enough to get started. We will review your message and respond
                    with the most relevant next step.
                  </I18n>
                </p>
              </div>

              <div
                className={cn(
                  "pt-4",
                  isBrutalist ? "border-border-strong border-t-2" : "border-border border-t"
                )}
              >
                <ContactForm variant={variant} />
              </div>

              <p className="text-muted-foreground pt-2 text-xs leading-relaxed font-medium">
                <I18n>
                  By submitting this form, you agree that we may contact you regarding your inquiry.
                  We do not use your details for unrelated marketing communication.
                </I18n>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
