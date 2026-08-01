"use client";

import { useMemo } from "react";
import { FormEngine } from "@/shared/components/forms/FormEngine";
import { FormEngineConfig } from "@/shared/components/forms/form-engine.types";
import { ProfileSchema } from "../schemas/profile.schema";
import { ProfilePayload } from "../types/profile.types";

interface ProfileFormProps {
  initialData?: (Partial<ProfilePayload> & { id?: string }) | null;
  onSubmit: (data: ProfilePayload) => Promise<void>;
  isSubmitting: boolean;
  [key: string]: any;
}

export function ProfileForm({
  initialData,
  onSubmit,
  isSubmitting,
}: ProfileFormProps) {
  const config: FormEngineConfig<ProfilePayload> = {
    sections: [
      {
        title: "Profile Information",
        fields: [
          { name: "fullName", label: "Full Name", type: "text", required: true, gridSpan: 6 },
          { name: "headline", label: "Headline", type: "text", gridSpan: 6 },
          { name: "bio", label: "Bio", type: "textarea", gridSpan: 12 },
          { name: "avatar", label: "Avatar", type: "media", mediaFolder: "profiles/avatar", altTextField: "avatarAlt", gridSpan: 6 },
          { name: "coverImage", label: "Cover Image", type: "media", mediaFolder: "profiles/cover", altTextField: "coverImageAlt", gridSpan: 6 },
          { name: "designation", label: "Designation", type: "text", gridSpan: 6 },
          { name: "experienceYears", label: "Experience Years", type: "number", gridSpan: 6 },
          { name: "skills", label: "Skills", type: "tags", placeholder: "React, TypeScript, Node.js", gridSpan: 12 },
          { name: "githubUrl", label: "Github Url", type: "text", gridSpan: 6 },
          { name: "linkedinUrl", label: "Linkedin Url", type: "text", gridSpan: 6 },
          { name: "portfolioUrl", label: "Portfolio Url", type: "text", gridSpan: 6 },
          { name: "isPublic", label: "Is Public", type: "switch", gridSpan: 12 },
        ],
      },
    ],
  };

  const formattedDefaults = useMemo(() => {
    if (!initialData) return undefined;
    return {
      fullName: initialData.fullName || "",
      headline: initialData.headline || "",
      bio: initialData.bio || "",
      avatar: initialData.avatar || null,
      coverImage: initialData.coverImage || null,
      designation: initialData.designation || "",
      experienceYears: initialData.experienceYears || null,
      skills: initialData.skills || [],
      githubUrl: initialData.githubUrl || "",
      linkedinUrl: initialData.linkedinUrl || "",
      portfolioUrl: initialData.portfolioUrl || "",
      isPublic: initialData.isPublic || false,
      avatarAlt: initialData.avatarAlt || "",
      coverImageAlt: initialData.coverImageAlt || "",
    };
  }, [initialData]);

  return (
    <FormEngine
      schema={ProfileSchema}
      config={config}
      defaultValues={formattedDefaults as any}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitText="Save Profile"
      folderPrefix="a2icoders"
    />
  );
}
