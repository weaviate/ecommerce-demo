"use server";

import { emptyProduct } from "../../types/productResponse";
import { RecommendationRequest } from "../../types/recommendationRequest";
import {
  emptyRecommendationResponse,
  RecommendationResponse,
} from "../../types/recommendationResponse";
import { SearchRequest } from "../../types/searchRequest";
import { emptySearchResponse } from "../../types/searchResponse";

export async function search(searchRequest: SearchRequest): Promise<any> {
  try {
    const response = await fetch("http://localhost:8000/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(searchRequest),
    });

    if (!response.ok) {
      return emptySearchResponse;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to perform search:", error);
    return emptySearchResponse;
  }
}

export async function getProduct(product_id: string): Promise<any> {
  try {
    const response = await fetch(
      "http://localhost:8000/product/" + product_id,
      {
        method: "GET",
      },
    );

    if (!response.ok) {
      return emptyProduct;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to perform search:", error);
    return emptyProduct;
  }
}

export async function getRecommendations(
  product_id: string,
  session_id: string,
  size: number = 3,
): Promise<any> {
  try {
    const body: RecommendationRequest = {
      product_id: product_id,
      session_id: session_id,
      size: size,
      page: 1,
    };

    const response = await fetch("http://localhost:8000/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return emptyRecommendationResponse;
    }

    const data: RecommendationResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to perform search:", error);
    return emptyProduct;
  }
}
