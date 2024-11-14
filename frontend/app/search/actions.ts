"use server";

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
