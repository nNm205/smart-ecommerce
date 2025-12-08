import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import useCart from "@/contexts/useCart";
import Navbar from "@/components/Shared/Navbar";
import Footer from "@/components/Shared/Footer";
import CheckoutBreadcrumb from "@/components/Checkout/CheckoutBreadcrumb";
import ShippingForm from "@/components/Checkout/ShippingForm";
import PaymentMethod from "@/components/Checkout/PaymentMethod";
import OrderSummary from "@/components/Checkout/OrderSummary";
import { validateCheckoutForm } from "@/utils/checkoutValidation";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

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

  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

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
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const order = {
        id: Date.now(),
        date: new Date().toISOString(),
        items: cartItems,
        shipping: formData,
        paymentMethod,
        status: "pending",
        total:
          cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) +
          30000,
      };

      clearCart();

      navigate("/order-success", { state: { order } });
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <>
      <Navbar />
      <CheckoutBreadcrumb />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handlePlaceOrder}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Forms */}
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

              {/* Right Column - Order Summary */}
              <div className="lg:col-span-1">
                <OrderSummary items={cartItems} />

                {/* Place Order Button */}
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
