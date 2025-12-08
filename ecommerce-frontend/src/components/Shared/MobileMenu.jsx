import { ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function MobileMenu({ menuOpen, closeMenu }) {
  const [subMenuOpen, setSubMenuOpen] = useState(null);

  const toggleSubMenu = (menu) => {
    setSubMenuOpen(subMenuOpen === menu ? null : menu);
  };

  return (
    <div
      className={`md:hidden fixed top-[64px] left-0 
                  h-[calc(100vh-64px)] w-[65%] sm:w-[45%] 
                  bg-white border-r border-gray-200 shadow-2xl
                  transition-all duration-500 
                  ease-[cubic-bezier(0.25,0.1,0.25,1)]
                  z-50 flex flex-col justify-between 
                  ${
                    menuOpen
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-full opacity-0"
                  }`}
    >
      <div
        className="flex flex-col px-6 py-6 
                      space-y-5 font-medium 
                      text-gray-800 overflow-y-auto"
      >
        <div>
          <button
            onClick={() => toggleSubMenu("sanpham")}
            className="flex items-center justify-between 
                       w-full text-left py-2"
          >
            <span>Sản phẩm</span>
            {subMenuOpen === "sanpham" ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>

          {subMenuOpen === "sanpham" && (
            <div className="pl-3 space-y-2 text-gray-700">
              <Link to="/category/ao-nam" onClick={closeMenu} className="block">
                Áo nam
              </Link>
              <Link
                to="/category/quan-nam"
                onClick={closeMenu}
                className="block"
              >
                Quần nam
              </Link>
              <Link
                to="/category/nhom-phu-kien"
                onClick={closeMenu}
                className="block"
              >
                Giày & Phụ kiện
              </Link>
            </div>
          )}
        </div>

        <Link to="/category/new" onClick={closeMenu}>
          Hàng mới
        </Link>
        <Link to="/category/sale" onClick={closeMenu}>
          SALE OFF
        </Link>
      </div>
    </div>
  );
}
