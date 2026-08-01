"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { FormEngine } from "@/shared/components/forms/FormEngine";
import I18n from "@/shared/components/I18n";
import { useAcceptInvite } from "../hooks/useAuth";
// 👉 আপনার এক্সিস্টিং স্কিমা ফাইল থেকে ইমপোর্ট করা হলো
import { AcceptInviteSchema, AcceptInviteSchemaType } from "@/features/auth/schemas/auth.schema";

interface AcceptInviteFormProps {
  initialToken?: string;
}

export function AcceptInviteForm({ initialToken = "" }: AcceptInviteFormProps) {
  const acceptInvite = useAcceptInvite();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // FormEngine কনফিগারেশন
  const formConfig = {
    sections: [
      {
        fields: [
          {
            name: "token" as const,
            label: "Invitation Token",
            type: "text" as const,
            placeholder: "Enter invitation token",
          },
          {
            name: "name" as const,
            label: "Full Name",
            type: "text" as const,
            placeholder: "John Doe",
          },
          {
            name: "phone" as const,
            label: "Phone Number",
            type: "text" as const,
            placeholder: "+880...",
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

  const defaultValues: AcceptInviteSchemaType = {
    token: initialToken,
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  };

  const handleFormSubmit = async (values: AcceptInviteSchemaType) => {
    setError(null);
    try {
      await acceptInvite.mutateAsync({
        token: values.token.trim(),
        name: values.name?.trim() || null,
        phone: values.phone?.trim() || null,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });
    } catch (err: any) {
      setError(err?.message || "Failed to accept invite");
    }
  };

  return (
    <div className="w-full space-y-6 p-1 sm:p-2">
      <div className="space-y-1 text-left">
        <h1 className="text-foreground text-sm font-bold tracking-tight">
          <I18n>Accept Invitation</I18n>
        </h1>
        <p className="text-muted-foreground text-xs">
          <I18n>Please fill out your details to set up your account.</I18n>
        </p>
      </div>

      {error && (
        <div className="border-destructive/20 bg-destructive/5 text-destructive rounded-xl border px-4 py-3 text-xs font-semibold">
          {error}
        </div>
      )}

      <FormEngine
        schema={AcceptInviteSchema}
        config={formConfig}
        defaultValues={defaultValues}
        onSubmit={handleFormSubmit}
        isSubmitting={acceptInvite.isPending}
        submitText="Accept Invite"
        cancelText={null}
      />
    </div>
  );
}