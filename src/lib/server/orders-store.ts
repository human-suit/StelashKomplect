import type { CartCalculation } from "@/lib/calculator";
import type { CartItem } from "@/store/cart-store";
import {
  getPersistedOrderByNumber,
  listPersistedOrders,
  nextOrderSequence,
  persistOrder,
  updatePersistedOrder,
} from "@/lib/server/orders-persistence";

export type OrderStatus = "new" | "processing" | "done" | "cancelled";
export type PaymentStatus =
  | "none"
  | "pending"
  | "succeeded"
  | "canceled"
  | "failed";

export type PaymentMethod = "online_card" | "cash" | "invoice";

export interface OrderPayload {
  name: string;
  phone: string;
  email?: string;
  cityId: string;
  deliveryType: string;
  pickupLocationId?: string;
  address?: string;
  clientType: string;
  companyName?: string;
  comment?: string;
  items: CartItem[];
  calculation: CartCalculation;
  assemblyEnabled?: boolean;
  paymentMethod?: PaymentMethod;
}

export interface StoredOrder extends OrderPayload {
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  paymentId?: string;
  paidAmountRub?: number;
  chargeAmountRub?: number;
  managerNote?: string;
  updatedAt?: string;
}

/** Публичный ответ — без телефона, адреса и состава корзины */
export type PublicOrderSummary = Pick<
  StoredOrder,
  | "orderNumber"
  | "status"
  | "paymentStatus"
  | "paidAmountRub"
  | "chargeAmountRub"
  | "createdAt"
>;

export function toPublicOrderSummary(order: StoredOrder): PublicOrderSummary {
  return {
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paidAmountRub: order.paidAmountRub,
    chargeAmountRub: order.chargeAmountRub,
    createdAt: order.createdAt,
  };
}

export async function createOrder(payload: OrderPayload): Promise<StoredOrder> {
  const seq = await nextOrderSequence();
  const year = new Date().getFullYear();
  const order: StoredOrder = {
    ...payload,
    orderNumber: `SK-${year}-${String(seq).padStart(5, "0")}`,
    createdAt: new Date().toISOString(),
    status: "new",
    paymentStatus: "none",
  };
  await persistOrder(order);
  return order;
}

export async function getOrderByNumber(
  orderNumber: string,
): Promise<StoredOrder | undefined> {
  return getPersistedOrderByNumber(orderNumber);
}

export async function updateOrderPayment(
  orderNumber: string,
  patch: Partial<
    Pick<
      StoredOrder,
      | "paymentStatus"
      | "paymentId"
      | "paidAmountRub"
      | "chargeAmountRub"
      | "status"
    >
  >,
): Promise<StoredOrder | undefined> {
  return updatePersistedOrder(orderNumber, patch);
}

export async function updateOrderAdmin(
  orderNumber: string,
  patch: Pick<StoredOrder, "status" | "managerNote">,
): Promise<StoredOrder | undefined> {
  const safeNote =
    patch.managerNote?.trim().slice(0, 2000) || undefined;
  return updatePersistedOrder(orderNumber, {
    status: patch.status,
    managerNote: safeNote,
    updatedAt: new Date().toISOString(),
  });
}

export async function listOrders(limit = 100): Promise<StoredOrder[]> {
  return listPersistedOrders(limit);
}
