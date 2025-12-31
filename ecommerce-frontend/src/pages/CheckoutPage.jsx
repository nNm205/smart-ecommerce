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
import useAuth from "@/contexts/useAuth";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const { auth } = useAuth();

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

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      fullName: auth.fullName,
      email: auth.email,
    }));
  }, [auth.fullName, auth.email]);

  useEffect(() => {
    const hasPendingOrder = localStorage.getItem("pendingOrderId");

    if (cartItems.length === 0 && !isProcessing && !hasPendingOrder) {
      navigate("/cart", { replace: true });
    }
  }, [cartItems.length, isProcessing, navigate]);

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
        const cartSnapshot = cartItems.map((item) => ({
          productId: item.productId || item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          size: item.size,
          quantity: item.quantity,
          stock: item.stock,
        }));

        const paymentResponse = await orderService.createVNPayOrder(
          shippingAddress
        );

        localStorage.setItem("pendingOrderId", paymentResponse.orderId);
        localStorage.setItem("vnpayCartSnapshot", JSON.stringify(cartSnapshot));
        localStorage.setItem("vnpayFormData", JSON.stringify(formData));

        window.location.href = paymentResponse.paymentUrl;
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
                  disabled={isProcessing}
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
