import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      cart: [],
      isCartOpen: false,
      setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
      
      setUser: (user, token) => {
        set({ user, token });
      },
      
      logout: () => {
        set({ user: null, token: null, cart: [] });
      },
      
      addToCart: (item) => set((state) => {
        const existing = state.cart.find(i => i.menuItemId === item._id);
        if (existing) {
          return {
            cart: state.cart.map(i => i.menuItemId === item._id ? { ...i, qty: i.qty + 1 } : i)
          };
        }
        return {
          cart: [...state.cart, { menuItemId: item._id, name: item.name, price: item.price, qty: 1 }]
        };
      }),

      removeFromCart: (itemId) => set((state) => ({
        cart: state.cart.filter(i => i.menuItemId !== itemId)
      })),

      updateCartQty: (itemId, delta) => set((state) => ({
        cart: state.cart.map(i => {
          if (i.menuItemId === itemId) {
            const newQty = i.qty + delta;
            return { ...i, qty: newQty > 0 ? newQty : 0 };
          }
          return i;
        }).filter(i => i.qty > 0)
      })),
      
      clearCart: () => set({ cart: [] })
    }),
    {
      name: 'darjeeling-momos-storage',
      partialize: (state) => ({ user: state.user, token: state.token, cart: state.cart }),
    }
  )
);
