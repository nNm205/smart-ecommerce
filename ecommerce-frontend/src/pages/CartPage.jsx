import { Link } from "react-router-dom";
import { useCart } from "@/contexts/useCart";
import { ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="w-full flex flex-col items-center mt-24 px-4">
        <h1 className="text-2xl font-semibold mb-4">Giỏ hàng của bạn</h1>
        <p className="text-gray-500 mb-6">Hiện chưa có sản phẩm nào.</p>
        <Link
          to="/"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="bg-gray-100 h-[50px] flex items-center px-6 lg:px-16 border-b border-gray-200">
        <Link
          to="/"
          className="hover:text-blue-700 transition-colors duration-200"
        >
          Trang chủ
        </Link>
        <ChevronRight size={14} />
        <Link
          to="#"
          className="hover:text-blue-700 transition-colors duration-200"
        >
          Danh mục
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-800 font-medium">Giỏ hàng</span>
      </div>

      <div className="w-full flex justify-center mt-5 px-3 sm:px-4 md:px-8 lg:px-12">
        <div className="w-full max-w-[1200px] lg:max-w-[1400px] xl:max-w-[1700px]">
          <h1 className="text-2xl md:text-3xl font-semibold mb-6">
            Giỏ hàng ({totalItems} sản phẩm)
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="hidden md:grid grid-cols-5 gap-4 px-4 py-3 border-b text-sm font-semibold text-gray-500">
                <div className="col-span-2">Sản phẩm</div>
                <div>Giá</div>
                <div>Số lượng</div>
                <div>Tổng</div>
              </div>

              <div className="divide-y">
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.size}-${item.color}`}
                    className="px-3 sm:px-4 py-4 flex flex-col md:grid md:grid-cols-5 gap-4 items-center"
                  >
                    <div className="flex items-center gap-3 col-span-2 w-full">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 line-clamp-2">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Size: <span className="font-medium">{item.size}</span>{" "}
                          | Màu:{" "}
                          <span className="font-medium">{item.color}</span>
                        </p>
                        <button
                          onClick={() =>
                            removeFromCart(item.id, item.size, item.color)
                          }
                          className="mt-1 text-xs text-red-500 hover:underline"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>

                    {/* Giá */}
                    <div className="w-full text-left md:text-center text-sm">
                      <p className="font-semibold text-gray-800">
                        {item.price.toLocaleString()}₫
                      </p>
                    </div>

                    {/* Số lượng */}
                    <div className="w-full flex md:justify-center">
                      <div className="inline-flex items-center border rounded-lg">
                        <button
                          className="px-3 py-1 text-lg"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.size,
                              item.color,
                              item.quantity - 1
                            )
                          }
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={1}
                          max={item.stock}
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(
                              item.id,
                              item.size,
                              item.color,
                              Number(e.target.value)
                            )
                          }
                          className="w-12 text-center border-x outline-none text-sm"
                        />
                        <button
                          className="px-3 py-1 text-lg"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.size,
                              item.color,
                              item.quantity + 1
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Tổng */}
                    <div className="w-full text-left md:text-center">
                      <p className="font-semibold text-blue-950">
                        {(item.price * item.quantity).toLocaleString()}₫
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center px-4 py-3 border-t">
                <button
                  onClick={clearCart}
                  className="text-sm text-red-500 hover:underline"
                >
                  Xóa toàn bộ giỏ hàng
                </button>
                <p className="text-sm text-gray-500">
                  Tổng số lượng:{" "}
                  <span className="font-semibold">{totalItems}</span>
                </p>
              </div>
            </div>

            {/* Tổng kết đơn hàng */}
            <div className="bg-white rounded-xl shadow-sm border p-4 lg:p-5 h-fit">
              <h2 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h2>
              <div className="flex justify-between mb-2 text-sm">
                <span>Tạm tính</span>
                <span>{totalPrice.toLocaleString()}₫</span>
              </div>
              <div className="flex justify-between mb-2 text-sm">
                <span>Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>
              <div className="border-t my-3" />
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Tổng cộng</span>
                <span className="text-xl font-bold text-blue-900">
                  {totalPrice.toLocaleString()}₫
                </span>
              </div>
              <button
                className="w-full py-2.5 
                                  bg-blue-600 
                                  text-white 
                                  rounded-lg 
                                  hover:bg-blue-700 
                                  font-semibold
                                  cursor-pointer"
              >
                Tiến hành đặt hàng
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default CartPage;
