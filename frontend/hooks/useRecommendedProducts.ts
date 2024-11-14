// hooks/useProductDetails.ts
import { useEffect, useState } from "react";

import { getRecommendations } from "../components/search/actions";
import {
  emptyRecommendationResponse,
  RecommendationResponse,
} from "../types/recommendationResponse";

export function useRecommendedProducts(productID: string) {
  const [recommendedProducts, setRecommendedProducts] =
    useState<RecommendationResponse>(emptyRecommendationResponse);
  const [loadingRecommendation, setLoadingRecommendation] = useState(true);

  useEffect(() => {
    async function fetchRecommendedProducts() {
      setLoadingRecommendation(true);

      const existingSessionId = localStorage.getItem("session_id");
      const recommendationData = await getRecommendations(
        productID,
        existingSessionId || "",
        4,
      );

      if (recommendationData) {
        setRecommendedProducts(recommendationData);
      }
      setLoadingRecommendation(false);
    }

    if (productID) {
      fetchRecommendedProducts();
    } else {
      setLoadingRecommendation(false);
    }
  }, [productID]);

  return { recommendedProducts, loadingRecommendation };
}
