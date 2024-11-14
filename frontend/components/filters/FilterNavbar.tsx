import React from "react";
import { useFacetHandlers } from "../../hooks/useFacetHandlers";
import { Facet } from "../../types/searchResponse";
import RangeFacet from "./RangeFacet";
import SingleMultiFacet from "./SingleMultiFacet";
import CategoryFacet from "./CategoryFacet";
import { RxReset } from "react-icons/rx";
import { sortingOptions } from "../../types/searchRequest";
import { useResultsState } from "../../hooks/useResultsState";
interface FilterNavbarProps {
  facets: Facet[];
  onSelectFilter: (filter: Facet, search: boolean) => void;
  handleRangeFilterApply: (filter: Facet) => void;
  onResetFilter: () => void;
  onLoad: boolean;
  onRangeChange: (facet: Facet, newLower: number, newUpper: number) => void;
}

const FilterNavbar: React.FC<FilterNavbarProps> = ({
  facets,
  onSelectFilter,
  onResetFilter,
  onLoad,
  handleRangeFilterApply,
  onRangeChange,
}) => {
  const { handleSelectFilter } = useFacetHandlers(onLoad, onSelectFilter);
  const { router, searchParams, sortOption, setSortOption } = useResultsState();

  const handleSortFieldChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    if (onLoad) return;
    const selectedOptionKey = event.target.value;
    setSortOption(selectedOptionKey);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("sort", selectedOptionKey);
    router.replace(`/search?${newSearchParams}`, { scroll: false });
  };

  const renderFacet = (facet: Facet) => {
    switch (facet.type) {
      case "CATEGORY":
        console.log(facet);
        return (
          <CategoryFacet
            facet={facet}
            handleSelectFilter={handleSelectFilter}
            onLoad={onLoad}
            facets={facets}
          />
        );
      case "SINGLE":
      case "MULTI":
        return (
          <SingleMultiFacet
            facet={facet}
            handleSelectFilter={handleSelectFilter}
            onLoad={onLoad}
          />
        );
      case "RANGE":
        return (
          <RangeFacet
            facet={facet}
            onApply={() => {
              handleRangeFilterApply(facet);
            }}
            onLoad={onLoad}
            onRangeChange={onRangeChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-white overflow-auto px-4 pb-5">
      <div className="flex -mx-3 justify-between pb-5">
        <select
          disabled={onLoad}
          value={sortOption}
          onChange={handleSortFieldChange}
          className="select select-sm text-sm text-black outline-none focus:outline-none"
        >
          {Object.keys(sortingOptions).map((option) => (
            <option key={option} value={option} className="focus:outline-none">
              {option}
            </option>
          ))}
        </select>
        <button
          className="btn btn-sm btn-ghost font-normal text-primary hover:bg-transparent hover:underline"
          onClick={onResetFilter}
        >
          <RxReset size={16} />
        </button>
      </div>
      {facets.map(
        (facet) =>
          facet.type !== "COLLECTION" && (
            <div key={facet.name} className="animate-pop-in">
              {renderFacet(facet)}
            </div>
          ),
      )}
    </div>
  );
};

export default FilterNavbar;
