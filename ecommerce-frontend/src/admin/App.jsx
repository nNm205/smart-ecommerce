import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminLayout from "./components/layout/AdminLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Chat from "./pages/Chat";
import AdminReviewsManagement from "./pages/AdminReviewsManagement";

const LoginRedirect = () => {
  const { auth, isLoading } = useAuth();

  console.log("LoginRedirect - isLoading:", isLoading);
  console.log("LoginRedirect - isAuthenticated:", auth.isAuthenticated);
  console.log("LoginRedirect - auth:", auth);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (auth.isAuthenticated) {
    console.log("LoginRedirect - Redirecting to dashboard");
    return <Navigate to="/" replace />;
  }

  console.log("LoginRedirect - Showing login page");
  return <Login />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Route login */}
      <Route path="/login" element={<LoginRedirect />} />

      {/* Routes được bảo vệ */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/products" element={<Products />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/reviews" element={<AdminReviewsManagement />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
