import { useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const API_BASE_URL = "http://localhost:8087/api";

export const useTokenRefresh = (refreshBeforeExpiry = 60) => {
  const timerRef = useRef(null);
  const isRefreshingRef = useRef(false);

  const refreshAccessToken = async () => {
    if (isRefreshingRef.current) {
      console.log("Đang refresh, bỏ qua refresh mới");
      return;
    }

    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      console.warn("Không có refresh token");
      return;
    }

    isRefreshingRef.current = true;

    try {
      console.log("Bắt đầu refresh token tự động...");

      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, null, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });

      const data = response.data;
      const newAccessToken = data.accessToken;
      const newRefreshToken = data.refreshToken;

      if (!newAccessToken) {
        throw new Error("Không nhận được access token mới");
      }

      console.log("Refresh token thành công");

      localStorage.setItem("accessToken", newAccessToken);
      if (refreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
      }

      const userData = {
        userId: data.userId,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
      };
      localStorage.setItem("user", JSON.stringify(userData));

      setupRefreshTimer();
    } catch (error) {
      console.error("Refresh token thất bại:", error);

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      window.location.href = "/login";
    } finally {
      isRefreshingRef.current = false;
    }
  };

  const setupRefreshTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.log("Không có access token");
      return;
    }

    try {
      const decoded = jwtDecode(accessToken);
      const currentTime = Date.now() / 1000;
      const expiryTime = decoded.exp;

      const timeUntilExpiry = expiryTime - currentTime;
      console.log(`Token hết hạn sau: ${Math.round(timeUntilExpiry)}s`);

      if (timeUntilExpiry <= refreshBeforeExpiry) {
        console.log("Token sắp hết hạn, refresh ngay lập tức");
        refreshAccessToken();
        return;
      }

      const timeToRefresh = (timeUntilExpiry - refreshBeforeExpiry) * 1000;
      console.log(
        `Sẽ refresh token sau ${Math.round(
          timeToRefresh / 1000
        )}s (${Math.round(timeToRefresh / 60000)}) phút`
      );

      timerRef.current = setTimeout(() => {
        console.log("Đã đến thời gian refresh token");
        refreshAccessToken();
      }, timeToRefresh);
    } catch (error) {
      console.error("Lỗi decode token:", error);
    }
  };

  useEffect(() => {
    setupRefreshTimer();

    const handleStorageChange = (e) => {
      if (e.key === "accessToken") {
        console.log("Access token thay đổi, setup lại timer");
        setupRefreshTimer();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [refreshBeforeExpiry]);
};
