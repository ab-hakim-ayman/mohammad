"use client";

import { useMyProfile, useUpdateMyProfile } from "@/features/profile";
import { ProfileForm } from "@/features/profile";
import { StateScreen } from "@/shared/components/StateScreen";
import { Link, useRouter } from "@/shared/i18n";
import { ArrowRight, PencilLine, Users } from "lucide-react";
import I18n from "@/shared/components/I18n";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";

export default function EditMyProfilePage() {
  const router = useRouter();
  const { data, isLoading, error } = useMyProfile();
  const updateProfile = useUpdateMyProfile();

  const profile = data?.data;

  const handleSubmit = async (formData: any) => {
    await updateProfile.mutateAsync(formData);
    router.push("/admin/profiles/me");
  };

  if (isLoading) return <StateScreen state="loading" title="Loading profile editor" compact />;

  if (error || !profile)
    return <StateScreen state={error ? "error" : "notFound"} title="Profile not found" compact />;

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <div className="ui-admin-container">
        <AdminPageBanner
          icon={PencilLine}
          eyebrow={<I18n>Edit Profile</I18n>}
          title={
            <>
              <I18n>Edit</I18n> {profile.fullName || profile.designation || "My Profile"}
            </>
          }
          description={
            <I18n>Adjust your public presence and profile metadata from one aligned editor.</I18n>
          }
          actions={
            <>
              <Link
                href="/admin/profiles"
                className="border-border bg-surface-elevated text-foreground ui-card-hover inline-flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium shadow-sm disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
              >
                <Users className="text-muted-foreground h-4 w-4" />
                <I18n>Profiles</I18n>
              </Link>
              <Link
                href="/admin/profiles/me"
                className="border-border bg-surface-elevated text-foreground ui-card-hover inline-flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium shadow-sm disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
              >
                <ArrowRight className="text-muted-foreground h-4 w-4 rotate-180" />
                <I18n>Back</I18n>
              </Link>
            </>
          }
        />

        <div className="ui-admin-muted-panel ui-card-hover mb-6 flex items-center gap-3">
          <I18n>
            This editor updates the same profile record used by the team directory and the public
            profile surfaces.
          </I18n>
        </div>
        <div className="ui-admin-section ui-card-hover">
          <ProfileForm
            initialData={profile}
            onSubmit={handleSubmit}
            isSubmitting={updateProfile.isPending}
          />
        </div>
      </div>
    </div>
  );
}
