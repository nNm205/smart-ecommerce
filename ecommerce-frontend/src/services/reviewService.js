import api from "./api";

export const reviewService = {
  // Lấy danh sách reviews của sản phẩm
  getReviewsByProductId: async (productId) => {
    try {
      const response = await api.get(`/products/${productId}/reviews`);
      return response.data;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }
  },

  // Tạo review mới
  createReview: async (productId, reviewData) => {
    try {
      const response = await api.post(
        `/products/${productId}/reviews`,
        reviewData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  },

  // Cập nhật review
  updateReview: async (productId, reviewId, reviewData) => {
    try {
      const response = await api.put(
        `/products/${productId}/reviews/${reviewId}`,
        reviewData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating review:", error);
      throw error;
    }
  },

  // Xóa review
  deleteReview: async (productId, reviewId) => {
    try {
      await api.delete(`/products/${productId}/reviews/${reviewId}`);
      return true;
    } catch (error) {
      console.error("Error deleting review:", error);
      throw error;
    }
  },
};
