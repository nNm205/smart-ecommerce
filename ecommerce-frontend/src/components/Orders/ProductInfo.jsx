import { formatVnd } from "@/utils/orderUtils";

export default function ProductInfo({ product, total }) {
  return (
    <div>
      <div className="font-medium text-xl line-clamp-2">{product.name}</div>

      <div className="text-lg text-gray-600 mt-2 flex items-center justify-between">
        <div>
          Số lượng: <span className="font-medium">{product.qty}</span>
        </div>
        <div className="text-right">{formatVnd(product.unitPrice)}</div>
      </div>

      <div className="mt-3 text-gray-700 text-lg text-right">
        Tổng: <span className="font-semibold">{formatVnd(total)}</span>
      </div>
    </div>
  );
}
