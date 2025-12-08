function ProductInfo({ name, price, rating, stock }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="text-2xl font-semibold">{name}</h1>
        <div
          className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
            stock > 0 ? "bg-green-600" : "bg-red-500"
          }`}
        >
          {stock > 0 ? "Còn hàng" : "Hết hàng"}
        </div>
      </div>

      <p className="text-xl font-bold text-blue-950">
        {price.toLocaleString()}₫
      </p>
      <div className="flex items-center gap-2 text-yellow-500">
        {"⭐".repeat(Math.round(rating))}
        <span className="text-gray-500">({rating} / 5)</span>
      </div>
    </div>
  );
}

export default ProductInfo;
