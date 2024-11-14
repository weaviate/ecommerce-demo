"use client";

import React from "react";

import Image from "next/image";
import Link from "next/link";

import useProductQuantity from "../../hooks/useProductQuantity";
import FavoriteButton from "./FavoriteButton";
import { Roboto_Slab } from "next/font/google";

const robotoSlab = Roboto_Slab({ weight: "400", subsets: ["latin"] });

interface ProductCardProps {
  image: string;
  tags: string[];
  productName: string;
  price: number;
  product_id: string;
  brand: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  tags,
  productName,
  price,
  product_id,
  brand,
}) => {
  const { productQuantity, handleIncrement, handleDecrement } =
    useProductQuantity(product_id);

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the Link from being activated
    e.stopPropagation(); // Stop the event from bubbling up
  };

  return (
    <Link href={`/product/${product_id}`} passHref>
      <div className="m-2 overflow-clip flex flex-col transition-transform duration-300 ease-in-out transform cursor-default hover:cursor-pointer animate-pop-in">
        <div className="relative justify-center gap-2">
          <div
            onClick={handleCartClick}
            className="flex-none absolute top-0 right-0 mr-2 mt-2"
          >
            <FavoriteButton />
          </div>
          {tags.indexOf("sale") !== -1 ? (
            <button className="flex-none absolute bottom-0 left-0 mb-1 justify-center bg-red-500 text-white m-0 px-2">
              Sale
            </button>
          ) : (
            <div></div>
          )}
          <Image
            src={image}
            alt="Product Image"
            className=""
            width={500}
            height={500}
            loading="lazy"
          />
        </div>
        <div className="flex flex-col text-primary overflow-hidden">
          <div className="w-full bg-black px-2 py-1">
            <p
              className={`text-xs truncate text-white ${robotoSlab.className}`}
            >
              {brand}
            </p>
          </div>

          <div className="px-1">
            <p className="text-md my-2 truncate text-black">{productName}</p>
            <div className="text-sm pb-1 opacity-80">${price.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
