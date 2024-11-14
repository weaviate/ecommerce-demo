"use client";

import React from "react";
import { Facet, FacetValue } from "../../types/searchResponse";
import { useFacetHandlers } from "../../hooks/useFacetHandlers";
import { DEFAULT_COLLECTIONS } from "../../constants/constants";

interface CollectionNavbarProps {
  facet: Facet;
  grid?: boolean;
  onLoad: boolean;
  onSelectFilter: (filter: Facet, search: boolean) => void;
  onResetFilter: () => void;
}

const CollectionNavbar: React.FC<CollectionNavbarProps> = ({
  facet,
  grid,
  onLoad,
  onSelectFilter,
  onResetFilter,
}) => {
  const { handleSelectFilter } = useFacetHandlers(onLoad, onSelectFilter);

  // Create synthetic facet values from DEFAULT_COLLECTIONS if facet.values is empty
  const collections = DEFAULT_COLLECTIONS.map((name) => ({
    name,
    status: facet.values?.find((v) => v.name === name)?.status || "CLICKABLE",
  }));

  // Update the facet with synthetic values before handling selection
  const handleCollectionSelect = (collectionName: string) => {
    const updatedFacet = {
      ...facet,
      values: collections.map((c) => ({
        name: c.name,
        status: c.name === collectionName ? "CLICKED" : "CLICKABLE",
      })),
    };
    handleSelectFilter(updatedFacet as Facet, collectionName);
  };

  return (
    <div
      className={`p-3 ${grid ? "grid grid-cols-4 gap-3" : "flex flex-nowrap overflow-x-scroll overscroll-x-contain scrollbar-hide"}`}
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <div
        key={"All"}
        onClick={() => onResetFilter()}
        className={`text-black flex justify-center p-3 flex-none transition-transform duration-300 ease-in-out transform hover:cursor-pointer`}
      >
        <p
          className={`text-sm ${!collections.some((v) => v.status === "CLICKED") ? "opacity-100 font-bold" : "opacity-50"}`}
        >
          All
        </p>
      </div>
      {collections.map((value, index) => (
        <div
          key={index}
          onClick={() => handleCollectionSelect(value.name)}
          className={`text-black flex justify-center p-3 flex-none transition-transform duration-300 ease-in-out transform hover:cursor-pointer`}
        >
          <p
            className={`text-sm ${value.status === "CLICKED" ? "opacity-100 font-bold" : "opacity-50"}`}
          >
            {value.name}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CollectionNavbar;
