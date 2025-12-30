import useCart from "@/contexts/useCart";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function VNPayReturnPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [status, setStatus] = useState("processing");
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processPayment = async () => {
      const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
      const vnp_TxnRef = searchParams.get("vnp_TxnRef");
      const vnp_TransactionNo = searchParams.get("vnp_TransactionNo");

      const pendingOrderId = localStorage.getItem("pendingOrderId");

      if (vnp_ResponseCode === "00") {
        setStatus("success");

        clearCart();
        localStorage.removeItem("pendingOrderId");
        localStorage.removeItem("pendingOrderData");

        setTimeout(() => {
          navigate("/order-success", {
            state: {
              orderId: pendingOrderId || vnp_TxnRef,
              transactionId: vnp_TransactionNo,
              fromCheckout: true,
              paymentMethod: "vnpay",
            },
            replace: true,
          });
        }, 2000);
      } else {
        setStatus("failed");
        localStorage.removeItem("pendingOrderId");

        setTimeout(() => {
          navigate("/checkout", { replace: true });
        }, 3000);
      }
    };

    processPayment();
  }, [searchParams, navigate, clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        {status === "processing" && (
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 size={48} className="text-blue-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Đang xử lý thanh toán...
            </h2>
            <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Thanh toán thành công!
            </h2>
            <p className="text-gray-600">
              Đang chuyển đến trang xác nhận đơn hàng...
            </p>
          </div>
        )}

        {status === "failed" && (
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle size={48} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Thanh toán thất bại!
            </h2>
            <p className="text-gray-600 mb-4">
              Giao dịch không thành công. Bạn sẽ được chuyển về trang thanh
              toán.
            </p>
            <button
              onClick={() => navigate("/checkout", { replace: true })}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Về trang thanh toán
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
