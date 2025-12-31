import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    email: "",
    fullName: "",
    role: "",
    userId: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userStr = localStorage.getItem("user");

    if (accessToken && userStr) {
      try {
        const user = JSON.parse(userStr);

        if (user.role === "ADMIN") {
          console.warn("Admin không thể truy cập giao diện user");
          logout();
          return;
        }

        setAuth({
          email: user.email || "",
          fullName: user.fullName || "",
          phone: user.phone || "",
          userId: user.userId || "",
          isAuthenticated: true,
        });
      } catch (error) {
        console.error("Lỗi parse user data:", error);
        logout();
      }
    }
  }, []);

  const login = (email, fullName, role, userId) => {
    const authData = {
      email,
      fullName,
      role,
      userId,
      isAuthenticated: true,
    };

    setAuth(authData);

    const userData = {
      email,
      fullName,
      role,
      userId,
    };
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setAuth({
      email: "",
      fullName: "",
      role: "",
      userId: null,
      isAuthenticated: false,
    });

    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
