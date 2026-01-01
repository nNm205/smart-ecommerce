import { useState } from "react";
import { useReviews } from "../hooks/useReviews";
import ReviewFilterPanel from "../components/Reviews/ReviewFilterPanel";
import ReviewTable from "../components/Reviews/ReviewTable";
import Pagination from "../components/Reviews/Pagination";
import DeleteConfirmModal from "../components/Reviews/DeleteConfirmModal";
import ReviewDetailModal from "../components/Reviews/ReviewDetailModal";
import { Star, TrendingUp, MessageSquare, AlertCircle } from "lucide-react";

const AdminReviewsManagement = () => {
  const {
    reviews,
    loading,
    currentPage,
    totalPages,
    totalElements,
    filters,
    setFilters,
    deleteReview,
    applyFilters,
    resetFilters,
    setCurrentPage,
  } = useReviews();

  const [showFilters, setShowFilters] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewDetail, setViewDetail] = useState(null);

  const handleApplyFilters = () => {
    applyFilters(filters);
  };

  const handleResetFilters = () => {
    resetFilters();
  };

  const handleViewDetail = (review) => {
    setViewDetail(review);
  };

  const handleDeleteClick = (review) => {
    setDeleteConfirm(review);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteReview(deleteConfirm.id);
      alert("Xóa review thành công!");
      setDeleteConfirm(null);
    } catch (error) {
      console.error(error);
      alert("Không thể xóa review. Vui lòng thử lại!");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  const handleDeleteFromDetail = () => {
    setDeleteConfirm(viewDetail);
    setViewDetail(null);
  };

  // Tính toán thống kê đơn giản
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Star className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý Đánh giá
              </h1>
              <p className="text-gray-600 mt-1">
                Theo dõi và quản lý phản hồi của khách hàng
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Tổng đánh giá
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {totalElements}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <MessageSquare className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Đánh giá TB
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {avgRating}{" "}
                    <span className="text-lg text-gray-500">/5</span>
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <Star className="text-yellow-600 fill-yellow-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Trang hiện tại
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {currentPage + 1}{" "}
                    <span className="text-lg text-gray-500">
                      /{totalPages || 1}
                    </span>
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-green-600" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="mb-6">
          <ReviewFilterPanel
            filters={filters}
            setFilters={setFilters}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            totalElements={totalElements}
          />
        </div>

        {/* Reviews Table Section */}
        <div className="mb-6">
          <ReviewTable
            reviews={reviews}
            loading={loading}
            onDelete={handleDeleteClick}
            onViewDetail={handleViewDetail}
          />
        </div>

        {/* Pagination Section */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {/* Review Detail Modal */}
        <ReviewDetailModal
          review={viewDetail}
          onClose={() => setViewDetail(null)}
          onDelete={handleDeleteFromDetail}
        />

        {/* Delete Modal */}
        <DeleteConfirmModal
          review={deleteConfirm}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      </div>
    </div>
  );
};

export default AdminReviewsManagement;
