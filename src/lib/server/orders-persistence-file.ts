import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { StoredOrder } from "@/lib/server/orders-store";

interface OrdersFile {
  seq: number;
  orders: StoredOrder[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

let cache: OrdersFile | null = null;

async function loadFile(): Promise<OrdersFile> {
  if (cache) return cache;

  try {
    const raw = await readFile(ORDERS_FILE, "utf-8");
    const parsed = JSON.parse(raw) as OrdersFile;
    cache = {
      seq: parsed.seq ?? 0,
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
    };
    return cache;
  } catch {
    cache = { seq: 0, orders: [] };
    return cache;
  }
}

async function saveFile(data: OrdersFile): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(ORDERS_FILE, JSON.stringify(data, null, 2), "utf-8");
  cache = data;
}

export async function persistOrderFile(order: StoredOrder): Promise<void> {
  const data = await loadFile();
  data.orders.unshift(order);
  if (data.orders.length > 5000) {
    data.orders = data.orders.slice(0, 5000);
  }
  await saveFile(data);
}

export async function nextOrderSequenceFile(): Promise<number> {
  const data = await loadFile();
  data.seq += 1;
  await saveFile(data);
  return data.seq;
}

export async function listPersistedOrdersFile(
  limit = 100,
): Promise<StoredOrder[]> {
  const data = await loadFile();
  return data.orders.slice(0, limit);
}

export async function getPersistedOrderByNumberFile(
  orderNumber: string,
): Promise<StoredOrder | undefined> {
  const data = await loadFile();
  return data.orders.find((o) => o.orderNumber === orderNumber);
}

export async function updatePersistedOrderFile(
  orderNumber: string,
  patch: Partial<StoredOrder>,
): Promise<StoredOrder | undefined> {
  const data = await loadFile();
  const idx = data.orders.findIndex((o) => o.orderNumber === orderNumber);
  if (idx < 0) return undefined;

  data.orders[idx] = { ...data.orders[idx], ...patch };
  await saveFile(data);
  return data.orders[idx];
}
