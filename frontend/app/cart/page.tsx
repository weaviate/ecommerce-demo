"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TiDelete } from "react-icons/ti";
import CartItem from "../../components/product/CartItem";
import ProductCard from "../../components/product/ProductCard";
import { useCart } from "../../contexts/CartContext";
import { useRecommendedProducts } from "../../hooks/useRecommendedProducts";
import { CartItemWithDetails } from "../../types/cartContext";

export default function CartPage() {
  const { cartItems, clearCart } = useCart();
  const router = useRouter();
  const [cartItemDetails, setCartItemDetails] = useState<CartItemWithDetails[]>(
    [],
  );
  const recommendedProduct = cartItems[0] ? cartItems[0].product_id : null;
  const { recommendedProducts, loadingRecommendation } = recommendedProduct
    ? useRecommendedProducts(recommendedProduct)
    : { recommendedProducts: { hits: [] }, loadingRecommendation: true };

  useEffect(() => {
    const fetchProductDetails = async () => {
      const details = await Promise.all(
        cartItems.map(async (item) => {
          const response = await fetch(
            `http://localhost:8000/product/${item.product_id}`,
          );
          const product = await response.json();
          return { ...item, product, loading: false };
        }),
      );
      setCartItemDetails(details);
    };

    fetchProductDetails();
  }, [cartItems]);

  const totalPrice = cartItemDetails.reduce((total, item) => {
    if (!item.loading && item.product) {
      return total + item.product.price * item.quantity;
    }
    return total;
  }, 0);

  return (
    <main className="w-full sm:px-10 px-25 py-8 min-h-screen">
      <button
        className="btn btn-s btn-ghost hover:bg-transparent bg-transparent text-primary"
        onClick={() => router.push("/search")}
      >
        <TiDelete size={25} className="mr-1" /> Back
      </button>
      <div className="mt-3">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
          Your Shopping Cart
        </h1>
        {!cartItems[0] ? (
          <p className="text-lg">Nothing here...</p>
        ) : (
          <>
            <div className="space-y-4">
              {cartItemDetails.map((item) => (
                <CartItem key={item.product_id} {...item} />
              ))}
            </div>
            <div className="mt-6 sm:mt-8">
              <p className="text-lg sm:text-xl font-bold">
                Total: ${totalPrice.toFixed(2)}
              </p>
              <div className="flex flex-col sm:flex-row mt-4 space-y-2 sm:space-y-0 sm:space-x-4">
                <button className="btn btn-primary w-full sm:w-auto">
                  Proceed to Checkout
                </button>
                {/* <button className="btn btn-outline w-full sm:w-auto" onClick={clearCart}>
                  Clear Cart
                </button> */}
              </div>
            </div>
          </>
        )}
      </div>
      {cartItems[0] && (
        <div className="mt-15 sm:mt-10">
          <div className="mb-4 sm:mb-5">
            <p className="text-xl sm:text-2xl text-primary font-bold">
              Did you forget something?
            </p>
          </div>
          {loadingRecommendation ? (
            <div className="flex justify-center items-center">
              <span className="loading loading-spinner loading-md"></span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recommendedProducts.hits.map((product) => (
                <ProductCard
                  key={product.product_id}
                  product_id={product.product_id}
                  image={product.image}
                  productName={product.name}
                  tags={product.tags}
                  price={product.price}
                  brand={product.brand}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
