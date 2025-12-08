import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function BannerSlider({ banners }) {
  const [currentBanner, setCurrentBanner] = useState(0);

  // Chuyển ảnh tự động sau 5s
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentBanner]);

  function prevSlide() {
    setCurrentBanner((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  }

  function nextSlide() {
    setCurrentBanner((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-md">
      {/* Danh sách ảnh */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentBanner * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <img
            key={index}
            src={banner}
            alt={`Banner ${index + 1}`}
            className="w-full flex-shrink-0 object-cover h-full"
          />
        ))}
      </div>

      {/* Nút chuyển ảnh trái/phải */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/60 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/60 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dot indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBanner(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentBanner ? "bg-white" : "bg-white/40"
            } transition`}
          ></button>
        ))}
      </div>
    </div>
  );
}

export default BannerSlider;
