import {
  X,
  User,
  Package,
  Calendar,
  MessageSquare,
  Trash2,
  Star as StarIcon,
} from "lucide-react";
import { formatDate } from "../../utils/reviewUtils";
import StarRating from "../Reviews/StarRating";

const ReviewDetailModal = ({ review, onClose, onDelete }) => {
  if (!review) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl transform transition-all animate-scaleIn max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <MessageSquare size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Chi tiết đánh giá</h3>
                <p className="text-blue-100 text-sm mt-1">
                  Review #{review.id}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Rating Section */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-5 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Đánh giá
                </p>
                <div className="flex items-center gap-3">
                  <StarRating rating={review.rating} />
                  <span className="text-2xl font-bold text-gray-900">
                    {review.rating}/5
                  </span>
                </div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <StarIcon className="text-white fill-white" size={32} />
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <User size={18} className="text-gray-600" />
              <h4 className="font-semibold text-gray-900">
                Thông tin người dùng
              </h4>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                {review.userName?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-lg">
                  {review.userName}
                </p>
                <p className="text-sm text-gray-600">
                  User ID: {review.userId}
                </p>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Package size={18} className="text-gray-600" />
              <h4 className="font-semibold text-gray-900">
                Sản phẩm được đánh giá
              </h4>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-gray-900 text-lg">
                {review.productName}
              </p>
              <p className="text-sm text-gray-600">
                Product ID: {review.productId}
              </p>
            </div>
          </div>

          {/* Review Content */}
          <div className="bg-white rounded-xl p-5 border-2 border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare size={18} className="text-blue-600" />
              <h4 className="font-semibold text-gray-900">Nội dung đánh giá</h4>
            </div>
            {review.comment ? (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {review.comment}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Độ dài: {review.comment.length} ký tự
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare
                  size={48}
                  className="mx-auto text-gray-300 mb-3"
                />
                <p className="text-gray-400 italic">
                  Không có nội dung bình luận
                </p>
              </div>
            )}
          </div>

          {/* Timestamp Info */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={18} className="text-gray-600" />
              <h4 className="font-semibold text-gray-900">Thời gian</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Ngày tạo:</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatDate(review.createdAt)}
                </span>
              </div>
              {review.updatedAt && review.updatedAt !== review.createdAt && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Cập nhật lần cuối:
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatDate(review.updatedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-2xl border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Đóng
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-lg hover:shadow-xl"
          >
            <Trash2 size={18} />
            Xóa đánh giá này
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailModal;
