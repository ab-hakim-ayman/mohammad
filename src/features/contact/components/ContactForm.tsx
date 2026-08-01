"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check, Loader2, ShieldCheck, Mail } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import I18n from "@/shared/components/I18n";
import { useSubmitContact } from "../hooks/useContact";

export type FormVariant = "classic" | "glassmorphic" | "brutalist" | null;

const containerVariants = cva("w-full transition-all duration-300 ease-in-out", {
  variants: {
    variant: {
      classic: "bg-transparent p-0 border-0 shadow-none",
      glassmorphic:
        "bg-card/50 backdrop-blur-xl border border-border p-6 sm:p-10 rounded-xl shadow-xl",
      brutalist: "bg-card border-medium border-border-strong p-6 sm:p-10 rounded-none shadow-brand",
    },
  },
  defaultVariants: {
    variant: "classic",
  },
});

const labelVariants = cva(
  "text-xs font-semibold tracking-wider text-muted-foreground block mb-2",
  {
    variants: {
      variant: {
        classic: "uppercase",
        glassmorphic: "uppercase tracking-widest text-muted-foreground",
        brutalist: "font-mono uppercase text-foreground font-bold",
      },
    },
  }
);

const inputVariants = cva(
  "w-full px-4 text-sm transition-all outline-hidden bg-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        classic:
          "h-10 rounded-lg border border-border bg-muted/50 hover:bg-muted focus:bg-background focus:border-border focus:ring-[length:var(--border-width-medium)] focus:ring-ring",
        glassmorphic:
          "h-10 rounded-lg border border-border bg-card/60 hover:border-border focus:border-border focus:ring-[length:var(--border-width-thick)] focus:ring-ring/5",
        brutalist:
          "h-10 rounded-none border-medium border-border-strong bg-card text-foreground placeholder:text-muted-foreground focus:bg-muted focus:ring-0",
      },
    },
  }
);

const buttonVariants = cva(
  "inline-flex min-w-[160px] h-10 items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer select-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-hidden focus-visible:ring-[length:var(--border-width-medium)] focus-visible:ring-ring",
  {
    variants: {
      variant: {
        classic: "rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
        glassmorphic: "rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-md",
        brutalist:
          "rounded-none bg-foreground text-background border-medium border-border-strong font-mono font-bold shadow-brand hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brand",
      },
    },
  }
);

interface ContactFormProps {
  showIntro?: boolean;
  variant?: FormVariant;
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
      setError(err instanceof Error ? err.message : "Failure");
    }
  };

  const isBrutalist = variant === "brutalist";

  return (
    <div className={containerVariants({ variant })}>
      {}
      {showIntro && (
        <div className="border-border mb-8 border-b pb-6">
          <p className="text-muted-foreground text-xs font-bold tracking-[0.2em] uppercase">
            <I18n>Project Brief</I18n>
          </p>
          <h3
            className={cn(
              "text-foreground mt-2 text-2xl font-semibold tracking-tight",
              isBrutalist && "font-mono font-black uppercase"
            )}
          >
            <I18n>Let's build something exceptional</I18n>
          </h3>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
            <I18n>
              Share your operational metrics, stack preferences, or roadmap milestones to initialize
              architecture sync.
            </I18n>
          </p>
        </div>
      )}

      {}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          {}
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

          {}
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

          {}
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

          {}
          <div className="space-y-1.5">
            <label htmlFor="contact-phone" className={labelVariants({ variant })}>
              <I18n>Phone Number</I18n>{" "}
              <span className="text-muted-foreground font-normal lowercase">
                ({isBrutalist ? "opt" : <I18n>optional</I18n>})
              </span>
            </label>
            <div
              className={cn(
                "focus-within:ring-ring flex items-center overflow-hidden transition-all focus-within:ring-[length:var(--border-width-medium)]",
                variant === "classic" &&
                  "border-border bg-muted/50 hover:bg-muted focus-within:bg-background hover:focus-within:bg-background focus-within:border-border rounded-lg border",
                variant === "glassmorphic" &&
                  "border-border bg-card/60 hover:border-border focus-within:border-border focus-within:ring-ring/5 rounded-lg border focus-within:ring-[length:var(--border-width-thick)]",
                variant === "brutalist" &&
                  "bg-card border-border-strong focus-within:bg-muted border-medium focus-within:ring-ring/5 rounded-none"
              )}
            >
              <span
                className={cn(
                  "bg-muted/50 text-muted-foreground flex h-10 items-center border-r px-4 text-xs font-semibold select-none",
                  variant === "brutalist" &&
                    "bg-muted text-foreground border-border-strong font-mono font-bold"
                )}
              >
                +880
              </span>
              <input
                id="contact-phone"
                type="tel"
                name="phone"
                autoComplete="tel"
                className="text-foreground placeholder:text-muted-foreground/60 h-10 min-w-0 flex-1 border-0 bg-transparent px-4 text-sm outline-hidden focus:ring-0"
                placeholder="1XXXXXXXXX"
              />
            </div>
          </div>
        </div>

        {}
        <div className="space-y-1.5">
          <label htmlFor="contact-message" className={labelVariants({ variant })}>
            <I18n>Message</I18n>
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            required
            className={cn(inputVariants({ variant }), "block min-h-[120px] resize-none p-4.5")}
            placeholder="Share goals, specifications, scope timeline parameters, or current performance blockers..."
          />
        </div>

        {}
        <div
          className={cn(
            "space-y-2.5 rounded-xl border p-4 transition-colors select-none",
            variant === "brutalist"
              ? "bg-card border-border-strong border-medium rounded-none"
              : "border-border bg-muted/50"
          )}
        >
          <div className="text-muted-foreground flex items-start gap-3 text-xs leading-normal">
            <ShieldCheck className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
            <span>
              <I18n>
                Secure internal data encryption pipeline guarantees dynamic enterprise privacy
                locks.
              </I18n>
            </span>
          </div>
          <div className="text-muted-foreground flex items-start gap-3 text-xs leading-normal">
            <Mail className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
            <span>
              <I18n>
                Our operations network reviews specifications to trigger an architecture response
                within 12h.
              </I18n>
            </span>
          </div>
        </div>

        {}
        {error && (
          <div
            role="alert"
            className={cn(
              "text-destructive animate-fade-in border px-4 py-3 text-xs font-medium duration-200",
              variant === "brutalist"
                ? "border-destructive text-destructive bg-card border-medium rounded-none font-mono"
                : "border-destructive/20 bg-destructive-subtle rounded-lg"
            )}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className={cn(
              "animate-fade-in flex items-center gap-2 border px-4 py-3 text-xs font-semibold duration-200",
              variant === "brutalist"
                ? "border-success bg-card text-success border-medium rounded-none font-mono"
                : "border-success/20 bg-success-subtle text-success rounded-lg"
            )}
          >
            <Check className="text-success h-4 w-4 shrink-0" />
            <span>
              <I18n>Inquiry synchronized successfully!</I18n>
            </span>
          </div>
        )}

        {}
        <div className="border-border flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground max-w-xs text-xs leading-relaxed">
            <I18n>
              We only deploy your tracking parameters to respond specifically to this architecture
              scope requirement.
            </I18n>
          </p>

          <button type="submit" disabled={submit.isPending} className={buttonVariants({ variant })}>
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
