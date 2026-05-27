export interface WebhookSendResult {
  ok: boolean;
  sent: number;
  errors: string[];
}

function parseWebhookList(raw?: string): string[] {
  return (raw ?? "")
    .split(/[,;\s]+/)
    .map((v) => v.trim())
    .filter(Boolean);
}

async function postWebhook(
  url: string,
  payload: Record<string, unknown>,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      return { ok: false, error: `HTTP ${res.status}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "network error" };
  }
}

export function isMaxConfigured(): boolean {
  return parseWebhookList(process.env.MAX_WEBHOOK_URLS).length > 0;
}

export function isWhatsAppConfigured(): boolean {
  return parseWebhookList(process.env.WHATSAPP_WEBHOOK_URLS).length > 0;
}

export async function sendMaxWebhook(text: string): Promise<WebhookSendResult> {
  const urls = parseWebhookList(process.env.MAX_WEBHOOK_URLS);
  if (urls.length === 0) return { ok: false, sent: 0, errors: ["MAX_WEBHOOK_URLS не задан"] };

  let sent = 0;
  const errors: string[] = [];
  for (const url of urls) {
    const r = await postWebhook(url, {
      text,
      source: "stellazh-komplekt",
      channel: "max",
      at: new Date().toISOString(),
    });
    if (r.ok) sent += 1;
    else errors.push(`${url}: ${r.error ?? "unknown"}`);
  }
  return { ok: sent > 0, sent, errors };
}

export async function sendWhatsAppWebhook(
  text: string,
): Promise<WebhookSendResult> {
  const urls = parseWebhookList(process.env.WHATSAPP_WEBHOOK_URLS);
  if (urls.length === 0) {
    return { ok: false, sent: 0, errors: ["WHATSAPP_WEBHOOK_URLS не задан"] };
  }

  let sent = 0;
  const errors: string[] = [];
  for (const url of urls) {
    const r = await postWebhook(url, {
      text,
      source: "stellazh-komplekt",
      channel: "whatsapp",
      at: new Date().toISOString(),
    });
    if (r.ok) sent += 1;
    else errors.push(`${url}: ${r.error ?? "unknown"}`);
  }
  return { ok: sent > 0, sent, errors };
}
