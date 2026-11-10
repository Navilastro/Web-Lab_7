import { create } from 'zustand';

const STORAGE_KEY = 'shop_cart_items';

function getInitialItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const useCartStore = create((set) => ({
  items: getInitialItems(),

  addItem: (product) =>
    set((state) => {
      const existing = state.items.find((item) => item.id === product.id);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            id: product.id,
            title: product.title,
            price: product.price,
            quantity: 1,
          },
        ],
      };
    }),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  setQuantity: (id, quantity) =>
    set((state) => {
      if (quantity < 1) {
        return {
          items: state.items.filter((item) => item.id !== id),
        };
      }
      return {
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ),
      };
    }),

  clear: () => set({ items: [] }),
}));

useCartStore.subscribe((state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  } catch {
    // Ignore storage write errors
  }
});