import React, { useState } from 'react';
import { Search, Eye, Edit2, Trash2 } from 'lucide-react';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import useModal from '../hooks/useModal';

const Users = () => {
    const [customers, setCustomers] = useState([
        { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com', phone: '0912345678', orders: 12, total: '₫89,500,000' },
        { id: 2, name: 'Trần Thị B', email: 'tranthib@gmail.com', phone: '0923456789', orders: 8, total: '₫45,200,000' },
        { id: 3, name: 'Lê Văn C', email: 'levanc@gmail.com', phone: '0934567890', orders: 5, total: '₫28,900,000' },
        { id: 4, name: 'Phạm Thị D', email: 'phamthid@gmail.com', phone: '0945678901', orders: 15, total: '₫125,400,000' },
    ]);

    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, customer: null });
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

    const viewModalHook = useModal();
    const editModalHook = useModal();

    const handleView = (customer) => {
        viewModalHook.openModal(customer);
    };

    const handleEdit = (customer) => {
        setFormData({
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
        });
        editModalHook.openModal(customer);
    };

    const handleDelete = (customer) => {
        setDeleteDialog({ isOpen: true, customer });
    };

    const confirmDelete = () => {
        if (deleteDialog.customer) {
            setCustomers(customers.filter(c => c.id !== deleteDialog.customer.id));
        }
        setDeleteDialog({ isOpen: false, customer: null });
    };

    const handleSaveEdit = () => {
        if (editModalHook.modalData) {
            setCustomers(customers.map(c =>
                c.id === editModalHook.modalData.id
                    ? { ...c, ...formData }
                    : c
            ));
            editModalHook.closeModal();
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Khách Hàng</h2>
                <p className="text-gray-600">Quản lý danh sách khách hàng</p>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm khách hàng..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao Tác</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {customers.map((customer) => (
                            <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
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
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleView(customer)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Xem chi tiết"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(customer)}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            title="Chỉnh sửa"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(customer)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Xóa"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {viewModalHook.isOpen && viewModalHook.modalData && (
                <Modal
                    isOpen={viewModalHook.isOpen}
                    onClose={viewModalHook.closeModal}
                    title="Chi Tiết Khách Hàng"
                    size="md"
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên Khách Hàng</label>
                            <p className="text-gray-900">{viewModalHook.modalData.name}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <p className="text-gray-900">{viewModalHook.modalData.email}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số Điện Thoại</label>
                            <p className="text-gray-900">{viewModalHook.modalData.phone}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số Đơn Hàng</label>
                            <p className="text-gray-900">{viewModalHook.modalData.orders}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tổng Chi Tiêu</label>
                            <p className="text-gray-900">{viewModalHook.modalData.total}</p>
                        </div>
                    </div>
                </Modal>
            )}

            {editModalHook.isOpen && (
                <Modal
                    isOpen={editModalHook.isOpen}
                    onClose={editModalHook.closeModal}
                    title="Chỉnh Sửa Khách Hàng"
                    size="md"
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tên Khách Hàng</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Số Điện Thoại</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                onClick={editModalHook.closeModal}
                                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {deleteDialog.isOpen && (
                <ConfirmDialog
                    isOpen={deleteDialog.isOpen}
                    onClose={() => setDeleteDialog({ isOpen: false, customer: null })}
                    onConfirm={confirmDelete}
                    title="Xác Nhận Xóa"
                    message={deleteDialog.customer ? `Bạn có chắc chắn muốn xóa khách hàng "${deleteDialog.customer.name}"? Hành động này không thể hoàn tác.` : ''}
                    type="danger"
                />
            )}
        </div>
    );
};

export default Users;