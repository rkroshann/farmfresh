import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      // Auth state
      user: null,
      token: null,
      isAuthenticated: false,

      // Set user and token
      setAuth: (user, token) => set({ 
        user, 
        token, 
        isAuthenticated: true 
      }),

      // Update user profile
      updateUser: (updates) => set((state) => ({
        user: { ...state.user, ...updates }
      })),

      // Logout
      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false 
      }),

      // Products
      products: [],
      setProducts: (products) => set({ products }),
      
      // Selected product
      selectedProduct: null,
      setSelectedProduct: (product) => set({ selectedProduct: product }),

      // Chats
      chats: [],
      setChats: (chats) => set({ chats }),
      addChat: (chat) => set((state) => ({ 
        chats: [chat, ...state.chats] 
      })),
      updateChat: (chatId, updates) => set((state) => ({
        chats: state.chats.map(chat => 
          chat._id === chatId ? { ...chat, ...updates } : chat
        )
      })),

      // Orders
      orders: [],
      setOrders: (orders) => set({ orders }),
      addOrder: (order) => set((state) => ({ 
        orders: [order, ...state.orders] 
      })),
      updateOrder: (orderId, updates) => set((state) => ({
        orders: state.orders.map(order => 
          order._id === orderId ? { ...order, ...updates } : order
        )
      })),

      // Cart/Checkout
      checkoutData: null,
      setCheckoutData: (data) => set({ checkoutData: data }),
      clearCheckoutData: () => set({ checkoutData: null }),

      // Filters
      filters: {
        category: '',
        minPrice: '',
        maxPrice: '',
        search: '',
        organic: false
      },
      setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters }
      })),
      resetFilters: () => set({
        filters: {
          category: '',
          minPrice: '',
          maxPrice: '',
          search: '',
          organic: false
        }
      })
    }),
    {
      name: 'farmfresh-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useStore;
