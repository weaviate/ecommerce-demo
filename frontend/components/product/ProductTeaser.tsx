"use client";

import React from "react";

import Image from "next/image";
import Link from "next/link";

import { Roboto_Slab } from "next/font/google";

const robotoSlab = Roboto_Slab({ weight: "400", subsets: ["latin"] });

interface ProductCardProps {
  name: string;
  price: number;
  product_id: string;
  brand: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  price,
  product_id,
  brand,
}) => {
  return (
    <Link href={`/product/${product_id}`} passHref>
      <div className="aspect-square relative group">
        <Image
          src={`https://d3o574pyao1sq3.cloudfront.net/fashion/${product_id}.png`}
          alt="Product Image"
          className="rounded-sm"
          width={500}
          height={500}
        />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <p className="text-white text-xl font-bold opacity-100">{name}</p>
            <p
              className={`text-white text-md font-bold opacity-100 ${robotoSlab.className}`}
            >
              {brand}
            </p>
            <p className="text-white text-lg font-bold opacity-100">${price}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
