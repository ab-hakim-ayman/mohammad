"use client";

import { useParams } from "next/navigation";
import { UserCog } from "lucide-react";
import { useProfile } from "@/features/profile";
import { StateScreen } from "@/shared/components";
import { DetailEngine } from "@/shared/components/details/DetailEngine";
import { DetailEngineConfig } from "@/shared/components/details/detail-engine.types";

export default function AdminProfileDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isPending, error } = useProfile(id);

  if (isLoading || isPending)
    return <StateScreen compact state="loading" title="Loading profile details" />;
  if (error) return <StateScreen compact state="error" title="Failed to load profile" />;
  if (!data?.data) return <StateScreen compact state="notFound" title="Profile not found" />;

  const originalProfile = data.data;
  const profile = {
    ...originalProfile,
    status: originalProfile.isPublic ? "PUBLISHED" : "DRAFT",
  };

  const config: DetailEngineConfig<typeof profile> = {
    titleKey: "fullName",
    subtitleKey: "headline",
    statusKey: "status",
    headerIcon: UserCog,
    eyebrow: "Profile Details",
    actions: {
      editHref: `/admin/profiles/${profile.id}/edit`,
      backHref: "/admin/profiles",
    },
    mainSections: [
      {
        title: "Overview",
        fields: [
          { label: "User ID", key: "userId", type: "text", gridSpan: 6 },
          {
            label: "Experience",
            key: "experienceYears",
            type: "text",
            gridSpan: 6,
            render: (p) => (p.experienceYears != null ? `${p.experienceYears} years` : "—"),
          },
          { label: "Designation", key: "designation", type: "text", gridSpan: 6 },
          { label: "Is Public", key: "isPublic", type: "boolean", gridSpan: 6 },
          {
            label: "Biography",
            key: "bio",
            type: "custom",
            gridSpan: 12,
            render: () => (
              <p className="text-foreground text-sm leading-relaxed whitespace-pre-line">
                {profile.bio || <span className="text-muted-foreground/40 italic">No biography available</span>}
              </p>
            ),
          },
        ],
      },
      {
        title: "Social & Portfolio Links",
        fields: [
          { label: "GitHub URL", key: "githubUrl", type: "link", gridSpan: 6 },
          { label: "LinkedIn URL", key: "linkedinUrl", type: "link", gridSpan: 6 },
          { label: "Portfolio URL", key: "portfolioUrl", type: "link", gridSpan: 12 },
        ],
      },
      {
        title: "Media Assets",
        fields: [
          { label: "Avatar", key: "avatar", type: "media", gridSpan: 6 },
          { label: "Cover Image", key: "coverImage", type: "media", gridSpan: 6 },
        ],
      },
    ],
    sidebarSections: [
      {
        title: "Audit Information",
        fields: [
          { label: "Created At", key: "createdAt", type: "datetime" },
          { label: "Updated At", key: "updatedAt", type: "datetime" },
        ],
      },
    ],
  };

  return <DetailEngine data={profile} config={config as any} />;
}
