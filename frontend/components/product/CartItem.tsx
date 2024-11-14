"use client";

import React from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { useCart } from "../../contexts/CartContext";
import { useProductDetails } from "../../hooks/useProductDetails";

interface CartItemProps {
  product_id: string;
  quantity: number;
}

const CartItem: React.FC<CartItemProps> = ({ product_id, quantity }) => {
  const { addToCart, removeFromCart } = useCart();
  const { product, loading } = useProductDetails(product_id);
  const router = useRouter();

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleProductClick = (product_id: string) => {
    router.replace(`/product/${product_id}`, { scroll: false });
  };

  return (
    <div className="flex flex-col lg:w-1/2 w-full">
      <div
        onClick={() => handleProductClick(product_id)}
        className="flex flex-col sm:flex-row items-center justify-between w-full shadow-md p-4 cursor-default hover:cursor-pointer hover:bg-gray-100 transition-colors duration-200 rounded-xl"
      >
        <div className="flex items-center mb-4 sm:mb-0">
          <Image
            src={product.image}
            alt={product.name}
            width={80}
            height={80}
            className="w-16 h-16 sm:w-20 sm:h-20 object-cover mr-4"
          />
          <div>
            <h3 className="font-bold text-sm sm:text-base">{product.name}</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              ${product.price.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <button
            className="btn btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              removeFromCart(product_id);
            }}
          >
            -
          </button>
          <span className="mx-2 text-sm sm:text-base">{quantity}</span>
          <button
            className="btn btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product_id);
            }}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
