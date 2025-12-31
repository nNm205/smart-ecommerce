import { Navigate } from "react-router-dom";
import useAuth from "@/contexts/useAuth";

function ProtectedRoute({ children, requireAuth = false }) {
  const { auth } = useAuth();

  if (auth.isAuthenticated && auth.role === "ADMIN") {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  if (requireAuth && !auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
