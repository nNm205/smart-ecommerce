import api from "./api";

export const authService = {
  // ================= Đăng ký =================
  // Bước 1. Gửi OTP đăng ký
  register: async (registerData) => {
    const response = await api.post("/auth/register", registerData);
    return response.data;
  },

  // Bước 2. Xác thực OTP và hoàn tất đăng ký
  verrifyRegistration: async (email, otp) => {
    const response = await api.post("/auth/verify-registration", {
      email,
      otp,
    });
    return response.data;
  },

  // ================= Đăng nhập =================
  // Đăng nhập
  login: async (loginData) => {
    const response = await api.post("/auth/login", loginData);
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    const response = await api.post("/auth/refresh", null, {
      header: {
        Authorization: `Bearer ${refreshToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },

  // ================= Quên mật khẩu =================
  // Bước 1. Gửi OTP đặt lại mật khẩu
  forgotPassword: async (email) => {
    const response = await api.post("/auth/forgot", { email });
    return response.data;
  },

  // Bước 2. Xác thực OTP
  verifyOtp: async (email, otp) => {
    const response = await api.post("/auth/verify-otp", {
      email,
      otp,
    });
    return response.data;
  },

  // Bước 3. Đặt lại mật khẩu
  resetPassword: async (email, otp, newPassword) => {
    const response = await api.post("/auth/reset", {
      email,
      otp,
      newPassword,
    });
    return response.data;
  },
};
