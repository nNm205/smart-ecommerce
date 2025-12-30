import { orderService } from "@/services/orderService";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/useToast";
import { formatPrice } from "@/utils/formatters";
import Navbar from "@/components/Shared/Navbar";
import Footer from "@/components/Shared/Footer";
import {
  Loader2,
  MapPin,
  Package,
  CreditCard,
  XCircle,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    if (!orderId) {
      showToast("Không tìm thấy mã đơn hàng", "error");
      navigate("/account");
      return;
    }
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    if (!orderId) return;

    try {
      const orderData = await orderService.getOrderById(orderId);
      setOrder(orderData);
    } catch (error) {
      console.error("Error fetching order:", error);
      showToast("Không thể tải thông tin đơn hàng", "error");
      navigate("/account");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
      return;
    }

    setCancelling(true);
    try {
      await orderService.cancelOrder(orderId);
      showToast("Hủy đơn hàng thành công", "success");
      fetchOrderDetails();
    } catch (error) {
      console.error("Error cancelling order:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Không thể hủy đơn hàng. Vui lòng thử lại!";
      showToast(errorMessage, "error");
    } finally {
      setCancelling(false);
    }
  };

  const getStatusText = (status) => {
    const statuses = {
      PENDING: "Chờ xử lý",
      CONFIRMED: "Đã xác nhận",
      SHIPPING: "Đang giao",
      DELIVERED: "Đã giao",
      CANCELLED: "Đã hủy",
      RETURNED: "Đã trả hàng",
    };
    return statuses[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      CONFIRMED: "bg-blue-100 text-blue-800",
      SHIPPING: "bg-purple-100 text-purple-800",
      DELIVERED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
      RETURNED: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPaymentMethodText = (method) => {
    const methods = {
      COD: "Thanh toán khi nhận hàng (COD)",
      VNPAY: "VNPay",
    };
    return methods[method] || method;
  };

  const getPaymentStatusText = (status) => {
    const statuses = {
      COD: "Thanh toán khi nhận hàng",
      PENDING: "Chờ thanh toán",
      PAID: "Đã thanh toán",
      FAILED: "Thanh toán thất bại",
      CANCELLED: "Đã hủy",
    };
    return statuses[status] || status;
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

  const canCancelOrder = order?.status === "PENDING";

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2
              size={48}
              className="text-blue-600 animate-spin mx-auto mb-4"
            />
            <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 h-[50px] flex items-center px-6 lg:px-16 border-b border-gray-200">
        <Link
          to="/"
          className="hover:text-blue-700 transition-colors duration-200"
        >
          Trang chủ
        </Link>
        <ChevronRight size={14} className="mx-1" />
        <Link
          to="/profile/orders"
          className="hover:text-blue-700 transition-colors duration-200"
        >
          Đơn hàng của tôi
        </Link>
        <ChevronRight size={14} className="mx-1" />
        <Link
          to={`/orders/${orderId}`}
          className="hover:text-blue-700 transition-colors duration-200"
        >
          Chi tiết đơn hàng
        </Link>
      </div>

      <ToastContainer />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Chi tiết đơn hàng #{order.id}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  order.status
                )}`}
              >
                {getStatusText(order.status)}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ngày đặt hàng</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Cập nhật lần cuối
                  </p>
                  <p className="font-medium text-gray-900">
                    {formatDate(order.updatedAt)}
                  </p>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin size={20} className="text-blue-600" />
                  Địa chỉ giao hàng
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900 mb-1">
                    {order.userFullName}
                  </p>
                  <p className="text-gray-700">{order.shippingAddress}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Package size={20} className="text-blue-600" />
                  Sản phẩm ({order.items.length})
                </h3>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 mb-1">
                          {item.productName}
                        </p>
                        <p className="text-sm text-gray-500 mb-2">
                          Size: {item.size} × {item.quantity}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            {formatPrice(item.price)} × {item.quantity}
                          </span>
                          <span className="font-semibold text-blue-600">
                            {formatPrice(item.subtotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Info */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CreditCard size={20} className="text-blue-600" />
                  Thanh toán
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phương thức</span>
                    <span className="font-medium text-gray-900">
                      {getPaymentMethodText(order.paymentMethod)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trạng thái</span>
                    <span
                      className={`font-medium ${
                        order.paymentStatus === "PAID"
                          ? "text-green-600"
                          : order.paymentStatus === "FAILED"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {getPaymentStatusText(order.paymentStatus)}
                    </span>
                  </div>
                  {order.paymentTransactionId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mã giao dịch</span>
                      <span className="font-medium text-gray-900">
                        {order.paymentTransactionId}
                      </span>
                    </div>
                  )}
                  <div className="pt-3 border-t flex justify-between items-center">
                    <span className="font-bold text-gray-900 text-lg">
                      Tổng cộng
                    </span>
                    <span className="font-bold text-blue-600 text-2xl">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {canCancelOrder && (
                <div className="pt-6 border-t">
                  <button
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                    className="w-full md:w-auto bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {cancelling ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        <span>Đang hủy...</span>
                      </>
                    ) : (
                      <>
                        <XCircle size={20} />
                        <span>Hủy đơn hàng</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
