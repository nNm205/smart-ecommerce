import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  MessageSquare,
  Menu,
  Star,
  X,
} from "lucide-react";

const Sidebar = ({ sidebarOpen, setSidebarOpen, currentPath }) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: "dashboard", path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { id: "users", path: "/users", icon: Users, label: "Khách Hàng" },
    { id: "products", path: "/products", icon: Package, label: "Sản Phẩm" },
    { id: "orders", path: "/orders", icon: ShoppingCart, label: "Đơn Hàng" },
    { id: "chat", path: "/chat", icon: MessageSquare, label: "Chat", badge: 3 },
    { id: "reviews", path: "/reviews", icon: Star, label: "Reviews" },
  ];

  const handleNavigate = (path) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-gray-900 text-white transition-all duration-300 flex flex-col`}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        {sidebarOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-800 rounded transition-colors"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.path)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 transition-colors relative ${
                isActive ? "bg-blue-600" : "hover:bg-gray-800"
              }`}
            >
              <Icon size={20} className="flex-shrink-0" />
              {sidebarOpen && (
                <span className="flex-1 text-left">{item.label}</span>
              )}
              {item.badge && sidebarOpen && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
              {item.badge && !sidebarOpen && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer - User Info */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-semibold flex-shrink-0">
            AD
          </div>
          {sidebarOpen && (
            <div className="min-w-0 flex-1">
              <p className="font-semibold truncate text-sm">Admin User</p>
              <p className="text-xs text-gray-400 truncate">
                admin@example.com
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
