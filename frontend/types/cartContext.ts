export interface CartItem {
  product_id: string;
  quantity: number;
}

export interface CartItemWithDetails extends CartItem {
  product: any;
  loading: boolean;
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product_id: string) => void;
  removeFromCart: (product_id: string) => void;
  clearCart: () => void;
}
