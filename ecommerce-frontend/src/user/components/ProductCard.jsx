import { ShoppingCart, Eye, Heart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

function ProductCard({ product, onAddToCart, onViewProduct }) {
  // Ảnh hiện tại
  const [currentImage, setCurrentImage] = useState(0);

  // Trạng thái yêu thích
  const [isLiked, setIsLiked] = useState(false);

  return (
    <Link to={`/product/${product.id}`}>
      <div className="group relative border-4 border-white rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-transform duration-200 hover:-translate-y-1 w-72">
        {/* Khung ảnh sản phẩm */}
        <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden p-2">
          {/* Ảnh sản phẩm */}
          <img
            src={product.images[currentImage]}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-300"
          />

          {/* Badge hàng mới */}
          {product.isNew && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-sm">
              NEW
            </div>
          )}

          {/* Nút yêu thích sản phẩm */}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-1 hover:bg-white transition"
          >
            <Heart
              size={18}
              className={`${
                isLiked ? "text-red-500 fill-red-500" : "text-gray-600"
              } transition`}
            />
          </button>

          {/* Nút mua hàng và nút xem sản phẩm */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/85 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md flex items-center gap-3 opacity-0 group-hover:opacity-100 transition duration-300">
            <button
              onClick={() => onAddToCart?.(product)}
              className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition"
            >
              <ShoppingCart size={18} />
            </button>

            <button
              onClick={() => onViewProduct?.(product)}
              className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition"
            >
              <Eye size={18} />
            </button>
          </div>
        </div>

        {/* Nội dung */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            {/* Giá */}
            <div className="text-lg font-bold text-gray-900">
              {product.price.toLocaleString("vi-VN")}₫
            </div>

            {/* Đánh giá */}
            <div className="text-yellow-500 text-sm flex items-center">
              ★ {product.rating}
            </div>
          </div>

          {/* Thumbnail nhỏ */}
          <div className="flex items-center gap-2 mt-3">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`w-8 h-8 rounded-full overflow-hidden border-2 transition ${
                  currentImage === index
                    ? "border-black"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt={`Ảnh ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
