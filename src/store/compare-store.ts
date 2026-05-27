"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_COMPARE_ITEMS = 4;

interface CompareState {
  slugs: string[];
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      slugs: [],
      has: (slug) => get().slugs.includes(slug),
      toggle: (slug) =>
        set((state) => {
          if (state.slugs.includes(slug)) {
            return { slugs: state.slugs.filter((s) => s !== slug) };
          }
          if (state.slugs.length >= MAX_COMPARE_ITEMS) {
            return { slugs: [...state.slugs.slice(1), slug] };
          }
          return { slugs: [...state.slugs, slug] };
        }),
      remove: (slug) =>
        set((state) => ({ slugs: state.slugs.filter((s) => s !== slug) })),
      clear: () => set({ slugs: [] }),
    }),
    { name: "sk-compare" },
  ),
);
