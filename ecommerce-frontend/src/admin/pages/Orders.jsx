import React, { useState, useEffect } from 'react';
import { Search, Eye } from 'lucide-react';
import Modal from '../components/common/Modal';
import useModal from '../hooks/useModal';
import orderService from '../services/orderService';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState('');

    const [filterStatus, setFilterStatus] = useState('all');

    // View Modal
    const viewModalHook = useModal();
    const isViewOpen = viewModalHook.isOpen;
    const viewData = viewModalHook.modalData;
    const openView = viewModalHook.openModal;
    const closeView = viewModalHook.closeModal;

    useEffect(() => {
        fetchOrders();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const formatCurrency = (value) => {
        if (typeof value !== 'number') return value;
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const fetchOrders = async (searchKeyword = '') => {
        setLoading(true);
        try {
            const data = await orderService.getOrders(searchKeyword);
            const list = Array.isArray(data) ? data : (data?.content || []);
            const normalized = list.map(o => {
                const customerName = o.userFullName || o.customerName || o.user?.fullName || o.user?.username || o.user?.email || 'N/A';
                const paymentStatus = o.paymentStatus || o.payment?.status || 'N/A';
                const paymentMethod = o.paymentMethod || o.payment?.method || 'N/A';
                const totalAmount = typeof o.totalAmount === 'number' ? o.totalAmount : (typeof o.amount === 'number' ? o.amount : 0);
                return {
                    id: o.id,
                    code: `ORD${o.id}`,
                    customer: customerName,
                    date: o.createdAt,
                    paymentStatus,
                    amount: totalAmount,
                    paymentMethod,
                    status: o.status || 'PENDING',
                    items: o.items || [],
                };
            });
            setOrders(normalized);
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setLoading(false);
        }
    };

    const statusLabelVi = (status) => {
        switch (status) {
            case 'CANCELLED': return 'Đã hủy';
            case 'PROCESSING': return 'Đang xử lý';
            case 'DELIVERED': return 'Đã giao';
            case 'PENDING': return 'Chờ xử lý';
            case 'SHIPPED': return 'Đang giao';
            default: return status || 'N/A';
        }
    };

    const handleView = async (order) => {
        try {
            const details = await orderService.getOrderById(order.id);
            openView({ ...order, ...details });
        } catch (error) {
            console.error('Failed to fetch order details', error);
            openView(order);
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await orderService.updateOrderStatus(orderId, newStatus);
            await fetchOrders(keyword);
        } catch (error) {
            const msg = error.response?.data?.message || error.message || 'Cập nhật trạng thái thất bại';
            alert(`Lỗi: ${msg}`);
        }
    };

    const filteredOrders = filterStatus === 'all'
        ? orders
        : orders.filter(order => order.status === filterStatus);

    return (
        <div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm đơn hàng..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') fetchOrders(keyword);
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="ml-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="CANCELLED">Đã hủy</option>
                        <option value="PROCESSING">Đang xử lý</option>
                        <option value="DELIVERED">Đã giao</option>
                        <option value="PENDING">Chờ xử lý</option>
                        <option value="SHIPPED">Đang giao</option>
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã Đơn Hàng</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Khách Hàng</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày Đặt</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái Thanh Toán</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số Tiền</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phương Thức Thanh Toán</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái Đơn Hàng</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao Tác</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan="8" className="text-center py-4">Đang tải...</td></tr>
                        ) : filteredOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.code}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.customer}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(order.date)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.paymentStatus}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{formatCurrency(order.amount)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.paymentMethod}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                        order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                                        order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                                        order.status === 'PENDING' ? 'bg-gray-100 text-gray-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {statusLabelVi(order.status)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button
                                        onClick={() => handleView(order)}
                                        className="text-blue-600 hover:text-blue-800 mr-3"
                                    >
                                        <Eye size={18} />
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
                    title={`Chi Tiết Đơn Hàng ${viewData.code || `ORD${viewData.id}`}`}
                    size="xl"
                >
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mã Đơn Hàng</label>
                                <p className="text-gray-900 font-semibold">{viewData.code || `ORD${viewData.id}`}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày Đặt</label>
                                <p className="text-gray-900">{formatDate(viewData.date || viewData.createdAt)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Khách Hàng</label>
                                <p className="text-gray-900">{viewData.customer}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng Thái Đơn Hàng</label>
                                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                    viewData.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                        viewData.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                                            viewData.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                                                viewData.status === 'PENDING' ? 'bg-gray-100 text-gray-800' :
                                                    'bg-red-100 text-red-800'
                                }`}>
                                    {statusLabelVi(viewData.status)}
                                </span>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Thanh Toán</label>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="font-medium text-gray-900">Trạng thái: {viewData.paymentStatus || 'N/A'}</p>
                                <p className="font-medium text-gray-900">Phương thức: {viewData.paymentMethod || 'N/A'}</p>
                                <p className="text-2xl font-bold text-blue-600 mt-2">{formatCurrency(viewData.amount)}</p>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sản Phẩm</label>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                {Array.isArray(viewData.items) && viewData.items.length ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        {viewData.items.map((it, idx) => (
                                            <div key={idx} className="flex items-center justify-between">
                                                <div className="text-sm text-gray-800">
                                                    {it.productName || it.name || `Sản phẩm #${it.productId || ''}`}
                                                    {typeof it.quantity === 'number' ? ` × ${it.quantity}` : ''}
                                                </div>
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {typeof it.price === 'number' ? formatCurrency(it.price) : (it.price || '')}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-600">Không có dữ liệu sản phẩm.</p>
                                )}
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cập Nhật Trạng Thái</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        handleUpdateStatus(viewData.id, 'CANCELLED');
                                        closeView();
                                    }}
                                    className="flex-1 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Đã hủy
                                </button>
                                <button
                                    onClick={() => {
                                        handleUpdateStatus(viewData.id, 'PROCESSING');
                                        closeView();
                                    }}
                                    className="flex-1 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-600 transition-colors"
                                >
                                    Đang xử lý
                                </button>
                                <button
                                    onClick={() => {
                                        handleUpdateStatus(viewData.id, 'DELIVERED');
                                        closeView();
                                    }}
                                    className="flex-1 px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    Đã giao
                                </button>
                                <button
                                    onClick={() => {
                                        handleUpdateStatus(viewData.id, 'PENDING');
                                        closeView();
                                    }}
                                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    Chờ xử lý
                                </button>
                                <button
                                    onClick={() => {
                                        handleUpdateStatus(viewData.id, 'SHIPPED');
                                        closeView();
                                    }}
                                    className="flex-1 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Đang giao
                                </button>
                            </div>
                        </div>

                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Orders;
