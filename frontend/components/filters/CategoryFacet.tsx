import React from "react";
import { Facet, FacetValue } from "../../types/searchResponse";

interface CategoryFacetProps {
  facet: Facet;
  handleSelectFilter: (facet: Facet, valueName?: string) => void;
  onLoad: boolean;
  facets?: Facet[];
}

const CategoryFacet: React.FC<CategoryFacetProps> = ({
  facet,
  handleSelectFilter,
  onLoad,
  facets,
}) => {
  // Only show subcategories if a main category is selected
  const categoryFacet = facets?.find((f) => f.name === "category");
  const shouldShowSubcategories =
    facet.name === "subcategory" &&
    categoryFacet?.values?.some((value) => value.status === "CLICKED");

  if (facet.name === "subcategory" && !shouldShowSubcategories) {
    return <></>;
  }

  return (
    <>
      <div className="mb-3 flex gap-2 items-center">
        <p className="text-sm text-black">
          {facet.name === "category" ? "Category" : "Subcategory"}
        </p>
      </div>
      {(facet.values as FacetValue[]).map((value, index) => (
        <div
          key={index}
          className="hover:bg-opacity-85 flex flex-row items-center"
        >
          <div className="w-7">
            {value.hits !== undefined && value.status !== "DISABLED" && (
              <span
                className={`bg-black text-white p-1 rounded text-xs w-7 text-center inline-block ${
                  value.status === "CLICKED"
                    ? "bg-opacity-100"
                    : "bg-opacity-30"
                }`}
              >
                {value.hits}
              </span>
            )}
          </div>
          <button
            className={`btn btn-sm btn-ghost font-normal text-black text-left px-4 py-2 ${
              value.status === "CLICKED"
                ? "font-bold text-opacity-100"
                : "text-opacity-50"
            } hover:bg-transparent hover:text-opacity-85 `}
            onClick={() => handleSelectFilter(facet, value.name)}
            disabled={value.status === "DISABLED" || onLoad}
          >
            {JSON.parse(`"${value.name}"`)}
          </button>
        </div>
      ))}
    </>
  );
};

export default CategoryFacet;
