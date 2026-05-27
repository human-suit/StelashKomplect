/** Нормализация телефона для РФ */
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 10) return null;

  let normalized = digits;
  if (normalized.length === 10) normalized = `7${normalized}`;
  if (normalized.length === 11 && normalized.startsWith("8")) {
    normalized = `7${normalized.slice(1)}`;
  }
  if (normalized.length !== 11 || !normalized.startsWith("7")) return null;

  return `+${normalized}`;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
