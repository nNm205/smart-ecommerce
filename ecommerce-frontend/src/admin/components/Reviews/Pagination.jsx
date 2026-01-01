import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage < 3) {
        pages.push(0, 1, 2, 3, "...", totalPages - 1);
      } else if (currentPage > totalPages - 4) {
        pages.push(
          0,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1
        );
      } else {
        pages.push(
          0,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages - 1
        );
      }
    }

    return pages;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Info */}
        <div className="text-sm text-gray-600">
          Hiển thị trang{" "}
          <span className="font-bold text-gray-900">{currentPage + 1}</span>{" "}
          trong tổng số{" "}
          <span className="font-bold text-gray-900">{totalPages}</span> trang
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2">
          {/* First Page */}
          <button
            onClick={() => onPageChange(0)}
            disabled={currentPage === 0}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Trang đầu"
          >
            <ChevronsLeft size={18} />
          </button>

          {/* Previous */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-2"
          >
            <ChevronLeft size={18} />
            <span className="hidden sm:inline">Trước</span>
          </button>

          {/* Page Numbers */}
          <div className="hidden md:flex items-center gap-1">
            {getPageNumbers().map((page, index) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-2 text-gray-400"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === page
                      ? "bg-blue-600 text-white shadow-md"
                      : "border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page + 1}
                </button>
              )
            )}
          </div>

          {/* Next */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-2"
          >
            <span className="hidden sm:inline">Sau</span>
            <ChevronRight size={18} />
          </button>

          {/* Last Page */}
          <button
            onClick={() => onPageChange(totalPages - 1)}
            disabled={currentPage >= totalPages - 1}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Trang cuối"
          >
            <ChevronsRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
