import React from 'react';
import { Search } from 'lucide-react';

const Users = () => {
    const customers = [
        { name: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com', phone: '0912345678', orders: 12, total: '₫89,500,000', status: 'VIP' },
        { name: 'Trần Thị B', email: 'tranthib@gmail.com', phone: '0923456789', orders: 8, total: '₫45,200,000', status: 'Thường' },
        { name: 'Lê Văn C', email: 'levanc@gmail.com', phone: '0934567890', orders: 5, total: '₫28,900,000', status: 'Thường' },
        { name: 'Phạm Thị D', email: 'phamthid@gmail.com', phone: '0945678901', orders: 15, total: '₫125,400,000', status: 'VIP' },
    ];

    return (
        <>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Khách Hàng</h2>
                <p className="text-gray-600">Quản lý danh sách khách hàng</p>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm khách hàng..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        + Thêm Khách Hàng
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách Hàng</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số ĐT</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn Hàng</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng Chi</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao Tác</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {customers.map((customer, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                                            {customer.name.split(' ').pop().charAt(0)}
                                        </div>
                                        <div className="font-medium text-gray-900">{customer.name}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{customer.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{customer.phone}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{customer.orders}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{customer.total}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        customer.status === 'VIP' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {customer.status}
                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button className="text-blue-600 hover:text-blue-800 mr-3">Xem</button>
                                    <button className="text-green-600 hover:text-green-800 mr-3">Sửa</button>
                                    <button className="text-red-600 hover:text-red-800">Xóa</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Users;