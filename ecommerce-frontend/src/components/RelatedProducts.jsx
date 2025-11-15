import { Link } from "react-router-dom";
import { useState } from "react";

function RelatedProducts({ products }) {
  const [startIndex, setStartIndex] = useState(0);
  const VISIBLE_COUNT = 4;

  if (!products || products.length === 0) {
    return <p className="text-gray-500">Không có sản phẩm tương tự</p>;
  }

  const canPrev = startIndex > 0;
  const canNext = startIndex + VISIBLE_COUNT < products.length;

  const handlePrev = () => {
    if (!canPrev) return;
    setStartIndex((prev) => Math.max(prev - VISIBLE_COUNT, 0));
  };

  const handleNext = () => {
    if (!canNext) return;
    setStartIndex((prev) =>
      Math.min(prev + VISIBLE_COUNT, products.length - VISIBLE_COUNT)
    );
  };

  const visibleProducts = products.slice(
    startIndex,
    startIndex + VISIBLE_COUNT
  );

  // return (
  //   <div className="mt-16">
  //     <h2 className="text-2xl font-semibold mb-6 text-blue-950">
  //       Sản phẩm tương tự
  //     </h2>

  //     <div className="flex items-center gap-4">
  //       {products.length > VISIBLE_COUNT && (
  //         <button
  //           onClick={handlePrev}
  //           disabled={!canPrev}
  //           className={`p-2 rounded-full border shadow-sm
  //                      disabled:opacity-40 disabled:cursor-not-allowed
  //                      hover:bg-gray-100 transition-colors`}
  //         >
  //           &#8249;
  //         </button>
  //       )}

  //       <div className="flex-1 overflow-hidden">
  //         <div className="flex gap-4">
  //           {visibleProducts.map((item) => (
  //             <div
  //               key={item.id}
  //               className="w-52 border rounded-xl
  //                           overflow-hidden shadow-sm
  //                           hover:shadow-md transition-shadow
  //                           duration-300 flex-shrink-0"
  //             >
  //               <Link to={`/product/${item.id}`}>
  //                 <img
  //                   src={item.images[0]}
  //                   alt={item.name}
  //                   className="w-full h-48 object-cover"
  //                 />
  //                 <div className="p-3">
  //                   <h3 className="font-medium text-gray-800 line-clamp-2">
  //                     {item.name}
  //                   </h3>
  //                   <p className="text-blue-950 font-semibold mt-1">
  //                     {item.price.toLocaleString()}₫
  //                   </p>
  //                 </div>
  //               </Link>
  //             </div>
  //           ))}
  //         </div>
  //       </div>

  //       {products.length > VISIBLE_COUNT && (
  //         <button
  //           onClick={handleNext}
  //           disabled={!canNext}
  //           className={`p-2 rounded-full border shadow-sm
  //                      disabled:opacity-40 disabled:cursor-not-allowed
  //                      hover:bg-gray-100 transition-colors`}
  //         >
  //           &#8250;
  //         </button>
  //       )}
  //     </div>
  //   </div>
  // );

  return (
    <div className="w-full mt-10 md:mt-12">
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-blue-950">
        Sản phẩm tương tự
      </h2>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Nút trái */}
        {products.length > VISIBLE_COUNT && (
          <button
            onClick={handlePrev}
            disabled={!canPrev}
            className={`
              p-2 sm:p-2.5 rounded-full border shadow-sm 
              disabled:opacity-40 disabled:cursor-not-allowed
              hover:bg-gray-100 transition-colors
            `}
          >
            &#8249;
          </button>
        )}

        {/* Thanh sản phẩm ngang */}
        <div className="flex-1 overflow-hidden">
          <div className="flex gap-3 sm:gap-4">
            {visibleProducts.map((item) => (
              <div
                key={item.id}
                className="
                  w-40 xs:w-44 sm:w-48 md:w-52 lg:w-56
                  border rounded-xl 
                  overflow-hidden shadow-sm
                  hover:shadow-md transition-shadow 
                  duration-300 flex-shrink-0
                "
              >
                <Link to={`/product/${item.id}`}>
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-40 xs:h-44 sm:h-48 object-cover"
                  />
                  <div className="p-2.5 sm:p-3">
                    <h3 className="font-medium text-gray-800 text-sm sm:text-base line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-blue-950 font-semibold mt-1 text-sm sm:text-base">
                      {item.price.toLocaleString()}₫
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Nút phải */}
        {products.length > VISIBLE_COUNT && (
          <button
            onClick={handleNext}
            disabled={!canNext}
            className={`
              p-2 sm:p-2.5 rounded-full border shadow-sm 
              disabled:opacity-40 disabled:cursor-not-allowed
              hover:bg-gray-100 transition-colors
            `}
          >
            &#8250;
          </button>
        )}
      </div>
    </div>
  );
}

export default RelatedProducts;
