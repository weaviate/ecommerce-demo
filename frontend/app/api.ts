"use server";

import { emptyProduct } from "../types/productResponse";
import { RecommendationRequest } from "../types/recommendationRequest";
import {
  emptyRecommendationResponse,
  RecommendationResponse,
} from "../types/recommendationResponse";
import { SearchRequest } from "../types/searchRequest";
import { emptySearchResponse } from "../types/searchResponse";

const checkUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch (error) {
    console.error(`Failed to fetch from ${url}:`, error);
    return false;
  }
};

export const detectHost = async (): Promise<string> => {
  const localUrl = "http://localhost:8000/health";
  const rootUrl = "http://127.0.0.1:8000/health";

  const isLocalHealthy = await checkUrl(localUrl);
  if (isLocalHealthy) {
    return "http://localhost:8000";
  }

  const isRootHealthy = await checkUrl(rootUrl);
  if (isRootHealthy) {
    return "http://127.0.0.1:8000";
  }

  throw new Error("Both health checks failed, please check the Magic Server");
};

export async function search(searchRequest: SearchRequest): Promise<any> {
  try {
    const host = await detectHost();
    const response = await fetch(`${host}/search`, {
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
    const host = await detectHost();
    const response = await fetch(`${host}/product/${product_id}`, {
      method: "GET",
    });

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

    const host = await detectHost();
    const response = await fetch(`${host}/recommend`, {
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
