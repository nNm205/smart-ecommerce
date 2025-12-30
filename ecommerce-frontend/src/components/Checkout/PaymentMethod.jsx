import { CreditCard, Banknote } from "lucide-react";

export default function PaymentMethod({ selectedMethod, onChange }) {
  const paymentMethods = [
    {
      id: "cod",
      name: "Thanh toán khi nhận hàng (COD)",
      description: "Thanh toán bằng tiền mặt khi nhận hàng",
      icon: Banknote,
    },
    {
      id: "vnpay",
      name: "Thanh toán VNPay",
      description:
        "Thanh toán qua cổng thanh toán VNPay (ATM, Visa, MasterCard)",
      icon: CreditCard,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Phương thức thanh toán
      </h2>
      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          return (
            <label
              key={method.id}
              className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedMethod === method.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={onChange}
                className="mt-1 w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={20} className="text-gray-600" />
                  <span className="font-medium text-gray-900">
                    {method.name}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{method.description}</p>
              </div>
            </label>
          );
        })}
      </div>

      {selectedMethod === "vnpay" && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-gray-900 mb-2">
            💳 Lưu ý thanh toán VNPay:
          </p>
          <ul className="text-sm text-gray-700 space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Bạn sẽ được chuyển hướng đến trang thanh toán VNPay</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                Hỗ trợ: Thẻ ATM nội địa, Visa, MasterCard, JCB, ví điện tử
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Giao dịch được mã hóa bảo mật SSL 256-bit</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Đơn hàng sẽ được tạo sau khi thanh toán thành công</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
