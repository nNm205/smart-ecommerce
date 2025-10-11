import "./index.css";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer";
import ProductCard from "./components/ProductCard";
import ProductSection from "./components/ProductSection";
import { products } from "./data/products.js";
import bannerImage_1 from "./assets/images/banner_hang_moi.jpg";
import bannerImage_2 from "./assets/images/banner_ban_chay.jpg";
import bannerImage_3 from "./assets/images/banner_ao_thun.jpg";
import bannerImage_4 from "./assets/images/banner_quan_short.jpg";
import BannerSlider from "./components/BannerSlider";
import homeBanner_1 from "./assets/images/banner_1.jpg";
import homeBanner_2 from "./assets/images/banner_2.jpg";

// import NewProductsList from "./components/NewProductsList";

// function App() {
//   function handleAddToCart(product) {
//     alert(`Thêm ${product.name} vào giỏ hàng`);
//   }

//   // function handleViewProduct(product) {
//   //   alert(`Xem chi tiết sản phẩm: ${product.name}`);
//   // }

//   return (
//     <div>
//       {/* Banner */}
//       <div className="bg-blue-700 text-white py-10">
//         <div className="max-w-7xl mx-auto px-4">
//           <h1 className="text-3xl font-bold">Smart Shop - mùa mới</h1>
//           <p className="mt-2">Khám phá bộ sưu tập sản phẩm mới nhất</p>
//         </div>
//       </div>

//       <NewProductsList onAddToCart={handleAddToCart} />
//     </div>
//   );
// }

function App() {
  const homeBannerImages = [homeBanner_1, homeBanner_2];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Nội dung chính */}
      <main className="flex-grow">
        {/* Banner Slider */}
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 mt-6">
          <BannerSlider banners={homeBannerImages} />
        </div>

        {/* Các section sản phẩm */}
        <div className="max-w-[1600px] mx-auto">
          <ProductSection
            title="Sản phẩm mới"
            bannerImage={bannerImage_1}
            products={products}
          />

          <ProductSection
            title="Sản phẩm mới"
            bannerImage={bannerImage_2}
            products={products}
          />

          <ProductSection
            title="Sản phẩm mới"
            bannerImage={bannerImage_3}
            products={products}
          />

          <ProductSection
            title="Sản phẩm mới"
            bannerImage={bannerImage_4}
            products={products}
          />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
