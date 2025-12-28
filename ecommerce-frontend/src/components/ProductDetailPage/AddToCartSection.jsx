import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ShoppingCart, Loader2 } from "lucide-react";

function AddToCartSection({
  onAddToCart,
  onBuyNow,
  isLoading = false,
  disabled = false,
}) {
  const [quantity, setQuantity] = useState(1);

  const decreaseQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));
  const increaseQuantity = () => setQuantity((prev) => prev + 1);

  const handleAddToCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!disabled && !isLoading) {
      onAddToCart(quantity);
    }
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!disabled && !isLoading && onBuyNow) {
      onBuyNow(quantity);
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-6 w-full">
      {/* Hint khi chưa chọn size */}
      {disabled && !isLoading && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
          <p className="text-sm text-amber-700">
            Vui lòng chọn size trước khi thêm vào giỏ hàng
          </p>
        </div>
      )}

      {/* Hàng 1: chỉnh số lượng + thêm vào giỏ */}
      <div className="flex items-center gap-4">
        {/* Bộ chỉnh số lượng */}
        <div
          className={`flex items-center border rounded-lg
                     ${
                       disabled || isLoading
                         ? "border-gray-300 text-gray-400"
                         : "border-blue-950 text-blue-950"
                     }`}
          style={{ height: 48 }}
        >
          <button
            onClick={decreaseQuantity}
            disabled={quantity <= 1 || disabled || isLoading}
            className="px-3 py-2 text-lg 
                       font-semibold 
                       hover:bg-gray-100 
                       transition-colors
                       disabled:opacity-50 
                       disabled:cursor-not-allowed
                       disabled:hover:bg-transparent"
          >
            -
          </button>
          <div
            className="px-4 py-2 text-center 
                       min-w-[50px] select-none"
          >
            {quantity}
          </div>
          <button
            onClick={increaseQuantity}
            disabled={disabled || isLoading}
            className="px-3 py-2 text-lg 
                       font-semibold 
                       hover:bg-gray-100 
                       transition-colors
                       disabled:opacity-50 
                       disabled:cursor-not-allowed
                       disabled:hover:bg-transparent"
          >
            +
          </button>
        </div>

        {/* Nút thêm vào giỏ */}
        <Button
          onClick={handleAddToCartClick}
          disabled={disabled || isLoading}
          className="flex-1 border-2 border-blue-950
                     text-blue-950 bg-white 
                     hover:bg-blue-950 hover:text-white 
                     transition-colors duration-300
                     cursor-pointer
                     disabled:opacity-50 
                     disabled:cursor-not-allowed
                     disabled:hover:bg-white
                     disabled:hover:text-blue-950
                     flex items-center justify-center gap-2"
          style={{ height: 48 }}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Đang thêm...</span>
            </>
          ) : (
            <>
              <ShoppingCart size={18} />
              <span>Thêm vào giỏ</span>
            </>
          )}
        </Button>
      </div>

      {/* Hàng 2: Nút mua ngay */}
      <Button
        onClick={handleBuyNow}
        disabled={disabled || isLoading}
        className="w-full bg-blue-950 
                   hover:bg-blue-900 
                   text-white transition-colors 
                   duration-300
                   cursor-pointer
                   disabled:opacity-50 
                   disabled:cursor-not-allowed
                   disabled:hover:bg-blue-950
                   flex items-center justify-center gap-2"
        style={{ height: 48 }}
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Đang xử lý...</span>
          </>
        ) : (
          <span>Mua ngay</span>
        )}
      </Button>
    </div>
  );
}

export default AddToCartSection;
