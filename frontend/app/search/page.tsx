"use client";

import React, { useState } from "react";
import { Facet } from "../../types/searchResponse";

import FilterNavbar from "../../components/filters/FilterNavbar";
import CollectionNavbar from "../../components/navigation/CollectionNavbar";
import Results from "../../components/search/Results";
import { useSearchActions } from "../../hooks/useSearchActions";
import { useSearchEffects } from "../../hooks/useSearchEffects";
import { useSearchState } from "../../hooks/useSearchState";
import { search } from "./actions";

export default function Home() {
  const searchState = useSearchState();
  const searchActions = useSearchActions(
    search,
    searchState.setSearchResponse,
    searchState.setFetching,
    searchState.setSearchRequest,
  );

  useSearchEffects(
    searchState.setQueryParam,
    searchState.setSortOption,
    searchState.setSearchMode,
    searchState.setPage,
    searchState.setSize,

    searchState.setSelectedProductID,
    searchState.setSessionID,
    searchState.setSearchRequest,
    searchActions.handleSearch,
    searchActions.createRequest,
  );

  const handleRangeChange = (
    facet: Facet,
    newLower: number,
    newUpper: number,
  ) => {
    searchActions.handleFilterChange(
      {
        ...facet,
        selected_lower: newLower,
        selected_upper: newUpper,
      },
      false,
    );
  };

  return (
    <main>
      <div>
        <div>
          <CollectionNavbar
            facet={
              searchState.searchResponse.facets.find(
                (facet) => facet.type === "COLLECTION",
              ) ?? {
                name: "empty",
                type: "COLLECTION",
                values: [],
              }
            }
            grid={false}
            onLoad={searchState.fetching}
            onSelectFilter={searchActions.handleFilterChange}
            onResetFilter={searchActions.resetFilters}
          />
        </div>
        <div className="flex pt-6">
          <div className="transition-all duration-300 w-1/6">
            <FilterNavbar
              facets={searchState.searchResponse.facets}
              onSelectFilter={searchActions.handleFilterChange}
              onLoad={searchState.fetching}
              onResetFilter={searchActions.resetFilters}
              handleRangeFilterApply={searchActions.handleRangeFilterApply}
              onRangeChange={handleRangeChange}
            />
          </div>
          <div className="w-5/6">
            <Results
              onLoad={searchState.fetching}
              searchResponse={searchState.searchResponse}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
