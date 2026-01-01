import { Search, Trash2, User, Package, Eye } from "lucide-react";
import { formatDate } from "../../utils/reviewUtils";
import StarRating from "../Reviews/StarRating";

const ReviewTable = ({ reviews, loading, onDelete, onViewDetail }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600"></div>
        <p className="mt-4 text-gray-600 font-medium">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search size={40} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Không tìm thấy đánh giá
        </h3>
        <p className="text-gray-500">
          Thử điều chỉnh bộ lọc hoặc tìm kiếm với các tiêu chí khác
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Người dùng
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Sản phẩm
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Đánh giá
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Nội dung
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {reviews.map((review) => (
              <tr
                key={review.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                    #{review.id}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {review.userName?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {review.userName}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <User size={12} />
                        ID: {review.userId}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {review.productName}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Package size={12} />
                      ID: {review.productId}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    <StarRating rating={review.rating} />
                    <span className="text-xs font-semibold text-gray-600">
                      {review.rating}/5
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-md">
                    {review.comment ? (
                      <div className="relative group">
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {review.comment}
                        </p>
                        {review.comment.length > 100 && (
                          <button
                            onClick={() => onViewDetail(review)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium mt-1 flex items-center gap-1"
                          >
                            <Eye size={12} />
                            Xem đầy đủ
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 italic">
                        Không có bình luận
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">
                    {formatDate(review.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onViewDetail(review)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                      title="Xem chi tiết"
                    >
                      <Eye size={16} />
                      <span className="hidden xl:inline">Chi tiết</span>
                    </button>
                    <button
                      onClick={() => onDelete(review)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                      title="Xóa review"
                    >
                      <Trash2 size={16} />
                      <span className="hidden xl:inline">Xóa</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewTable;
