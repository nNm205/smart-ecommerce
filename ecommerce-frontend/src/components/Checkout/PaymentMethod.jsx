import { CreditCard, Banknote, Wallet } from "lucide-react";

export default function PaymentMethod({ selectedMethod, onChange }) {
  const paymentMethods = [
    {
      id: "cod",
      name: "Thanh toán khi nhận hàng (COD)",
      description: "Thanh toán bằng tiền mặt khi nhận hàng",
      icon: Banknote,
    },
    {
      id: "bank_transfer",
      name: "Chuyển khoản ngân hàng",
      description: "Chuyển khoản qua ngân hàng hoặc ví điện tử",
      icon: CreditCard,
    },
    {
      id: "momo",
      name: "Ví MoMo",
      description: "Thanh toán qua ví điện tử MoMo",
      icon: Wallet,
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

      {selectedMethod === "bank_transfer" && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-gray-900 mb-2">
            Thông tin chuyển khoản:
          </p>
          <div className="text-sm text-gray-700 space-y-1">
            <p>
              Ngân hàng: <strong>Vietcombank</strong>
            </p>
            <p>
              Số tài khoản: <strong>1234567890</strong>
            </p>
            <p>
              Chủ tài khoản: <strong>NGUYEN VAN A</strong>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Nội dung: Họ tên + Số điện thoại
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
