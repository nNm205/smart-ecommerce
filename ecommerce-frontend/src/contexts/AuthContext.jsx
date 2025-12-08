import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      // fetch user profile when token present
      fetch("/api/user/me", { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => data && setUser(data))
        .catch(() => {});
    } else {
      setUser(null);
    }
  }, [token]);

  const login = (t, userData) => {
    setToken(t);
    localStorage.setItem("token", t);
    setUser(userData);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
