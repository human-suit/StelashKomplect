/** Тарифы калькулятора — позже из админки */
export const calculatorDefaults = {
  deliveryUfa: 500,
  deliveryRegion: 1500,
  assemblyPercent: 0.1,
  assemblyMin: 500,
  bulkDiscountFrom: 5,
  bulkDiscountPercent: 0.05,
} as const;

export interface CartCalculationInput {
  subtotal: number;
  itemCount: number;
  deliveryEnabled: boolean;
  assemblyEnabled: boolean;
  isUfa: boolean;
}

export interface CartCalculation {
  subtotal: number;
  delivery: number;
  assembly: number;
  discount: number;
  total: number;
}

export function calculateCart(input: CartCalculationInput): CartCalculation {
  const { subtotal, itemCount, deliveryEnabled, assemblyEnabled, isUfa } =
    input;
  const { deliveryUfa, deliveryRegion, assemblyPercent, assemblyMin, bulkDiscountFrom, bulkDiscountPercent } =
    calculatorDefaults;

  let delivery = 0;
  if (deliveryEnabled) {
    delivery = isUfa ? deliveryUfa : deliveryRegion;
  }

  let assembly = 0;
  if (assemblyEnabled && subtotal > 0) {
    assembly = Math.max(subtotal * assemblyPercent, assemblyMin);
  }

  let discount = 0;
  if (itemCount >= bulkDiscountFrom) {
    discount = Math.round(subtotal * bulkDiscountPercent);
  }

  const total = Math.max(0, subtotal + delivery + assembly - discount);

  return {
    subtotal,
    delivery,
    assembly,
    discount,
    total,
  };
}
