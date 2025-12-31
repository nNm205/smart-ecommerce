import api from "./api";

export const productService = {
  getAllProducts: async (params = {}) => {
    try {
      const queryParams = {
        page: params.page ?? 0,
        size: params.size ?? 30,
        sortBy: params.sortBy ?? "id",
        direction: params.direction ?? "ASC",
      };

      if (params.keyword && params.keyword.trim()) {
        queryParams.keyword = params.keyword.trim();
      }

      if (params.categoryId) {
        queryParams.categoryId = params.categoryId;
      }

      const response = await api.get("/products", {
        params: queryParams,
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching product by id:", error);
      throw error;
    }
  },

  getNewProducts: async (params = {}) => {
    try {
      const response = await productService.getAllProducts({
        sortBy: "createdAt",
        direction: "DESC",
        page: 0,
        size: params.size || 20,
      });

      const days = params.days || 7;
      const now = new Date();
      const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

      const newProducts = (response.content || []).filter((product) => {
        if (!product.createdAt) return false;
        const createdDate = new Date(product.createdAt);
        return createdDate >= cutoffDate;
      });

      return {
        ...response,
        content: newProducts,
        totalElements: newProducts.length,
      };
    } catch (error) {
      console.error("Error fetching new products:", error);
      throw error;
    }
  },

  getNewProductsByCategory: async (categoryId, size = 10) => {
    try {
      const response = await productService.getAllProducts({
        categoryId: categoryId,
        sortBy: "createdAt",
        direction: "DESC",
        page: 0,
        size: size,
      });

      const now = new Date();
      const cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const newProducts = (response.content || []).filter((product) => {
        if (!product.createdAt) return false;
        const createdDate = new Date(product.createdAt);
        return createdDate >= cutoffDate;
      });

      return newProducts;
    } catch (error) {
      console.error("Error fetching new products by category:", error);
      throw error;
    }
  },

  searchProducts: async (params = {}) => {
    try {
      const queryParams = {
        page: params.page ?? 0,
        size: params.size ?? 12,
        sortBy: params.sortBy ?? "createdAt",
        direction: params.direction ?? "DESC",
      };

      if (params.keyword && params.keyword.trim()) {
        queryParams.keyword = params.keyword.trim();
      }

      if (params.categoryId) {
        queryParams.categoryId = params.categoryId;
      }

      if (
        params.minPrice !== undefined &&
        params.minPrice !== null &&
        params.minPrice !== ""
      ) {
        queryParams.minPrice = params.minPrice;
      }

      if (
        params.maxPrice !== undefined &&
        params.maxPrice !== null &&
        params.maxPrice !== ""
      ) {
        queryParams.maxPrice = params.maxPrice;
      }

      const response = await api.get("/products/search", {
        params: queryParams,
      });

      return response.data;
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  },
};
