import useCart from "@/contexts/useCart";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function VNPayReturnPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart, addToCart } = useCart();
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
        console.log("✅ Thanh toán thành công");
        setStatus("success");

        await clearCart();
        localStorage.removeItem("pendingOrderId");
        localStorage.removeItem("vnpayCartSnapshot");
        localStorage.removeItem("vnpayFormData");

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

        try {
          const cartSnapshotStr = localStorage.getItem("vnpayCartSnapshot");

          if (cartSnapshotStr) {
            const cartSnapshot = JSON.parse(cartSnapshotStr);

            await clearCart();

            for (const item of cartSnapshot) {
              const product = {
                id: item.productId,
                name: item.name,
                price: item.price,
                imageUrls: [item.image],
                totalQuantity: item.stock,
              };

              await addToCart(
                product,
                { size: item.size, color: "mặc định" },
                item.quantity
              );
            }
          } else {
            console.warn("Không tìm thấy cart snapshot");
          }
        } catch (error) {
          console.error("Lỗi khi restore cart:", error);
        }

        localStorage.removeItem("pendingOrderId");
        localStorage.removeItem("vnpayCartSnapshot");
        localStorage.removeItem("vnpayFormData");

        setTimeout(() => {
          navigate("/cart", { replace: true });
        }, 3000);
      }
    };

    processPayment();
  }, [searchParams, navigate, clearCart, addToCart]);

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
              Giao dịch không thành công. Đang quay lại trang giỏ hàng...
            </p>
            <button
              onClick={() => navigate("/cart", { replace: true })}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Về giỏ hàng
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
