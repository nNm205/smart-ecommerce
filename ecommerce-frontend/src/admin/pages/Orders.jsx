import React, { useState } from 'react';
import { Search, Printer } from 'lucide-react';
import Modal from '../components/common/Modal';
import useModal from '../hooks/useModal';

const Orders = () => {
    const [orders, setOrders] = useState([
        { id: 1, orderId: '#ĐH001', customer: 'Nguyễn Văn A', date: '23/11/2024', product: 'iPhone 15 Pro', amount: '₫29,990,000', status: 'Hoàn thành' },
        { id: 2, orderId: '#ĐH002', customer: 'Trần Thị B', date: '23/11/2024', product: 'MacBook Air M2', amount: '₫28,490,000', status: 'Đang xử lý' },
        { id: 3, orderId: '#ĐH003', customer: 'Lê Văn C', date: '23/11/2024', product: 'AirPods Pro', amount: '₫6,490,000', status: 'Đang giao' },
        { id: 4, orderId: '#ĐH004', customer: 'Phạm Thị D', date: '23/11/2024', product: 'iPad Air', amount: '₫15,990,000', status: 'Hoàn thành' },
        { id: 5, orderId: '#ĐH005', customer: 'Hoàng Văn E', date: '23/11/2024', product: 'Apple Watch', amount: '₫10,990,000', status: 'Đang xử lý' },
    ]);

    const [filterStatus, setFilterStatus] = useState('all');

    // View Modal
    const viewModalHook = useModal();
    const isViewOpen = viewModalHook.isOpen;
    const viewData = viewModalHook.modalData;
    const openView = viewModalHook.openModal;
    const closeView = viewModalHook.closeModal;

    const handleView = (order) => {
        openView(order);
    };

    const handlePrint = (order) => {
        console.log('Printing order:', order.orderId);
        alert(`In đơn hàng ${order.orderId}`);
    };

    const handleUpdateStatus = (orderId, newStatus) => {
        setOrders(orders.map(order =>
            order.id === orderId
                ? { ...order, status: newStatus }
                : order
        ));
    };

    const filteredOrders = filterStatus === 'all'
        ? orders
        : orders.filter(order => order.status === filterStatus);

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Đơn Hàng</h2>
                <p className="text-gray-600">Quản lý tất cả đơn hàng</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Tất cả', count: orders.length, color: 'bg-gray-500' },
                    { label: 'Đang xử lý', count: orders.filter(o => o.status === 'Đang xử lý').length, color: 'bg-yellow-500' },
                    { label: 'Đang giao', count: orders.filter(o => o.status === 'Đang giao').length, color: 'bg-blue-500' },
                    { label: 'Hoàn thành', count: orders.filter(o => o.status === 'Hoàn thành').length, color: 'bg-green-500' },
                ].map((item, idx) => (
                    <div key={idx} className="bg-white rounded-lg shadow p-4">
                        <div className={`w-10 h-10 ${item.color} rounded-lg mb-3`}></div>
                        <h3 className="text-2xl font-bold text-gray-800">{item.count}</h3>
                        <p className="text-sm text-gray-600">{item.label}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm đơn hàng..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="ml-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="Đang xử lý">Đang xử lý</option>
                        <option value="Đang giao">Đang giao</option>
                        <option value="Hoàn thành">Hoàn thành</option>
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã ĐH</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách Hàng</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày Đặt</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản Phẩm</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số Tiền</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao Tác</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {filteredOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderId}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.customer}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.date}</td>
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
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button
                                        onClick={() => handleView(order)}
                                        className="text-blue-600 hover:text-blue-800 mr-3"
                                    >
                                        Xem
                                    </button>
                                    <button
                                        onClick={() => handlePrint(order)}
                                        className="text-green-600 hover:text-green-800"
                                    >
                                        In
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Order Modal */}
            {isViewOpen && viewData && (
                <Modal
                    isOpen={isViewOpen}
                    onClose={closeView}
                    title={`Chi Tiết Đơn Hàng ${viewData.orderId}`}
                    size="lg"
                >
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mã Đơn Hàng</label>
                                <p className="text-gray-900 font-semibold">{viewData.orderId}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày Đặt</label>
                                <p className="text-gray-900">{viewData.date}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Khách Hàng</label>
                                <p className="text-gray-900">{viewData.customer}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng Thái</label>
                                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                    viewData.status === 'Hoàn thành' ? 'bg-green-100 text-green-800' :
                                        viewData.status === 'Đang xử lý' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-blue-100 text-blue-800'
                                }`}>
                  {viewData.status}
                </span>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sản Phẩm</label>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="font-medium text-gray-900">{viewData.product}</p>
                                <p className="text-2xl font-bold text-blue-600 mt-2">{viewData.amount}</p>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cập Nhật Trạng Thái</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        handleUpdateStatus(viewData.id, 'Đang xử lý');
                                        closeView();
                                    }}
                                    className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                                >
                                    Đang xử lý
                                </button>
                                <button
                                    onClick={() => {
                                        handleUpdateStatus(viewData.id, 'Đang giao');
                                        closeView();
                                    }}
                                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Đang giao
                                </button>
                                <button
                                    onClick={() => {
                                        handleUpdateStatus(viewData.id, 'Hoàn thành');
                                        closeView();
                                    }}
                                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    Hoàn thành
                                </button>
                            </div>
                        </div>

                        <div className="border-t pt-4 flex justify-end gap-3">
                            <button
                                onClick={() => handlePrint(viewData)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                            >
                                <Printer size={18} />
                                In Đơn Hàng
                            </button>
                            <button
                                onClick={closeView}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Orders;