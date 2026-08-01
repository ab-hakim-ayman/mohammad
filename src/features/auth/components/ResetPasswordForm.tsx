"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useLocale } from "next-intl";

import { FormEngine } from "@/shared/components/forms/FormEngine";
import I18n from "@/shared/components/I18n";
import { useResetPassword } from "../hooks/useAuth";
// 👉 আপনার এক্সিস্টিং স্কিমা ফাইল থেকে ইমপোর্ট করা হলো
import { ResetPasswordSchema, ResetPasswordSchemaType } from "@/features/auth/schemas/auth.schema";

interface ResetPasswordFormProps {
  initialToken?: string;
}

export function ResetPasswordForm({ initialToken = "" }: ResetPasswordFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const resetPassword = useResetPassword();
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // FormEngine ফিল্ড কনফিগারেশন
  const formConfig = {
    sections: [
      {
        fields: [
          {
            name: "token" as const,
            label: "Reset Token",
            type: "text" as const,
            placeholder: "Enter your reset token",
          },
          {
            name: "password" as const,
            label: "New Password",
            type: "password" as const,
            placeholder: "••••••••",
          },
          {
            name: "confirmPassword" as const,
            label: "Confirm Password",
            type: "custom" as const,
            renderCustom: (methods: any) => {
              const { register } = methods;
              return (
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    placeholder="••••••••"
                    className="bg-background/60 border-border/80 focus-visible:ring-primary/20 h-9 w-full rounded-xl px-3.5 pr-10 text-xs backdrop-blur-md transition-all focus-visible:ring-2 focus:outline-hidden text-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((val) => !val)}
                    className="text-muted-foreground/70 hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              );
            },
          },
        ],
      },
    ],
  };

  const defaultValues: ResetPasswordSchemaType = {
    token: initialToken,
    password: "",
    confirmPassword: "",
  };

  const handleFormSubmit = async (values: ResetPasswordSchemaType) => {
    await resetPassword.mutateAsync({
      token: values.token.trim(),
      password: values.password,
      confirmPassword: values.confirmPassword,
    });
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="animate-in fade-in-50 w-full space-y-5 p-1 text-center duration-300">
        <div className="bg-success/10 text-success mx-auto flex h-12 w-12 items-center justify-center rounded-full">
          <CheckCircle2 className="h-6 w-6 stroke-[2]" />
        </div>
        <div className="space-y-1.5">
          <p className="text-muted-foreground text-sm leading-relaxed font-medium">
            <I18n>Password reset successfully</I18n>
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push(`/${locale}/login`)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold shadow-2xs transition-all"
        >
          <span>
            <I18n>Back to login</I18n>
          </span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 p-1 sm:p-2">
      <div className="space-y-1 text-left">
        <h1 className="text-foreground text-sm font-bold tracking-tight">
          <I18n>Set new password</I18n>
        </h1>
        <p className="text-muted-foreground text-xs">
          <I18n>Please enter your new password below.</I18n>
        </p>
      </div>

      <FormEngine
        schema={ResetPasswordSchema}
        config={formConfig}
        defaultValues={defaultValues}
        onSubmit={handleFormSubmit}
        isSubmitting={resetPassword.isPending}
        submitText="Reset Password"
        cancelText={null}
      />
    </div>
  );
}