import { useEffect } from "react";

import { useSearchParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

import { SearchRequest } from "../types/searchRequest";

export function useSearchEffects(
  setQueryParam: (query: string | null) => void,
  setSortOption: (sort: string) => void,
  setSearchMode: (mode: "KEYWORD" | "VECTOR" | "HYBRID") => void,
  setPage: (page: number) => void,
  setSize: (size: number) => void,
  setSelectedProductID: (id: string) => void,
  setSessionID: (id: string) => void,
  setSearchRequest: (request: SearchRequest) => void,
  handleSearch: (request: SearchRequest) => void,
  createRequest: (
    query: string,
    type: "KEYWORD" | "VECTOR" | "HYBRID",
    sessionID: string,
    size: number,
    page: number,
    sort: string,
  ) => SearchRequest,
) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const currentParams = JSON.stringify({
      _query: searchParams.get("query"),
      _sort: searchParams.get("sort"),
      _searchMode: searchParams.get("searchMode"),
      _page: searchParams.get("page"),
      _size: searchParams.get("size"),
      _product_id: searchParams.get("id"),
    });

    const { _query, _sort, _searchMode, _page, _size, _product_id } =
      JSON.parse(currentParams);

    setQueryParam(_query);
    setSortOption(_sort);
    setSearchMode(_searchMode);
    setPage(parseInt(_page || "1"));
    setSize(parseInt(_size || "12"));

    if (_product_id) {
      setSelectedProductID(_product_id);
    } else {
      setSelectedProductID("");
    }

    const existingSessionId = localStorage.getItem("session_id");
    let currentSessionID = "";
    if (existingSessionId) {
      setSessionID(existingSessionId);
      currentSessionID = existingSessionId;
    } else {
      const newSessionId = uuidv4();
      currentSessionID = newSessionId;
      localStorage.setItem("session_id", newSessionId);
      setSessionID(newSessionId);
    }

    const body: SearchRequest = createRequest(
      _query,
      _searchMode,
      currentSessionID,
      _size,
      _page,
      _sort,
    );
    setSearchRequest(body);

    if (_searchMode && currentSessionID && _size && _page && _sort) {
      handleSearch(body);
    }
  }, [searchParams]);
}
