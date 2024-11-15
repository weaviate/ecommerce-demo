"use client";

import React, { useState } from "react";

import { usePathname, useRouter } from "next/navigation";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaGithub } from "react-icons/fa";

import { useCart } from "../../contexts/CartContext";
import SearchBar from "../search/Searchbar";

const Navbar: React.FC = () => {
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const { cartItems, clearCart } = useCart();

  const pathname = usePathname();

  const totalItems = cartItems.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  return (
    <div>
      <header className="flex justify-between items-center p-3 bg-white">
        <div
          className="flex items-center btn btn-ghost hover:bg-white"
          onClick={() => router.push("/")}
        >
          <img src="/weaviate-logo-W.svg" alt="Logo" className="h-6 mr-2" />
          <h1 className="text-center text-base text-primary">WeCommerce</h1>
        </div>
        <div className="flex items-center gap-10 w-auto justify-end transition-all duration-1000 ease-in-out">
          <p
            onClick={() => router.push("/search")}
            className="text-sm text-gray-500 hover:text-primary cursor-pointer"
          >
            Shop all
          </p>
          <p
            onClick={() => window.open("https://weaviate.io/", "_blank")}
            className="text-sm text-gray-500 hover:text-primary cursor-pointer"
          >
            About Weaviate
          </p>
        </div>
        <div
          className={`flex items-center gap-2 ${
            isFocused ? "w-1/3 justify-center" : "w-auto justify-end"
          } transition-all duration-1000 ease-in-out`}
        >
          <SearchBar onFocusChange={setIsFocused} />
          <div className="flex ml-5 mr-5">
            <div className={totalItems > 0 ? "indicator" : ""}>
              {totalItems > 0 && (
                <span className="badge badge-sm bg-accent bg-opacity-10 border-none indicator-item indicator-center mt-2 ml-2">
                  {totalItems}
                </span>
              )}
              <button
                className={`${isFocused ? "hidden" : "block"} ${
                  pathname === "/cart" ? "text-opacity-100" : "text-opacity-25"
                } btn btn-square btn-ghost text-primary hover:text-opacity-100 hover:bg-white`}
                onClick={() => router.push("/cart")}
              >
                <AiOutlineShoppingCart size={20} />
              </button>
            </div>
            <button
              className={` text-opacity-25 btn btn-square btn-ghost text-primary hover:text-opacity-100 hover:bg-white`}
              onClick={() => window.open("https://github.com", "_blank")}
            >
              <FaGithub size={20} />
            </button>
          </div>
        </div>
      </header>
      <div className="flex justify-center items-center">
        <hr className="border-t border-accent border-opacity-25 w-full" />
      </div>
    </div>
  );
};

export default Navbar;
