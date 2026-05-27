/**
 * Импорт data/orders.json в PostgreSQL (после prisma migrate deploy).
 *
 *   set DATABASE_URL=postgresql://...
 *   node scripts/import-orders-json.mjs
 */

import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const ordersFile = path.join(root, "data", "orders.json");

const dbUrl = process.env.DATABASE_URL?.trim();
if (!dbUrl) {
  console.error("Задайте DATABASE_URL");
  process.exit(1);
}

let file;
try {
  const raw = await readFile(ordersFile, "utf-8");
  file = JSON.parse(raw);
} catch (e) {
  console.error("Не найден или не читается data/orders.json:", e.message);
  process.exit(1);
}

const orders = Array.isArray(file.orders) ? file.orders : [];
const seq = Number(file.seq) || 0;

const prisma = new PrismaClient();

let imported = 0;
let skipped = 0;

for (const o of orders) {
  if (!o?.orderNumber) {
    skipped++;
    continue;
  }
  const exists = await prisma.order.findUnique({
    where: { orderNumber: o.orderNumber },
  });
  if (exists) {
    skipped++;
    continue;
  }
  await prisma.order.create({
    data: {
      orderNumber: o.orderNumber,
      name: o.name ?? "",
      phone: o.phone ?? "",
      email: o.email ?? null,
      cityId: o.cityId ?? "ufa",
      deliveryType: o.deliveryType ?? "pickup",
      pickupLocationId: o.pickupLocationId ?? null,
      address: o.address ?? null,
      clientType: o.clientType ?? "individual",
      companyName: o.companyName ?? null,
      comment: o.comment ?? null,
      items: o.items ?? [],
      calculation: o.calculation ?? { subtotal: 0, delivery: 0, assembly: 0, discount: 0, total: 0 },
      assemblyEnabled: o.assemblyEnabled ?? null,
      paymentMethod: o.paymentMethod ?? null,
      status: o.status ?? "new",
      paymentStatus: o.paymentStatus ?? "none",
      paymentId: o.paymentId ?? null,
      paidAmountRub: o.paidAmountRub ?? null,
      chargeAmountRub: o.chargeAmountRub ?? null,
      managerNote: o.managerNote ?? null,
      createdAt: o.createdAt ? new Date(o.createdAt) : new Date(),
      updatedAt: o.updatedAt ? new Date(o.updatedAt) : new Date(o.createdAt ?? Date.now()),
    },
  });
  imported++;
}

const curSeq = await prisma.orderSequence.findUnique({
  where: { id: "default" },
});
const nextSeq = Math.max(seq, curSeq?.value ?? 0);
await prisma.orderSequence.upsert({
  where: { id: "default" },
  create: { id: "default", value: nextSeq },
  update: { value: nextSeq },
});

await prisma.$disconnect();

console.log(`Готово: импортировано ${imported}, пропущено ${skipped}, seq=${seq}`);
