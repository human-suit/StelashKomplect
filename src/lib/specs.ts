export function specsToText(specs: unknown): string {
  if (!specs || typeof specs !== "object" || Array.isArray(specs)) return "";
  return Object.entries(specs as Record<string, string>)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}
