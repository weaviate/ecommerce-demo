import { useEffect, useState } from "react";

import { getProduct } from "../app/api";
import { emptyProduct, Product } from "../types/productResponse";

export function useProductDetails(productID: string) {
  const [product, setProduct] = useState<Product>(emptyProduct);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProductDetails() {
      setLoading(true);

      const productData = await getProduct(productID);
      if (productData) {
        setProduct(productData);
      }
      setLoading(false);
    }

    if (productID) {
      fetchProductDetails();
    }
  }, [productID]);

  return { product, loading };
}
