import axios from "axios";

const API_BASE_URL = "http://localhost:8088/api";

const chatbotApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Biến để tracking trạng thái refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

chatbotApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request để debug
    console.log("Request:", {
      method: config.method?.toUpperCase(),
      url: config.baseURL + config.url,
      headers: config.headers.Authorization ? "Has Token" : "No Token",
    });
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

chatbotApi.interceptors.response.use(
  (response) => {
    console.log("Response:", {
      status: response.status,
      url: response.config.url,
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.error("Response Error:", {
      status: error.response?.status,
      url: originalRequest?.url,
      message: error.message,
    });

    if (error.response?.status === 401 && !originalRequest._retry) {
      const isAuthEndpoint =
        originalRequest.url.includes("/auth/refresh") ||
        originalRequest.url.includes("/auth/login") ||
        originalRequest.url.includes("/auth/register") ||
        originalRequest.url.includes("/auth/verify-registration");

      if (isAuthEndpoint) {
        console.warn("Auth endpoint thất bại - Không retry");

        if (originalRequest.url.includes("/auth/refresh")) {
          console.warn("Refresh token hết hạn - Đăng xuất");
          handleLogout();
        }

        return Promise.reject(error);
      }

      if (isRefreshing) {
        console.log("⏳ Đang chờ refresh token...");

        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return chatbotApi(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        console.warn("Không có refresh token - Đăng xuất");
        isRefreshing = false;
        handleLogout();
        return Promise.reject(error);
      }

      try {
        console.log("Đang refresh access token...");

        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          null,
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
              "Content-Type": "application/json",
            },
            timeout: 10000,
          }
        );

        const data = response.data;
        const newAccessToken = data.accessToken;
        const newRefreshToken = data.refreshToken;

        if (!newAccessToken) {
          throw new Error("Không nhận được access token mới");
        }

        console.log("Refresh token thành công");

        localStorage.setItem("accessToken", newAccessToken);

        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        const userData = {
          userId: data.userId,
          email: data.email,
          fullName: data.fullName,
          role: data.role,
        };
        localStorage.setItem("user", JSON.stringify(userData));

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        return chatbotApi(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token thất bại:", refreshError);

        processQueue(refreshError, null);

        handleLogout();

        window.location.href = "/login";

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

const handleLogout = () => {
  console.log("Đang đăng xuất...");

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  window.location.href = "/login";
};

export default chatbotApi;
