import { CartItem } from "@/types/CartItem";
import { Dish } from "@/types/Dish";
import { create } from "zustand";

type CartStoreType = {
  items: CartItem[];
  addItem: (dish: Dish) => void;
  decrementQuantity: (dish: Dish) => void;
  clearItem: () => void;
};

export const useCartStore = create<CartStoreType>((set, get) => ({
  items: [],

  addItem: (dish) => {
    const { items } = get();
    const existing = items.find((item) => item.item.id === dish.id);

    if (existing) {
      const canAddMore = existing.quantity + 1 <= dish.servings_left;
      if (!canAddMore) return;

      return set({
        items: items.map((item) =>
          item.item.id === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      });
    }

    return set({ items: [...items, { item: dish, quantity: 1 }] });
  },

  decrementQuantity: (dish) => {
    const { items } = get();
    const existing = items.find((item) => item.item.id === dish.id);

    if (!existing) return;

    const shouldRemove = existing.quantity - 1 === 0;

    if (shouldRemove) {
      return set({ items: items.filter((item) => item.item.id !== dish.id) });
    }

    return set({
      items: items.map((item) =>
        item.item.id === dish.id
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    });
  },
  clearItem: () => {
    set({ items: [] });
  },
}));
