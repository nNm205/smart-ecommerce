import useCart from "@/contexts/useCart";
import Navbar from "@/components/Shared/Navbar";
import Footer from "@/components/Shared/Footer";
import CartItemsList from "@/components/Cart/CartItemList";
import EmptyCart from "@/components/Cart/EmptyCart";
import Breadcrumb from "@/components/Cart/Breadcrumb";
import OrderSummary from "@/components/Cart/OrderSummary";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50">
        <Breadcrumb />

        <div className="w-full flex justify-center mt-5 px-3 sm:px-4 md:px-8 lg:px-12 pb-12">
          <div className="w-full max-w-[1200px] lg:max-w-[1400px] xl:max-w-[1700px]">
            <h1 className="text-2xl md:text-3xl font-semibold mb-6">
              Giỏ hàng ({totalItems} sản phẩm)
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
              <CartItemsList
                items={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
                onClearCart={clearCart}
                totalItems={totalItems}
              />

              <OrderSummary
                totalPrice={totalPrice}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
