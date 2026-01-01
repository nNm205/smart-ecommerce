import api from "../utils/api";

export const authService = {
  // Đăng nhập
  login: async (loginData) => {
    const response = await api.post("/auth/login", loginData);
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    const response = await api.post("/auth/refresh", null, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },
};
