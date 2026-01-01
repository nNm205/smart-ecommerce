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
import { useAuth } from "../../hooks/useAuth";

const Sidebar = ({ sidebarOpen, setSidebarOpen, currentPath }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { id: "dashboard", path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { id: "users", path: "/users", icon: Users, label: "Khách Hàng" },
    { id: "products", path: "/products", icon: Package, label: "Sản Phẩm" },
    { id: "orders", path: "/orders", icon: ShoppingCart, label: "Đơn Hàng" },
    { id: "chat", path: "/chat", icon: MessageSquare, label: "Chat" },
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

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-50 text-gray-900 transition-all duration-300 flex flex-col border-r border-gray-200`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          {sidebarOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded">
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
                isActive ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
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

      <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-gray-400 rounded-lg transition-colors"
      >
          Đăng xuất
      </button>
    </div>
  );
};

export default Sidebar;
