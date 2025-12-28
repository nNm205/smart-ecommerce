import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { formatPrice } from "@/utils/productUtils";

function RelatedProducts({ products }) {
  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    const calculateVisibleCount = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setVisibleCount(2); // Mobile: 2 sản phẩm
      } else if (width < 768) {
        setVisibleCount(2); // Small tablet: 2 sản phẩm
      } else if (width < 1024) {
        setVisibleCount(3); // Tablet: 3 sản phẩm
      } else if (width < 1280) {
        setVisibleCount(4); // Small desktop: 4 sản phẩm
      } else if (width < 1536) {
        setVisibleCount(5); // Large desktop: 5 sản phẩm
      } else {
        setVisibleCount(6); // Extra large: 6 sản phẩm
      }
    };

    calculateVisibleCount();
    window.addEventListener("resize", calculateVisibleCount);

    return () => window.removeEventListener("resize", calculateVisibleCount);
  }, []);

  useEffect(() => {
    setStartIndex(0);
  }, [visibleCount]);

  if (!products || products.length === 0) {
    return (
      <div className="w-full mt-10 md:mt-12">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-blue-950">
          Sản phẩm tương tự
        </h2>
        <p className="text-gray-500">Không có sản phẩm tương tự</p>
      </div>
    );
  }

  const canPrev = startIndex > 0;
  const canNext = startIndex + visibleCount < products.length;

  const handlePrev = () => {
    if (!canPrev) return;
    setStartIndex((prev) => Math.max(prev - visibleCount, 0));
  };

  const handleNext = () => {
    if (!canNext) return;
    setStartIndex((prev) =>
      Math.min(prev + visibleCount, products.length - visibleCount)
    );
  };

  const visibleProducts = products.slice(startIndex, startIndex + visibleCount);

  return (
    <div className="w-full mt-10 md:mt-12">
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-blue-950">
        Sản phẩm tương tự
      </h2>

      <div className="flex items-center gap-3 sm:gap-4">
        {products.length > visibleCount && (
          <button
            onClick={handlePrev}
            disabled={!canPrev}
            className="
              flex-shrink-0
              w-10 h-10
              flex items-center justify-center
              rounded-full border shadow-sm 
              disabled:opacity-40 disabled:cursor-not-allowed
              hover:bg-gray-100 transition-colors
              text-2xl font-light
            "
            aria-label="Previous products"
          >
            ‹
          </button>
        )}

        <div className="flex-1 overflow-hidden">
          <div
            className="grid gap-3 sm:gap-4"
            style={{
              gridTemplateColumns: `repeat(${visibleCount}, minmax(0, 1fr))`,
            }}
          >
            {visibleProducts.map((item) => {
              const defaultImage =
                "https://via.placeholder.com/400x400?text=No+Image";
              const image =
                item.imageUrls && item.imageUrls.length > 0
                  ? item.imageUrls[0]
                  : defaultImage;

              return (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  className="
                    border rounded-xl 
                    overflow-hidden shadow-sm
                    hover:shadow-md transition-shadow 
                    duration-300
                    block
                  "
                >
                  <div className="aspect-square w-full overflow-hidden bg-gray-100">
                    <img
                      src={image}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = defaultImage;
                      }}
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-800 text-sm line-clamp-2 min-h-[2.5rem]">
                      {item.name}
                    </h3>
                    <p className="text-blue-950 font-semibold mt-2 text-sm">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {products.length > visibleCount && (
          <button
            onClick={handleNext}
            disabled={!canNext}
            className="
              flex-shrink-0
              w-10 h-10
              flex items-center justify-center
              rounded-full border shadow-sm 
              disabled:opacity-40 disabled:cursor-not-allowed
              hover:bg-gray-100 transition-colors
              text-2xl font-light
            "
            aria-label="Next products"
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
}

export default RelatedProducts;
