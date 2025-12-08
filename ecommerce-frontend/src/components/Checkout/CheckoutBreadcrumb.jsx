import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Breadcrumb() {
  return (
    <div className="bg-gray-100 h-[50px] flex items-center px-6 lg:px-16 border-b border-gray-200">
      <Link
        to="/"
        className="hover:text-blue-700 transition-colors duration-200"
      >
        Trang chủ
      </Link>
      <ChevronRight size={14} className="mx-1" />
      <Link
        to="/"
        className="hover:text-blue-700 transition-colors duration-200"
      >
        Danh mục
      </Link>
      <ChevronRight size={14} className="mx-1" />
      <Link to="/cart" className="text-gray-800 font-medium">
        Giỏ hàng
      </Link>
      <ChevronRight size={14} className="mx-1" />
      <Link to="/checkout" className="text-gray-800 font-medium">
        Thanh toán
      </Link>
    </div>
  );
}
