import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "@/components/HomePage/ProductCard";
import { productService } from "@/services/productService";
import { Loader2 } from "lucide-react";

function ProductSection({ title, bannerImage, categoryId, categorySlug }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const newProducts = await productService.getNewProductsByCategory(
          categoryId,
          9,
          7
        );

        setProducts(newProducts);
      } catch (error) {
        console.error("Error fetching products", error);
        setError("Không thể tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchProducts();
    }
  }, [categoryId]);

  if (loading) {
    return (
      <section className="my-10 px-4 md:px-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-5">{title}</h2>
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Đang tải...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="my-10 px-4 md:px-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-5">{title}</h2>
        <div className="text-center text-red-600 py-10">{error}</div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="my-10 px-4 md:px-8">
      {/* Tiêu đề danh mục */}
      <h2 className="text-2xl font-bold text-gray-800 mb-5">{title}</h2>

      {/* Banner + Danh sách sản phẩm */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-x-2 gap-y-4">
        {/* Banner */}
        <div className="col-span-1">
          <Link to={`/category/${categorySlug}`}>
            <div className="relative rounded-lg overflow-hidden h-full min-h-[300px] cursor-pointer hover:opacity-90 transition-opacity">
              <img
                src={bannerImage}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="col-span-1 md:col-span-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-x-2 gap-y-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Nút xem tất cả */}
      <div className="flex justify-center mt-6">
        <Link to={`/category/${categorySlug}`}>
          <button className="px-6 py-2 border border-black text-black bg-white rounded-lg hover:bg-black hover:text-white transition-colors duration-300 cursor-pointer">
            Xem tất cả
          </button>
        </Link>
      </div>
    </section>
  );
}

export default ProductSection;
