export interface Product {
    product_id: string;
    name: string;
    description: string;
    category: string;
    subcategory: string;
    collection: string;
    price: number;
    image: string;
    colors: string[];
    rating: number;
    brand: string;
    tags: string[];
    reviews: string[];
  }
  
  export const emptyProduct: Product = {
    product_id: "1234-5678-91011",
    name: "",
    description: "",
    category: "",
    subcategory: "",
    collection: "",
    price: 0,
    image: "",
    colors: [],
    rating: 0,
    brand: "",
    tags: [],
    reviews: [],
  };
  