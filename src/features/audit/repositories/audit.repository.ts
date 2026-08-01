import prisma from "@/core/server/prisma";
import { Prisma, $Enums } from "@prisma/client";
import type { AuditLogFilters, CreateAuditLogInput } from "../types/audit.types";
const auditUserSelect = {
  id: true,
  name: true,
  email: true,
  avatar: true,
} as const satisfies Prisma.UserSelect;
const auditSelect = {
  id: true,
  actorId: true,
  actor: { select: auditUserSelect },
  action: true,
  entityType: true,
  entityId: true,
  oldValues: true,
  newValues: true,
  ipAddress: true,
  userAgent: true,
  createdAt: true,
} as const satisfies Prisma.AuditLogSelect;
function buildWhere(filters: AuditLogFilters): Prisma.AuditLogWhereInput {
  const { search, actorId, action, entityType, entityId, from, to } = filters;
  return {
    ...(actorId && { actorId }),
    ...(action && { action }),
    ...(entityType && { entityType: { contains: entityType, mode: "insensitive" } }),
    ...(entityId && { entityId }),
    ...(from || to
      ? {
          createdAt: {
            ...(from ? { gte: new Date(from) } : {}),
            ...(to ? { lte: new Date(to) } : {}),
          },
        }
      : {}),
    ...(search && {
      OR: [
        { entityType: { contains: search, mode: "insensitive" } },
        { entityId: { contains: search, mode: "insensitive" } },
        { ipAddress: { contains: search, mode: "insensitive" } },
        { userAgent: { contains: search, mode: "insensitive" } },
        {
          actor: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          },
        },
      ],
    }),
  };
}
function buildOrderBy(sort: AuditLogFilters["sort"]): Prisma.AuditLogOrderByWithRelationInput {
  return sort === "createdAt_asc" ? { createdAt: "asc" } : { createdAt: "desc" };
}
export const auditRepository = {
  async findAll(filters: AuditLogFilters) {
    const { page, limit } = filters;
    const where = buildWhere(filters);
    const [data, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: buildOrderBy(filters.sort),
        select: auditSelect,
      }),
      prisma.auditLog.count({ where }),
    ]);
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },
  async findById(id: string) {
    return prisma.auditLog.findUnique({ where: { id }, select: auditSelect });
  },
  async create(data: CreateAuditLogInput) {
    return prisma.auditLog.create({
      data: {
        actorId: data.actorId || null,
        action: data.action as $Enums.AuditAction,
        entityType: data.entityType,
        entityId: data.entityId || null,
        oldValues:
          data.oldValues == null ? Prisma.DbNull : (data.oldValues as Prisma.InputJsonValue),
        newValues:
          data.newValues == null ? Prisma.DbNull : (data.newValues as Prisma.InputJsonValue),
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
      },
      select: auditSelect,
    });
  },
  async delete(id: string) {
    return prisma.auditLog.delete({ where: { id }, select: auditSelect });
  },
};
