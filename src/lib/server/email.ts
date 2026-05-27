export interface SendEmailResult {
  ok: boolean;
  error?: string;
  skipped?: boolean;
}

function smtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim(),
  );
}

/** Отправка через SMTP (Timeweb, Yandex, и т.д.) */
export async function sendOrderEmail(
  subject: string,
  text: string,
): Promise<SendEmailResult> {
  const to = process.env.ORDER_EMAIL?.trim() ?? "stellazh.komplekt@inbox.ru";

  if (!smtpConfigured()) {
    console.log(`[order] Email (SMTP не настроен) to ${to}: ${subject}\n`, text);
    return { ok: true, skipped: true };
  }

  const host = process.env.SMTP_HOST!.trim();
  const port = Number(process.env.SMTP_PORT ?? "465");
  const user = process.env.SMTP_USER!.trim();
  const pass = process.env.SMTP_PASS!.trim();
  const from =
    process.env.SMTP_FROM?.trim() ?? `"Стеллаж Комплект" <${user}>`;

  try {
    const nodemailer = await import("nodemailer");
    const transport = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transport.sendMail({
      from,
      to,
      subject,
      text,
    });

    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "smtp error";
    console.error("[order] SMTP failed:", msg);
    return { ok: false, error: msg };
  }
}
