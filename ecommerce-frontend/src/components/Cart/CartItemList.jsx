import { Trash2 } from "lucide-react";
import CartTableHeader from "@/components/Cart/CartTableHeader";
import CartItem from "@/components/Cart/CartItem";

export default function CartItemsList({
  items,
  onUpdateQuantity,
  onRemove,
  onClearCart,
  totalItems,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <CartTableHeader />

      <div className="divide-y">
        {items.map((item) => (
          <CartItem
            key={`${item.id}-${item.size}-${item.color}`}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
          />
        ))}
      </div>

      <div className="flex justify-between items-center px-4 py-3 border-t">
        <button
          onClick={onClearCart}
          className="text-sm text-red-500 hover:underline flex items-center gap-1"
        >
          <Trash2 size={14} />
          Xóa toàn bộ giỏ hàng
        </button>
        <p className="text-sm text-gray-500">
          Tổng số lượng: <span className="font-semibold">{totalItems}</span>
        </p>
      </div>
    </div>
  );
}
