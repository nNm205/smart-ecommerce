import { useState } from "react";
import { Trash2, Edit2, X, Check, User } from "lucide-react";

function ProductReviews({
  rating,
  reviewCount,
  reviews = [],
  currentUserId = null,
  isAuthenticated = false,
  onAddReview,
  onUpdateReview,
  onDeleteReview,
  isLoadingAction = false,
}) {
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [editReview, setEditReview] = useState({ rating: 5, comment: "" });

  // Kiểm tra xem user đã review chưa
  const userHasReviewed = reviews.some((r) => r.userId === currentUserId);

  const handleStartAddReview = () => {
    setIsAddingReview(true);
    setNewReview({ rating: 5, comment: "" });
  };

  const handleCancelAddReview = () => {
    setIsAddingReview(false);
    setNewReview({ rating: 5, comment: "" });
  };

  const handleSubmitNewReview = async () => {
    if (!newReview.comment.trim()) {
      alert("Vui lòng nhập nội dung đánh giá");
      return;
    }

    const success = await onAddReview(newReview);

    // Chỉ đóng form nếu submit thành công
    if (success) {
      setIsAddingReview(false);
      setNewReview({ rating: 5, comment: "" });
    }
  };

  const handleStartEdit = (review) => {
    setEditingReviewId(review.id);
    setEditReview({
      rating: review.rating,
      comment: review.comment,
    });
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditReview({ rating: 5, comment: "" });
  };

  const handleSubmitEdit = async (reviewId) => {
    if (!editReview.comment.trim()) {
      alert("Vui lòng nhập nội dung đánh giá");
      return;
    }

    const success = await onUpdateReview(reviewId, editReview);

    // Chỉ đóng form nếu update thành công
    if (success) {
      setEditingReviewId(null);
      setEditReview({ rating: 5, comment: "" });
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) {
      await onDeleteReview(reviewId);
    }
  };

  const StarRating = ({
    rating,
    onChange,
    readonly = false,
    size = "text-lg",
  }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readonly && onChange(star)}
            disabled={readonly}
            className={`${size} transition-transform transition-colors ${
              readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
            }`}
          >
            {star <= rating ? (
              <span className="text-yellow-500">⭐</span>
            ) : (
              <span className="text-gray-300">☆</span>
            )}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Đánh giá sản phẩm</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center text-yellow-500">
            {[...Array(5)].map((_, index) => (
              <span key={index} className="text-xl">
                {index < Math.round(rating) ? "⭐" : "☆"}
              </span>
            ))}
          </div>
          <span className="text-gray-700 font-semibold text-lg">
            {rating ? rating.toFixed(1) : "0.0"}/5
          </span>
          <span className="text-gray-500">({reviewCount} đánh giá)</span>
        </div>
      </div>

      {/* Nút thêm đánh giá */}
      {isAuthenticated &&
        currentUserId &&
        !userHasReviewed &&
        !isAddingReview && (
          <div className="mb-6">
            <button
              onClick={handleStartAddReview}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
              transition-colors font-medium shadow-sm hover:shadow-md"
            >
              Viết đánh giá
            </button>
          </div>
        )}

      {/* Form thêm đánh giá mới */}
      {isAddingReview && (
        <div className="mb-6 p-6 border-2 border-blue-200 rounded-lg bg-blue-50">
          <h3 className="font-semibold text-lg mb-4">Đánh giá của bạn</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn số sao
            </label>
            <StarRating
              rating={newReview.rating}
              onChange={(rating) => setNewReview({ ...newReview, rating })}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nhận xét của bạn
            </label>
            <textarea
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                resize-none h-32"
              disabled={isLoadingAction}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSubmitNewReview}
              disabled={isLoadingAction}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg 
                hover:bg-blue-700 transition-colors font-medium
                disabled:bg-gray-400 disabled:cursor-not-allowed
                flex items-center gap-2"
            >
              <Check size={18} />
              {isLoadingAction ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
            <button
              onClick={handleCancelAddReview}
              disabled={isLoadingAction}
              className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg 
                hover:bg-gray-300 transition-colors font-medium
                disabled:cursor-not-allowed flex items-center gap-2"
            >
              <X size={18} />
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Danh sách đánh giá */}
      {reviews.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg font-medium">
            Chưa có đánh giá nào cho sản phẩm này.
          </p>
          <p className="text-gray-400 mt-2">
            Hãy là người đầu tiên đánh giá sản phẩm!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => {
            const isEditing = editingReviewId === review.id;
            const isOwnReview = review.userId === currentUserId;

            return (
              <div
                key={review.id}
                className={`border rounded-lg p-5 transition-all ${
                  isOwnReview
                    ? "bg-blue-50 border-blue-200"
                    : "bg-white border-gray-200"
                }`}
              >
                {isEditing ? (
                  // Form chỉnh sửa
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chọn số sao
                      </label>
                      <StarRating
                        size="text-xs"
                        rating={editReview.rating}
                        onChange={(rating) =>
                          setEditReview({ ...editReview, rating })
                        }
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nhận xét
                      </label>
                      <textarea
                        value={editReview.comment}
                        onChange={(e) =>
                          setEditReview({
                            ...editReview,
                            comment: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                          focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                          resize-none h-32"
                        disabled={isLoadingAction}
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleSubmitEdit(review.id)}
                        disabled={isLoadingAction}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg 
                          hover:bg-blue-700 transition-colors text-sm font-medium
                          disabled:bg-gray-400 flex items-center gap-2"
                      >
                        <Check size={16} />
                        {isLoadingAction ? "Đang lưu..." : "Lưu"}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={isLoadingAction}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg 
                          hover:bg-gray-300 transition-colors text-sm font-medium
                          flex items-center gap-2"
                      >
                        <X size={16} />
                        Hủy
                      </button>
                    </div>
                  </div>
                ) : (
                  // Hiển thị đánh giá
                  <div className="flex gap-4">
                    {/* CỘT TRÁI - ICON USER */}
                    <div className="flex-shrink-0">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center
      bg-blue-100 text-blue-600"
                      >
                        <User size={24} />
                      </div>
                    </div>

                    {/* CỘT PHẢI - NỘI DUNG REVIEW */}
                    <div className="flex-1 space-y-1">
                      {/* HÀNG 1 - TÊN USER */}
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800 text-lg">
                          {review.userName || "Người dùng"}
                        </span>

                        {isOwnReview && (
                          <span
                            className="px-2 py-0.5 bg-blue-600 text-white text-xs 
          rounded-full font-medium"
                          >
                            Bạn
                          </span>
                        )}
                      </div>

                      {/* HÀNG 2 - RATING */}
                      <div className="text-yellow-500">
                        <StarRating rating={review.rating} readonly />
                      </div>

                      {/* HÀNG 3 - THỜI GIAN */}
                      {review.createdAt && (
                        <div className="text-sm text-gray-400">
                          {(() => {
                            const date = new Date(review.createdAt);
                            const day = String(date.getDate()).padStart(2, "0");
                            const month = String(date.getMonth() + 1).padStart(
                              2,
                              "0"
                            );
                            const year = date.getFullYear();
                            const hours = String(date.getHours()).padStart(
                              2,
                              "0"
                            );
                            const minutes = String(date.getMinutes()).padStart(
                              2,
                              "0"
                            );
                            return `${day}-${month}-${year}  ${hours}:${minutes}`;
                          })()}
                        </div>
                      )}

                      {/* HÀNG 4 - NỘI DUNG REVIEW */}
                      <p className="text-gray-700 leading-relaxed pt-1">
                        {review.comment}
                      </p>
                    </div>

                    {/* ACTION BUTTONS (EDIT / DELETE) */}
                    {isOwnReview && (
                      <div className="flex gap-2 self-start">
                        <button
                          onClick={() => handleStartEdit(review)}
                          disabled={isLoadingAction}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg 
        transition-colors disabled:opacity-50"
                          title="Chỉnh sửa"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(review.id)}
                          disabled={isLoadingAction}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg 
        transition-colors disabled:opacity-50"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Thông báo khi user chưa đăng nhập */}
      {!isAuthenticated && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-center">
            Vui lòng <span className="font-semibold">đăng nhập</span> để viết
            đánh giá
          </p>
        </div>
      )}
    </div>
  );
}

export default ProductReviews;
