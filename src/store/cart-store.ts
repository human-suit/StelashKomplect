"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/products";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  deliveryEnabled: boolean;
  assemblyEnabled: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  setDeliveryEnabled: (v: boolean) => void;
  setAssemblyEnabled: (v: boolean) => void;
  clear: () => void;
  itemCount: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      deliveryEnabled: false,
      assemblyEnabled: false,

      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existing = items.find((i) => i.productId === product.id);
        if (existing) {
          set({
            items: items.map((i) =>
              i.productId === product.id
                ? { ...i, quantity: i.quantity + quantity }
                : i,
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                productId: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                quantity,
              },
            ],
          });
        }
      },

      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),

      setQuantity: (productId, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i,
          ),
        });
      },

      setDeliveryEnabled: (deliveryEnabled) => set({ deliveryEnabled }),
      setAssemblyEnabled: (assemblyEnabled) => set({ assemblyEnabled }),
      clear: () => set({ items: [], deliveryEnabled: false, assemblyEnabled: false }),

      itemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "sk-cart" },
  ),
);
