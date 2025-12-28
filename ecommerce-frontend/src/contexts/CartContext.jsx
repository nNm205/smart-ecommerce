import { createContext, useEffect, useState } from "react";
import { cartService } from "@/services/cartService";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Kiểm tra user đã đăng nhập chưa
  const isAuthenticated = () => {
    return !!localStorage.getItem("accessToken");
  };

  // Chuyển đổi data từ backend sang format của frontend
  const transformCartData = (backendCart) => {
    if (!backendCart || !backendCart.items) return [];

    return backendCart.items.map((item) => ({
      cartItemId: item.id,
      id: item.productId,
      productId: item.productId,
      variantId: item.variantId,
      name: item.productName,
      price: item.productPrice,
      image: item.productImage,
      size: item.size,
      color: "mặc định",
      quantity: item.quantity,
      stock: item.availableQuantity,
      subtotal: item.subtotal,
    }));
  };

  // Load giỏ hàng
  useEffect(() => {
    if (isAuthenticated()) {
      fetchCart();
    } else {
      // Nếu chưa đăng nhập thì load từ localStorage
      const savedCart = localStorage.getItem("cart");
      setCartItems(savedCart ? JSON.parse(savedCart) : []);
      setIsLoading(false);
    }
  }, []);

  // Nếu chưa đăng nhập thì lưu vào localStorage
  useEffect(() => {
    if (!isAuthenticated()) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // Fetch giỏ hàng từ backend
  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const data = await cartService.getCart();
      const transformedItems = transformCartData(data);
      setCartItems(transformedItems);
      setError(null);
    } catch (error) {
      console.error("Lỗi khi tải giỏ hàng:", error);
      setError("Không thể tải giỏ hàng");

      // Nếu lỗi thì load từ localStorage
      const savedCart = localStorage.getItem("cart");
      setCartItems(savedCart ? JSON.parse(savedCart) : []);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product, { size, color }, quantity = 1) => {
    try {
      if (isAuthenticated()) {
        const response = await cartService.addToCart(
          product.id,
          size,
          quantity
        );

        const transformedItems = transformCartData(response);
        setCartItems(transformedItems);
        setError(null);

        return { success: true, message: "Đã thêm vào giỏ hàng" };
      } else {
        setCartItems((prev) => {
          const existingIndex = prev.findIndex(
            (item) =>
              item.id === product.id &&
              item.size === size &&
              item.color === color
          );

          if (existingIndex !== -1) {
            const newItems = [...prev];
            const newQuantity = newItems[existingIndex].quantity + quantity;
            const availableStock = newItems[existingIndex].stock || 9999;

            if (newQuantity > availableStock) {
              throw new Error(`Chỉ còn ${availableStock} sản phẩm`);
            }

            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity: newQuantity,
            };
            return newItems;
          }

          const productImage =
            product.imageUrls?.[0] || "https://via.placeholder.com/80";
          const productStock = product.totalQuantity ?? product.stock ?? 9999;

          return [
            ...prev,
            {
              id: product.id,
              productId: product.id,
              name: product.name,
              price: product.price,
              image: productImage,
              size,
              color: "mặc định",
              quantity,
              stock: productStock,
            },
          ];
        });

        return { success: true, message: "Đã thêm vào giỏ hàng" };
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);

      let errorMessage = "Có lỗi xảy ra";
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const removeFromCart = async (id, size, color) => {
    try {
      if (isAuthenticated()) {
        // Tìm itemId từ backend
        const item = cartItems.find(
          (item) => item.id === id && item.size === size && item.color === color
        );

        if (item && item.cartItemId) {
          await cartService.removeCartItem(item.cartItemId);
        }

        // Cập nhật state
        setCartItems((prev) =>
          prev.filter((it) => it.cartItemId !== item.cartItemId)
        );
        setError(null);

        await fetchCart();
      } else {
        // Chưa đăng nhập
        setCartItems((prev) =>
          prev.filter(
            (item) =>
              !(item.id === id && item.size === size && item.color === color)
          )
        );
      }
    } catch (err) {
      console.error("Lỗi khi xóa sản phẩm:", err);
      setError("Không thể xóa sản phẩm");
    }
  };

  const updateQuantity = async (id, size, color, quantity) => {
    try {
      if (isAuthenticated()) {
        const item = cartItems.find(
          (item) => item.id === id && item.size === size && item.color === color
        );

        if (item && item.cartItemId) {
          const validQuantity = Math.max(1, Math.min(quantity, item.stock));
          await cartService.updateCartItem(item.cartItemId, validQuantity);

          await fetchCart();
          setError(null);
        }
      } else {
        // Chưa đăng nhập
        setCartItems((prev) =>
          prev.map((item) => {
            if (item.id === id && item.size === size && item.color === color) {
              const q = Math.max(1, Math.min(quantity, item.stock));
              return { ...item, quantity: q };
            }
            return item;
          })
        );
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật số lượng:", err);
      setError("Không thể cập nhật số lượng");
    }
  };

  const clearCart = async () => {
    try {
      if (isAuthenticated()) {
        await cartService.clearCart();
      }
      setCartItems([]);
      localStorage.removeItem("cart");
      setError(null);
    } catch (err) {
      console.error("Lỗi khi xóa giỏ hàng:", err);
      setError("Không thể xóa giỏ hàng");
    }
  };

  // Đồng bộ giỏ hàng từ localStorage lên backend khi đăng nhập
  const syncCartAfterLogin = async () => {
    try {
      const localCart = localStorage.getItem("cart");
      if (localCart) {
        const items = JSON.parse(localCart);

        // Gửi từng item lên backend
        for (const item of items) {
          try {
            await cartService.addToCart(item.id, item.size, item.quantity);
          } catch (error) {
            console.error("Lỗi khi đồng bộ item:", item, error);
          }
        }

        // Xóa localCart ở localStorage sau khi đồng bộ
        localStorage.removeItem("cart");
      }

      // Load lại giỏ hàng từ backend
      await fetchCart();
    } catch (error) {
      console.error("Lỗi khi đồng bộ giỏ hàng:", error);
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isLoading,
        error,
        syncCartAfterLogin,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
