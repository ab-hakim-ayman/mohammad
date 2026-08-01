import { NextRequest } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { enforceRequestRateLimit } from "@/core/server/rate-limiter";
import { CreateContactSchema } from "@/features/contact";
import { contactService } from "@/features/contact/server";
import { ApiResponse } from "@/core/server/http/response";
import type { CreateContactSchemaType } from "@/features/contact";

export async function POST(request: NextRequest) {
  return ApiServer.public(request, async () => {
    await enforceRequestRateLimit(
      request,
      "public:contact",
      10 * 60 * 1000,
      5,
      "Too many messages sent from this network. Please try again later."
    );

    const body = await validateBody<CreateContactSchemaType>(request, CreateContactSchema);
    const contact = await contactService.create(body);
    return ApiResponse.created(contact, "Message sent successfully");
  });
}
