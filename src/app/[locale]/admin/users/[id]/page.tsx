"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { UserCog, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/shared/components/Select";
import {
  useDeleteUser,
  useResendUserInvite,
  useUpdateUserRole,
  useUpdateUserStatus,
  useUser,
} from "@/features/user";
import { StateScreen } from "@/shared/components/StateScreen";
import { useRouter } from "next/navigation";
import { ACCOUNT_STATUSES, USER_ROLES, type AccountStatus, type UserRole } from "@/shared/types";
import { DetailEngine } from "@/shared/components/details/DetailEngine";
import { DetailEngineConfig } from "@/shared/components/details/detail-engine.types";
import { enumLabel } from "@/shared/utils/enum-label";

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading, isPending, error } = useUser(id);
  const deleteUser = useDeleteUser();
  const resendInvite = useResendUserInvite();
  const updateRole = useUpdateUserRole();
  const updateStatus = useUpdateUserStatus();

  const [role, setRole] = useState<UserRole | "">("");
  const [status, setStatus] = useState<AccountStatus | "">("");

  if (isLoading || isPending)
    return <StateScreen state="loading" title="Loading user details" compact />;
  if (error) return <StateScreen state="error" title="Failed to load user" compact />;
  if (!data?.data) return <StateScreen state="notFound" title="User not found" compact />;

  const user = data.data;
  const currentRole = role || ((user?.role || "USER") as UserRole);
  const currentStatus = status || ((user?.status || "ACTIVE") as AccountStatus);

  const handleDelete = async () => {
    if (!confirm("Delete this user permanently?")) return;
    await deleteUser.mutateAsync(id);
    router.push("/admin/users");
  };

  const handleResend = async () => {
    await resendInvite.mutateAsync(id);
  };

  const handleRoleUpdate = async () => {
    if (!role || role === user?.role) return;
    await updateRole.mutateAsync({ id, data: { role: currentRole } });
    setRole("");
  };

  const handleStatusUpdate = async () => {
    if (!status || status === user?.status) return;
    await updateStatus.mutateAsync({ id, data: { status: currentStatus } });
    setStatus("");
  };

  const item = {
    ...user,
    titleName: user.name || user.email || "User",
  };

  const config: DetailEngineConfig<typeof item> = {
    titleKey: "titleName",
    subtitleKey: "email",
    statusKey: "status",
    headerIcon: UserCog,
    eyebrow: "User Management",
    actions: {
      editHref: `/admin/users/${id}/edit`,
      backHref: "/admin/users",
      onDelete: handleDelete,
      isDeleting: deleteUser.isPending,
    },
    mainSections: [
      {
        title: "Account Details",
        fields: [
          { label: "ID", key: "id", type: "text", gridSpan: 12 },
          { label: "Email", key: "email", type: "text", gridSpan: 6 },
          {
            label: "Name",
            key: "name",
            type: "text",
            gridSpan: 6,
            render: (rec) => rec.name || "—",
          },
          {
            label: "Phone",
            key: "phone",
            type: "text",
            gridSpan: 6,
            render: (rec) => rec.phone || "—",
          },
          { label: "Verified Account", key: "isVerified", type: "boolean", gridSpan: 6 },
        ],
      },
      {
        title: "Access Controls",
        fields: [
          {
            label: "Role & Status Update",
            key: "role",
            type: "custom",
            gridSpan: 12,
            render: () => (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-muted-foreground block text-sm font-medium">Role</label>
                    <Select
                      value={currentRole}
                      onValueChange={(val) => setRole(val as UserRole)}
                      options={USER_ROLES.map((v) => ({ label: enumLabel(v), value: v }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-muted-foreground block text-sm font-medium">
                      Status
                    </label>
                    <Select
                      value={currentStatus}
                      onValueChange={(val) => setStatus(val as AccountStatus)}
                      options={ACCOUNT_STATUSES.map((v) => ({ label: enumLabel(v), value: v }))}
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-1">
                  <Button
                    onClick={handleRoleUpdate}
                    disabled={!role || role === user?.role}
                    className="bg-primary h-10 rounded-xl px-5 shadow-sm"
                  >
                    Update role
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleStatusUpdate}
                    disabled={!status || status === user?.status}
                    className="h-10 rounded-xl px-5 shadow-sm"
                  >
                    Update status
                  </Button>
                </div>
              </div>
            ),
          },
          {
            label: "Invitation Actions",
            key: "status",
            type: "custom",
            gridSpan: 12,
            render: () => (
              <div className="pt-2">
                <Button
                  variant="outline"
                  onClick={handleResend}
                  className="border-border bg-surface-elevated text-foreground ui-card-hover h-10 rounded-xl border px-4 shadow-sm"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Resend invite
                </Button>
              </div>
            ),
          },
        ],
      },
      {
        title: "Profile Bio",
        fields: [
          {
            label: "Biography",
            key: "profile.bio",
            type: "custom",
            gridSpan: 12,
            render: () => (
              <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                {user.profile?.bio || (
                  <span className="text-muted-foreground/40 italic">No bio available</span>
                )}
              </p>
            ),
          },
        ],
      },
      {
        title: "Profile Specs",
        fields: [
          {
            label: "Full Name",
            key: "profile.fullName",
            type: "text",
            gridSpan: 6,
            render: (rec) => rec.profile?.fullName || "—",
          },
          {
            label: "Headline",
            key: "profile.headline",
            type: "text",
            gridSpan: 6,
            render: (rec) => rec.profile?.headline || "—",
          },
          {
            label: "Designation",
            key: "profile.designation",
            type: "text",
            gridSpan: 6,
            render: (rec) => rec.profile?.designation || "—",
          },
          {
            label: "Experience Years",
            key: "profile.experienceYears",
            type: "text",
            gridSpan: 6,
            render: (rec) =>
              rec.profile?.experienceYears != null ? `${rec.profile.experienceYears} years` : "—",
          },
          {
            label: "Public Visibility",
            key: "profile.isPublic",
            type: "boolean",
            gridSpan: 6,
            render: (rec) => rec.profile?.isPublic,
          },
        ],
      },
    ],
    sidebarSections: [
      {
        title: "Avatar & Cover",
        fields: [
          { label: "Avatar", key: "avatar", type: "media" },
          {
            label: "Cover Image",
            key: "profile.coverImage",
            type: "media",
            render: (rec) => rec.profile?.coverImage || "",
          },
        ],
      },
      {
        title: "Social Connections",
        fields: [
          {
            label: "GitHub Profile",
            key: "profile.githubUrl",
            type: "link",
            render: (rec) => rec.profile?.githubUrl || "",
          },
          {
            label: "LinkedIn Profile",
            key: "profile.linkedinUrl",
            type: "link",
            render: (rec) => rec.profile?.linkedinUrl || "",
          },
          {
            label: "Portfolio Site",
            key: "profile.portfolioUrl",
            type: "link",
            render: (rec) => rec.profile?.portfolioUrl || "",
          },
        ],
      },
      {
        title: "Activity Logs",
        fields: [
          { label: "Last Login At", key: "lastLoginAt", type: "datetime" },
          { label: "Created At", key: "createdAt", type: "datetime" },
          { label: "Updated At", key: "updatedAt", type: "datetime" },
        ],
      },
    ],
    relatedSections: [
      {
        title: "Skills",
        hrefPrefix: "skills",
        variant: "badges",
        getRecords: (rec) =>
          rec.profile?.skills?.map((sk: any) => ({ id: sk.id, title: sk.title })) || [],
      },
    ],
  };

  return <DetailEngine data={item} config={config as any} />;
}
