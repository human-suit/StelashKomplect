import {
  getChargeAmountRub,
  isPaymentTestMode,
  isYooKassaConfigured,
} from "@/lib/payments/config";
import { NextResponse } from "next/server";

/** Публичные настройки оплаты для фронта */
export async function GET() {
  return NextResponse.json({
    enabled: isYooKassaConfigured(),
    testMode: isPaymentTestMode(),
    testAmountRub: getChargeAmountRub(0),
  });
}
