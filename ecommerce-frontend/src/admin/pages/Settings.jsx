import React from 'react';

const Settings = () => {
    return (
        <>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Cài Đặt</h2>
                <p className="text-gray-600">Quản lý cài đặt hệ thống</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-4">Thông Tin Cửa Hàng</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tên Cửa Hàng</label>
                                <input type="text" defaultValue="Tech Store VN" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input type="email" defaultValue="contact@techstore.vn" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Số Điện Thoại</label>
                                <input type="tel" defaultValue="0123456789" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Địa Chỉ</label>
                                <textarea rows="3" defaultValue="123 Đường ABC, Quận 1, TP.HCM" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                            </div>
                            <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                Lưu Thay Đổi
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-4">Đổi Mật Khẩu</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mật Khẩu Hiện Tại</label>
                                <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mật Khẩu Mới</label>
                                <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Xác Nhận Mật Khẩu</label>
                                <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                Đổi Mật Khẩu
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-4">Thông Báo</h3>
                        <div className="space-y-3">
                            {[
                                'Email khi có đơn hàng mới',
                                'Thông báo đơn hàng',
                                'Thông báo khách hàng',
                                'Báo cáo hàng ngày',
                            ].map((item, idx) => (
                                <label key={idx} className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm text-gray-700">{item}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Settings;