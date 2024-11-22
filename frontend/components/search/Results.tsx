"use client";

import React, { Suspense } from "react";

import { useResultsState } from "../../hooks/useResultsState";
import { SearchResponse } from "../../types/searchResponse";
import Pagination from "../navigation/Pagination";
import ProductCard from "../product/ProductCard";
import { TiDelete } from "react-icons/ti";

interface Results {
  searchResponse: SearchResponse;
  onLoad: boolean;
}

const Results: React.FC<Results> = ({ searchResponse, onLoad }) => {
  const {
    router,
    pathname,
    searchParams,
    query,
    setQuery,
    page,
    setPage,
    size,
    setSize,
  } = useResultsState();

  const handleClearQuery = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("query");
    router.push(`${pathname}?${newSearchParams}`, { scroll: false });
  };

  return (
    <div className="h-full px-4 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center text-primary w-full">
          {query && (
            <button
              disabled={onLoad}
              onClick={() => {
                handleClearQuery();
              }}
              className="btn btn-sm btn-ghost bg-transparent hover:bg-transparent"
            >
              <TiDelete size={25} className="text-primary" />
            </button>
          )}
          <h2 className="text-3xl font-semibold">{query}</h2>
          {!onLoad && (
            <p className="ml-4 animate-pop-in opacity-50 text-xs">
              {`${searchResponse.total_hits} results in ${searchResponse.took}ms`}
            </p>
          )}
        </div>
      </div>
      {onLoad ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary border-opacity-25"></div>
        </div>
      ) : (
        <div className="min-h-64 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
          {searchResponse.hits.map((product) => (
            <ProductCard
              key={product.product_id}
              product_id={product.product_id}
              image={product.image}
              productName={product.name}
              tags={product.tags}
              price={product.price}
              brand={product.brand}
            />
          ))}
        </div>
      )}
      <Suspense fallback={<div>Loading...</div>}>
      <Pagination
        totalHits={searchResponse.total_hits}
        page={page}
        setPage={setPage}
        size={size}
        setSize={setSize}
        onLoad={onLoad}
      />
      </Suspense>
    </div>
  );
};

export default Results;
