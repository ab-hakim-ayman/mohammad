import { ArrowRight, Check, Mail, MapPin, Phone } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { getCachedCurrentSiteInfo } from "@/features/site-info/server";
import { ContactForm } from "./ContactForm";
import { cn } from "@/lib/utils";
import I18n from "@/shared/components/I18n";

const sectionVariants = cva("w-full transition-all duration-300 ease-in-out py-16 sm:py-24", {
  variants: {
    variant: {
      classic: "bg-transparent text-foreground",
      glassmorphic: "bg-gradient-to-b from-background/50 to-transparent text-foreground",
      brutalist: "bg-card text-foreground",
    },
  },
  defaultVariants: {
    variant: "classic",
  },
});

const badgeVariants = cva(
  "text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 inline-block select-none mb-4",
  {
    variants: {
      variant: {
        classic: "text-muted-foreground bg-surface-elevated rounded-md",
        glassmorphic: "text-muted-foreground bg-card/60 border border-border rounded-full",
        brutalist: "text-foreground bg-card border-2 border-border-strong rounded-none font-mono",
      },
    },
  }
);

const cardVariants = cva("flex flex-col justify-between p-6 transition-all", {
  variants: {
    variant: {
      classic:
        "rounded-xl border border-border bg-surface-elevated/40 hover:border-border hover:bg-surface-elevated/80 shadow-2xs",
      glassmorphic:
        "rounded-xl border border-border bg-card/40 backdrop-blur-md hover:bg-card/60 hover:border-border shadow-sm",
      brutalist:
        "rounded-none border-2 border-border-strong bg-card font-mono shadow-brand hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brand dark:hover:shadow-brand",
    },
  },
});

interface ContactSectionProps extends VariantProps<typeof sectionVariants> { }

export async function ContactSection({ variant = "classic" }: ContactSectionProps) {
  const siteInfo = await getCachedCurrentSiteInfo();
  const isBrutalist = variant === "brutalist";

  const contactCards = [
    siteInfo?.email && {
      key: "email",
      label: "Email Us",
      value: siteInfo.email,
      href: `mailto:${siteInfo.email}`,
      icon: Mail,
    },
    siteInfo?.phone && {
      key: "phone",
      label: "Call Us",
      value: siteInfo.phone,
      href: `tel:${siteInfo.phone}`,
      icon: Phone,
    },
    siteInfo?.address && {
      key: "address",
      label: "Visit Us",
      value: siteInfo.address,
      href: "#map",
      icon: MapPin,
    },
  ].filter(Boolean) as Array<{
    key: string;
    label: string;
    value: string;
    href: string;
    icon: typeof Mail;
  }>;

  const promiseItems = [
    {
      title: "Tell us your vision",
      description:
        "Share your product goals, timeline, and the structural constraints we should plan around from day one.",
    },
    {
      title: "Get a practical response",
      description:
        "We deliver concrete architect suggestions, not a vague commercial sales follow-up strategy.",
    },
    {
      title: "Move with absolute clarity",
      description:
        "Expect structured deliverable roadmaps, strict clean telemetry communication, and immediate safe zones pathing.",
    },
  ];

  return (
    <section className={cn(sectionVariants({ variant }))}>
      <div className="container-custom px-4 sm:px-6">
        <div
          className={cn(
            "grid items-start gap-12 pb-16 lg:grid-cols-[1.1fr_0.9fr]",
            isBrutalist ? "border-border-strong border-b-2" : "border-border/60 border-b"
          )}
        >
          <div className="space-y-10">
            <div className="space-y-4">
              <span className={badgeVariants({ variant })}>
                <I18n>Get In Touch</I18n>
              </span>
              <h2
                className={cn(
                  "text-foreground text-3xl leading-[1.1] font-semibold tracking-tight sm:text-4xl lg:text-5xl",
                  isBrutalist && "font-mono font-black uppercase"
                )}
              >
                <I18n>Let&apos;s shape your next software move with confidence.</I18n>
              </h2>
              <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">
                <I18n>
                  Have an architecture concept or scaling challenge? Connect straight to our core
                  development systems framework layer.
                </I18n>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#contact-form"
                className={cn(
                  "group inline-flex h-10 items-center justify-center gap-2 px-5 text-xs font-semibold tracking-wider uppercase transition-all",
                  isBrutalist
                    ? "text-background shadow-brand border-border-strong bg-foreground rounded-none border-2 font-mono hover:translate-x-[-2px] hover:translate-y-[-2px]"
                    : "bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-sm"
                )}
              >
                <span>
                  <I18n>Start your brief</I18n>
                </span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>

              {siteInfo?.mapEmbedUrl && (
                <a
                  href="#map"
                  className={cn(
                    "inline-flex h-10 items-center justify-center gap-2 px-5 text-xs font-semibold tracking-wider uppercase transition-colors",
                    isBrutalist
                      ? "text-foreground hover:bg-surface-elevated border-border-strong rounded-none border-2 font-mono"
                      : "border-border text-muted-foreground hover:bg-surface-elevated hover:text-foreground rounded-lg border bg-transparent"
                  )}
                >
                  <I18n>See location</I18n>
                </a>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {contactCards.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.key}
                    href={item.href}
                    className={cardVariants({ variant })}
                    style={{ minHeight: "115px" }}
                  >
                    <span
                      className={cn(
                        "bg-background flex h-8 w-8 items-center justify-center transition-colors",
                        isBrutalist
                          ? "text-foreground border-border-strong rounded-none border-2"
                          : "border-border text-muted-foreground rounded-lg border"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="mt-4 min-w-0">
                      <span className="text-muted-foreground block text-xs font-bold tracking-wider uppercase select-none">
                        {item.label}
                      </span>
                      <span className="text-foreground mt-0.5 block truncate text-xs font-semibold">
                        {item.value}
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          <div
            id="contact-form"
            className={cn(
              "transition-all lg:sticky lg:top-28",
              variant === "classic" && "border-0 bg-transparent p-0 shadow-none",
              variant === "glassmorphic" &&
              "border-border bg-card/40 rounded-xl border p-6 shadow-xl backdrop-blur-xl sm:p-8",
              variant === "brutalist" &&
              "bg-card shadow-brand border-border-strong rounded-none border-2 p-6 sm:p-8"
            )}
          >
            <ContactForm variant={variant || "classic"} showIntro={true} />
          </div>
        </div>

        <div className="mt-16 space-y-6">
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              <I18n>Our Protocol</I18n>
            </p>
            <h3
              className={cn(
                "text-foreground text-xl font-semibold tracking-tight",
                isBrutalist && "font-mono font-black uppercase"
              )}
            >
              <I18n>The Engagement Path</I18n>
            </h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {promiseItems.map((item) => (
              <article key={item.title} className={cardVariants({ variant })}>
                <span
                  className={cn(
                    "text-success flex h-7 w-7 items-center justify-center select-none",
                    isBrutalist
                      ? "bg-card border-border-strong rounded-none border-2"
                      : "bg-success/10 rounded-full"
                  )}
                >
                  <Check className="h-3.5 w-3.5" />
                </span>
                <div className="mt-4 space-y-1.5">
                  <h4 className="text-foreground text-sm font-semibold tracking-tight">
                    {item.title}
                  </h4>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}