"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, PencilLine } from "lucide-react";

import { useUpdateUser, useUser, UserForm } from "@/features/user";
import { Button } from "@/components/ui/button";
import { StateScreen } from "@/shared/components/StateScreen";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";
import I18n from "@/shared/components/I18n";

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const locale = useLocale();

  const { data, isLoading, error } = useUser(id);
  const updateUser = useUpdateUser();

  const handleSubmit = async (formData: any) => {
    await updateUser.mutateAsync({ id, data: formData });
    router.push(`/${locale}/admin/users/${id}`);
  };

  if (isLoading) {
    return <StateScreen state="loading" title="Loading user editor" compact />;
  }

  if (error || !data?.data) {
    return <StateScreen state={error ? "error" : "notFound"} title="User not found" compact />;
  }

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={PencilLine}
        eyebrow={<I18n>Edit Record</I18n>}
        title={
          <>
            <I18n>Edit</I18n> {data.data.name || data.data.email}
          </>
        }
        description={
          <I18n>Update access, status, and profile fields from one structured editor.</I18n>
        }
        actions={
          <Link href={`/${locale}/admin/users/${id}`}>
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
      <UserForm
        initialData={data.data}
        mode="edit"
        onSubmit={handleSubmit}
        isSubmitting={updateUser.isPending}
      />
    </div>
  );
}
