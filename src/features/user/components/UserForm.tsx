"use client";

import { useMemo } from "react";
import { FormEngine } from "@/shared/components/forms/FormEngine";
import { FormEngineConfig } from "@/shared/components/forms/form-engine.types";
import { CreateUserSchema, UpdateUserSchema } from "../schemas/user.schema";
import { CreateUserPayload, UpdateUserPayload, UserRecord } from "../types/user.types";
import { ACCOUNT_STATUSES, USER_ROLES } from "@/shared/types";
import { enumLabel } from "@/shared/utils/enum-label";

interface UserFormProps {
  initialData?: Partial<UserRecord>;
  onSubmit: (data: any) => Promise<void> | void;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
  submitLabel?: string;
  [key: string]: any;
}

export function UserForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  mode = "create",
  submitLabel,
}: UserFormProps) {
  const schema = mode === "create" ? CreateUserSchema : UpdateUserSchema;

  const roleOptions = useMemo(() => {
    return USER_ROLES.map((role) => ({ label: enumLabel(role), value: role }));
  }, []);

  const statusOptions = useMemo(() => {
    return ACCOUNT_STATUSES.map((status) => ({ label: enumLabel(status), value: status }));
  }, []);

  const config: FormEngineConfig<any> = useMemo(() => {
    const basicFields = [
      ...(mode === "create"
        ? [
            { name: "email", label: "Email", type: "text" as const, required: true, gridSpan: 6 as const },
            { name: "password", label: "Password", type: "password" as const, gridSpan: 6 as const },
          ]
        : []),
      { name: "name", label: "Name", type: "text" as const, gridSpan: 6 as const },
      { name: "phone", label: "Phone", type: "text" as const, gridSpan: 6 as const },
      { name: "role", label: "Role", type: "select" as const, required: true, options: roleOptions, gridSpan: 6 as const },
      { name: "status", label: "Status", type: "select" as const, required: true, options: statusOptions, gridSpan: 6 as const },
    ];

    return {
      sections: [
        {
          title: "Basic Details",
          fields: basicFields,
        },
        {
          title: "Profile Details",
          fields: [
            { name: "profile.fullName", label: "Full Name", type: "text" as const, gridSpan: 6 as const },
            { name: "profile.headline", label: "Headline", type: "text" as const, gridSpan: 6 as const },
            { name: "profile.bio", label: "Bio", type: "textarea" as const, gridSpan: 12 as const },
            { name: "avatar", label: "Avatar", type: "media" as const, mediaFolder: "users/avatar", gridSpan: 6 as const },
            { name: "profile.coverImage", label: "Cover Image", type: "media" as const, mediaFolder: "profiles/cover", gridSpan: 6 as const },
            { name: "profile.designation", label: "Designation", type: "text" as const, gridSpan: 6 as const },
            { name: "profile.experienceYears", label: "Experience Years", type: "number" as const, gridSpan: 6 as const },
            { name: "profile.skills", label: "Skills", type: "tags" as const, placeholder: "React, TypeScript, Node.js", gridSpan: 12 as const },
            { name: "profile.githubUrl", label: "Github Url", type: "text" as const, gridSpan: 6 as const },
            { name: "profile.linkedinUrl", label: "Linkedin Url", type: "text" as const, gridSpan: 6 as const },
            { name: "profile.portfolioUrl", label: "Portfolio Url", type: "text" as const, gridSpan: 6 as const },
            { name: "profile.isPublic", label: "Is Public", type: "switch" as const, gridSpan: 12 as const },
          ],
        },
      ],
    };
  }, [mode, roleOptions, statusOptions]);

  const formattedDefaults = useMemo(() => {
    return {
      ...(mode === "create" ? { email: initialData?.email || "", password: null } : {}),
      name: initialData?.name || "",
      phone: initialData?.phone || "",
      role: initialData?.role || "EMPLOYEE",
      status: initialData?.status || "INVITED",
      avatar: initialData?.avatar || null,
      profile: {
        fullName: initialData?.profile?.fullName || "",
        headline: initialData?.profile?.headline || "",
        bio: initialData?.profile?.bio || "",
        avatar: initialData?.avatar || null,
        coverImage: initialData?.profile?.coverImage || null,
        designation: initialData?.profile?.designation || "",
        experienceYears: initialData?.profile?.experienceYears || null,
        skills: initialData?.profile?.skills?.map((s: any) => typeof s === "string" ? s : s.title) || [],
        githubUrl: initialData?.profile?.githubUrl || "",
        linkedinUrl: initialData?.profile?.linkedinUrl || "",
        portfolioUrl: initialData?.profile?.portfolioUrl || "",
        isPublic: initialData?.profile?.isPublic || false,
      },
    };
  }, [initialData, mode]);

  const onFormSubmit = async (data: any) => {
    const payload = {
      ...data,
      avatar: data.avatar || null,
      profile: data.profile
        ? {
            ...data.profile,
            avatar: data.avatar || null,
          }
        : undefined,
    };
    await onSubmit(payload);
  };

  return (
    <FormEngine
      schema={schema}
      config={config}
      defaultValues={formattedDefaults as any}
      onSubmit={onFormSubmit}
      isSubmitting={isSubmitting}
      submitText={submitLabel || "Save"}
      folderPrefix="a2icoders"
    />
  );
}
