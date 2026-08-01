"use client";

import { useMemo } from "react";
import { FormEngine } from "@/shared/components/forms/FormEngine";
import { FormEngineConfig } from "@/shared/components/forms/form-engine.types";
import { InviteUserSchema } from "../schemas/user.schema";
import { InviteUserPayload } from "../types/user.types";
import { USER_ROLES } from "@/shared/types";
import { enumLabel } from "@/shared/utils/enum-label";

interface InviteUserFormProps {
  onSubmit: (data: InviteUserPayload) => Promise<void> | void;
  isSubmitting?: boolean;
  [key: string]: any;
}

export function InviteUserForm({
  onSubmit,
  isSubmitting = false,
}: InviteUserFormProps) {
  const roleOptions = useMemo(() => {
    return USER_ROLES.map((role) => ({ label: enumLabel(role), value: role }));
  }, []);

  const config: FormEngineConfig<InviteUserPayload> = {
    sections: [
      {
        fields: [
          { name: "email", label: "Email", type: "text", required: true, gridSpan: 6 },
          { name: "role", label: "Role", type: "select", required: true, options: roleOptions, gridSpan: 6 },
          { name: "name", label: "Name", type: "text", gridSpan: 6 },
          { name: "phone", label: "Phone", type: "text", gridSpan: 6 },
        ],
      },
    ],
  };

  const defaultValues = {
    email: "",
    role: "EMPLOYEE" as const,
    name: null,
    phone: null,
  };

  return (
    <FormEngine
      schema={InviteUserSchema}
      config={config}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitText="Send invitation"
      cancelText={null}
      folderPrefix="a2icoders"
    />
  );
}
