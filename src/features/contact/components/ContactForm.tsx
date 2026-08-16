"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check, Loader2, ShieldCheck, Mail, Sparkles } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import I18n from "@/shared/components/I18n";
import { useSubmitContact } from "../hooks/useContact";

export type FormVariant =
  | "classic"
  | "glassmorphic"
  | "brutalist"
  | "gradiantGlow"
  | "minimal";

const containerVariants = cva("w-full transition-all duration-300", {
  variants: {
    variant: {
      classic: "bg-transparent p-0 border-0 shadow-none",
      glassmorphic:
        "rounded-2xl border border-border/50 bg-card/40 p-6 sm:p-10 shadow-xl backdrop-blur-xl",
      brutalist:
        "rounded-none border-2 border-border-strong bg-card p-6 sm:p-10 font-mono shadow-[6px_6px_0px_0px_currentColor]",
      "gradiantGlow":
        "rounded-2xl border border-border/60 bg-gradient-to-b from-card/80 via-card/50 to-card/20 p-6 sm:p-10 shadow-xl backdrop-blur-md",
      minimal: "bg-transparent p-0 border-0 shadow-none",
    },
  },
  defaultVariants: {
    variant: "classic",
  },
});

const labelVariants = cva(
  "block mb-2 text-xs font-bold tracking-wider select-none",
  {
    variants: {
      variant: {
        classic: "uppercase tracking-widest text-muted-foreground",
        glassmorphic: "uppercase tracking-widest text-muted-foreground",
        brutalist: "font-mono uppercase text-foreground font-black tracking-wider",
        "gradiantGlow": "uppercase tracking-widest text-foreground/80",
        minimal: "text-muted-foreground font-medium",
      },
    },
    defaultVariants: {
      variant: "classic",
    },
  }
);

const inputVariants = cva(
  "w-full px-4 text-sm transition-all outline-hidden file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        classic:
          "h-11 rounded-xl border border-border bg-background/60 hover:border-primary/40 focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10 shadow-2xs",
        glassmorphic:
          "h-11 rounded-xl border border-border/60 bg-background/40 backdrop-blur-md hover:border-primary/40 focus:border-primary focus:bg-background/70 focus:ring-2 focus:ring-primary/15 shadow-2xs",
        brutalist:
          "h-11 rounded-none border-2 border-border-strong bg-background text-foreground font-mono placeholder:text-muted-foreground focus:bg-muted focus:ring-0",
        "gradiantGlow":
          "h-11 rounded-xl border border-border/60 bg-card/60 hover:border-primary/50 focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 shadow-xs",
        minimal:
          "h-10 rounded-lg border-b border-border/80 bg-transparent px-0 hover:border-foreground focus:border-primary focus:ring-0",
      },
    },
    defaultVariants: {
      variant: "classic",
    },
  }
);

const phoneBoxVariants = cva(
  "flex items-center overflow-hidden transition-all",
  {
    variants: {
      variant: {
        classic:
          "rounded-xl border border-border bg-background/60 hover:border-primary/40 focus-within:border-primary focus-within:bg-background focus-within:ring-2 focus-within:ring-primary/10 shadow-2xs",
        glassmorphic:
          "rounded-xl border border-border/60 bg-background/40 backdrop-blur-md hover:border-primary/40 focus-within:border-primary focus-within:bg-background/70 focus-within:ring-2 focus-within:ring-primary/15 shadow-2xs",
        brutalist:
          "rounded-none border-2 border-border-strong bg-background focus-within:bg-muted",
        "gradiantGlow":
          "rounded-xl border border-border/60 bg-card/60 hover:border-primary/50 focus-within:border-primary focus-within:bg-background focus-within:ring-2 focus-within:ring-primary/20 shadow-xs",
        minimal:
          "rounded-lg border-b border-border/80 bg-transparent focus-within:border-primary",
      },
    },
    defaultVariants: {
      variant: "classic",
    },
  }
);

const buttonVariants = cva(
  "inline-flex min-w-[160px] h-11 items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer select-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        classic:
          "rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:-translate-y-0.5",
        glassmorphic:
          "rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-md backdrop-blur-md hover:-translate-y-0.5",
        brutalist:
          "rounded-none bg-foreground text-background border-2 border-border-strong font-mono font-black shadow-[3px_3px_0px_0px_currentColor] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-0 active:translate-y-0 active:shadow-none",
        "gradiantGlow":
          "rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:-translate-y-0.5",
        minimal:
          "rounded-lg bg-foreground text-background hover:bg-foreground/90",
      },
    },
    defaultVariants: {
      variant: "classic",
    },
  }
);

interface ContactFormProps extends VariantProps<typeof containerVariants> {
  showIntro?: boolean;
}

