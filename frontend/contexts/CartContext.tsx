"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

import { CartContextType, CartItem } from "../types/cartContext";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product_id: string) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product_id === product_id,
      );
      if (existingItem) {
        return prevItems.map((item) =>
          item.product_id === product_id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prevItems, { product_id, quantity: 1 }];
    });
  };

  const removeFromCart = (product_id: string) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product_id === product_id,
      );
      if (existingItem && existingItem.quantity > 1) {
        return prevItems.map((item) =>
          item.product_id === product_id
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        );
      }
      return prevItems.filter((item) => item.product_id !== product_id);
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
