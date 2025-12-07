import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import useModal from '../hooks/useModal';

const Users = () => {
    const [customers, setCustomers] = useState([
        { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com', phone: '0912345678', orders: 12, total: '₫89,500,000', status: 'VIP' },
        { id: 2, name: 'Trần Thị B', email: 'tranthib@gmail.com', phone: '0923456789', orders: 8, total: '₫45,200,000', status: 'Thường' },
        { id: 3, name: 'Lê Văn C', email: 'levanc@gmail.com', phone: '0934567890', orders: 5, total: '₫28,900,000', status: 'Thường' },
        { id: 4, name: 'Phạm Thị D', email: 'phamthid@gmail.com', phone: '0945678901', orders: 15, total: '₫125,400,000', status: 'VIP' },
    ]);

    // View Modal
    const viewModalHook = useModal();
    const isViewOpen = viewModalHook.isOpen;
    const viewData = viewModalHook.modalData;
    const openView = viewModalHook.openModal;
    const closeView = viewModalHook.closeModal;

    // Edit Modal
    const editModalHook = useModal();
    const isEditOpen = editModalHook.isOpen;
    const editData = editModalHook.modalData;
    const openEdit = editModalHook.openModal;
    const closeEdit = editModalHook.closeModal;

    // Add Modal
    const addModalHook = useModal();
    const isAddOpen = addModalHook.isOpen;
    const openAdd = addModalHook.openModal;
    const closeAdd = addModalHook.closeModal;

    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, customer: null });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        status: 'Thường',
    });

    const handleView = (customer) => {
        openView(customer);
    };

    const handleEdit = (customer) => {
        setFormData({
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            status: customer.status,
        });
        openEdit(customer);
    };

    const handleAdd = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            status: 'Thường',
        });
        openAdd();
    };

    const handleDelete = (customer) => {
        setDeleteDialog({ isOpen: true, customer: customer });
    };

    const confirmDelete = () => {
        if (deleteDialog.customer) {
            setCustomers(customers.filter(c => c.id !== deleteDialog.customer.id));
        }
        setDeleteDialog({ isOpen: false, customer: null });
    };

    const handleSaveAdd = () => {
        const newCustomer = {
            id: Date.now(),
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            status: formData.status,
            orders: 0,
            total: '₫0',
        };
        setCustomers([...customers, newCustomer]);
        closeAdd();
    };

    const handleSaveEdit = () => {
        if (editData) {
            setCustomers(customers.map(c =>
                c.id === editData.id
                    ? { ...c, name: formData.name, email: formData.email, phone: formData.phone, status: formData.status }
                    : c
            ));
            closeEdit();
        }
    };

    return (
        <div>
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
                    <button
                        onClick={handleAdd}
                        className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
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
                                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        customer.status === 'VIP' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {customer.status}
                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button
                                        onClick={() => handleView(customer)}
                                        className="text-blue-600 hover:text-blue-800 mr-3"
                                    >
                                        Xem
                                    </button>
                                    <button
                                        onClick={() => handleEdit(customer)}
                                        className="text-green-600 hover:text-green-800 mr-3"
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDelete(customer)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Modal */}
            {isViewOpen && viewData && (
                <Modal
                    isOpen={isViewOpen}
                    onClose={closeView}
                    title="Chi Tiết Khách Hàng"
                    size="md"
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên Khách Hàng</label>
                            <p className="text-gray-900">{viewData.name}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <p className="text-gray-900">{viewData.email}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số Điện Thoại</label>
                            <p className="text-gray-900">{viewData.phone}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số Đơn Hàng</label>
                            <p className="text-gray-900">{viewData.orders}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tổng Chi Tiêu</label>
                            <p className="text-gray-900">{viewData.total}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng Thái</label>
                            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                                viewData.status === 'VIP' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                {viewData.status}
              </span>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Edit Modal */}
            {isEditOpen && (
                <Modal
                    isOpen={isEditOpen}
                    onClose={closeEdit}
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Trạng Thái</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Thường">Thường</option>
                                <option value="VIP">VIP</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                onClick={closeEdit}
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

            {/* Add Modal */}
            {isAddOpen && (
                <Modal
                    isOpen={isAddOpen}
                    onClose={closeAdd}
                    title="Thêm Khách Hàng Mới"
                    size="md"
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tên Khách Hàng</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Nhập tên khách hàng"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="example@gmail.com"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Số Điện Thoại</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="0912345678"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Trạng Thái</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Thường">Thường</option>
                                <option value="VIP">VIP</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                onClick={closeAdd}
                                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSaveAdd}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Thêm
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Delete Confirmation Dialog */}
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