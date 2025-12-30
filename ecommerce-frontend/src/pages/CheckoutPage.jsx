import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import useCart from "@/contexts/useCart";
import Navbar from "@/components/Shared/Navbar";
import Footer from "@/components/Shared/Footer";
import CheckoutBreadcrumb from "@/components/Checkout/CheckoutBreadcrumb";
import ShippingForm from "@/components/Checkout/ShippingForm";
import PaymentMethod from "@/components/Checkout/PaymentMethod";
import OrderSummary from "@/components/Checkout/OrderSummary";
import { validateCheckoutForm } from "@/utils/checkoutValidation";
import { orderService } from "@/services/orderService";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, clearCart, addToCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [isRestoringCart, setIsRestoringCart] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    district: "",
    notes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  // Khôi phục giỏ hàng và form data từ pendingOrderData
  useEffect(() => {
    const orderDataStr = localStorage.getItem("pendingOrderData");
    if (!orderDataStr) {
      console.log("✅ Không có pendingOrderData");
      return;
    }

    const restoreCart = async () => {
      try {
        const orderData = JSON.parse(orderDataStr);
        console.log("📦 pendingOrderData:", orderData);
        console.log("🛒 Cart hiện tại TRƯỚC khi restore:", cartItems);

        // Khôi phục form data
        if (orderData.formData) {
          setFormData(orderData.formData);
        }

        // Khôi phục giỏ hàng - CLEAR trước khi restore để tránh duplicate
        if (orderData.cartItems && orderData.cartItems.length > 0) {
          console.log(
            "🔄 Bắt đầu restore cart với",
            orderData.cartItems.length,
            "items"
          );
          setIsRestoringCart(true);

          // QUAN TRỌNG: Clear cart hiện tại trước
          console.log("🗑️ Clearing cart...");
          await clearCart();
          console.log("✅ Cart đã được clear");

          // Restore từng item với đúng format
          console.log("➕ Bắt đầu thêm items vào cart...");
          for (const item of orderData.cartItems) {
            console.log("Adding item:", item);
            const product = {
              id: item.productId || item.id,
              name: item.name,
              price: item.price,
              imageUrls: [item.image],
              totalQuantity: item.stock,
            };

            await addToCart(
              product,
              { size: item.size || "M", color: item.color || "mặc định" },
              item.quantity
            );
          }

          console.log("✅ Hoàn tất restore cart");
          setIsRestoringCart(false);
          // Xóa pendingOrderData sau khi đã khôi phục
          localStorage.removeItem("pendingOrderData");
        }
      } catch (error) {
        console.error("❌ Error loading pending order data:", error);
        setIsRestoringCart(false);
        localStorage.removeItem("pendingOrderData");
      }
    };

    restoreCart();
  }, []); // Chỉ chạy 1 lần khi component mount

  useEffect(() => {
    const hasPendingOrder = localStorage.getItem("pendingOrderId");
    // Không redirect nếu đang khôi phục giỏ hàng hoặc có pendingOrderData
    const hasPendingData = localStorage.getItem("pendingOrderData");

    if (
      cartItems.length === 0 &&
      !isProcessing &&
      !hasPendingOrder &&
      !hasPendingData &&
      !isRestoringCart
    ) {
      navigate("/cart", { replace: true });
    }
  }, [cartItems.length, isProcessing, isRestoringCart, navigate]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    const validationErrors = validateCheckoutForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      const firstError = document.querySelector(".border-red-500");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsProcessing(true);

    try {
      const shippingAddress = `${formData.address}, ${formData.district}, ${
        formData.city
      }${formData.notes ? ` - Ghi chú: ${formData.notes}` : ""}`;

      if (paymentMethod === "cod") {
        const order = await orderService.createCODOrder(shippingAddress);
        clearCart();
        navigate("/order-success", {
          state: {
            orderId: order.id,
            fromCheckout: true,
          },
        });
      } else if (paymentMethod === "vnpay") {
        const paymentResponse = await orderService.createVNPayOrder(
          shippingAddress
        );

        localStorage.setItem("pendingOrderId", paymentResponse.orderId);
        localStorage.setItem(
          "pendingOrderData",
          JSON.stringify({
            orderId: paymentResponse.orderId,
            shippingAddress: shippingAddress,
            formData: formData,
            cartItems: cartItems,
          })
        );

        // QUAN TRỌNG: Clear cart trước khi chuyển sang VNPay
        // để tránh duplicate khi quay lại
        clearCart();

        // Redirect sau khi clear cart
        setTimeout(() => {
          window.location.href = paymentResponse.paymentUrl;
        }, 100);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!";

      alert(errorMessage);
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Navbar />
      <CheckoutBreadcrumb />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isRestoringCart && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
              Đang khôi phục giỏ hàng của bạn...
            </div>
          )}

          <form onSubmit={handlePlaceOrder}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <ShippingForm
                  formData={formData}
                  errors={errors}
                  onChange={handleFormChange}
                />
                <PaymentMethod
                  selectedMethod={paymentMethod}
                  onChange={handlePaymentChange}
                />
              </div>

              <div className="lg:col-span-1">
                <OrderSummary items={cartItems} />

                <button
                  type="submit"
                  disabled={isProcessing || isRestoringCart}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      <span>Đặt hàng</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}
