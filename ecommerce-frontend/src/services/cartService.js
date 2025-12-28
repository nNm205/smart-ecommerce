import api from "./api";

export const cartService = {
  getCart: async () => {
    try {
      const response = await api.get("/cart");
      return response.data;
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  },

  addToCart: async (productId, size, quantity = 1) => {
    try {
      const response = await api.post("/cart/add", {
        productId,
        size,
        quantity,
      });
      return response.data;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  },

  updateCartItem: async (cartItemId, quantity) => {
    try {
      const response = await api.put(`/cart/items/${cartItemId}`, {
        quantity,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating cart item:", error);
      throw error;
    }
  },

  removeCartItem: async (itemId) => {
    try {
      const response = await api.delete(`/cart/items/${itemId}`);
      return response.data;
    } catch (error) {
      console.error("Error removing cart item:", error);
      throw error;
    }
  },

  clearCart: async () => {
    try {
      const response = await api.delete("/cart/clear");
      return response.data;
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  },
};
