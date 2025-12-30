import React from 'react';
import {
    LayoutDashboard,
    Users,
    ShoppingCart,
    Package,
    Settings,
    MessageSquare,
    Menu,
    X
} from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen, currentPath, navigate }) => {
    const menuItems = [
        { id: 'dashboard', path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'users', path: '/users', icon: Users, label: 'Khách Hàng' },
        { id: 'products', path: '/products', icon: Package, label: 'Sản Phẩm' },
        { id: 'orders', path: '/orders', icon: ShoppingCart, label: 'Đơn Hàng' },
        { id: 'chat', path: '/chat', icon: MessageSquare, label: 'Chat', badge: 3 },
        { id: 'settings', path: '/settings', icon: Settings, label: 'Cài Đặt' },
    ];

    return (
        <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-50 text-gray-900 transition-all duration-300 flex flex-col border-r border-gray-200`}>
            <div className="p-4 flex items-center justify-between border-b border-gray-200">
                {sidebarOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded">
                    {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            <nav className="flex-1 p-4">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => {
                            const token = localStorage.getItem('token');
                            if (!token) {
                                navigate('/login');
                            } else {
                                navigate(item.path);
                            }
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 transition-colors relative ${
                            currentPath === item.path ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                        }`}
                    >
                        <item.icon size={20} />
                        {sidebarOpen && <span className="truncate">{item.label}</span>}
                        {item.badge && (
                            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {item.badge}
              </span>
                        )}
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                        AD
                    </div>
                    {sidebarOpen && (
                        <div className="min-w-0">
                            <p className="font-semibold truncate">Admin User</p>
                            <p className="text-sm text-gray-500 truncate">admin@example.com</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
