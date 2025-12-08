function ProductReviews({ reviews }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Đánh giá sản phẩm</h2>
      {reviews.length === 0 ? (
        <p>Chưa có đánh giá nào.</p>
      ) : (
        reviews.map((review, index) => (
          <div key={index} className="border-b py-3">
            <div className="font-medium">{review.user}</div>
            <div className="text-yellow-500">{"⭐".repeat(review.rating)}</div>
            <p>{review.comment}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default ProductReviews;
