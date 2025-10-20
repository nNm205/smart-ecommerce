import { Link } from "react-router-dom";

function RelatedProducts({ products }) {
  if (!products || products.length === 0) {
    return <p className="text-gray-500">Không có sản phẩm tương tự</p>;
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-semibold mb-6 text-blue-950">
        Sản phẩm tương tự
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((item) => (
          <div
            key={item.id}
            className="border rounded-xl overflow-hidden shadow-sm 
                       hover:shadow-md transition-shadow duration-300"
          >
            <Link to={`/product/${item.id}`}>
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-3">
                <h3 className="font-medium text-gray-800 line-clamp-2">
                  {item.name}
                </h3>
                <p className="text-blue-950 font-semibold mt-1">
                  {item.price.toLocaleString()}₫
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RelatedProducts;
