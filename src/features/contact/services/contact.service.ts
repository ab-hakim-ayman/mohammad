import I18n from "@/shared/components/I18n";
import { Prisma } from "@prisma/client";
import { contactRepository } from "../repositories/contact.repository";
import { AppError } from "@/core/server/http/errors";
import {
  CreateContactPayload,
  UpdateContactPayload,
  ContactQueryValidated,
} from "../types/contact.types";

export const contactService = {
  async getAll(params: ContactQueryValidated) {
    return contactRepository.findAll(params);
  },

  async getById(id: string) {
    const contact = await contactRepository.findById(id);
    if (!contact) throw AppError.notFound("Contact message not found");
    return contact;
  },

  async create(data: CreateContactPayload) {
    const createData: Prisma.ContactCreateInput = {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      phone: data.phone,
      status: "NEW",
    };

    if (data.serviceId) {
      createData.service = { connect: { id: data.serviceId } };
    }

    return contactRepository.create(createData);
  },

  async update(id: string, data: UpdateContactPayload) {
    const existing = await contactRepository.findById(id);
    if (!existing) throw AppError.notFound("Contact message not found");

    const updateData: Prisma.ContactUpdateInput = { status: data.status };
    if (data.status === "REPLIED") updateData.repliedAt = new Date();
    if (data.status === "ARCHIVED") updateData.archivedAt = new Date();
    return contactRepository.update(id, updateData);
  },

  async delete(id: string) {
    const existing = await contactRepository.findById(id);
    if (!existing) throw AppError.notFound("Contact message not found");
    return contactRepository.hardDelete(id);
  },
};
