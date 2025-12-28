import { formatPrice } from "@/utils/productUtils";

function ProductInfo({ name, price, rating, reviewCount, stock }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="text-2xl font-semibold">{name}</h1>
        <div
          className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
            stock > 0 ? "bg-green-600" : "bg-red-500"
          }`}
        >
          {stock > 0 ? `Còn ${stock} sản phẩm` : "Hết hàng"}
        </div>
      </div>

      <p className="text-xl font-bold text-blue-950">{formatPrice(price)}</p>

      <div className="flex items-center gap-2">
        <div className="flex items-center text-yellow-500">
          {[...Array(5)].map((_, index) => (
            <span key={index}>{index < Math.round(rating) ? "⭐" : "☆"}</span>
          ))}
        </div>
        <span className="text-gray-500">
          ({rating ? rating.toFixed(1) : "0.0"} / 5)
        </span>
        {reviewCount > 0 && (
          <span className="text-gray-400 text-sm">
            • {reviewCount} đánh giá
          </span>
        )}
      </div>
    </div>
  );
}

export default ProductInfo;
