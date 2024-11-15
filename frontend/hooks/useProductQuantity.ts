import { useEffect, useState } from "react";

import { useCart } from "../contexts/CartContext";

export const useProductQuantity = (
  product_id: string,
  initialQuantity: number = 0,
) => {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const [productQuantity, setProductQuantity] = useState(initialQuantity);

  useEffect(() => {
    const cartItem = cartItems.find((item) => item.product_id === product_id);
    if (cartItem) {
      setProductQuantity(cartItem.quantity);
    }
  }, [cartItems, product_id]);

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setProductQuantity((prevQuantity) => prevQuantity + 1);
    addToCart(product_id);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setProductQuantity((prevQuantity) => Math.max(prevQuantity - 1, 0));
    removeFromCart(product_id);
  };

  return {
    productQuantity,
    handleIncrement,
    handleDecrement,
  };
};

export default useProductQuantity;
