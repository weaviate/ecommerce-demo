import { useState } from "react";

import { dummySearchRequest, SearchRequest } from "../types/searchRequest";
import { emptySearchResponse, SearchResponse } from "../types/searchResponse";

export function useSearchState() {
  const [searchResponse, setSearchResponse] =
    useState<SearchResponse>(emptySearchResponse);
  const [searchRequest, setSearchRequest] =
    useState<SearchRequest>(dummySearchRequest);
  const [fetching, setFetching] = useState(false);
  const [queryParam, setQueryParam] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState("");
  const [searchMode, setSearchMode] = useState<"KEYWORD" | "VECTOR" | "HYBRID">(
    "HYBRID",
  );
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(12);
  const [sessionID, setSessionID] = useState("");
  const [selectedProductID, setSelectedProductID] = useState("");

  return {
    searchResponse,
    setSearchResponse,
    searchRequest,
    setSearchRequest,
    fetching,
    setFetching,
    queryParam,
    setQueryParam,
    sortOption,
    setSortOption,
    searchMode,
    setSearchMode,
    page,
    setPage,
    size,
    setSize,
    sessionID,
    setSessionID,
    selectedProductID,
    setSelectedProductID,
  };
}
