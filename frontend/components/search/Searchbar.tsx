"use client";

import React, { useEffect, useRef, useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IoIosSearch } from "react-icons/io";
import { TiDelete } from "react-icons/ti";
import useTypewriter from "react-typewriter-hook";

interface SearchBarProps {
  onFocusChange?: (isFocused: boolean) => void;
  largeMode?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onFocusChange, largeMode }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchMode, setSearchMode] = useState<"KEYWORD" | "VECTOR" | "HYBRID">(
    "HYBRID",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const searchBarRef = useRef<HTMLDivElement>(null);

  const MagicQueries = [
    "Garden Tea Party",
    "Pleated Skirt",
    "Matrix Trench Coat",
    "Sparkly Shirt",
  ];

  const [index, setIndex] = useState(0);

  const [magicName, setMagicName] = useState("Garden Tea Party");
  const intervalRef = useRef<number | null>(null);
  const name = useTypewriter(magicName);

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      // Change the phrase after one complete cycle
      setIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % MagicQueries.length;
        setMagicName(MagicQueries[nextIndex]);
        return nextIndex;
      });
    }, 4000);
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [magicName]);

  useEffect(() => {
    // Check if the URL has a 'query' parameter and update searchQuery state
    const queryParam = searchParams.get("query");
    const searchModeParam = searchParams.get("searchMode");

    if (queryParam) {
      setSearchQuery(queryParam);
    } else if (!queryParam && searchQuery) {
      setSearchQuery("");
    }

    if (
      searchModeParam === "KEYWORD" ||
      searchModeParam === "VECTOR" ||
      searchModeParam === "HYBRID"
    ) {
      setSearchMode(searchModeParam);
    } else {
      setSearchMode("HYBRID");
      const newSearchParams = new URLSearchParams(searchParams.toString());
      if (pathname === "/search") {
        newSearchParams.set("searchMode", "HYBRID");
        router.replace(`${pathname}?${newSearchParams}`, { scroll: false });
      }
    }
  }, [searchParams]); // Run this effect when searchParams changes

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node)
      ) {
        handleFocusChange(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchBarRef]);

  const handleFocusChange = (focused: boolean) => {
    setIsFocused(focused);
    onFocusChange?.(focused);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set("query", searchQuery);
      newSearchParams.set("searchMode", searchMode);

      const productQuery = searchParams.get("id");

      if (productQuery) {
        newSearchParams.delete("id");
      }

      router.push(`/search?${newSearchParams}`, { scroll: false });
      handleFocusChange(false);
    }
  };

  const clearSearchQuery = () => {
    setSearchQuery("");
    if (pathname === "/search") {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("query"); // Remove 'query' param
      router.push(`${pathname}?${newSearchParams}`, { scroll: false });
    }
  };

  const handleModeFieldChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const mode = event.target.value.toUpperCase();

    if (mode === "KEYWORD" || mode === "VECTOR" || mode === "HYBRID") {
      setSearchMode(mode);
    }
  };

  if (largeMode ? largeMode : false) {
    return (
      <div
        ref={searchBarRef}
        className={`bg-white shadow-2xl fade-in flex gap-2 items-center justify-center border-2 border-accent rounded-xl w-full max-w-full hover:border-opacity-70 ${isFocused ? "border-opacity-100" : "border-opacity-25"} transition-all duration-1000 ease-in-out`}
      >
        <IoIosSearch
          className={`text-primary ml-2 ${isFocused ? "text-opacity-100" : "text-opacity-25"}`}
          size={35}
        />
        <input
          type="text"
          placeholder={name as string}
          className={`text-primary text-base input rounded-xl w-full p-0 focus:border-none focus:outline-none bg-inherit`}
          onFocus={() => handleFocusChange(true)}
          onKeyDown={handleKeyDown}
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
        />
        {searchQuery && !isFocused && (
          <button onClick={clearSearchQuery} className="p-1">
            <TiDelete size={20} className="text-primary" />
          </button>
        )}
        <div className="w-1/2">
          <select
            onChange={handleModeFieldChange}
            value={searchMode}
            className=" hover:opacity-100 opacity-50 select select-bordered w-full text-xs text-primary border-none bg-transparent focus:outline-none"
          >
            <option value="KEYWORD">Keyword</option>
            <option value="VECTOR">Vector</option>
            <option value="HYBRID">Hybrid</option>
          </select>
        </div>
      </div>
    );
  } else {
    return (
      <div
        ref={searchBarRef}
        className={`bg-white flex gap-2 items-center justify-center border border-accent rounded-xl hover:border-opacity-70 ${isFocused ? "w-full max-w-full border-opacity-100" : "w-auto max-w-xs border-opacity-25"} transition-all duration-1000 ease-in-out`}
      >
        <IoIosSearch
          className={`text-primary ml-1 ${isFocused ? "text-opacity-100" : "text-opacity-25"}`}
          size={25}
        />
        <input
          type="text"
          placeholder=""
          className={`text-primary ${isFocused ? "text-opacity-100" : "text-opacity-50"} text-xs input-sm rounded-xl w-full p-0 focus:border-none focus:outline-none bg-inherit`}
          onFocus={() => handleFocusChange(true)}
          onKeyDown={handleKeyDown}
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
        />
        {searchQuery && !isFocused && (
          <button onClick={clearSearchQuery} className="p-1">
            <TiDelete size={20} className="text-primary" />
          </button>
        )}
        {isFocused && (
          <div className="w-1/2">
            <select
              onChange={handleModeFieldChange}
              value={searchMode}
              className="select select-sm select-bordered w-full text-xs text-primary border-none bg-transparent focus:outline-none hover:opacity-100 opacity-50"
            >
              <option value="KEYWORD">Keyword</option>
              <option value="VECTOR">Vector</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>
        )}
      </div>
    );
  }
};

export default SearchBar;
