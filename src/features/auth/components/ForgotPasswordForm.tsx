"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { useLocale } from "next-intl";

import { FormEngine } from "@/shared/components/forms/FormEngine";
import I18n from "@/shared/components/I18n";
import { useForgotPassword } from "../hooks/useAuth";
// 👉 আপনার এক্সিস্টিং স্কিমা ফাইল থেকে ইমপোর্ট করা হলো
import { ForgotPasswordSchema, ForgotPasswordSchemaType } from "@/features/auth/schemas/auth.schema";

export function ForgotPasswordForm() {
  const locale = useLocale();
  const forgotPassword = useForgotPassword();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // FormEngine কনফিগারেশন
  const formConfig = {
    sections: [
      {
        fields: [
          {
            name: "email" as const,
            label: "Email Address",
            type: "text" as const,
            placeholder: "name@company.com",
          },
        ],
      },
    ],
  };

  const defaultValues: ForgotPasswordSchemaType = {
    email: "",
  };

  const handleFormSubmit = async (values: ForgotPasswordSchemaType) => {
    setError(null);
    try {
      await forgotPassword.mutateAsync({ email: values.email.trim() });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || "Failed to send reset link");
    }
  };

  if (success) {
    return (
      <div className="animate-in fade-in-50 w-full space-y-5 p-1 text-center duration-300">
        <div className="bg-success/10 text-success mx-auto flex h-12 w-12 items-center justify-center rounded-full">
          <CheckCircle2 className="h-6 w-6 stroke-[2]" />
        </div>
        <div className="space-y-1.5">
          <p className="text-muted-foreground text-sm leading-relaxed font-medium">
            <I18n>Check your inbox</I18n>
          </p>
        </div>
        <Link
          href={`/${locale}/login`}
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold shadow-2xs transition-all"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>
            <I18n>Back to login</I18n>
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 p-1 sm:p-2">
      <div className="space-y-1 text-left">
        <h1 className="text-foreground text-sm font-bold tracking-tight">
          <I18n>Forgot password?</I18n>
        </h1>
        <p className="text-muted-foreground text-xs">
          <I18n>Enter your email to receive a password reset link.</I18n>
        </p>
      </div>

      {error && (
        <div className="border-destructive/20 bg-destructive/5 text-destructive rounded-xl border px-4 py-3 text-xs font-semibold">
          {error}
        </div>
      )}

      <FormEngine
        schema={ForgotPasswordSchema}
        config={formConfig}
        defaultValues={defaultValues}
        onSubmit={handleFormSubmit}
        isSubmitting={forgotPassword.isPending}
        submitText="Send Reset Link"
        cancelText={null}
      />
    </div>
  );
}