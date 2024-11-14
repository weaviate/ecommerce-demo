"use client";

import React from "react";

import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  totalHits: number;
  page: number;
  setPage: (page: number) => void;
  size: number;
  setSize: (size: number) => void;
  onLoad: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  totalHits,
  page,
  setPage,
  size,
  setSize,
  onLoad,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageEvent = (pageJump: number) => {
    if (onLoad) return;

    const newSearchParams = new URLSearchParams(searchParams.toString());
    let newPage = page + pageJump;

    if (pageJump > 0 && totalHits < size) {
      newPage = 1;
    } else if (newPage < 1 || newPage > 100) {
      newPage = 1;
    }

    setPage(newPage);
    newSearchParams.set("page", newPage.toString());
    router.replace(`/search?${newSearchParams}`, { scroll: false });
  };

  const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (onLoad) {
      return;
    }

    const selectedSize = event.target.value;
    setSize(parseInt(selectedSize));
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("size", selectedSize);
    router.replace(`/search?${newSearchParams}`, { scroll: false });
  };

  return (
    <div className="flex items-center justify-center py-6 gap-2">
      <div className="join items-center justify-center flex ">
        <button
          className="join-item btn text-primary bg-transparent"
          disabled={onLoad || page === 1}
          onClick={() => {
            handlePageEvent(-1);
          }}
        >
          «
        </button>
        <button
          className="join-item btn text-primary bg-transparent"
          disabled={onLoad}
        >
          Page {page}
        </button>
        <button
          className="join-item btn text-primary bg-transparent"
          disabled={onLoad || totalHits < size}
          onClick={() => {
            handlePageEvent(1);
          }}
        >
          »
        </button>
      </div>
      <select
        value={size}
        disabled={onLoad}
        className="select select-bordered max-w-xs text-primary"
        onChange={handleSizeChange}
      >
        <option key={8} value={8}>
          8
        </option>
        <option key={12} value={12}>
          12
        </option>
        <option key={16} value={16}>
          16
        </option>
        <option key={32} value={32}>
          32
        </option>
      </select>
    </div>
  );
};

export default Pagination;
