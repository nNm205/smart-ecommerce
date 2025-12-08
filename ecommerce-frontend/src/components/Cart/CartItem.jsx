import { Trash2 } from "lucide-react";
import QuantityControl from "@/components/Cart/QuantityControl";
import { formatPrice } from "@/utils/formatters";

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="px-4 sm:px-6 py-5 flex flex-col md:grid md:grid-cols-5 gap-4 md:gap-6 items-center">
      {/* Product Info */}
      <div className="flex items-center gap-4 col-span-2 w-full">
        <div className="flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg border border-gray-200 shadow-sm"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-800 line-clamp-2 mb-2">
            {item.name}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            Size: <span className="font-medium text-gray-700">{item.size}</span>{" "}
            | Màu:{" "}
            <span className="font-medium text-gray-700">{item.color}</span>
          </p>
          <button
            onClick={() => onRemove(item.id, item.size, item.color)}
            className="text-xs text-red-500 hover:text-red-700 hover:underline flex items-center gap-1 transition-colors"
          >
            <Trash2 size={13} />
            Xóa
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="w-full text-left md:text-center">
        <p className="text-sm text-gray-500 md:hidden mb-1">Đơn giá</p>
        <p className="font-semibold text-gray-800">{formatPrice(item.price)}</p>
      </div>

      {/* Quantity */}
      <div className="w-full flex justify-start md:justify-center">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-0">
          <p className="text-sm text-gray-500 md:hidden">Số lượng</p>
          <QuantityControl
            quantity={item.quantity}
            stock={item.stock}
            onDecrease={() =>
              onUpdateQuantity(
                item.id,
                item.size,
                item.color,
                item.quantity - 1
              )
            }
            onIncrease={() =>
              onUpdateQuantity(
                item.id,
                item.size,
                item.color,
                item.quantity + 1
              )
            }
            onChange={(e) =>
              onUpdateQuantity(
                item.id,
                item.size,
                item.color,
                Number(e.target.value)
              )
            }
          />
        </div>
      </div>

      {/* Total */}
      <div className="w-full text-left md:text-center">
        <p className="text-sm text-gray-500 md:hidden mb-1">Tổng</p>
        <p className="font-bold text-blue-950 text-lg">
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>
    </div>
  );
}
