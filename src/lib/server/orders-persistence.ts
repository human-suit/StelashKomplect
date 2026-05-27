import type { StoredOrder } from "@/lib/server/orders-store";
import { isDatabaseConfigured } from "@/lib/server/prisma";
import {
  getPersistedOrderByNumberDb,
  listPersistedOrdersDb,
  nextOrderSequenceDb,
  persistOrderDb,
  updatePersistedOrderDb,
} from "@/lib/server/orders-persistence-db";
import {
  getPersistedOrderByNumberFile,
  listPersistedOrdersFile,
  nextOrderSequenceFile,
  persistOrderFile,
  updatePersistedOrderFile,
} from "@/lib/server/orders-persistence-file";

function wantsDb(): boolean {
  return isDatabaseConfigured();
}

export function getOrdersStorageMode(): "postgres" | "file" {
  return wantsDb() ? "postgres" : "file";
}

async function withDbFallback<T>(
  dbFn: () => Promise<T>,
  fileFn: () => Promise<T>,
): Promise<T> {
  if (!wantsDb()) return fileFn();
  try {
    return await dbFn();
  } catch (error) {
    console.error("[orders] DB error, using file:", error);
    return fileFn();
  }
}

export async function persistOrder(order: StoredOrder): Promise<void> {
  return withDbFallback(
    () => persistOrderDb(order),
    () => persistOrderFile(order),
  );
}

export async function nextOrderSequence(): Promise<number> {
  return withDbFallback(
    () => nextOrderSequenceDb(),
    () => nextOrderSequenceFile(),
  );
}

export async function listPersistedOrders(limit = 100): Promise<StoredOrder[]> {
  return withDbFallback(
    () => listPersistedOrdersDb(limit),
    () => listPersistedOrdersFile(limit),
  );
}

export async function getPersistedOrderByNumber(
  orderNumber: string,
): Promise<StoredOrder | undefined> {
  return withDbFallback(
    () => getPersistedOrderByNumberDb(orderNumber),
    () => getPersistedOrderByNumberFile(orderNumber),
  );
}

export async function updatePersistedOrder(
  orderNumber: string,
  patch: Partial<StoredOrder>,
): Promise<StoredOrder | undefined> {
  return withDbFallback(
    () => updatePersistedOrderDb(orderNumber, patch),
    () => updatePersistedOrderFile(orderNumber, patch),
  );
}
