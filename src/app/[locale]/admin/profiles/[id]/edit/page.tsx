"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, PencilLine } from "lucide-react";

import { useProfile, useUpdateProfile, ProfileForm } from "@/features/profile";
import { Button } from "@/components/ui/button";
import { StateScreen } from "@/shared/components/StateScreen";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";
import I18n from "@/shared/components/I18n";

export default function EditProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const locale = useLocale();

  const { data, isLoading, error } = useProfile(id);
  const updateProfile = useUpdateProfile();

  const handleSubmit = async (formData: any) => {
    await updateProfile.mutateAsync({ id, data: formData });
    router.push(`/${locale}/admin/profiles/${id}`);
  };

  if (isLoading) return <StateScreen state="loading" title="Loading profile editor" compact />;

  if (error || !data?.data)
    return <StateScreen state={error ? "error" : "notFound"} title="Profile not found" compact />;

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={PencilLine}
        eyebrow={<I18n>Edit Record</I18n>}
        title={
          <>
            <I18n>Edit</I18n> {data.data.fullName || data.data.designation || data.data.user.email}
          </>
        }
        description={
          <I18n>Adjust team visibility and profile metadata from one aligned editor.</I18n>
        }
        actions={
          <Link href={`/${locale}/admin/profiles/${id}`}>
            <Button
              variant="outline"
              className="border-border bg-surface-elevated text-foreground ui-card-hover h-10 cursor-pointer rounded-xl px-4 shadow-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <I18n>Back</I18n>
            </Button>
          </Link>
        }
      />
      <ProfileForm
        initialData={data.data}
        onSubmit={handleSubmit}
        isSubmitting={updateProfile.isPending}
      />
    </div>
  );
}
