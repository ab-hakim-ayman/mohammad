import I18n from "@/shared/components/I18n";

import { NextRequest } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { UpdateContactSchema } from "@/features/contact";
import { contactService } from "@/features/contact/server";
import { ApiResponse } from "@/core/server/http/response";
import type { UpdateContactSchemaType } from "@/features/contact";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const contact = await contactService.getById(id);
    return ApiResponse.success(contact, "Contact retrieved");
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const body = await validateBody<UpdateContactSchemaType>(request, UpdateContactSchema);
    const contact = await contactService.update(id, body);
    return ApiResponse.success(contact, "Contact updated");
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    await contactService.delete(id);
    return ApiResponse.noContent("Contact deleted");
  });
}
