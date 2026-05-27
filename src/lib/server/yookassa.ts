import { getSiteUrl } from "@/lib/payments/config";
import { randomUUID } from "crypto";

const API = "https://api.yookassa.ru/v3";

export interface YooKassaPayment {
  id: string;
  status: string;
  amount: { value: string; currency: string };
  confirmation?: { type: string; confirmation_url?: string };
  metadata?: Record<string, string>;
}

function authHeader(): string {
  const shopId = process.env.YOOKASSA_SHOP_ID!.trim();
  const secret = process.env.YOOKASSA_SECRET_KEY!.trim();
  const encoded = Buffer.from(`${shopId}:${secret}`).toString("base64");
  return `Basic ${encoded}`;
}

export async function createYooKassaPayment(params: {
  amountRub: number;
  description: string;
  orderNumber: string;
  customerEmail?: string;
}): Promise<{ ok: true; payment: YooKassaPayment } | { ok: false; error: string }> {
  const value = params.amountRub.toFixed(2);
  const returnUrl = `${getSiteUrl()}/checkout/payment?order=${encodeURIComponent(params.orderNumber)}`;

  const body = {
    amount: { value, currency: "RUB" },
    capture: true,
    confirmation: { type: "redirect", return_url: returnUrl },
    description: params.description.slice(0, 128),
    metadata: {
      orderNumber: params.orderNumber,
    },
    ...(params.customerEmail
      ? { receipt: { customer: { email: params.customerEmail } } }
      : {}),
  };

  try {
    const res = await fetch(`${API}/payments`, {
      method: "POST",
      headers: {
        Authorization: authHeader(),
        "Content-Type": "application/json",
        "Idempotence-Key": randomUUID(),
      },
      body: JSON.stringify(body),
    });

    const data = (await res.json()) as YooKassaPayment & {
      description?: string;
      type?: string;
    };

    if (!res.ok) {
      return {
        ok: false,
        error: data.description ?? `YooKassa HTTP ${res.status}`,
      };
    }

    return { ok: true, payment: data };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "YooKassa network error",
    };
  }
}

export async function getYooKassaPayment(
  paymentId: string,
): Promise<YooKassaPayment | null> {
  try {
    const res = await fetch(`${API}/payments/${paymentId}`, {
      headers: { Authorization: authHeader() },
    });
    if (!res.ok) return null;
    return (await res.json()) as YooKassaPayment;
  } catch {
    return null;
  }
}
