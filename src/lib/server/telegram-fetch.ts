const TIMEOUT_MS = 25_000;

export function getTelegramNetworkHint(): string | null {
  const proxy =
    process.env.HTTPS_PROXY?.trim() ||
    process.env.HTTP_PROXY?.trim() ||
    process.env.TELEGRAM_PROXY?.trim();
  if (proxy) return null;
  return "Telegram недоступен с этого ПК. Включите VPN или добавьте HTTPS_PROXY=http://127.0.0.1:ПОРТ в .env.local";
}

export async function telegramFetch(
  url: string,
  init?: RequestInit,
): Promise<Response> {
  try {
    return await fetch(url, {
      ...init,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "network error";
    if (
      msg.includes("fetch failed") ||
      msg.includes("Timeout") ||
      msg.includes("abort")
    ) {
      throw new Error(
        `Нет связи с api.telegram.org (${msg}). ${getTelegramNetworkHint() ?? ""}`,
      );
    }
    throw e;
  }
}
