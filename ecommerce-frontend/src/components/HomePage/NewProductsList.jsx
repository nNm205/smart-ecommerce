import { useState, useEffect } from "react";
import ProductCard from "@/components/HomePage/ProductCard.jsx";
import { productService } from "@/services/productService";
import { Loader2 } from "lucide-react";

function NewProductsList({ categoryId = null, initialCount = 8, onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(initialCount);

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        let newProducts;
        if (categoryId) {
          newProducts = await productService.getNewProductsByCategory(
            categoryId,
            50,
            7
          );
        } else {
          const response = await productService.getNewProducts({
            size: 50,
            days: 7,
          });
          newProducts = response.content || [];
        }

        setProducts(newProducts);
      } catch (error) {
        console.error("Error fetching new products:", error);
        setError("Không thể tải sản phẩm mới. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchNewProducts();
  }, [categoryId]);

  const visibleProducts = products.slice(0, visibleCount);
  const canLoadMore = visibleCount < products.length;

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Đang tải sản phẩm mới...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700 text-center">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Sản phẩm mới</h2>
        {products.length > 0 && (
          <span className="text-sm text-gray-500">
            {products.length} sản phẩm
          </span>
        )}
      </div>

      {visibleProducts.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          Chưa có sản phẩm mới trong 7 ngày qua.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}

      {canLoadMore && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + initialCount)}
            className="px-6 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors"
          >
            Xem thêm ({products.length - visibleCount} sản phẩm)
          </button>
        </div>
      )}
    </section>
  );
}

export default NewProductsList;
