import ProductImages from "@/components/ProductImages";
import ProductInfo from "@/components/ProductInfo";
import ProductVariants from "@/components/ProductVariants";
import AddToCartSection from "@/components/AddToCartSection";
import ProductDescription from "@/components/ProductDescription";
import ProductReviews from "@/components/ProductReviews";
import RelatedProducts from "@/components/RelatedProducts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { useParams } from "react-router-dom";
import { products } from "@/data/products";
import { useState } from "react";

import { useCart } from "@/contexts/CartContext";

function ProductDetailPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const [selected, setSelected] = useState({ size: null, color: null });
  const { addToCart } = useCart();

  if (!product) {
    return (
      <div className="p-10 text-center text-gray-500">
        Không tìm thấy sản phẩm
      </div>
    );
  }

  function handleAddToCart(quantity) {
    if (!selected.size || !selected.color) {
      alert("Vui lòng chọn đầy đủ size và màu trước khi thêm vào giỏ hàng.");
      return;
    }

    addToCart(product, selected, quantity);
    alert("Đã thêm sản phẩm vào giỏ hàng!");
  }

  // return (
  //   <div className="w-full flex flex-col bg-white min-h-screen">
  //     <Navbar />

  //     <main
  //       className="w-full flex flex-col
  //                   justify-center items-center
  //                   bg-white"
  //     >
  //       <div
  //         className="w-full max-w-[1700px]
  //                     px-4 md:px-8 lg:px-12
  //                     py-12 grid md:grid-cols-2
  //                     gap-14"
  //       >
  //         <div className="flex items-start">
  //           <ProductImages images={product.images} />
  //         </div>

  //         <div
  //           className="flex flex-col justify-start
  //                       items-start"
  //         >
  //           <ProductInfo
  //             name={product.name}
  //             price={product.price}
  //             rating={product.rating}
  //             stock={product.stock}
  //           />
  //           <div className="mt-6 w-full">
  //             <ProductVariants
  //               sizes={product.sizes}
  //               colors={product.colors}
  //               selected={selected}
  //               onChange={setSelected}
  //             />
  //             <AddToCartSection onAddToCart={handleAddToCart} />
  //           </div>
  //         </div>
  //         <div className="col-span-2 mt-10">
  //           <ProductDescription description={product.description} />
  //           <ProductReviews reviews={product.reviews} />
  //           <RelatedProducts
  //             products={products.filter(
  //               (p) => p.category === product.category && p.id != product.id
  //             )}
  //           />
  //         </div>
  //       </div>
  //     </main>

  //     <Footer />
  //   </div>
  // );

  return (
    <div
      className="w-full flex flex-col 
                    bg-white min-h-screen"
    >
      <Navbar />

      <main
        className="w-full flex-1 flex 
                        justify-center bg-white"
      >
        <div
          className="w-full max-w-[1200px] 
            lg:max-w-[1400px] xl:max-w-[1700px]
            px-3 sm:px-4 md:px-8 lg:px-12
            py-8 md:py-12
            grid grid-cols-1 md:grid-cols-2
            gap-8 md:gap-12 xl:gap-16"
        >
          <div
            className="flex justify-center 
                          md:justify-start items-start"
          >
            <ProductImages images={product.images} />
          </div>

          <div
            className="flex flex-col justify-start 
                          items-start space-y-4"
          >
            <ProductInfo
              name={product.name}
              price={product.price}
              rating={product.rating}
              stock={product.stock}
            />
            <div className="mt-4 w-full">
              <ProductVariants
                sizes={product.sizes}
                colors={product.colors}
                selected={selected}
                onChange={setSelected}
              />
              <div className="mt-4 sm:mt-6">
                <AddToCartSection onAddToCart={handleAddToCart} />
              </div>
            </div>
          </div>

          <div
            className="col-span-1 md:col-span-2 
                          mt-8 md:mt-10 space-y-8 
                          md:space-y-10"
          >
            <ProductDescription description={product.description} />
            <ProductReviews reviews={product.reviews} />
            <RelatedProducts
              products={products.filter(
                (p) => p.category === product.category && p.id !== product.id
              )}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ProductDetailPage;
