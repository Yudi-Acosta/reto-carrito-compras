import { useState } from "react";
import { CartContext } from "./CartContext";
import { CartItem } from "./types"


export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([])
  
    const addToCart = (item: CartItem) => {
      setCart((prevCart) => {
        const existingItem = prevCart.find((cartItem) => cartItem.id === item.id)
        if (existingItem) {
          return prevCart.map((cartItem) =>
            cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
          )
        }
        return [...prevCart, { ...item, quantity: 1 }]
      })
    }
  
    const removeFromCart = (id: string) => {
      setCart((prevCart) => prevCart.filter((item) => item.id !== id))
    }
  
    const updateQuantity = (id: string, quantity: number) => {
      setCart((prevCart) =>
        prevCart.map((item) => (item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item)),
      )
    }
  
    const clearCart = () => {
      setCart([])
    }
  
    const getTotalItems = () => {
      return cart.reduce((total, item) => total + item.quantity, 0)
    }
  
    const getTotalPrice = () => {
      return cart.reduce((total, item) => total + item.price * item.quantity, 0)
    }
  
    return (
      <CartContext.Provider
        value={{
          cart,
          addToCart,
          removeFromCart,
          updateQuantity,
          clearCart,
          getTotalItems,
          getTotalPrice,
        }}
      >
        {children}
      </CartContext.Provider>
    )
  }