import { Search, ShoppingCart, User } from "lucide-react";

function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left Section */}
          <div className="text-2xl font-bold text-blue-900">Smart Shop</div>

          {/* Middle Section */}
          <div className="hidden md:flex space-x-8">
            <div className="text-gray-600 hover:text-black transition">
              Sản phẩm
            </div>
            <div className="text-gray-600 hover:text-black transition">
              Hàng mới
            </div>
            <div className="text-gray-600 hover:text-black transition">
              Áo nam
            </div>
            <div className="text-gray-600 hover:text-black transition">
              Quần nam
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <div>
              <Search className="w-6 h-6 text-gray-700 hover:text-black" />
            </div>
            <div>
              <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-black" />
            </div>
            <div>
              <User className="w-6 h-6 text-gray-700 hover:text-black" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
