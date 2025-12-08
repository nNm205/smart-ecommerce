import { ChevronRight } from "lucide-react";

export default function Breadcrumb() {
  return (
    <div className="bg-gray-100 h-[50px] flex items-center px-6 lg:px-16 border-b border-gray-200">
      <a
        href="/"
        className="hover:text-blue-700 transition-colors duration-200"
      >
        Trang chủ
      </a>
      <ChevronRight size={14} className="mx-1" />
      <a
        href="#"
        className="hover:text-blue-700 transition-colors duration-200"
      >
        Danh mục
      </a>
      <ChevronRight size={14} className="mx-1" />
      <span className="text-gray-800 font-medium">Giỏ hàng</span>
    </div>
  );
}
