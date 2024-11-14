import { Product } from "./productResponse";

export interface RecommendationResponse {
  session_id: string;
  took: number;
  hits: Product[];
}

export const emptyRecommendationResponse: RecommendationResponse = {
  session_id: "",
  took: 0,
  hits: [],
};
