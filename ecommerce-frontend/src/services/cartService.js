import CartItem from "@/components/Cart/CartItem";
import api from "./api";

export const cartService = {
  getCart: async () => {
    const response = await api.get("/cart");
    return response.data;
  },

  addToCart: async (cartItemData) => {
    const response = await api.post("/cart/add", cartItemData);
    return response.data;
  },

  updateCartItem: async (itemId, quantity) => {
    const response = await api.put(`/cart/items/${itemId}`, { quantity });
    return response.data;
  },

  removeCartItem: async (itemId) => {
    const response = await api.delete(`/cart/items/${itemId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete("/cart/clear");
    return response.data;
  },
};
