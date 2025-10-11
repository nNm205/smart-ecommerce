import { useState, useMemo } from "react";
import ProductCard from "./ProductCard";
import { products as allProducts } from "../data/products.js";

function NewProductsList({ products = null, initialCount = 8, onAddToCart }) {
  const source = products ?? allProducts;

  // lọc sản phẩm mới
  const newProducts = useMemo(() => source.filter((p) => p.isNew), [source]);

  const [visibleCount, setVisibleCount] = useState(initialCount);

  const visibleProducts = newProducts.slice(0, visibleCount);

  const canLoadMore = visibleCount < newProducts.length;

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Sản phẩm mới</h2>
      </div>

      {visibleProducts.length === 0 ? (
        <div className="text-center text-gray-500">Chưa có sản phẩm mới.</div>
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
            className="px-4 py-2 border rounded-md bg-white hover:bg-gray-50"
          >
            Xem thêm
          </button>
        </div>
      )}
    </section>
  );
}

export default NewProductsList;
