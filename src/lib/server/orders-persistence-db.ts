import type { Prisma } from "@prisma/client";
import type { StoredOrder } from "@/lib/server/orders-store";
import { prisma } from "@/lib/server/prisma";

function toJson<T>(value: T): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function rowToOrder(row: {
  orderNumber: string;
  name: string;
  phone: string;
  email: string | null;
  cityId: string;
  deliveryType: string;
  pickupLocationId: string | null;
  address: string | null;
  clientType: string;
  companyName: string | null;
  comment: string | null;
  items: unknown;
  calculation: unknown;
  assemblyEnabled: boolean | null;
  paymentMethod: string | null;
  status: string;
  paymentStatus: string;
  paymentId: string | null;
  paidAmountRub: number | null;
  chargeAmountRub: number | null;
  managerNote: string | null;
  createdAt: Date;
  updatedAt: Date;
}): StoredOrder {
  return {
    orderNumber: row.orderNumber,
    name: row.name,
    phone: row.phone,
    email: row.email ?? undefined,
    cityId: row.cityId,
    deliveryType: row.deliveryType,
    pickupLocationId: row.pickupLocationId ?? undefined,
    address: row.address ?? undefined,
    clientType: row.clientType,
    companyName: row.companyName ?? undefined,
    comment: row.comment ?? undefined,
    items: row.items as StoredOrder["items"],
    calculation: row.calculation as StoredOrder["calculation"],
    assemblyEnabled: row.assemblyEnabled ?? undefined,
    paymentMethod: (row.paymentMethod as StoredOrder["paymentMethod"]) ?? undefined,
    status: row.status as StoredOrder["status"],
    paymentStatus: row.paymentStatus as StoredOrder["paymentStatus"],
    paymentId: row.paymentId ?? undefined,
    paidAmountRub: row.paidAmountRub ?? undefined,
    chargeAmountRub: row.chargeAmountRub ?? undefined,
    managerNote: row.managerNote ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function persistOrderDb(order: StoredOrder): Promise<void> {
  await prisma.order.create({
    data: {
      orderNumber: order.orderNumber,
      name: order.name,
      phone: order.phone,
      email: order.email,
      cityId: order.cityId,
      deliveryType: order.deliveryType,
      pickupLocationId: order.pickupLocationId,
      address: order.address,
      clientType: order.clientType,
      companyName: order.companyName,
      comment: order.comment,
      items: toJson(order.items),
      calculation: toJson(order.calculation),
      assemblyEnabled: order.assemblyEnabled,
      paymentMethod: order.paymentMethod,
      status: order.status,
      paymentStatus: order.paymentStatus ?? "none",
      paymentId: order.paymentId,
      paidAmountRub: order.paidAmountRub,
      chargeAmountRub: order.chargeAmountRub,
      managerNote: order.managerNote,
      createdAt: new Date(order.createdAt),
      updatedAt: order.updatedAt
        ? new Date(order.updatedAt)
        : new Date(order.createdAt),
    },
  });
}

export async function nextOrderSequenceDb(): Promise<number> {
  const row = await prisma.$transaction(async (tx) => {
    const updated = await tx.orderSequence.upsert({
      where: { id: "default" },
      create: { id: "default", value: 1 },
      update: { value: { increment: 1 } },
    });
    return updated;
  });
  return row.value;
}

export async function listPersistedOrdersDb(
  limit = 100,
): Promise<StoredOrder[]> {
  const rows = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(rowToOrder);
}

export async function getPersistedOrderByNumberDb(
  orderNumber: string,
): Promise<StoredOrder | undefined> {
  const row = await prisma.order.findUnique({
    where: { orderNumber },
  });
  return row ? rowToOrder(row) : undefined;
}

export async function updatePersistedOrderDb(
  orderNumber: string,
  patch: Partial<StoredOrder>,
): Promise<StoredOrder | undefined> {
  const existing = await prisma.order.findUnique({ where: { orderNumber } });
  if (!existing) return undefined;

  const data: Record<string, unknown> = {
    updatedAt: patch.updatedAt ? new Date(patch.updatedAt) : new Date(),
  };
  if (patch.status !== undefined) data.status = patch.status;
  if (patch.paymentStatus !== undefined) data.paymentStatus = patch.paymentStatus;
  if (patch.paymentId !== undefined) data.paymentId = patch.paymentId;
  if (patch.paidAmountRub !== undefined) data.paidAmountRub = patch.paidAmountRub;
  if (patch.chargeAmountRub !== undefined) {
    data.chargeAmountRub = patch.chargeAmountRub;
  }
  if (patch.managerNote !== undefined) data.managerNote = patch.managerNote;

  const row = await prisma.order.update({
    where: { orderNumber },
    data,
  });
  return rowToOrder(row);
}
