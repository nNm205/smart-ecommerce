import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Shared/Navbar";
import Footer from "@/components/Shared/Footer";

export default function EmptyCart() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingCart size={64} className="text-gray-300 mb-4 mx-auto" />
          <h1 className="text-2xl font-semibold mb-2">Giỏ hàng của bạn</h1>
          <p className="text-gray-500 mb-6">Hiện chưa có sản phẩm nào.</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}
