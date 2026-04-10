import { create } from 'zustand'
import { supabase } from '../lib/supabase'

// ── Supabase sync helpers ────────────────────────────────────────────────────

async function dbSaveCart(userId, cart) {
  if (!userId) return
  // Delete all then insert current state (simple & reliable)
  await supabase.from('user_cart').delete().eq('user_id', userId)
  if (cart.length === 0) return
  await supabase.from('user_cart').insert(
    cart.map((item) => ({
      user_id: userId,
      product_id: item.id,
      quantity: item.quantity,
      product_data: item,
    }))
  )
}

async function dbSaveFavorites(userId, favorites) {
  if (!userId) return
  await supabase.from('user_favorites').delete().eq('user_id', userId)
  if (favorites.length === 0) return
  await supabase.from('user_favorites').insert(
    favorites.map((item) => ({
      user_id: userId,
      product_id: item.id,
      product_data: item,
    }))
  )
}

async function dbLoadUserData(userId) {
  const [{ data: cartRows }, { data: favRows }] = await Promise.all([
    supabase.from('user_cart').select('product_data, quantity').eq('user_id', userId),
    supabase.from('user_favorites').select('product_data').eq('user_id', userId),
  ])
  const cart = (cartRows ?? []).map((r) => ({ ...r.product_data, quantity: r.quantity }))
  const favorites = (favRows ?? []).map((r) => r.product_data)
  return { cart, favorites }
}

// ── Store ────────────────────────────────────────────────────────────────────

export const useStore = create((set, get) => ({
  // ─── Cart ──────────────────────────────────────────────────────────────
  cart: [],
  isCartOpen: false,

  addToCart: (product) => {
    const { cart, user } = get()
    const existing = cart.find((item) => item.id === product.id)
    const newCart = existing
      ? cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      : [...cart, { ...product, quantity: 1 }]
    set({ cart: newCart })
    dbSaveCart(user?.id, newCart)
  },

  removeFromCart: (productId) => {
    const { user } = get()
    const newCart = get().cart.filter((item) => item.id !== productId)
    set({ cart: newCart })
    dbSaveCart(user?.id, newCart)
  },

  updateQuantity: (productId, quantity) => {
    if (quantity < 1) { get().removeFromCart(productId); return }
    const { user } = get()
    const newCart = get().cart.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    )
    set({ cart: newCart })
    dbSaveCart(user?.id, newCart)
  },

  clearCart: () => {
    const { user } = get()
    set({ cart: [] })
    dbSaveCart(user?.id, [])
  },

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set({ isCartOpen: !get().isCartOpen }),

  getCartTotal: () =>
    get().cart.reduce((total, item) => total + item.price * item.quantity, 0),

  getCartCount: () =>
    get().cart.reduce((count, item) => count + item.quantity, 0),

  // ─── Favorites ─────────────────────────────────────────────────────────
  favorites: [],

  toggleFavorite: (product) => {
    const { favorites, user } = get()
    const isFav = favorites.find((p) => p.id === product.id)
    const newFavs = isFav
      ? favorites.filter((p) => p.id !== product.id)
      : [...favorites, product]
    set({ favorites: newFavs })
    dbSaveFavorites(user?.id, newFavs)
  },

  isFavorite: (productId) => !!get().favorites.find((p) => p.id === productId),

  getFavoritesCount: () => get().favorites.length,

  // ─── Auth Modal ────────────────────────────────────────────────────────
  isAuthModalOpen: false,
  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  // ─── User ──────────────────────────────────────────────────────────────
  user: null,

  setUser: async (user) => {
    set({ user })
    // Load persisted cart & favorites from Supabase
    const { cart, favorites } = await dbLoadUserData(user.id)
    set({ cart, favorites })
  },

  clearUser: () => set({ user: null, cart: [], favorites: [] }),

  // ─── Search ────────────────────────────────────────────────────────────
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
  clearSearch: () => set({ searchQuery: '' }),

  // ─── Active Category ───────────────────────────────────────────────────
  activeCategory: null,
  setActiveCategory: (cat) => set({ activeCategory: cat }),

  // ─── Scroll trigger ────────────────────────────────────────────────────
  scrollToProductsTrigger: 0,
  triggerScrollToProducts: () => set(s => ({ scrollToProductsTrigger: s.scrollToProductsTrigger + 1 })),
}))
