export interface SearchResponse {
  total_hits: number;
  took: number;
  hits: Hit[];
  facets: Facet[];
}

export interface Hit {
  product_id: string;
  score: number;
  name: string;
  image: string;
  price: number;
  brand: string;
  rating: number;
  tags: string[];
}

export interface Facet {
  name: string;
  type: "COLLECTION" | "CATEGORY" | "SINGLE" | "MULTI" | "RANGE";
  values?: FacetValue[];
  lower?: number;
  upper?: number;
  selected_lower?: number;
  selected_upper?: number;
}

export interface FacetValue {
  name: string;
  hits?: number;
  status?: "CLICKED" | "CLICKABLE" | "DISABLED";
}

export interface RangeFacetValue {
  lower: number;
  upper: number;
  selected_lower: number;
  selected_upper: number;
}

export const emptySearchResponse: SearchResponse = {
  total_hits: 0,
  took: 0,
  hits: [],
  facets: [],
};
