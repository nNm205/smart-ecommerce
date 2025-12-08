import { formatPrice } from "@/utils/formatters";

export default function OrderSummary({ items, shippingFee = 30000 }) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal + shippingFee;

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Đơn hàng</h2>

      {/* Danh sách sản phẩm */}
      <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
        {items.map((item) => (
          <div
            key={`${item.id}-${item.size}-${item.color}`}
            className="flex gap-3"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-lg border"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 line-clamp-2">
                {item.name}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {item.size} / {item.color} × {item.quantity}
              </p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Tổng tiền */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tạm tính</span>
          <span className="font-medium text-gray-900">
            {formatPrice(subtotal)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Phí vận chuyển</span>
          <span className="font-medium text-gray-900">
            {formatPrice(shippingFee)}
          </span>
        </div>
        <div className="flex justify-between text-base font-bold pt-2 border-t">
          <span className="text-gray-900">Tổng cộng</span>
          <span className="text-blue-600 text-lg">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
