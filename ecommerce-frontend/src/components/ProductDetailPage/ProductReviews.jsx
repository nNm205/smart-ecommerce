function ProductReviews({ rating, reviewCount, reviews = [] }) {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Đánh giá sản phẩm</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center text-yellow-500">
            {[...Array(5)].map((_, index) => (
              <span key={index} className="text-lg">
                {index < Math.round(rating) ? "⭐" : "☆"}
              </span>
            ))}
          </div>
          <span className="text-gray-600 font-medium">
            {rating ? rating.toFixed(1) : "0.0"}/5
          </span>
          <span className="text-gray-400">({reviewCount} đánh giá)</span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500">
            Chưa có đánh giá nào cho sản phẩm này.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Hãy là người đầu tiên đánh giá sản phẩm!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div key={index} className="border-b pb-4 last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-gray-800">{review.user}</div>
                <div className="text-yellow-500">
                  {"⭐".repeat(review.rating)}
                </div>
              </div>
              <p className="text-gray-600">{review.comment}</p>
              {review.createdAt && (
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductReviews;
