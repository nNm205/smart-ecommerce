import React, { useState } from 'react';
import { LogOut } from 'lucide-react';

export default function Profile() {
    const [user] = useState({
        name: 'Trần Thị B',
        email: 'tranthib@email.com',
        phone: '0987654321',
        address: '456 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh',
        joinDate: 'Tháng 6, 2023',
        avatar: '👩',
        totalOrders: 12
    });

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
                    <div className="flex flex-col items-center">
                        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-7xl mb-4 shadow-lg">
                            {user.avatar}
                        </div>
                        <h2 className="text-3xl font-bold">{user.name}</h2>
                    </div>
                </div>

                {/* Profile Content */}
                <div className="p-8">
                    {/* Info Sections */}
                    <div className="space-y-6 mb-8">
                        <div className="pb-6 border-b border-gray-200">
                            <p className="text-xs text-gray-600 font-bold mb-2 uppercase tracking-wider">Email</p>
                            <p className="text-lg font-semibold text-gray-800">{user.email}</p>
                        </div>

                        <div className="pb-6 border-b border-gray-200">
                            <p className="text-xs text-gray-600 font-bold mb-2 uppercase tracking-wider">Số điện thoại</p>
                            <p className="text-lg font-semibold text-gray-800">{user.phone}</p>
                        </div>

                        <div className="pb-6 border-b border-gray-200">
                            <p className="text-xs text-gray-600 font-bold mb-2 uppercase tracking-wider">Địa chỉ giao hàng</p>
                            <p className="text-lg font-semibold text-gray-800">{user.address}</p>
                        </div>

                        <div className="pb-6 border-b border-gray-200">
                            <p className="text-xs text-gray-600 font-bold mb-2 uppercase tracking-wider">Thành viên từ</p>
                            <p className="text-lg font-semibold text-gray-800">{user.joinDate}</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 gap-4 p-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl mb-8">
                        <div className="text-center">
                            <p className="text-4xl font-bold text-blue-600">{user.totalOrders}</p>
                            <p className="text-sm text-gray-700 mt-2 font-semibold">Đơn hàng</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-lg transition">
                            ✏️ Chỉnh sửa hồ sơ
                        </button>
                        <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg transition flex items-center justify-center gap-2">
                            <LogOut size={20} />
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}