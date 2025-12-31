import { Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ProfilePage from "@/pages/ProfilePage";
import CartPage from "@/pages/CartPage";
import CategoryPage from "@/pages/CategoryPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderSuccessPage from "@/pages/OrderSuccessPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import { useTokenRefresh } from "@/hooks/useTokenRefresh";
import VNPayReturnPage from "@/pages/VNPayReturnPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import ChatWidget from "./components/ChatWidget";
import SearchPage from "./pages/SearchPage";

function App() {
  useTokenRefresh(60);

  return (
    <>
      <div className="pt-16">
        <Routes>
          {/* Home route */}
          <Route path="/" element={<HomePage />} />

          {/* Authentication routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Profile routes */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/addresses" element={<ProfilePage />} />
          <Route path="/profile/security" element={<ProfilePage />} />
          <Route path="/profile/orders" element={<ProfilePage />} />
          <Route path="/profile/admin-chat" element={<ProfilePage />} />
          <Route path="/profile/logout" element={<ProfilePage />} />

          {/* Order Detail route */}
          <Route path="/orders/:orderId" element={<OrderDetailPage />} />

          {/* Order success route */}
          <Route path="/order-success" element={<OrderSuccessPage />} />

          {/* Cart route */}
          <Route path="/cart" element={<CartPage />} />

          {/* Category route */}
          <Route path="/category/:category" element={<CategoryPage />} />

          {/* Product Detail route */}
          <Route path="/product/:id" element={<ProductDetailPage />} />

          {/* Checkout route */}
          <Route path="/checkout" element={<CheckoutPage />} />

          {/* Checkout VNPay route */}
          <Route path="/vnpay-return" element={<VNPayReturnPage />} />

          {/* Search route */}
          <Route path="/search" element={<SearchPage />} />
        </Routes>

        <ChatWidget />
      </div>
    </>
  );
}

export default App;
