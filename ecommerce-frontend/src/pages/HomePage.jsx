import { useState, useEffect } from "react";
import Navbar from "@/components/Shared/Navbar";
import Footer from "@/components/Shared/Footer";
import ProductSection from "@/components/HomePage/ProductSection.jsx";
import bannerImage_1 from "@/assets/images/banner_hang_moi.jpg";
import bannerImage_2 from "@/assets/images/banner_ban_chay.jpg";
import bannerImage_3 from "@/assets/images/banner_ao_thun.jpg";
import bannerImage_4 from "@/assets/images/banner_quan_short.jpg";
import BannerSlider from "@/components/HomePage/BannerSlider";
import homeBanner_1 from "@/assets/images/banner_1.jpg";
import homeBanner_2 from "@/assets/images/banner_2.jpg";
import Chatbot from "@/components/Shared/Chatbot.jsx";
import ChatWidget from "@/components/ChatWidget";
import { fetchAllCategories } from "@/utils/categoryMapping";
import { Loader2 } from "lucide-react";

function HomePage() {
  const homeBannerImages = [homeBanner_1, homeBanner_2];
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const allCategories = await fetchAllCategories();
        setCategories(allCategories);
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  const aoThunCategory = categories.find((cat) => cat.slug === "ao-thun");
  const aoSoMiCategory = categories.find((cat) => cat.slug === "ao-so-mi");
  const quanShortCategory = categories.find((cat) => cat.slug === "quan-short");
  const giayDepCategory = categories.find((cat) => cat.slug === "giay-dep");

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

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Đang tải danh mục...</span>
          </div>
        ) : (
          /* Các section sản phẩm */
          <div className="max-w-[1600px] mx-auto">
            {/* Section Áo Thun Mới */}
            {aoThunCategory && (
              <ProductSection
                title="Áo Thun Mới"
                bannerImage={bannerImage_3}
                categoryId={aoThunCategory.id}
                categorySlug={aoThunCategory.slug}
              />
            )}

            {/* Section Áo Sơ Mi Mới */}
            {aoSoMiCategory && (
              <ProductSection
                title="Áo Sơ Mi Mới"
                bannerImage={bannerImage_1}
                categoryId={aoSoMiCategory.id}
                categorySlug={aoSoMiCategory.slug}
              />
            )}

            {/* Section Quần Short Mới */}
            {quanShortCategory && (
              <ProductSection
                title="Quần Short Mới"
                bannerImage={bannerImage_4}
                categoryId={quanShortCategory.id}
                categorySlug={quanShortCategory.slug}
              />
            )}

            {/* Section Giày & Dép Mới */}
            {giayDepCategory && (
              <ProductSection
                title="Giày & Dép Mới"
                bannerImage={bannerImage_2}
                categoryId={giayDepCategory.id}
                categorySlug={giayDepCategory.slug}
              />
            )}

            {/* Thông báo nếu không có category nào */}
            {!aoThunCategory &&
              !aoSoMiCategory &&
              !quanShortCategory &&
              !giayDepCategory && (
                <div className="text-center py-20">
                  <p className="text-gray-600 text-lg">
                    Đang cập nhật sản phẩm mới...
                  </p>
                </div>
              )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default HomePage;
