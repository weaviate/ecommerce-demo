export interface SearchRequest {
  query: string;
  type: "KEYWORD" | "VECTOR" | "HYBRID";
  session_id: string;
  size: number;
  page: number;
  filters: Filter[];
  sort: Sort;
}

export interface Filter {
  name: string;
  value?: string;
  values?: string[];
  gte?: number;
  lte?: number;
}

export interface Sort {
  name: string;
  order: "ASC" | "DESC";
}

export interface sortingOptionInterface {
  [key: string]: Sort;
}

export const sortingOptions: sortingOptionInterface = {
  Relevance: { name: "RELEVANCE", order: "DESC" },
  Popularity: { name: "POPULARITY", order: "DESC" },
  "Product name (a-z)": { name: "NAME", order: "ASC" },
  "Product name (z-a)": { name: "NAME", order: "DESC" },
  "Price (low-high)": { name: "PRICE", order: "ASC" },
  "Price (high-low)": { name: "PRICE", order: "DESC" },
};

export const dummySearchRequest: SearchRequest = {
  query: "",
  type: "HYBRID",
  session_id: "",
  size: 12,
  page: 1,
  filters: [],
  sort: {
    name: "relevance",
    order: "DESC",
  },
};
