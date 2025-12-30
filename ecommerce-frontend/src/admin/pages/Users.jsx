import React, { useState, useEffect } from 'react';
import { Search, Eye, Edit2, Trash2 } from 'lucide-react';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import useModal from '../hooks/useModal';
import userService from '../services/userService';

const Users = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState('');

    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, customer: null });
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

    const viewModalHook = useModal();
    const editModalHook = useModal();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async (searchKeyword = '') => {
        setLoading(true);
        try {
            const data = await userService.getUsers(searchKeyword, 'USER');
            const rawList = Array.isArray(data) ? data : (data?.content || []);
            const filtered = rawList.filter(u => {
                const roles = Array.isArray(u.roles) ? u.roles : (Array.isArray(u.authorities) ? u.authorities : []);
                const roleField = u.role || u.userRole;
                return (Array.isArray(roles) && (roles.includes('USER') || roles.includes('ROLE_USER')))
                    || (roleField === 'USER' || roleField === 'ROLE_USER');
            });
            const normalizedData = filtered.map(user => ({
                id: user.id,
                name: user.fullName,
                email: user.email,
                phone: user.phone,
                createdAt: user.createdAt
            }));
            setCustomers(normalizedData);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            fetchUsers(keyword);
        }
    };

    const handleView = async (customer) => {
        try {
            const details = await userService.getUserById(customer.id);
            viewModalHook.openModal({
                ...customer,
                ...details // Merge thêm thông tin chi tiết nếu có
            });
        } catch (error) {
            console.error("Failed to fetch user details", error);
            // Fallback dùng thông tin hiện có
            viewModalHook.openModal(customer);
        }
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

    const confirmDelete = async () => {
        if (deleteDialog.customer) {
            try {
                await userService.deleteUser(deleteDialog.customer.id);
                fetchUsers(keyword); // Refresh list
            } catch (error) {
                console.error("Failed to delete user", error);
                alert("Xóa người dùng thất bại!");
            }
        }
        setDeleteDialog({ isOpen: false, customer: null });
    };

    const handleSaveEdit = async () => {
        if (editModalHook.modalData) {
            try {
                if (!formData.phone || String(formData.phone).trim() === '') {
                    alert("Số điện thoại không được để trống");
                    return;
                }
                // Mapping formData về đúng format API cần (nếu cần)
                const updateData = {
                    fullName: formData.name,
                    phone: formData.phone,
                    email: formData.email,
                };
                await userService.updateUser(editModalHook.modalData.id, updateData);
                fetchUsers(keyword); // Refresh list
                editModalHook.closeModal();
            } catch (error) {
                console.error("Failed to update user", error);
                const errorMessage = error.response?.data?.message || error.message || "Cập nhật thất bại!";
                alert(`Lỗi: ${errorMessage}`);
            }
        }
    };

    // Helper format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm khách hàng..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={handleSearch}
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao Tác</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {loading ? (
                             <tr><td colSpan="5" className="text-center py-4">Đang tải...</td></tr>
                        ) : customers.length === 0 ? (
                             <tr><td colSpan="5" className="text-center py-4">Không tìm thấy khách hàng nào.</td></tr>
                        ) : (
                            customers.map((customer) => (
                            <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                                            {(customer.name || '?').split(' ').pop().charAt(0)}
                                        </div>
                                        <div className="font-medium text-gray-900">{customer.name}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{customer.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{customer.phone}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(customer.createdAt)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleView(customer)}
                                            className="p-2 bg-blue-300 text-gray-600 hover:bg-blue-600 rounded-lg transition-colors"
                                            title="Xem chi tiết"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(customer)}
                                            className="p-2 bg-green-300 text-gray-600 hover:bg-green-600 rounded-lg transition-colors"
                                            title="Chỉnh sửa"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(customer)}
                                            className="p-2 bg-red-300 text-gray-600 hover:bg-red-600 rounded-lg transition-colors"
                                            title="Xóa"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )))}
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tạo</label>
                            <p className="text-gray-900">{formatDate(viewModalHook.modalData.createdAt)}</p>
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
