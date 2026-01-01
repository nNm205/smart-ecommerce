const API_BASE_URL = "http://localhost:8087/api/admin/reviews";

const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const reviewService = {
  // Lấy danh sách reviews với filters và pagination
  getReviews: async (page = 0, filters = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: "10",
      sort: "createdAt,DESC",
    });

    if (filters.productId) params.append("productId", filters.productId);
    if (filters.userId) params.append("userId", filters.userId);
    if (filters.rating) params.append("rating", filters.rating);

    const response = await fetch(`${API_BASE_URL}?${params}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        // Token hết hạn hoặc không hợp lệ
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        throw new Error("Unauthorized - Please login again");
      }
      throw new Error(`Failed to fetch reviews: ${response.status}`);
    }

    return await response.json();
  },

  // Xóa review
  deleteReview: async (reviewId) => {
    const response = await fetch(`${API_BASE_URL}/${reviewId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        throw new Error("Unauthorized - Please login again");
      }
      throw new Error(`Failed to delete review: ${response.status}`);
    }

    return true;
  },
};
