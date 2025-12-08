import Navbar from "@/components/Shared/Navbar";
import Footer from "@/components/Shared/Footer";
import ProductSection from "@/components/HomePage/ProductSection.jsx";
import { products } from "@/data/products";
import bannerImage_1 from "@/assets/images/banner_hang_moi.jpg";
import bannerImage_2 from "@/assets/images/banner_ban_chay.jpg";
import bannerImage_3 from "@/assets/images/banner_ao_thun.jpg";
import bannerImage_4 from "@/assets/images/banner_quan_short.jpg";
import BannerSlider from "@/components/HomePage/BannerSlider";
import homeBanner_1 from "@/assets/images/banner_1.jpg";
import homeBanner_2 from "@/assets/images/banner_2.jpg";
import Chatbot from "@/components/Shared/Chatbot.jsx";

function HomePage() {
  const homeBannerImages = [homeBanner_1, homeBanner_2];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Nội dung chính */}
      <main className="flex-grow">
        {/* Banner Slider */}
        <div className="max-w-[1800px] mx-auto px-4 md:px-8 mt-6">
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

      <Chatbot />
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default HomePage;
