import { create } from 'zustand'

export const useStore = create((set, get) => ({
  // ─── Cart ───────────────────────────────────────────────────────────────
  cart: [],
  isCartOpen: false,

  addToCart: (product) => {
    const { cart } = get()
    const existing = cart.find((item) => item.id === product.id)
    if (existing) {
      set({
        cart: cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      })
    } else {
      set({ cart: [...cart, { ...product, quantity: 1 }] })
    }
  },

  removeFromCart: (productId) => {
    set({ cart: get().cart.filter((item) => item.id !== productId) })
  },

  updateQuantity: (productId, quantity) => {
    if (quantity < 1) {
      get().removeFromCart(productId)
      return
    }
    set({
      cart: get().cart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      ),
    })
  },

  clearCart: () => set({ cart: [] }),

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set({ isCartOpen: !get().isCartOpen }),

  getCartTotal: () => {
    return get().cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
  },

  getCartCount: () => {
    return get().cart.reduce((count, item) => count + item.quantity, 0)
  },

  // ─── Favorites ──────────────────────────────────────────────────────────
  favorites: [],

  toggleFavorite: (product) => {
    const { favorites } = get()
    const isFav = favorites.find((p) => p.id === product.id)
    if (isFav) {
      set({ favorites: favorites.filter((p) => p.id !== product.id) })
    } else {
      set({ favorites: [...favorites, product] })
    }
  },

  isFavorite: (productId) => {
    return !!get().favorites.find((p) => p.id === productId)
  },

  getFavoritesCount: () => get().favorites.length,

  // ─── Auth Modal ─────────────────────────────────────────────────────────
  isAuthModalOpen: false,
  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  // ─── User ───────────────────────────────────────────────────────────────
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}))
