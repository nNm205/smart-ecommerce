import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Shared/Navbar";
import Footer from "@/components/Shared/Footer";
import ProductCard from "@/components/HomePage/ProductCard";
import { productService } from "@/services/productService";
import {
  Loader2,
  SlidersHorizontal,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const keyword = searchParams.get("q") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filter states
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    sortBy: "createdAt",
    direction: "DESC",
  });

  // Mobile filter state
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch products when keyword or filters change
  useEffect(() => {
    if (keyword.trim()) {
      fetchSearchResults(0);
    }
  }, [keyword, filters]);

  const fetchSearchResults = async (page) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        keyword: keyword.trim(),
        page: page,
        size: 12,
        sortBy: filters.sortBy,
        direction: filters.direction,
      };

      // Thêm filter giá nếu có
      if (filters.minPrice) {
        params.minPrice = parseFloat(filters.minPrice);
      }
      if (filters.maxPrice) {
        params.maxPrice = parseFloat(filters.maxPrice);
      }

      const response = await productService.searchProducts(params);

      setProducts(response.content || []);
      setTotalElements(response.totalElements || 0);
      setTotalPages(response.totalPages || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error searching products:", error);
      setError("Không thể tìm kiếm sản phẩm. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      sortBy: "createdAt",
      direction: "DESC",
    });
  };

  const handlePageChange = (newPage) => {
    fetchSearchResults(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters = filters.minPrice || filters.maxPrice;

  if (!keyword.trim()) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-20">
          <div className="text-center px-4">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Tìm kiếm sản phẩm
            </h2>
            <p className="text-gray-600 mb-6">
              Vui lòng nhập từ khóa để tìm kiếm sản phẩm
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Quay về trang chủ
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-5 pb-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Header - Improved */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 mb-6 shadow-lg">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Kết quả tìm kiếm
                </h1>
                <p className="text-blue-100 flex items-center gap-2">
                  <Search size={18} />
                  <span className="font-medium">"{keyword}"</span>
                  {!loading && (
                    <span className="ml-2 bg-white/20 px-3 py-1 rounded-full text-sm">
                      {totalElements} sản phẩm
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Filters - Desktop */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Filter size={20} />
                    Bộ lọc
                  </h3>
                  {hasActiveFilters && (
                    <button
                      onClick={handleClearFilters}
                      className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <X size={16} />
                      Xóa
                    </button>
                  )}
                </div>

                {/* Sort By */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Sắp xếp theo
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      handleFilterChange("sortBy", e.target.value)
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="createdAt">Mới nhất</option>
                    <option value="price">Giá</option>
                    <option value="name">Tên A-Z</option>
                  </select>
                </div>

                {/* Direction */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Thứ tự
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleFilterChange("direction", "ASC")}
                      className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                        filters.direction === "ASC"
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Tăng dần
                    </button>
                    <button
                      onClick={() => handleFilterChange("direction", "DESC")}
                      className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                        filters.direction === "DESC"
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Giảm dần
                    </button>
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Khoảng giá
                  </label>
                  <div className="space-y-3">
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) =>
                        handleFilterChange("minPrice", e.target.value)
                      }
                      placeholder="Giá tối thiểu"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        handleFilterChange("maxPrice", e.target.value)
                      }
                      placeholder="Giá tối đa"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Mobile Filter Button */}
              <div className="lg:hidden mb-4 flex items-center gap-2">
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <SlidersHorizontal size={20} />
                  <span className="font-medium">Bộ lọc</span>
                  {hasActiveFilters && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {(filters.minPrice ? 1 : 0) + (filters.maxPrice ? 1 : 0)}
                    </span>
                  )}
                </button>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              {/* Mobile Filters Dropdown */}
              {showMobileFilters && (
                <div className="lg:hidden mb-6 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
                  <div className="space-y-4">
                    {/* Sort By */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Sắp xếp theo
                      </label>
                      <select
                        value={filters.sortBy}
                        onChange={(e) =>
                          handleFilterChange("sortBy", e.target.value)
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="createdAt">Mới nhất</option>
                        <option value="price">Giá</option>
                        <option value="name">Tên A-Z</option>
                      </select>
                    </div>

                    {/* Direction */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Thứ tự
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleFilterChange("direction", "ASC")}
                          className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                            filters.direction === "ASC"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          Tăng dần
                        </button>
                        <button
                          onClick={() =>
                            handleFilterChange("direction", "DESC")
                          }
                          className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                            filters.direction === "DESC"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          Giảm dần
                        </button>
                      </div>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Khoảng giá
                      </label>
                      <div className="space-y-2">
                        <input
                          type="number"
                          value={filters.minPrice}
                          onChange={(e) =>
                            handleFilterChange("minPrice", e.target.value)
                          }
                          placeholder="Giá tối thiểu"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="number"
                          value={filters.maxPrice}
                          onChange={(e) =>
                            handleFilterChange("maxPrice", e.target.value)
                          }
                          placeholder="Giá tối đa"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="flex flex-col justify-center items-center py-20 bg-white rounded-xl shadow-sm">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
                  <span className="text-gray-600 font-medium">
                    Đang tìm kiếm sản phẩm...
                  </span>
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <X className="w-6 h-6 text-red-600" />
                    </div>
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* No Results */}
              {!loading && !error && products.length === 0 && (
                <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                  <div className="max-w-md mx-auto px-4">
                    <Search className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Không tìm thấy kết quả
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Không tìm thấy sản phẩm nào phù hợp với "{keyword}"
                    </p>
                    <div className="space-y-3">
                      {hasActiveFilters && (
                        <button
                          onClick={handleClearFilters}
                          className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                          Xóa bộ lọc
                        </button>
                      )}
                      <button
                        onClick={() => navigate("/")}
                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Quay về trang chủ
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Products Grid */}
              {!loading && products.length > 0 && (
                <>
                  <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white rounded-xl shadow-sm p-4">
                      <div className="text-sm text-gray-600">
                        Trang{" "}
                        <span className="font-semibold">{currentPage + 1}</span>{" "}
                        / {totalPages}
                        <span className="ml-2 text-gray-400">
                          ({products.length} sản phẩm)
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 0}
                          className="p-2 border border-gray-300 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                          <ChevronLeft size={20} />
                        </button>

                        <div className="flex items-center gap-1">
                          {[...Array(totalPages)].map((_, index) => {
                            // Smart pagination display
                            const showPage =
                              index === 0 ||
                              index === totalPages - 1 ||
                              (index >= currentPage - 1 &&
                                index <= currentPage + 1);

                            const showDots =
                              index === currentPage - 2 ||
                              index === currentPage + 2;

                            if (showDots) {
                              return (
                                <span
                                  key={index}
                                  className="px-2 text-gray-400"
                                >
                                  ...
                                </span>
                              );
                            }

                            if (!showPage) return null;

                            return (
                              <button
                                key={index}
                                onClick={() => handlePageChange(index)}
                                className={`min-w-[40px] h-10 rounded-lg font-medium transition-all ${
                                  currentPage === index
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                                }`}
                              >
                                {index + 1}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages - 1}
                          className="p-2 border border-gray-300 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default SearchPage;
