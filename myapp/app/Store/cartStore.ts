import { create } from "zustand"
import { persist } from "zustand/middleware"

type CartItem = { itemId: number; quantity: number }

type CartState = {
    items: CartItem[]
    addItem: (itemId: number, qty?: number) => void
    removeItem: (itemId: number) => void
    setQuantity: (itemId: number, qty: number) => void
    clear: () => void
    totalItems: () => number
    getItems: () => CartItem[] 
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            // given an ItemId and quantity, check if the item exists in the basket,
            // if it does, add the new quantity to the existing quantity else add the new quantity to the 
            // basket
            addItem: (itemId, qty = 1) =>
                set((state) => {
                const existing = state.items.find((i) => i.itemId === itemId)

                if (existing) {
                    return {
                    items: state.items.map((i) =>
                        i.itemId === itemId ? { ...i, quantity: i.quantity + qty } : i
                    ),
                    }
                }
                return { items: [...state.items, { itemId, quantity: qty }] }
            }),

            removeItem: (itemId) =>
                set((state) => ({ items: state.items.filter((i) => i.itemId !== itemId) })),

            setQuantity: (itemId, qty) =>
                set((state) => {
                    let items: CartItem[]
                
                    if (qty <= 0) {
                        // remove the item if quantity is zero or less
                        items = state.items.filter((i) => i.itemId !== itemId)
                    } else {
                        //  otherwise update the quantity of the item
                        items = state.items.map((i) => {
                            if (i.itemId === itemId) {
                                return { ...i, quantity: qty }
                            }

                            return i
                        })
                    }
                    return { items }
                }),

            clear: () => set({ items: [] }),

            totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

            getItems: () => get().items,
        }),
        { name: "cart-v1" } // localStorage key
    )
  )