export function deliveryTypeLabel(deliveryType: string): string {
  switch (deliveryType) {
    case "consultation":
      return "Консультация";
    case "pickup":
      return "Самовывоз";
    case "delivery":
      return "Доставка";
    default:
      return deliveryType;
  }
}

export function deliveryTypeSummary(order: {
  deliveryType: string;
  pickupLocationId?: string;
  address?: string;
}): string {
  switch (order.deliveryType) {
    case "consultation":
      return "Консультация";
    case "pickup":
      return `Самовывоз: ${order.pickupLocationId ?? "—"}`;
    case "delivery":
      return `Доставка: ${order.address ?? "—"}`;
    default:
      return order.deliveryType;
  }
}
