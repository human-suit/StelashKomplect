import { isDatabaseConfigured } from "@/lib/server/prisma";

/** Запрос к БД с fallback, если Prisma не сгенерирован или PostgreSQL недоступен */
export async function dbQuery<T>(
  fn: () => Promise<T>,
  fallback: T,
): Promise<T> {
  if (!isDatabaseConfigured()) return fallback;

  try {
    return await fn();
  } catch (error) {
    console.error("[db] fallback:", error);
    return fallback;
  }
}
