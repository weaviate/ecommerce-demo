"use client";

import React, { Suspense } from "react";

import SearchBar from "../components/search/Searchbar";
import CollectionShowcase from "../components/product/CollectionShowcase";
import RotatingImages from "../components/visual/RotatingImages";

export default function Home() {
  return (
    <main>
      <div className="w-full h-[60vh] flex flex-row items-center justify-between">
        <div className="pl-40 w-1/2">
          <p className="text-7xl font-bold text-left">WeCommerce</p>
          <p className="text-4xl font-bold text-accent pt-3 pb-8 text-left">
            weaviate for ecommerce
          </p>
          <div className="text-left">
            <Suspense fallback={<div>Loading...</div>}>
            <SearchBar largeMode={true} />
            </Suspense>s
          </div>
        </div>
        <div className="w-1/3 h-full items-center justify-center">
          <RotatingImages
            images={[
              "10b791c1-c36c-40d3-923f-fcd772c971cd",
              "f3c71908-9c02-4bbf-a0cf-493ff8545e67",
              "00ab66a0-880a-46de-837e-4615483c0f59",
              "7cae6377-c2a1-4b4b-8266-3efbd4185b79",
            ]}
          />
        </div>
      </div>
      <div className="justify-center">
        <p className="flex justify-center font-bold my-10 text-4xl">
          Our Top Collections
        </p>
      </div>
      <CollectionShowcase
        backgroundColor="black"
        accentColor="white"
        collectionName="Techwear"
        description="Featuring multi-pocket jackets, waterproof pants, and tactical backpacks, this collection brings a sleek, futuristic aesthetic inspired by urban survivalism and outdoor gear. Designed for both resilience and refined minimalism."
        products={[
          {
            name: "Weave Pullover",
            price: 120,
            product_id: "136e178d-7519-49eb-bf97-4f53296a25f2",
            brand: "Nova Nest",
          },
          {
            name: "Circuit Wristband",
            price: 89.99,
            product_id: "2c50244b-214a-48eb-8953-8ea44cebfa24",
            brand: "Nova Nest",
          },
          {
            name: "Circuit Flex Trousers",
            price: 220,
            product_id: "1b58c1c5-1e9c-4b2b-8feb-57de9730b379",
            brand: "NixNada",
          },
        ]}
        imagePath="/techwear.png"
        descriptionEnd={false}
      />
      <CollectionShowcase
        backgroundColor="white"
        accentColor="black"
        collectionName="Dark Academia"
        description="A collection that embodies the elegance and sophistication of a bygone era, with a focus on vintage-inspired designs and a touch of nostalgia. Think tailored blazers, pearl necklaces, and lace-up shoes, all in rich, dark tones."
        products={[
          {
            name: "Hallowed Herringbone Overcoat",
            price: 249.99,
            product_id: "f3505634-44e2-4931-8e20-0c5ff70c42ce",
            brand: "Echo & Stitch",
          },
          {
            name: "Vintage Scholar Pleated Skirt",
            price: 89.99,
            product_id: "1506a2ca-6cde-46c5-ae51-f1981240aec7",
            brand: "Solemn Chic",
          },
          {
            name: "Scholar's Reprieve Woolen Blouse",
            price: 89.99,
            product_id: "630caa1c-3449-46a6-aaf4-5cf9f64720fc",
            brand: "Nova Nest",
          },
        ]}
        imagePath={null}
        descriptionEnd={false}
      />
      <CollectionShowcase
        backgroundColor="white"
        accentColor="black"
        collectionName="Light Academia"
        description="Brining a refined, scholarly style inspired by literature and art in bright, airy settings. With soft beiges, creams, and pastels, it features classic pieces like button-up shirts, cardigans, and pleated trousers for an elegant, intellectual look."
        products={[
          {
            name: "Scholarly Charm Blouse",
            price: 58,
            product_id: "66ccf78d-e0b2-45e5-a243-48bc46910980",
            brand: "Loom & Aura",
          },
          {
            name: "Ivory Intellect Blazer",
            price: 149.99,
            product_id: "e4347552-852f-4088-8e4a-6de5ba1cbbaa",
            brand: "Loom & Aura",
          },
          {
            name: "Ivory Ponder Prose Skirt",
            price: 55,
            product_id: "f3c71908-9c02-4bbf-a0cf-493ff8545e67",
            brand: "Nova Nest",
          },
        ]}
        imagePath={null}
        descriptionEnd={true}
      />
      <CollectionShowcase
        backgroundColor="#E3F7FF"
        accentColor="black"
        collectionName="Y2K"
        description="Capturing the bold, nostalgic spirit of early 2000s pop culture and tech optimism, it's all about making a statement. Featuring low-rise jeans, baby tees, mini skirts, and platform sneakers, this collection brings back the iconic looks of music videos and celebrity fashion from the era."
        products={[
          {
            name: "Space-Age Sequin Top",
            price: 45.99,
            product_id: "7cae6377-c2a1-4b4b-8266-3efbd4185b79",
            brand: "Vivid Verse",
          },
          {
            name: "Icy Baby Blue Puffer",
            price: 89.99,
            product_id: "18144d23-f6f7-41de-9614-9e1a7db0872d",
            brand: "Vivid Verse",
          },
          {
            name: "Glide Platforms",
            price: 89.99,
            product_id: "91a7d5d0-18aa-405c-a007-fc672778edeb",
            brand: "Vivid Verse",
          },
        ]}
        imagePath="/y2k.png"
        descriptionEnd={false}
      />
      <CollectionShowcase
        backgroundColor="white"
        accentColor="black"
        collectionName="Cottagecore"
        description="This collection captures the dreamy, nostalgic essence of rural life, inspired by the simple pleasures of gardening, baking, and nature. Embrace romantic countryside vibes."
        products={[
          {
            name: "Blossom Patchwork Vest",
            price: 58,
            product_id: "10b791c1-c36c-40d3-923f-fcd772c971cd",
            brand: "Loom & Aura",
          },
          {
            name: "Rustic Charm Soft Linen Trousers",
            price: 68,
            product_id: "ac114c7a-9f9d-40e9-b600-0fb6b48dbbc0",
            brand: "Canvas & Co",
          },
          {
            name: "Sunlit Garden Jumpsuit",
            price: 65.99,
            product_id: "126b06da-36b0-49dc-ae7f-861b632832ec",
            brand: "Eko & Stitch",
          },
        ]}
        imagePath="/cottagecore.png"
        descriptionEnd={false}
      />
    </main>
  );
}
