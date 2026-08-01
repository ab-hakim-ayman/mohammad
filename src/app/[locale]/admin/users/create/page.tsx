"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, UserCog } from "lucide-react";

import { useInviteUser } from "@/features/auth";
import { useCreateUser } from "@/features/user";
import { InviteUserForm, UserForm } from "@/features/user";
import { Button } from "@/components/ui/button";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";
import I18n from "@/shared/components/I18n";

export default function CreateUserPage() {
  const router = useRouter();
  const locale = useLocale();
  const createUser = useCreateUser();
  const inviteUser = useInviteUser();

  const handleCreate = async (data: any) => {
    await createUser.mutateAsync(data);
    router.push(`/${locale}/admin/users`);
  };

  const handleInvite = async (data: any) => {
    await inviteUser.mutateAsync(data);
    router.push(`/${locale}/admin/users`);
  };

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={UserCog}
        eyebrow={<I18n>Create Record</I18n>}
        title={<I18n>Create or Invite User</I18n>}
        description={
          <I18n>Create a full account or send an invitation for an active workspace role.</I18n>
        }
        actions={
          <Link href={`/${locale}/admin/users`}>
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
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="border-border bg-surface-elevated ui-card-hover space-y-6 rounded-none border p-6 shadow-sm sm:rounded-lg">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-primary text-xs font-bold tracking-[0.2em] uppercase">
                <I18n>Direct account</I18n>
              </p>
              <h2 className="text-foreground mt-2 text-xl font-bold">
                <I18n>Create user record</I18n>
              </h2>
            </div>
            <span className="bg-muted text-muted-foreground inline-flex items-center rounded-full px-3 py-1 text-xs font-medium">
              <I18n>Full setup</I18n>
            </span>
          </div>
          <UserForm mode="create" onSubmit={handleCreate} isSubmitting={createUser.isPending} />
        </section>
        <section className="border-border bg-surface-elevated ui-card-hover space-y-6 rounded-none border p-6 shadow-sm sm:rounded-lg">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-primary text-xs font-bold tracking-[0.2em] uppercase">
                <I18n>Invitation flow</I18n>
              </p>
              <h2 className="text-foreground mt-2 text-xl font-bold">
                <I18n>Send invitation</I18n>
              </h2>
            </div>
            <span className="bg-muted text-muted-foreground inline-flex items-center rounded-full px-3 py-1 text-xs font-medium">
              <I18n>Quick invite</I18n>
            </span>
          </div>
          <InviteUserForm onSubmit={handleInvite} isSubmitting={inviteUser.isPending} />
        </section>
      </div>
    </div>
  );
}
