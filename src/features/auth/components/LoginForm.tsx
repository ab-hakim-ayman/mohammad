"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { FormEngine } from "@/shared/components/forms/FormEngine";
import I18n from "@/shared/components/I18n";
import { useLogin } from "../hooks/useAuth";
import { useAuthStore } from "../store/auth.store";
// আপনার এক্সিস্টিং স্কিমা ফাইল থেকে ইমপোর্ট
import { LoginSchema, LoginSchemaType } from "@/features/auth/schemas/auth.schema";

export function LoginForm() {
  const locale = useLocale();
  const login = useLogin();
  const [error, setError] = useState<string | null>(null);

  const emailDraft = useAuthStore((state) => state.emailDraft);
  const rememberMe = useAuthStore((state) => state.rememberMe);
  const showPassword = useAuthStore((state) => state.showPassword);

  const setEmailDraft = useAuthStore((state) => state.setEmailDraft);
  const setRememberMe = useAuthStore((state) => state.setRememberMe);
  const togglePasswordVisibility = useAuthStore((state) => state.togglePasswordVisibility);

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
          {
            name: "password" as const,
            label: "Password",
            type: "custom" as const,
            renderCustom: (methods: any) => {
              const { register } = methods;
              return (
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="••••••••"
                    className="bg-background/60 border-border/80 focus-visible:ring-primary/20 h-9 w-full rounded-xl px-3.5 pr-10 text-xs backdrop-blur-md transition-all focus-visible:ring-2 focus:outline-hidden text-foreground"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-muted-foreground/70 hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              );
            },
          },
          {
            name: "rememberMe" as const,
            label: "Remember me",
            type: "switch" as const,
          },
        ],
      },
    ],
  };

  const defaultValues: LoginSchemaType & { rememberMe: boolean } = {
    email: emailDraft || "",
    password: "",
    rememberMe: rememberMe,
  };

  const handleFormSubmit = async (values: any) => {
    setError(null);

    if (values.rememberMe) {
      setEmailDraft(values.email);
    } else {
      setEmailDraft("");
    }
    setRememberMe(values.rememberMe);

    try {
      await login.mutateAsync({
        email: values.email,
        password: values.password,
      });
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="w-full space-y-5 p-1 sm:p-2">
      <div className="space-y-1 text-left">
        <h1 className="text-foreground text-sm font-bold tracking-tight">
          <I18n>Sign in to your account</I18n>
        </h1>
        <p className="text-muted-foreground text-xs">
          <I18n>Welcome back! Please enter your details.</I18n>
        </p>
      </div>

      {error && (
        <div className="border-destructive/20 bg-destructive/5 text-destructive animate-in fade-in-50 rounded-xl border px-4 py-3 text-xs font-semibold">
          {error}
        </div>
      )}

      <FormEngine
        schema={LoginSchema}
        config={formConfig}
        defaultValues={defaultValues}
        onSubmit={handleFormSubmit}
        isSubmitting={login.isPending}
        submitText="Login"
        cancelText={null}
      />

      <div className="flex items-center justify-between pt-1 text-xs">
        <Link
          href={`/${locale}/forgot-password`}
          className="text-primary font-bold transition-colors hover:underline"
        >
          <I18n>Forgot password?</I18n>
        </Link>
        <p className="text-muted-foreground">
          <I18n>Don't have an account?</I18n>{" "}
          <Link
            href={`/${locale}/register`}
            className="text-foreground font-bold hover:underline"
          >
            <I18n>Sign up</I18n>
          </Link>
        </p>
      </div>
    </div>
  );
}