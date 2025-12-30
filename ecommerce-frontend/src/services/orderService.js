import api from "./api";

export const orderService = {
  createCODOrder: async (shippingAddress) => {
    try {
      const response = await api.post("/orders", {
        shippingAddress,
        paymentMethod: "COD",
      });
      return response.data;
    } catch (error) {
      console.error("Error creating COD order:", error);
      throw error;
    }
  },

  createVNPayOrder: async (shippingAddress) => {
    try {
      const response = await api.post("/payment/vnpay/create", {
        shippingAddress,
        paymentMethod: "VNPAY",
      });
      return response.data;
    } catch (error) {
      console.error("Error creating VNPay order:", error);
      throw error;
    }
  },

  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting order by id:", error);
      throw error;
    }
  },

  getUserOrders: async () => {
    try {
      const response = await api.get("/orders");
      return response.data;
    } catch (error) {
      console.error("Error getting all orders of user:", error);
      throw error;
    }
  },

  cancelOrder: async (orderId) => {
    try {
      const response = await api.put(`/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      console.error("Error cancelling order:", error);
      throw error;
    }
  },
};
