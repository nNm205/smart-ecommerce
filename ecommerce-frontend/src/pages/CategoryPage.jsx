import { useParams } from "react-router-dom";
// import { products } from "@/data/products.js";
import ProductCard from "@/components/HomePage/ProductCard.jsx";
import Navbar from "@/components/Shared/Navbar.jsx";
import Footer from "@/components/Shared/Footer.jsx";
import bannerImage1 from "@/assets/images/banner_nhom_ao_nam.jpg";
import bannerImage2 from "@/assets/images/banner_nhom_quan_nam.jpg";
import bannerImage3 from "@/assets/images/banner_nhom_phu_kien.jpg";
import { Link } from "react-router-dom";
import { ChevronRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { productService } from "@/services/productService";
import {
  getCategoryIdBySlug,
  getCategoryNameBySlug,
  getCategoryBySlug,
  getCategoriesByGroup,
  getCategoryIdsByGroup,
  categoryGroupNames,
} from "@/utils/categoryMapping";

function CategoryPage() {
  const { category } = useParams();
  const [sortOption, setSortOption] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [categoryName, setCategoryName] = useState("");
  const [categoryIds, setCategoryIds] = useState([]);
  const [isGroupCategory, setIsGroupCategory] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const productsPerPage = 30;

  const categoryBannerMap = {
    "ao-nam": bannerImage1,
    "quan-nam": bannerImage2,
    "nhom-phu-kien": bannerImage3,
  };

  const getSortParams = (sortOption) => {
    switch (sortOption) {
      case "name-asc":
        return { sortBy: "name", direction: "ASC" };
      case "name-desc":
        return { sortBy: "name", direction: "DESC" };
      case "price-asc":
        return { sortBy: "price", direction: "ASC" };
      case "price-desc":
        return { sortBy: "price", direction: "DESC" };
      default:
        return { sortBy: "id", direction: "ASC" };
    }
  };

  useEffect(() => {
    const loadCategoryInfo = async () => {
      try {
        const isGroup = ["ao-nam", "quan-nam", "nhom-phu-kien"].includes(
          category
        );
        setIsGroupCategory(isGroup);

        if (isGroup) {
          const ids = await getCategoryIdsByGroup(category);
          const subCats = await getCategoriesByGroup(category);

          setCategoryIds(ids);
          setSubCategories(subCats);
          setCategoryName(categoryGroupNames[category] || "");
        } else {
          const id = await getCategoryIdBySlug(category);
          const name = await getCategoryNameBySlug(category);
          const categoryInfo = await getCategoryBySlug(category);

          setCategoryIds(id ? [id] : []);
          setCategoryName(name);
          setSubCategories([]);

          if (categoryInfo?.group) {
            const sameGroupCats = await getCategoriesByGroup(
              categoryInfo.group
            );
            setSubCategories(sameGroupCats);
          }
        }
      } catch (error) {
        console.error("Error loading category info:", error);
        setCategoryIds([]);
        setCategoryName("");
      }
    };

    loadCategoryInfo();
    setCurrentPage(1);
  }, [category]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!categoryIds || categoryIds.length === 0) return;

      try {
        setLoading(true);
        setError(null);

        const { sortBy, direction } = getSortParams(sortOption);

        const response = await productService.getAllProducts({
          categoryId: categoryIds.length === 1 ? categoryIds[0] : null,
          sortBy: sortBy,
          direction: direction,
          page: currentPage - 1,
          size: productsPerPage,
        });

        let filteredProducts = response.content || [];

        if (categoryIds.length > 1) {
          filteredProducts = filteredProducts.filter((product) =>
            categoryIds.includes(product.category?.id)
          );
        }

        setProducts(filteredProducts);
        setTotalPages(response.totalPages || 0);
        setTotalElements(response.totalElements || 0);
      } catch (error) {
        console.error("Error fetching products:", error);

        if (error.response) {
          // Server trả về error response
          const status = error.response.status;
          if (status === 404) {
            setError("Không tìm thấy danh mục này.");
          } else if (status === 500) {
            setError("Lỗi server. Vui lòng thử lại sau.");
          } else {
            setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
          }
        } else if (error.request) {
          // Request được gửi nhưng không nhận được response
          setError(
            "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng."
          );
        } else {
          setError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryIds, sortOption, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-gray-100 h-[50px] flex items-center px-6 lg:px-16 border-b border-gray-200">
        <Link
          to="/"
          className="hover:text-blue-700 transition-colors duration-200"
        >
          Trang chủ
        </Link>
        <ChevronRight size={14} className="mx-2" />
        <Link
          to="#"
          className="hover:text-blue-700 transition-colors duration-200"
        >
          Danh mục
        </Link>
        <ChevronRight size={14} className="mx-2" />
        <span className="text-gray-800 font-medium">
          {categoryName || "Đang tải..."}
        </span>
      </div>

      <main className="flex-grow">
        <div className="max-w-[1800px] mx-auto px-4 md:px-8">
          {/* Banner - Chỉ hiển thị cho nhóm category */}
          {isGroupCategory && categoryBannerMap[category] && (
            <img
              src={categoryBannerMap[category]}
              alt={categoryName}
              className="w-full object-cover max-h-[350px]"
            />
          )}

          {/* Sub-categories filter */}
          {subCategories.length > 0 && (
            <div className="mt-8 mb-6">
              <div className="flex flex-wrap gap-3">
                {isGroupCategory && (
                  <Link
                    to={`/category/${category}`}
                    className={`px-4 py-2 rounded-full border transition-colors ${
                      isGroupCategory
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-600 hover:text-blue-600"
                    }`}
                  >
                    Tất cả
                  </Link>
                )}
                {subCategories.map((subCat) => (
                  <Link
                    key={subCat.id}
                    to={`/category/${subCat.slug}`}
                    className={`px-4 py-2 rounded-full border transition-colors ${
                      category === subCat.slug
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-600 hover:text-blue-600"
                    }`}
                  >
                    {subCat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Thanh sắp xếp sản phẩm */}
          {!loading && products.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 mb-6 gap-4">
              <p className="text-gray-600">
                Tìm thấy <span className="font-semibold">{totalElements}</span>{" "}
                sản phẩm
              </p>
              <div className="flex items-center">
                <label
                  htmlFor="sort"
                  className="mr-3 text-gray-700 font-medium whitespace-nowrap"
                >
                  Sắp xếp theo:
                </label>
                <select
                  id="sort"
                  value={sortOption}
                  onChange={handleSortChange}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
                >
                  <option value="default">Mặc định</option>
                  <option value="name-asc">Tên A - Z</option>
                  <option value="name-desc">Tên Z - A</option>
                  <option value="price-asc">Giá tăng dần</option>
                  <option value="price-desc">Giá giảm dần</option>
                </select>
              </div>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex flex-col justify-center items-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600 mt-4">
                Đang tải sản phẩm...
              </span>
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-10 mb-6">
              <p className="text-red-700 text-center">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 mx-auto block px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Thử lại
              </button>
            </div>
          )}

          {/* Danh sách sản phẩm */}
          {!loading && !error && (
            <div className="max-w-[1600px] mx-auto mt-6">
              {products.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-8">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-600 text-lg mb-4">
                    Hiện chưa có sản phẩm trong danh mục này.
                  </p>
                  <Link
                    to="/"
                    className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Quay về trang chủ
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Thanh phân trang */}
          {!loading && !error && totalPages > 1 && (
            <div className="flex flex-wrap justify-center mt-10 mb-16 gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {"<< Trước"}
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-4 py-2 border rounded-md transition-colors ${
                      currentPage === pageNumber
                        ? "bg-blue-600 text-white border-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {"Sau >>"}
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default CategoryPage;
