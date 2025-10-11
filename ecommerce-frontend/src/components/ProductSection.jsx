import ProductCard from "./ProductCard";

function ProductSection({ title, bannerImage, products }) {
  return (
    <section className="my-10 px-4 md:px-8">
      {/* Tiêu đề danh mục */}
      <h2 className="text-2xl font-bold text-gray-800 mb-5">{title}</h2>

      {/* Banner + Danh sách sản phẩm */}
      <div className="grid grid-cols-5 gap-x-2 gap-y-4">
        {/* Banner */}
        <div className="col-span-1">
          <div className="relative rounded-lg overflow-hidden h-120">
            <img
              src={bannerImage}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        {products.slice(0, 9).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {/* Nút xem tất cả */}
      <div className="flex justify-center mt-6">
        <button className="px-6 py-2 border border-black text-black bg-white rounded-lg hover:bg-black hover:text-white transition-colors duration-700 cursor-pointer">
          Xem tất cả
        </button>
      </div>
    </section>
  );
}

export default ProductSection;
