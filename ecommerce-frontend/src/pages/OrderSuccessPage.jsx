import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Home, Package, Phone, Mail, MapPin } from "lucide-react";
import { useEffect } from "react";
import Navbar from "@/components/Shared/Navbar";
import Footer from "@/components/Shared/Footer";
import { formatPrice } from "@/utils/formatters";

export default function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  useEffect(() => {
    if (!order) {
      navigate("/");
    }
  }, [order, navigate]);

  if (!order) {
    return null;
  }

  const getPaymentMethodText = (method) => {
    const methods = {
      cod: "Thanh toán khi nhận hàng (COD)",
      bank_transfer: "Chuyển khoản ngân hàng",
      momo: "Ví MoMo",
    };
    return methods[method] || method;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center text-white">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CheckCircle size={48} className="text-green-600" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Đặt hàng thành công!
              </h1>
              <p className="text-green-50 text-sm md:text-base">
                Cảm ơn bạn đã tin tưởng và mua hàng tại shop chúng tôi
              </p>
            </div>

            {/* Order Info */}
            <div className="p-6 md:p-8">
              {/* Order ID & Date */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Mã đơn hàng</p>
                    <p className="text-xl font-bold text-gray-900">
                      #{order.id}
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-sm text-gray-600 mb-1">Thời gian đặt</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(order.date)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-blue-600" />
                  Thông tin giao hàng
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Package size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Người nhận</p>
                      <p className="font-semibold text-gray-900">
                        {order.shipping.fullName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone size={16} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Số điện thoại</p>
                      <p className="font-semibold text-gray-900">
                        {order.shipping.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail size={16} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold text-gray-900">
                        {order.shipping.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin size={16} className="text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Địa chỉ</p>
                      <p className="font-semibold text-gray-900">
                        {order.shipping.address}, {order.shipping.district},{" "}
                        {order.shipping.city}
                      </p>
                    </div>
                  </div>

                  {order.shipping.notes && (
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Ghi chú</p>
                      <p className="text-sm text-gray-700">
                        {order.shipping.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Sản phẩm đã đặt
                </h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 line-clamp-2 mb-1">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500 mb-2">
                          {item.size} / {item.color} × {item.quantity}
                        </p>
                        <p className="font-semibold text-blue-600">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Phương thức thanh toán
                    </span>
                    <span className="font-medium text-gray-900">
                      {getPaymentMethodText(order.paymentMethod)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tạm tính</span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(order.total - 30000)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(30000)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="font-bold text-gray-900 text-base">
                      Tổng cộng
                    </span>
                    <span className="font-bold text-blue-600 text-xl">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Message */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  <span className="font-semibold">📦 Trạng thái: </span>
                  Đơn hàng đang được xử lý. Chúng tôi sẽ liên hệ với bạn trong
                  thời gian sớm nhất để xác nhận đơn hàng.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate("/")}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Home size={20} />
                  <span>Về trang chủ</span>
                </button>
                <button
                  onClick={() => navigate("/account")}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Package size={20} />
                  <span>Đơn hàng của tôi</span>
                </button>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ{" "}
              <a
                href="mailto:support@shop.com"
                className="text-blue-600 hover:underline font-medium"
              >
                support@shop.com
              </a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