export function ContactForm({ showIntro = false, variant = "classic" }: ContactFormProps) {
  const submit = useSubmitContact();

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const data = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      subject: String(formData.get("subject") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      phone: String(formData.get("phone") || "").trim() || null,
    };

    try {
      await submit.mutateAsync(data);
      setSuccess(true);
      form.reset();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submission failure");
    }
  };

  const isBrutalist = variant === "brutalist";
  const isGlow = variant === "gradiantGlow";

  return (
    <div className={containerVariants({ variant })}>
      {/* Intro Header */}
      {showIntro && (
        <div
          className={cn(
            "mb-8 pb-6",
            isBrutalist ? "border-b-2 border-border-strong" : "border-b border-border/60"
          )}
        >
          <div className="flex items-center gap-1.5 text-xs font-bold tracking-[0.2em] uppercase text-primary">
            {isGlow && <Sparkles className="h-3.5 w-3.5" />}
            <p>
              <I18n>Project Brief</I18n>
            </p>
          </div>
          <h3
            className={cn(
              "text-foreground mt-2 text-2xl font-bold tracking-tight",
              isBrutalist && "font-mono uppercase font-black"
            )}
          >
            <I18n>Let&apos;s build something exceptional</I18n>
          </h3>
          <p className="text-muted-foreground mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed">
            <I18n>
              Share your architecture scope, tech stack requirements, or milestone targets to initiate engineering consultation.
            </I18n>
          </p>
        </div>
      )}

      {/* Main Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label htmlFor="contact-name" className={labelVariants({ variant })}>
              <I18n>Full Name</I18n>
            </label>
            <input
              id="contact-name"
              type="text"
              name="name"
              autoComplete="name"
              required
              className={inputVariants({ variant })}
              placeholder="Full name"
            />
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label htmlFor="contact-email" className={labelVariants({ variant })}>
              <I18n>Email Address</I18n>
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              autoComplete="email"
              required
              className={inputVariants({ variant })}
              placeholder="you@company.com"
            />
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <label htmlFor="contact-subject" className={labelVariants({ variant })}>
              <I18n>Subject</I18n>
            </label>
            <input
              id="contact-subject"
              type="text"
              name="subject"
              required
              className={inputVariants({ variant })}
              placeholder="What are we building?"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label htmlFor="contact-phone" className={labelVariants({ variant })}>
              <I18n>Phone Number</I18n>{" "}
              <span className="text-muted-foreground font-normal lowercase">
                ({isBrutalist ? "opt" : <I18n>optional</I18n>})
              </span>
            </label>
            <div className={phoneBoxVariants({ variant })}>
              <span
                className={cn(
                  "bg-muted/50 text-muted-foreground flex h-11 items-center border-r border-border/60 px-3.5 text-xs font-semibold select-none",
                  isBrutalist && "bg-muted text-foreground border-border-strong font-mono font-bold"
                )}
              >
                +880
              </span>
              <input
                id="contact-phone"
                type="tel"
                name="phone"
                autoComplete="tel"
                className="text-foreground placeholder:text-muted-foreground/60 h-11 min-w-0 flex-1 border-0 bg-transparent px-3.5 text-sm outline-hidden focus:ring-0"
                placeholder="1XXXXXXXXX"
              />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <label htmlFor="contact-message" className={labelVariants({ variant })}>
            <I18n>Message</I18n>
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            required
            className={cn(
              inputVariants({ variant }),
              "block min-h-[120px] resize-none p-4",
              variant === "minimal" && "border rounded-lg p-3"
            )}
            placeholder="Share goals, specifications, scope timeline parameters, or current performance blockers..."
          />
        </div>

        {/* Privacy & Guarantee Note */}
        <div
          className={cn(
            "space-y-2.5 rounded-xl border p-4 transition-colors select-none",
            isBrutalist && "bg-background border-2 border-border-strong rounded-none font-mono",
            variant === "glassmorphic" && "border-border/50 bg-background/30 backdrop-blur-md",
            variant === "gradiantGlow" && "border-border/60 bg-card/40",
            (variant === "classic" || variant === "minimal") && "border-border/80 bg-muted/40"
          )}
        >
          <div className="text-muted-foreground flex items-start gap-2.5 text-xs leading-relaxed">
            <ShieldCheck className="text-primary mt-0.5 h-4 w-4 shrink-0" />
            <span>
              <I18n>
                Internal data encryption pipeline guarantees dynamic enterprise privacy and zero data leakage.
              </I18n>
            </span>
          </div>
          <div className="text-muted-foreground flex items-start gap-2.5 text-xs leading-relaxed">
            <Mail className="text-primary mt-0.5 h-4 w-4 shrink-0" />
            <span>
              <I18n>
                Our engineering team reviews project specifications to deliver an architectural response within 24 hours.
              </I18n>
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            role="alert"
            className={cn(
              "text-destructive border px-4 py-3 text-xs font-medium",
              isBrutalist
                ? "border-2 border-destructive bg-background font-mono rounded-none"
                : "rounded-xl border-destructive/20 bg-destructive/10"
            )}
          >
            {error}
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div
            role="status"
            className={cn(
              "flex items-center gap-2 border px-4 py-3 text-xs font-semibold text-emerald-500",
              isBrutalist
                ? "border-2 border-emerald-500 bg-background font-mono rounded-none"
                : "rounded-xl border-emerald-500/20 bg-emerald-500/10"
            )}
          >
            <Check className="h-4 w-4 shrink-0 text-emerald-500" />
            <span>
              <I18n>Inquiry received successfully! Our architects will reach out shortly.</I18n>
            </span>
          </div>
        )}

        {/* Submit Action Area */}
        <div
          className={cn(
            "flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between",
            isBrutalist ? "border-border-strong border-t-2" : "border-border/60"
          )}
        >
          <p className="text-muted-foreground max-w-xs text-[11px] leading-relaxed">
            <I18n>
              We only use your submitted parameters to prepare and respond to this specific system scope inquiry.
            </I18n>
          </p>

          <button
            type="submit"
            disabled={submit.isPending}
            className={buttonVariants({ variant })}
          >
            {submit.isPending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>
                  <I18n>Processing...</I18n>
                </span>
              </>
            ) : (
              <>
                <span>
                  <I18n>Submit Inquiry</I18n>
                </span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}