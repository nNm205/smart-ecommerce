import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Package } from "lucide-react";
import { orderService } from "@/services/orderService";
import { formatPrice } from "@/utils/formatters";
import { useToast } from "@/hooks/useToast";

export default function OrdersTab() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const { showToast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const ordersData = await orderService.getUserOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
      showToast("Không thể tải danh sách đơn hàng", "error");
    } finally {
      setLoading(false);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleOrderClick = (orderId) => {
    if (!orderId) {
      showToast("Không thể xem chi tiết đơn hàng", "error");
      return;
    }

    navigate(`/orders/${orderId}`);
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "ALL") return true;
    return order.status === filter;
  });

  const statusFilters = [
    { key: "ALL", label: "Tất cả" },
    { key: "PENDING", label: "Chờ xử lý" },
    { key: "CONFIRMED", label: "Đã xác nhận" },
    { key: "SHIPPING", label: "Đang giao" },
    { key: "DELIVERED", label: "Đã giao" },
    { key: "CANCELLED", label: "Đã hủy" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2
            size={48}
            className="text-blue-600 animate-spin mx-auto mb-4"
          />
          <p className="text-gray-600">Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl text-center font-semibold mb-6">
        Đơn hàng của tôi
      </h1>

      {/* Status Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap justify-center gap-2">
          {statusFilters.map((statusFilter) => (
            <button
              key={statusFilter.key}
              onClick={() => setFilter(statusFilter.key)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === statusFilter.key
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border"
              }`}
            >
              {statusFilter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package size={64} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {filter === "ALL"
              ? "Bạn chưa có đơn hàng nào"
              : "Không có đơn hàng nào"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleOrderClick(order.id)}
            >
              {/* Order Header */}
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Mã đơn hàng</p>
                    <p className="font-bold text-gray-900">#{order.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ngày đặt</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {getStatusText(order.status)}
                </span>
              </div>

              {/* Order Items */}
              <div className="p-4">
                <div className="space-y-3">
                  {order.items.slice(0, 2).map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded border"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 line-clamp-1 text-sm">
                          {item.productName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Size: {item.size} × {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          {formatPrice(item.subtotal)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-sm text-gray-500 text-center">
                      và {order.items.length - 2} sản phẩm khác
                    </p>
                  )}
                </div>
              </div>

              {/* Order Footer */}
              <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Tổng tiền</p>
                  <p className="font-bold text-blue-600 text-lg">
                    {formatPrice(order.totalAmount)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOrderClick(order.id);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors text-sm"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
