import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Check } from 'lucide-react';
import dashboardService from '../../services/dashboardService';

const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    const dropdownRef = useRef(null);

    const unreadCount = notifications.filter(n => n.unread).length;

    const loadLowStock = async () => {
        setLoading(true);
        try {
            const res = await dashboardService.getLowStockProducts();
            const list = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
            const mapped = list.map((p, idx) => {
                const status = p.status || p.stockStatus;
                let message = '';
                if (status === 'LOW_STOCK') {
                    message = `${p.productName} đang còn ít hàng`;
                } else if (status === 'OUT_OF_STOCK') {
                    message = `${p.productName} đã hết hàng`;
                } else {
                    message = `${p.productName} trạng thái kho: ${status || 'N/A'}`;
                }
                return {
                    id: `${Date.now()}-${idx}`,
                    title: 'Cảnh báo tồn kho',
                    message,
                    time: '',
                    unread: true,
                };
            });
            setNotifications(mapped);
        } catch {
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = (id) => {
        setNotifications(notifications.map(notif =>
            notif.id === id ? { ...notif, unread: false } : notif
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(notif => ({ ...notif, unread: false })));
    };

    const removeNotification = (id) => {
        setNotifications(notifications.filter(notif => notif.id !== id));
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => {
                    const next = !isOpen;
                    setIsOpen(next);
                    if (next) {
                        loadLowStock();
                    }
                }}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
            {unreadCount}
          </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">Thông Báo</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Đánh dấu tất cả đã đọc
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center">
                                <Bell size={48} className="mx-auto text-gray-300 mb-3 animate-pulse" />
                                <p className="text-gray-500">Đang tải thông báo...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <Bell size={48} className="mx-auto text-gray-300 mb-3" />
                                <p className="text-gray-500">Không có thông báo mới</p>
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors relative group ${
                                        notif.unread ? 'bg-blue-50' : ''
                                    }`}
                                >
                                    <div className="flex gap-3">
                                        {notif.unread && (
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <h4 className="font-semibold text-gray-800 text-sm">{notif.title}</h4>
                                                <button
                                                    onClick={() => removeNotification(notif.id)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-xs text-gray-400">{notif.time}</span>
                                                {notif.unread && (
                                                    <button
                                                        onClick={() => markAsRead(notif.id)}
                                                        className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                                                    >
                                                        <Check size={12} />
                                                        Đánh dấu đã đọc
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="p-3 border-t border-gray-200 text-center">
                            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                Xem tất cả thông báo
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
