import React, { useState } from 'react';
import {
    LayoutDashboard,
    Users,
    ShoppingCart,
    Package,
    Settings,
    Bell,
    Search,
    DollarSign,
    UserPlus,
    Menu,
    X,
    TrendingUp,
    ArrowUp,
    ArrowDown,
    MessageSquare,
    Send,
    Paperclip,
    Smile
} from 'lucide-react';

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activePage, setActivePage] = useState('dashboard');
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([
        { id: 1, sender: 'user', name: 'Nguyễn Văn A', text: 'Xin chào, tôi muốn hỏi về sản phẩm iPhone 15 Pro', time: '10:30', avatar: 'NA' },
        { id: 2, sender: 'admin', text: 'Chào bạn! Tôi có thể giúp gì cho bạn về iPhone 15 Pro?', time: '10:31' },
        { id: 3, sender: 'user', name: 'Nguyễn Văn A', text: 'Sản phẩm này còn hàng không ạ?', time: '10:32', avatar: 'NA' },
        { id: 4, sender: 'admin', text: 'Vâng, chúng tôi vẫn còn hàng. Bạn muốn màu nào?', time: '10:33' },
    ]);
    const [newMessage, setNewMessage] = useState('');
    const [chatList] = useState([
        { id: 1, name: 'Nguyễn Văn A', lastMsg: 'Sản phẩm này còn hàng không ạ?', time: '10:32', unread: 2, avatar: 'NA', online: true },
        { id: 2, name: 'Trần Thị B', lastMsg: 'Cảm ơn bạn!', time: '09:15', unread: 0, avatar: 'TB', online: false },
        { id: 3, name: 'Lê Văn C', lastMsg: 'Khi nào giao hàng?', time: '08:45', unread: 1, avatar: 'LC', online: true },
        { id: 4, name: 'Phạm Thị D', lastMsg: 'Được rồi, cảm ơn', time: 'Hôm qua', unread: 0, avatar: 'PD', online: false },
    ]);

    // Dữ liệu thống kê
    const stats = [
        {
            title: 'Tổng Doanh Thu',
            value: '₫125,430,000',
            change: '+12.5%',
            icon: DollarSign,
            color: 'bg-blue-500',
            trend: 'up'
        },
        {
            title: 'Đơn Hàng Mới',
            value: '234',
            change: '+8.2%',
            icon: ShoppingCart,
            color: 'bg-green-500',
            trend: 'up'
        },
        {
            title: 'Khách Hàng',
            value: '1,429',
            change: '+23.1%',
            icon: UserPlus,
            color: 'bg-purple-500',
            trend: 'up'
        },
        {
            title: 'Sản Phẩm',
            value: '856',
            change: '-2.4%',
            icon: Package,
            color: 'bg-orange-500',
            trend: 'down'
        }
    ];

    // Dữ liệu biểu đồ
    const chartData = [
        { month: 'T1', revenue: 45, orders: 120 },
        { month: 'T2', revenue: 52, orders: 145 },
        { month: 'T3', revenue: 48, orders: 135 },
        { month: 'T4', revenue: 68, orders: 180 },
        { month: 'T5', revenue: 75, orders: 210 },
        { month: 'T6', revenue: 82, orders: 234 },
        { month: 'T7', revenue: 95, orders: 268 },
    ];

    const maxRevenue = 100; // Đặt max cố định để có khoảng trống phía trên
    const maxOrders = 300;

    // Dữ liệu danh mục
    const categories = [
        { name: 'Điện thoại', value: 35, color: 'bg-blue-500' },
        { name: 'Laptop', value: 28, color: 'bg-green-500' },
        { name: 'Phụ kiện', value: 20, color: 'bg-yellow-500' },
        { name: 'Tablet', value: 17, color: 'bg-purple-500' },
    ];

    // Đơn hàng gần đây
    const recentOrders = [
        { id: '#ĐH001', customer: 'Nguyễn Văn A', product: 'iPhone 15 Pro', amount: '₫29,990,000', status: 'Hoàn thành' },
        { id: '#ĐH002', customer: 'Trần Thị B', product: 'MacBook Air M2', amount: '₫28,490,000', status: 'Đang xử lý' },
        { id: '#ĐH003', customer: 'Lê Văn C', product: 'AirPods Pro', amount: '₫6,490,000', status: 'Đang giao' },
        { id: '#ĐH004', customer: 'Phạm Thị D', product: 'iPad Air', amount: '₫15,990,000', status: 'Hoàn thành' },
        { id: '#ĐH005', customer: 'Hoàng Văn E', product: 'Apple Watch', amount: '₫10,990,000', status: 'Đang xử lý' },
    ];

    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'users', icon: Users, label: 'Khách Hàng' },
        { id: 'orders', icon: ShoppingCart, label: 'Đơn Hàng' },
        { id: 'products', icon: Package, label: 'Sản Phẩm' },
        { id: 'chat', icon: MessageSquare, label: 'Chat', badge: 3 },
        { id: 'settings', icon: Settings, label: 'Cài Đặt' },
    ];

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const newMsg = {
                id: messages.length + 1,
                sender: 'admin',
                text: newMessage,
                time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
            };
            setMessages([...messages, newMsg]);
            setNewMessage('');
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 flex flex-col`}>
                <div className="p-4 flex items-center justify-between border-b border-gray-700">
                    {sidebarOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-800 rounded">
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 p-4">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActivePage(item.id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 transition-colors relative ${
                                activePage === item.id ? 'bg-blue-600' : 'hover:bg-gray-800'
                            }`}
                        >
                            <item.icon size={20} />
                            {sidebarOpen && <span>{item.label}</span>}
                            {item.badge && (
                                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge}
                </span>
                            )}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-semibold">
                            AD
                        </div>
                        {sidebarOpen && (
                            <div className="min-w-0">
                                <p className="font-semibold truncate">Admin User</p>
                                <p className="text-sm text-gray-400 truncate">admin@example.com</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="flex-1 overflow-auto p-6">
                    {activePage === 'dashboard' && (
                        <>
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
                                <p className="text-gray-600">Tổng quan và thống kê hệ thống</p>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                {stats.map((stat, index) => (
                                    <div key={index} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`${stat.color} p-3 rounded-lg`}>
                                                <stat.icon className="text-white" size={24} />
                                            </div>
                                            <div className={`flex items-center gap-1 text-sm font-semibold ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                                {stat.trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                                                <span>{stat.change}</span>
                                            </div>
                                        </div>
                                        <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
                                        <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Charts */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                                {/* Column Chart */}
                                <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                                    <h3 className="text-lg font-semibold mb-6">Doanh Thu & Đơn Hàng Theo Tháng</h3>
                                    <div className="h-80 flex items-end justify-around gap-4 px-4 border-l-2 border-b-2 border-gray-300">
                                        {chartData.map((data, index) => (
                                            <div key={index} className="flex flex-col items-center gap-3 flex-1 h-full">
                                                <div className="w-full flex gap-2 items-end h-full pb-8">
                                                    <div className="flex-1 flex items-end h-full">
                                                        <div
                                                            className="w-full bg-blue-500 rounded-t-lg hover:bg-blue-600 cursor-pointer transition-all duration-300 relative group"
                                                            style={{
                                                                height: `${(data.revenue / maxRevenue) * 100}%`
                                                            }}
                                                        >
                                                            <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                                {data.revenue}tr
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 flex items-end h-full">
                                                        <div
                                                            className="w-full bg-green-500 rounded-t-lg hover:bg-green-600 cursor-pointer transition-all duration-300 relative group"
                                                            style={{
                                                                height: `${(data.orders / maxOrders) * 100}%`
                                                            }}
                                                        >
                                                            <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                                {data.orders} đơn
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-xs font-medium text-gray-600">{data.month}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-center gap-6 mt-6 text-sm border-t pt-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-blue-500 rounded"></div>
                                            <span>Doanh thu (triệu)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-green-500 rounded"></div>
                                            <span>Đơn hàng</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Pie Chart */}
                                <div className="bg-white rounded-lg shadow p-6">
                                    <h3 className="text-lg font-semibold mb-6">Danh Mục Sản Phẩm</h3>
                                    <div className="flex items-center justify-center mb-6">
                                        <div className="relative w-48 h-48">
                                            <svg viewBox="0 0 200 200" className="transform -rotate-90">
                                                {(() => {
                                                    let currentAngle = 0;
                                                    return categories.map((cat, index) => {
                                                        const percentage = cat.value / 100;
                                                        const angle = percentage * 360;
                                                        const endAngle = currentAngle + angle;

                                                        const startX = 100 + 80 * Math.cos((currentAngle * Math.PI) / 180);
                                                        const startY = 100 + 80 * Math.sin((currentAngle * Math.PI) / 180);
                                                        const endX = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
                                                        const endY = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);

                                                        const largeArc = angle > 180 ? 1 : 0;
                                                        const pathData = `M 100 100 L ${startX} ${startY} A 80 80 0 ${largeArc} 1 ${endX} ${endY} Z`;

                                                        const colors = {
                                                            'bg-blue-500': '#3b82f6',
                                                            'bg-green-500': '#10b981',
                                                            'bg-yellow-500': '#eab308',
                                                            'bg-purple-500': '#a855f7'
                                                        };

                                                        const result = (
                                                            <path
                                                                key={index}
                                                                d={pathData}
                                                                fill={colors[cat.color]}
                                                                className="hover:opacity-80 transition-opacity cursor-pointer"
                                                                stroke="white"
                                                                strokeWidth="2"
                                                            />
                                                        );

                                                        currentAngle = endAngle;
                                                        return result;
                                                    });
                                                })()}
                                                <circle cx="100" cy="100" r="45" fill="white" />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-gray-800">100%</div>
                                                    <div className="text-xs text-gray-500">Tổng</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {categories.map((cat, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-3 h-3 ${cat.color} rounded-full`}></div>
                                                    <span className="text-sm text-gray-700">{cat.name}</span>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900">{cat.value}%</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                        <div className="flex items-center gap-2 text-blue-700">
                                            <TrendingUp size={20} />
                                            <span className="text-sm font-semibold">Tăng trưởng 15% so với tháng trước</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Orders */}
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="p-6 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold">Đơn Hàng Gần Đây</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã ĐH</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách Hàng</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản Phẩm</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số Tiền</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                        {recentOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.customer}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.product}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{order.amount}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                order.status === 'Hoàn thành' ? 'bg-green-100 text-green-800' :
                                    order.status === 'Đang xử lý' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status}
                            </span>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Chat Page */}
                    {activePage === 'chat' && (
                        <div className="h-full flex flex-col">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Chat</h2>
                                <p className="text-gray-600">Trò chuyện với khách hàng</p>
                            </div>

                            <div className="flex-1 flex gap-4 overflow-hidden">
                                {/* Chat List */}
                                <div className="w-80 bg-white rounded-lg shadow overflow-hidden flex flex-col">
                                    <div className="p-4 border-b border-gray-200">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                placeholder="Tìm kiếm cuộc trò chuyện..."
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto">
                                        {chatList.map((chat) => (
                                            <div
                                                key={chat.id}
                                                onClick={() => setSelectedChat(chat)}
                                                className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors ${
                                                    selectedChat?.id === chat.id ? 'bg-blue-50' : ''
                                                }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="relative">
                                                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                            {chat.avatar}
                                                        </div>
                                                        {chat.online && (
                                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <h4 className="font-semibold text-gray-800 truncate">{chat.name}</h4>
                                                            <span className="text-xs text-gray-500">{chat.time}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-sm text-gray-600 truncate">{chat.lastMsg}</p>
                                                            {chat.unread > 0 && (
                                                                <span className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                                  {chat.unread}
                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Chat Window */}
                                <div className="flex-1 bg-white rounded-lg shadow flex flex-col">
                                    {selectedChat ? (
                                        <>
                                            {/* Chat Header */}
                                            <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                                                <div className="relative">
                                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                        {selectedChat.avatar}
                                                    </div>
                                                    {selectedChat.online && (
                                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">{selectedChat.name}</h3>
                                                    <p className="text-xs text-green-600">{selectedChat.online ? 'Đang hoạt động' : 'Không hoạt động'}</p>
                                                </div>
                                            </div>

                                            {/* Messages */}
                                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                                {messages.map((msg) => (
                                                    <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                                        <div className={`flex gap-2 max-w-md ${msg.sender === 'admin' ? 'flex-row-reverse' : 'flex-row'}`}>
                                                            {msg.sender === 'user' && (
                                                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                                                    {msg.avatar}
                                                                </div>
                                                            )}
                                                            <div>
                                                                <div className={`px-4 py-2 rounded-lg ${
                                                                    msg.sender === 'admin'
                                                                        ? 'bg-blue-500 text-white'
                                                                        : 'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                    {msg.text}
                                                                </div>
                                                                <span className="text-xs text-gray-500 mt-1 block">{msg.time}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Message Input */}
                                            <div className="p-4 border-t border-gray-200">
                                                <div className="flex items-center gap-2">
                                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                        <Paperclip size={20} className="text-gray-600" />
                                                    </button>
                                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                        <Smile size={20} className="text-gray-600" />
                                                    </button>
                                                    <input
                                                        type="text"
                                                        value={newMessage}
                                                        onChange={(e) => setNewMessage(e.target.value)}
                                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                                        placeholder="Nhập tin nhắn..."
                                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                    <button
                                                        onClick={handleSendMessage}
                                                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                                    >
                                                        <Send size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex-1 flex items-center justify-center">
                                            <div className="text-center">
                                                <MessageSquare size={64} className="text-gray-300 mx-auto mb-4" />
                                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Chọn một cuộc trò chuyện</h3>
                                                <p className="text-gray-600">Chọn khách hàng từ danh sách bên trái để bắt đầu chat</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;