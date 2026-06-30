import { createContext, useContext, useState, type ReactElement, type ReactNode } from 'react'
import type Game from '../models/game'

export type CartItem = Game & { qty: number };

interface CartContextType {
  items: CartItem[],
  addToCart: (game: Game) => void,
  removeFromCart: (id: number) => void,
  increaseQty: (id: number) => void,
  decreaseQty: (id: number) => void,
  clearCart: () => void,
  totalItems: number,
  totalPrice: number,
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }): ReactElement {
  const [items, setItems] = useState<CartItem[]>([])

  const addToCart = (game: Game) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === game.id)
      if (existing) {
        return prev.map(item =>
          item.id === game.id ? { ...item, qty: item.qty + 1 } : item
        )
      }
      return [...prev, { ...game, qty: 1 }]
    })
  }

  const removeFromCart = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const increaseQty = (id: number) => {
    setItems(prev =>
      prev.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item)
    )
  }

  const decreaseQty = (id: number) => {
    setItems(prev =>
      prev
        .map(item => item.id === id ? { ...item, qty: item.qty - 1 } : item)
        .filter(item => item.qty > 0)
    )
  }

  const clearCart = () => setItems([])

  const totalItems = items.reduce((sum, item) => sum + item.qty, 0)

  const totalPrice = items.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('$', ''))
    return sum + price * item.qty
  }, 0)

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      increaseQty,
      decreaseQty,
      clearCart,
      totalItems,
      totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider')
  }
  return context
}