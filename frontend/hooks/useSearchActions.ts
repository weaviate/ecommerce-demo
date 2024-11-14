import { useRef } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Filter, SearchRequest, sortingOptions } from "../types/searchRequest";
import { Facet, FacetValue, SearchResponse } from "../types/searchResponse";

export function useSearchActions(
  search: (body: SearchRequest) => Promise<SearchResponse>,
  setSearchResponse: React.Dispatch<React.SetStateAction<SearchResponse>>,
  setFetching: (fetching: boolean) => void,
  setSearchRequest: React.Dispatch<React.SetStateAction<SearchRequest>>,
) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fetchingRef = useRef(false);

  const handleSearch = async (body: SearchRequest) => {
    if (fetchingRef.current) {
      return;
    }

    try {
      fetchingRef.current = true;
      setFetching(true);

      const data = await search(body);
      if (data) {
        setSearchResponse(data);
        setFetching(false);
        fetchingRef.current = false;
      }
    } catch (error) {
      console.error("Search failed:", error);
      setFetching(false);
      fetchingRef.current = false;
    }
  };

  const triggerSearch = (
    queryParam: string | null,
    searchMode: "KEYWORD" | "VECTOR" | "HYBRID",
    sessionID: string,
    size: number,
    page: number,
    sortOption: string,
  ) => {
    const body: SearchRequest = createRequest(
      queryParam ? queryParam : "",
      searchMode,
      sessionID,
      size,
      page,
      sortOption,
    );
    setSearchRequest(body);
    handleSearch(body);
  };

  const handleFilterChange = (updatedFacet: Facet, shouldSearch: boolean) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (
      (updatedFacet.type === "SINGLE" ||
        updatedFacet.type === "MULTI" ||
        updatedFacet.type === "CATEGORY" ||
        updatedFacet.type === "COLLECTION") &&
      Array.isArray(updatedFacet.values)
    ) {
      const clickedValues = (updatedFacet.values as FacetValue[])
        .filter((value) => value.status === "CLICKED")
        .map((value) => {
          return value.name.replace(/\\u[\dA-F]{4}/gi, (match) =>
            String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16)),
          );
        })
        .join(",");

      if (updatedFacet.type === "COLLECTION") {
        if (clickedValues.length > 0) {
          newSearchParams.set("collection", clickedValues);
        } else {
          newSearchParams.delete("collection");
        }
      } else {
        if (clickedValues.length > 0) {
          newSearchParams.set(
            updatedFacet.type + "_" + updatedFacet.name,
            clickedValues,
          );
        } else {
          newSearchParams.delete(updatedFacet.type + "_" + updatedFacet.name);
        }
      }
    }

    router.replace(`/search?${newSearchParams.toString()}`, { scroll: false });

    setSearchResponse((prev) => ({
      ...prev,
      facets: prev.facets.map((facet) =>
        facet.name === updatedFacet.name ? updatedFacet : facet,
      ),
    }));

    if (shouldSearch) {
      triggerSearch(
        searchParams.get("query"),
        (searchParams.get("searchMode") as "KEYWORD" | "VECTOR" | "HYBRID") ||
          "HYBRID",
        searchParams.get("sessionID") || "",
        parseInt(searchParams.get("size") || "12"),
        parseInt(searchParams.get("page") || "1"),
        searchParams.get("sort") || "",
      );
    }
  };

  const handleRangeFilterApply = (updatedFacet: Facet) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (updatedFacet.type === "RANGE") {
      const lower = updatedFacet.lower ?? -1;
      const upper = updatedFacet.upper ?? -1;
      const selectedLower = updatedFacet.selected_lower ?? -1;
      const selectedUpper = updatedFacet.selected_upper ?? -1;

      const rangeValue = `[${selectedLower},${selectedUpper}]`;
      newSearchParams.set("RANGE_" + updatedFacet.name, rangeValue);
    }

    router.replace(`/search?${newSearchParams.toString()}`, { scroll: false });

    setSearchResponse((prev) => ({
      ...prev,
      facets: prev.facets.map((facet) =>
        facet.name === updatedFacet.name ? updatedFacet : facet,
      ),
    }));

    triggerSearch(
      searchParams.get("query"),
      (searchParams.get("searchMode") as "KEYWORD" | "VECTOR" | "HYBRID") ||
        "HYBRID",
      searchParams.get("sessionID") || "",
      parseInt(searchParams.get("size") || "12"),
      parseInt(searchParams.get("page") || "1"),
      searchParams.get("sort") || "",
    );
  };

  const resetFilters = () => {
    setSearchResponse((prev) => ({
      ...prev,
      facets: prev.facets.map((facet) => {
        if (facet.type === "COLLECTION") {
          return {
            ...facet,
            values: (facet.values as FacetValue[]).map((value) => ({
              ...value,
              status: value.status === "CLICKED" ? "CLICKABLE" : value.status,
            })),
          };
        } else if (facet.type === "RANGE") {
          return {
            ...facet,
            selected_lower: facet.lower,
            selected_upper: facet.upper,
          };
        } else if (
          (facet.type === "SINGLE" || facet.type === "MULTI") &&
          Array.isArray(facet.values)
        ) {
          return {
            ...facet,
            values: (facet.values as FacetValue[]).map((value) => ({
              ...value,
              status: value.status === "CLICKED" ? "CLICKABLE" : value.status,
            })),
          };
        }
        return facet;
      }),
    }));

    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (searchParams.has("collection")) {
      newSearchParams.delete("collection");
    } else {
      for (const [key] of Array.from(newSearchParams.entries())) {
        if (
          key.startsWith("SINGLE_") ||
          key.startsWith("MULTI_") ||
          key.startsWith("RANGE_") ||
          key.startsWith("CATEGORY_")
        ) {
          newSearchParams.delete(key);
        }
      }
    }

    newSearchParams.set("_", Math.random().toString(36).substring(7));
    router.replace(`/search?${newSearchParams.toString()}`, { scroll: false });
  };

  const createRequest = (
    query: string,
    _type: "KEYWORD" | "HYBRID" | "VECTOR",
    session_id: string,
    size: number,
    page: number,
    sort: string,
  ): SearchRequest => {
    const filters = transformFacetsToFilters(searchParams);

    return {
      query,
      type: _type,
      session_id,
      size,
      page,
      sort: sortingOptions[sort],
      filters,
    };
  };

  const transformFacetsToFilters = (
    searchParams: URLSearchParams,
  ): Filter[] => {
    const filters: Filter[] = [];

    searchParams.forEach((value, key) => {
      if (
        key.startsWith("SINGLE_") ||
        key.startsWith("MULTI_") ||
        key.startsWith("CATEGORY_")
      ) {
        const filterType = key.split("_")[0];
        const filterName = key.substring(filterType.length + 1);
        const filterValues = value.split(",");

        if (filterValues.length > 1 || filterType === "MULTI") {
          filters.push({ name: filterName, values: filterValues });
        } else {
          filters.push({ name: filterName, value: filterValues[0] });
        }
      } else if (key.startsWith("RANGE_")) {
        const filterName = key.substring("RANGE_".length);
        const [selectedLower, selectedUpper] = JSON.parse(value);
        filters.push({
          name: filterName,
          gte: selectedLower,
          lte: selectedUpper,
        });
      } else if (key === "collection") {
        filters.push({ name: "collection", value: value });
      }
    });

    return filters;
  };

  return {
    handleSearch,
    triggerSearch,
    handleFilterChange,
    handleRangeFilterApply,
    resetFilters,
    createRequest,
  };
}
