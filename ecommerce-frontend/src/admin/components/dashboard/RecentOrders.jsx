import React from 'react';

const RecentOrders = () => {
    const recentOrders = [
        { id: '#ĐH001', customer: 'Nguyễn Văn A', product: 'iPhone 15 Pro', amount: '₫29,990,000', status: 'Hoàn thành' },
        { id: '#ĐH002', customer: 'Trần Thị B', product: 'MacBook Air M2', amount: '₫28,490,000', status: 'Đang xử lý' },
        { id: '#ĐH003', customer: 'Lê Văn C', product: 'AirPods Pro', amount: '₫6,490,000', status: 'Đang giao' },
        { id: '#ĐH004', customer: 'Phạm Thị D', product: 'iPad Air', amount: '₫15,990,000', status: 'Hoàn thành' },
        { id: '#ĐH005', customer: 'Hoàng Văn E', product: 'Apple Watch', amount: '₫10,990,000', status: 'Đang xử lý' },
    ];

    return (
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
    );
};

export default RecentOrders;