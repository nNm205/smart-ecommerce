import { Search } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import NotificationDropdown from '../common/NotificationDropdown.jsx';

const Header = () => {
  const { auth } = useAuth(); // ✅ Lấy cả auth để hiển thị thông tin user

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <NotificationDropdown />

          {/* User Info */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">
                {auth?.fullName || "Admin User"}
              </p>
              <p className="text-xs text-gray-500">
                {auth?.role === "ADMIN" ? "Quản trị viên" : "Người dùng"}
              </p>
            </div>
            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {auth?.fullName?.charAt(0) || "A"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
