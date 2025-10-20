import { Button } from "@/components/ui/button";
import { useState } from "react";

function AddToCartSection({ onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  function decreaseQuantity() {
    setQuantity((prev) => Math.max(1, prev - 1));
  }

  function increaseQuantity() {
    setQuantity((prev) => prev + 1);
  }

  function handleAddToCartClick() {
    onAddToCart(quantity);
  }

  return (
    <div className="flex flex-col gap-4 mt-6 w-full">
      {/* Hàng 1: chỉnh số lượng + thêm vào giỏ */}
      <div className="flex items-center gap-4">
        {/* Bộ chỉnh số lượng */}
        <div
          className="flex items-center border
                        text-blue-950 
                        border-blue-950 
                        rounded-lg"
          style={{ height: 48 }}
        >
          <button
            onClick={decreaseQuantity}
            className="px-3 py-2 text-lg 
                       font-semibold 
                       hover:bg-gray-100 
                       transition-colors"
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
            className="px-3 py-2 text-lg 
                       font-semibold 
                       hover:bg-gray-100 
                       transition-colors"
          >
            +
          </button>
        </div>

        {/* Nút thêm vào giỏ */}
        <Button
          onClick={handleAddToCartClick}
          className="flex-1 border-2 border-blue-950
                     text-blue-950 bg-white 
                     hover:bg-blue-950 hover:text-white 
                     transition-colors duration-300
                     cursor-pointer"
          style={{ height: 48 }}
        >
          Thêm vào giỏ
        </Button>
      </div>

      {/* Hàng 2: Nút mua ngay */}
      <div
        className="flex items-center border
                        text-blue-950 
                        border-blue-950 
                        rounded-lg"
        style={{ height: 48 }}
      >
        <Button
          className="flex-1 bg-blue-950 
                         hover:bg-blue-900 
                         text-white transition-colors 
                         duration-300
                         cursor-pointer"
          style={{ height: 48 }}
        >
          Mua ngay
        </Button>
      </div>
    </div>
  );
}

export default AddToCartSection;
