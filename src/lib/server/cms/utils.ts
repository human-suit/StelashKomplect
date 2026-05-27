import type { Prisma } from "@prisma/client";

export function toJson<T>(value: T): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export function parseLines(text: string): string[] {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string");
}

/** Строки вида «Ключ: значение» → объект характеристик */
export function parseSpecs(text: string): Record<string, string> {
  const specs: Record<string, string> = {};
  for (const line of parseLines(text)) {
    const idx = line.indexOf(":");
    if (idx <= 0) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (key) specs[key] = value;
  }
  return specs;
}

export function specsToText(specs: unknown): string {
  if (!specs || typeof specs !== "object" || Array.isArray(specs)) return "";
  return Object.entries(specs as Record<string, string>)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}
