import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import ImageUpload from '../components/common/ImageUpload';
import useModal from '../hooks/useModal';

const Products = () => {
    const [products, setProducts] = useState([
        { id: 1, name: 'iPhone 15 Pro', price: '₫29,990,000', stock: 45, category: 'Điện thoại', image: 'https://via.placeholder.com/150' },
        { id: 2, name: 'MacBook Air M2', price: '₫28,490,000', stock: 23, category: 'Laptop', image: 'https://via.placeholder.com/150' },
        { id: 3, name: 'AirPods Pro', price: '₫6,490,000', stock: 120, category: 'Phụ kiện', image: 'https://via.placeholder.com/150' },
        { id: 4, name: 'iPad Air', price: '₫15,990,000', stock: 67, category: 'Tablet', image: 'https://via.placeholder.com/150' },
        { id: 5, name: 'Apple Watch', price: '₫10,990,000', stock: 89, category: 'Phụ kiện', image: 'https://via.placeholder.com/150' },
        { id: 6, name: 'Magic Keyboard', price: '₫3,490,000', stock: 156, category: 'Phụ kiện', image: 'https://via.placeholder.com/150' },
        { id: 7, name: 'iPhone 14', price: '₫19,990,000', stock: 34, category: 'Điện thoại', image: 'https://via.placeholder.com/150' },
        { id: 8, name: 'MacBook Pro', price: '₫45,990,000', stock: 12, category: 'Laptop', image: 'https://via.placeholder.com/150' },
    ]);

    // Modals
    const editModalHook = useModal();
    const isEditOpen = editModalHook.isOpen;
    const editData = editModalHook.modalData;
    const openEdit = editModalHook.openModal;
    const closeEdit = editModalHook.closeModal;

    const addModalHook = useModal();
    const isAddOpen = addModalHook.isOpen;
    const openAdd = addModalHook.openModal;
    const closeAdd = addModalHook.closeModal;

    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, product: null });

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        stock: '',
        category: 'Điện thoại',
        image: null,
    });

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            price: product.price,
            stock: product.stock,
            category: product.category,
            image: product.image,
        });
        openEdit(product);
    };

    const handleAdd = () => {
        setFormData({
            name: '',
            price: '',
            stock: '',
            category: 'Điện thoại',
            image: null,
        });
        openAdd();
    };

    const handleDelete = (product) => {
        setDeleteDialog({ isOpen: true, product: product });
    };

    const confirmDelete = () => {
        if (deleteDialog.product) {
            setProducts(products.filter(p => p.id !== deleteDialog.product.id));
        }
        setDeleteDialog({ isOpen: false, product: null });
    };

    const handleSaveAdd = () => {
        const newProduct = {
            id: Date.now(),
            name: formData.name,
            price: formData.price,
            stock: parseInt(formData.stock),
            category: formData.category,
            image: formData.image || 'https://via.placeholder.com/150',
        };
        setProducts([...products, newProduct]);
        closeAdd();
    };

    const handleSaveEdit = () => {
        if (editData) {
            setProducts(products.map(p =>
                p.id === editData.id
                    ? { ...p, name: formData.name, price: formData.price, stock: parseInt(formData.stock), category: formData.category, image: formData.image || p.image }
                    : p
            ));
            closeEdit();
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Sản Phẩm</h2>
                <p className="text-gray-600">Quản lý danh mục sản phẩm</p>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        onClick={handleAdd}
                        className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        + Thêm Sản Phẩm
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-40 object-cover rounded-lg mb-4"
                            />
                            <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                            <p className="text-lg font-bold text-blue-600 mb-2">{product.price}</p>
                            <p className="text-sm text-gray-600 mb-4">Kho: {product.stock}</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(product)}
                                    className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                                >
                                    Sửa
                                </button>
                                <button
                                    onClick={() => handleDelete(product)}
                                    className="flex-1 px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Edit Modal */}
            {isEditOpen && (
                <Modal
                    isOpen={isEditOpen}
                    onClose={closeEdit}
                    title="Chỉnh Sửa Sản Phẩm"
                    size="md"
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Hình Ảnh Sản Phẩm</label>
                            <ImageUpload
                                value={formData.image}
                                onChange={(imageData) => setFormData({ ...formData, image: imageData })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tên Sản Phẩm</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Giá</label>
                            <input
                                type="text"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                placeholder="₫29,990,000"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Số Lượng Kho</label>
                            <input
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Danh Mục</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Điện thoại">Điện thoại</option>
                                <option value="Laptop">Laptop</option>
                                <option value="Phụ kiện">Phụ kiện</option>
                                <option value="Tablet">Tablet</option>
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
                    title="Thêm Sản Phẩm Mới"
                    size="md"
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Hình Ảnh Sản Phẩm</label>
                            <ImageUpload
                                value={formData.image}
                                onChange={(imageData) => setFormData({ ...formData, image: imageData })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tên Sản Phẩm</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="iPhone 15 Pro"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Giá</label>
                            <input
                                type="text"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                placeholder="₫29,990,000"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Số Lượng Kho</label>
                            <input
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                placeholder="50"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Danh Mục</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Điện thoại">Điện thoại</option>
                                <option value="Laptop">Laptop</option>
                                <option value="Phụ kiện">Phụ kiện</option>
                                <option value="Tablet">Tablet</option>
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
                    onClose={() => setDeleteDialog({ isOpen: false, product: null })}
                    onConfirm={confirmDelete}
                    title="Xác Nhận Xóa"
                    message={deleteDialog.product ? `Bạn có chắc chắn muốn xóa sản phẩm "${deleteDialog.product.name}"? Hành động này không thể hoàn tác.` : ''}
                    type="danger"
                />
            )}
        </div>
    );
};

export default Products;