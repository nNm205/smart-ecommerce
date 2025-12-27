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
      localStorage.setIem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // Fetch giỏ hàng từ backend
  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const data = await cartService.getCart();
      setCartItems(data.items || []);
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
        const cartItemData = {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || "https://via.placeholder.com/80",
          size,
          color,
          quantity,
          stock: product.stock ?? 9999,
        };

        const response = await cartService.addToCart(cartItemData);

        setCartItems(response.items || []);
        setError(null);

        return { success: true, message: "Đã thêm vào giỏ hàng" };
      } else {
        setCartItems((prev) => {
          const existingIndex = prev.findIndex(
            (item) =>
              item.id === product.id &&
              item.size === product.size &&
              item.color === product.color
          );

          if (existingIndex !== -1) {
            const newItems = [...prev];
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity: newItems[existingIndex].quantity + quantity,
            };
            return newItems;
          }

          return [
            ...prev,
            {
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.images?.[0] || "https://via.placeholder.com/80",
              size,
              color,
              quantity,
              stock: product.stock ?? 9999,
            },
          ];
        });

        return { success: true, message: "Đã thêm vào giỏ hàng" };
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      setError("Không thể thêm sản phẩm vào giỏ hàng");
      return { success: false, message: "Có lỗi xảy ra" };
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
          prev.filter(
            (item) =>
              !(item.id === id && item.size === size && item.color === color)
          )
        );
        setError(null);
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

          // Cập nhật state
          setCartItems((prev) =>
            prev.map((item) => {
              if (
                item.id === id &&
                item.size === size &&
                item.color === color
              ) {
                return { ...item, quantity: validQuantity };
              }
              return item;
            })
          );
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
          await cartService.addToCart({
            productId: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            stock: item.stock,
          });
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
