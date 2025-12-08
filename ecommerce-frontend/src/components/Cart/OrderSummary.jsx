import { formatPrice } from "@/utils/formatters";

export default function OrderSummary({ totalPrice, onCheckout }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 lg:p-5 h-fit lg:sticky lg:top-4">
      <h2 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h2>

      <div className="space-y-2 text-sm mb-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Tạm tính</span>
          <span className="font-medium">{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Phí vận chuyển</span>
          <span className="font-medium text-green-600">Miễn phí</span>
        </div>
      </div>

      <div className="border-t pt-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-800">Tổng cộng</span>
          <span className="text-xl font-bold text-blue-900">
            {formatPrice(totalPrice)}
          </span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        className="w-full py-2.5 bg-blue-800 text-white rounded-lg font-semibold hover:bg-blue-900 transition-colors"
      >
        Tiến hành đặt hàng
      </button>

      <p className="text-xs text-gray-500 text-center mt-3">
        Bằng việc đặt hàng, bạn đồng ý với{" "}
        <a href="/terms" className="text-blue-600 hover:underline">
          Điều khoản dịch vụ
        </a>
      </p>
    </div>
  );
}
