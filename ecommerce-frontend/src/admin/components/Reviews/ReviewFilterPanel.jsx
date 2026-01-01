import { Filter, X, Search } from "lucide-react";

const ReviewFilterPanel = ({
  filters,
  setFilters,
  onApply,
  onReset,
  showFilters,
  setShowFilters,
  totalElements,
}) => {
  const hasActiveFilters =
    filters.productId || filters.userId || filters.rating;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-5 flex items-center justify-between border-b border-gray-100">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            showFilters
              ? "bg-blue-50 text-blue-700"
              : "bg-gray-50 text-gray-700 hover:bg-gray-100"
          }`}
        >
          <Filter size={18} />
          <span>Bộ lọc</span>
          {hasActiveFilters && !showFilters && (
            <span className="ml-1 w-2 h-2 bg-blue-600 rounded-full"></span>
          )}
        </button>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">Tổng số:</span>
          <span className="font-bold text-gray-900 text-lg">
            {totalElements}
          </span>
          <span className="text-gray-600">reviews</span>
        </div>
      </div>

      {/* Filter Content */}
      {showFilters && (
        <div className="p-5 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Product ID Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ID Sản phẩm
              </label>
              <input
                type="number"
                value={filters.productId}
                onChange={(e) =>
                  setFilters({ ...filters, productId: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Nhập ID sản phẩm"
              />
            </div>

            {/* User ID Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ID Người dùng
              </label>
              <input
                type="number"
                value={filters.userId}
                onChange={(e) =>
                  setFilters({ ...filters, userId: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Nhập ID người dùng"
              />
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Đánh giá
              </label>
              <select
                value={filters.rating}
                onChange={(e) =>
                  setFilters({ ...filters, rating: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
              >
                <option value="">Tất cả đánh giá</option>
                <option value="5">⭐⭐⭐⭐⭐ (5 sao)</option>
                <option value="4">⭐⭐⭐⭐ (4 sao)</option>
                <option value="3">⭐⭐⭐ (3 sao)</option>
                <option value="2">⭐⭐ (2 sao)</option>
                <option value="1">⭐ (1 sao)</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onApply}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md"
            >
              <Search size={18} />
              Áp dụng bộ lọc
            </button>
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <X size={18} />
              Đặt lại
            </button>
            {hasActiveFilters && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                <Filter size={16} />
                Đang lọc
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewFilterPanel;
