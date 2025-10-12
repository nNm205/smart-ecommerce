import { useParams } from "react-router-dom";
import { products } from "../data/products.js";
import ProductCard from "../components/ProductCard.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import bannerImage1 from "../assets/images/banner_nhom_ao_nam.jpg";
import bannerImage2 from "../assets/images/banner_nhom_quan_nam.jpg";
import bannerImage3 from "../assets/images/banner_nhom_phu_kien.jpg";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

function CategoryPage() {
  const { category } = useParams();
  const [sortOption, setSortOption] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 30;

  const categoryBannerMap = {
    "ao-nam": bannerImage1,
    "quan-nam": bannerImage2,
    "nhom-phu-kien": bannerImage3,
  };

  // Lọc sản phẩm theo category
  const filteredProducts = products.filter(
    (product) => product.category === category
  );

  // Tiêu đề hiển thị
  const categoryNameMap = {
    "ao-nam": "Áo Nam",
    "quan-nam": "Quần Nam",
    "nhom-phu-kien": "Giày & Phụ kiện",
  };

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      default:
        return 0;
    }
  });

  // Phân trang
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="bg-gray-100 h-[50px] flex items-center px-6 lg:px-16 border-b border-gray-200">
        <Link
          to="/"
          className="hover:text-blue-700 transition-colors duration-200"
        >
          Trang chủ
        </Link>
        <ChevronRight size={14} />
        <Link
          to="#"
          className="hover:text-blue-700 transition-colors duration-200"
        >
          Danh mục
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-800 font-medium">
          {categoryNameMap[category]}
        </span>
      </div>

      <main className="flex-grow">
        <div className="max-w-[1800px] mx-auto px-4 md:px-8">
          <img
            src={categoryBannerMap[category]}
            alt={categoryNameMap[category]}
            className="w-full object-cover max-h-[350px]"
          />

          {/* Thanh sắp xếp sản phẩm */}
          {currentProducts.length > 0 && (
            <div className="flex justify-end items-center mt-10 mb-6">
              <label htmlFor="sort" className="mr-3 text-gray-700 font-medium">
                Sắp xếp theo:
              </label>
              <select
                id="sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
              >
                <option value="default">Mặc định</option>
                <option value="name-asc">Tên A - Z</option>
                <option value="name-desc">Tên Z - A</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
              </select>
            </div>
          )}

          {/* Danh sách sản phẩm */}
          <div className="max-w-[1600px] mx-auto mt-10">
            {currentProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-8 max-w-[1600px] mx-auto">
                {currentProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-lg text-center">
                Hiện chưa có sản phẩm trong danh mục này.
              </p>
            )}
          </div>

          {/* Thanh phân trang */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10 mb-16 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              >
                {"<< Trước"}
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-4 py-2 border rounded-md ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white border-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50"
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
