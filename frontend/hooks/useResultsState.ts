import { useEffect, useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useResultsState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [sortOption, setSortOption] = useState("Relevance");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(12);

  useEffect(() => {
    const sortOptionQuery = searchParams.get("sort");
    const pageQuery = searchParams.get("page");
    const sizeQuery = searchParams.get("size");

    if (sortOptionQuery) {
      setSortOption(sortOptionQuery);
    } else {
      setSortOption("Relevance");
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set("sort", "Relevance");
      router.replace(`/search?${newSearchParams}`, { scroll: false });
    }

    if (pageQuery) {
      setPage(parseInt(pageQuery));
    } else {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      setPage(1);
      newSearchParams.set("page", "1");
      router.replace(`/search?${newSearchParams}`, { scroll: false });
    }

    if (sizeQuery) {
      setSize(parseInt(sizeQuery));
    } else {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      setSize(12);
      newSearchParams.set("size", "12");
      router.replace(`/search?${newSearchParams}`, { scroll: false });
    }
  }, [searchParams, pathname]);

  return {
    router,
    pathname,
    searchParams,
    query,
    setQuery,
    sortOption,
    setSortOption,
    page,
    setPage,
    size,
    setSize,
  };
}
