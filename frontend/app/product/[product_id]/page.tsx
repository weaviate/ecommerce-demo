"use client";

import { useParams } from "next/navigation";

import React from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { TiDelete } from "react-icons/ti";

import { useProductDetails } from "../../../hooks/useProductDetails";
import useProductQuantity from "../../../hooks/useProductQuantity";
import { useRecommendedProducts } from "../../../hooks/useRecommendedProducts";
import ProductCard from "../../../components/product/ProductCard";
import RenderStars from "../../../components/product/RenderStars";
import Reviews from "../../../components/product/Reviews";
import ShoppingCartButton from "../../../components/product/ShoppingCartButton";

export default function ProductPage() {
  const params = useParams();
  const product_id = params.product_id as string;

  const { product, loading } = useProductDetails(product_id);
  const { recommendedProducts, loadingRecommendation } =
    useRecommendedProducts(product_id);
  const router = useRouter();
  const { productQuantity, handleIncrement, handleDecrement } =
    useProductQuantity(product_id);

  const handleBack = () => {
    router.back();
  };

  return (
    <main className="p-10">
      <div className="flex justify-start gap-2">
        <button
          className="btn btn-s btn-ghost hover:bg-transparent bg-transparent text-primary"
          onClick={() => {
            handleBack();
          }}
        >
          {" "}
          <TiDelete size={25} /> Back{" "}
        </button>
      </div>
      <div className="flex ml-6">
        {loading ? (
          <div className="bg-white w-1/4 mr-10 animate-pop-in justify-center flex items-center">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : (
          <div className="w-1/4 mr-10 animate-pop-in justify-center flex items-center">
            <Image
              src={product.image}
              alt="Product Image"
              className="rounded-sm mt-2"
              width={500}
              height={500}
            />
          </div>
        )}

        {!loading && (
          <div className="w-2/4 p-10 animate-pop-in">
            <div className="flex text-primary justify-between items-center gap-5">
              <div>
                <p className="text-xl font-light opacity-75">{product.brand}</p>
                <p className="text-4xl mb-2 truncate font-bold">
                  {product.name}
                </p>
                <div className="flex flex-row pt-2">
                  <div className="flex gap-2">
                    <RenderStars rating={product.rating} size={25} />
                  </div>
                  <p className="pl-2 text-lg text-primary">
                    {"("}
                    {product.rating}
                    {")"}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-7 text-primary ">
              <p className="text-lg">{product.description}</p>
            </div>
            <div className="flex justify-start mt-4 gap-2">
              {product.tags.map((tags, index) => (
                <div
                  key={tags}
                  className="bg-white shadow-md p-3 rounded-lg items-center justify-center"
                >
                  <p className="text-sm text-primary">{tags}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center text-center mt-2">
              <div className="flex gap-5 justify-between text-center items-center mt-5">
                <p className="text-2xl font-bold">{product.price}$</p>
                <ShoppingCartButton
                  productQuantity={productQuantity}
                  handleIncrement={handleIncrement}
                  handleDecrement={handleDecrement}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      {!loading && (
        <div className="p-15 mt-10">
          <div className="ml-5 flex flex-row">
            <p className="text-xl font-medium">Customers say:</p>
          </div>
          <Reviews reviews={product.reviews} rating={product.rating} />
          <div className="mt-10 ml-5">
            <p className="text-2xl text-primary font-bold">Similar items</p>
            <p className="text-lg text-secondart font-light">
              How about these?
            </p>
          </div>
          {loadingRecommendation ? (
            <div className="flex justify-center items-center">
              <span className="loading loading-spinner loading-md"></span>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
              {recommendedProducts.hits.map((product, index) => (
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
