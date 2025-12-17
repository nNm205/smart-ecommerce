// pages/Products.jsx - Shop Layout Style
import React, { useState } from 'react';
import { Search, Maximize2, RefreshCw, Edit2, Trash2 } from 'lucide-react';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import ImageUpload from '../components/common/ImageUpload';
import ProductDetail from '../components/products/ProductDetail';
import useModal from '../hooks/useModal';

const Products = () => {
    const [products, setProducts] = useState([
        { id: 1, name: 'iPhone 15 Pro', price: '29,990,000', oldPrice: '32,990,000', stock: 45, category: 'Điện thoại', image: 'https://via.placeholder.com/300', rating: 5, reviews: 128 },
        { id: 2, name: 'MacBook Air M2', price: '28,490,000', oldPrice: null, stock: 23, category: 'Laptop', image: 'https://via.placeholder.com/300', rating: 5, reviews: 95 },
        { id: 3, name: 'AirPods Pro', price: '6,490,000', oldPrice: '7,490,000', stock: 120, category: 'Phụ kiện', image: 'https://via.placeholder.com/300', rating: 4, reviews: 203 },
        { id: 4, name: 'iPad Air', price: '15,990,000', oldPrice: null, stock: 67, category: 'Tablet', image: 'https://via.placeholder.com/300', rating: 5, reviews: 87 },
        { id: 5, name: 'Apple Watch Series 9', price: '10,990,000', oldPrice: '12,990,000', stock: 89, category: 'Phụ kiện', image: 'https://via.placeholder.com/300', rating: 5, reviews: 156 },
        { id: 6, name: 'Magic Keyboard', price: '3,490,000', oldPrice: null, stock: 156, category: 'Phụ kiện', image: 'https://via.placeholder.com/300', rating: 4, reviews: 64 },
        { id: 7, name: 'iPhone 14', price: '19,990,000', oldPrice: '24,990,000', stock: 34, category: 'Điện thoại', image: 'https://via.placeholder.com/300', rating: 5, reviews: 142 },
        { id: 8, name: 'MacBook Pro M3', price: '45,990,000', oldPrice: null, stock: 12, category: 'Laptop', image: 'https://via.placeholder.com/300', rating: 5, reviews: 78 },
    ]);

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const categories = [
        { id: 'all', name: 'Tất cả sản phẩm', count: products.length },
        { id: 'Điện thoại', name: 'Điện thoại', count: products.filter(p => p.category === 'Điện thoại').length },
        { id: 'Laptop', name: 'Laptop', count: products.filter(p => p.category === 'Laptop').length },
        { id: 'Phụ kiện', name: 'Phụ kiện', count: products.filter(p => p.category === 'Phụ kiện').length },
        { id: 'Tablet', name: 'Tablet', count: products.filter(p => p.category === 'Tablet').length },
    ];

    const editModalHook = useModal();
    const addModalHook = useModal();
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, product: null });
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        stock: '',
        category: 'Điện thoại',
        image: null,
    });

    const filteredProducts = products.filter(product => {
        const matchCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCategory && matchSearch;
    });

    const handleProductClick = (product) => {
        setSelectedProduct(product);
    };

    const handleEdit = (product, e) => {
        e.stopPropagation();
        setFormData({
            name: product.name,
            price: product.price,
            stock: product.stock,
            category: product.category,
            image: product.image,
        });
        editModalHook.openModal(product);
    };

    const handleAdd = () => {
        setFormData({
            name: '',
            price: '',
            stock: '',
            category: 'Điện thoại',
            image: null,
        });
        addModalHook.openModal();
    };

    const handleDelete = (product, e) => {
        e.stopPropagation();
        setDeleteDialog({ isOpen: true, product });
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
            oldPrice: null,
            stock: parseInt(formData.stock),
            category: formData.category,
            image: formData.image || 'https://via.placeholder.com/300',
            rating: 5,
            reviews: 0,
        };
        setProducts([...products, newProduct]);
        addModalHook.closeModal();
    };

    const handleSaveEdit = () => {
        if (editModalHook.modalData) {
            setProducts(products.map(p =>
                p.id === editModalHook.modalData.id
                    ? { ...p, name: formData.name, price: formData.price, stock: parseInt(formData.stock), category: formData.category, image: formData.image || p.image }
                    : p
            ));
            editModalHook.closeModal();
        }
    };

    const renderStars = (rating) => {
        return (
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                ))}
            </div>
        );
    };

    return (
        <div className="flex gap-6">
            {/* Sidebar */}
            <div className="w-80 flex-shrink-0">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Danh Mục Sản Phẩm</h3>
                    <div className="space-y-2">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors text-left ${
                                    selectedCategory === category.id
                                        ? 'bg-blue-50 text-blue-600 font-medium'
                                        : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                <span className="flex items-center gap-2">
                  <span className={selectedCategory === category.id ? '' : 'text-gray-400'}>›</span>
                    {category.name}
                </span>
                                <span className="text-gray-500">{category.count}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
                {/* Header */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-center gap-4 ml-6">
                            <span className="text-gray-600"> 1–{filteredProducts.length} trong số {filteredProducts.length} </span>
                            <button
                                onClick={handleAdd}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Tải sản phẩm lên
                            </button>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                {filteredProducts.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-6">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-lg shadow hover:shadow-xl transition-all group cursor-pointer overflow-hidden"
                            >
                                <div className="relative overflow-hidden bg-gray-100">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-300"
                                        onClick={() => handleProductClick(product)}
                                    />
                                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleProductClick(product)}
                                            className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
                                        >
                                            <Maximize2 size={20} className="text-gray-600" />
                                        </button>
                                        <button className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-colors">
                                            <RefreshCw size={20} className="text-gray-600" />
                                        </button>
                                    </div>
                                    <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => handleEdit(product, e)}
                                            className="p-2 bg-blue-500 text-white rounded-full shadow hover:bg-blue-600 transition-colors"
                                            title="Sửa"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(product, e)}
                                            className="p-2 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition-colors"
                                            title="Xóa"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3
                                        className="font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors cursor-pointer"
                                        onClick={() => handleProductClick(product)}
                                    >
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mb-3">
                                        {product.oldPrice && (
                                            <span className="text-gray-400 line-through text-sm">₫{product.oldPrice}</span>
                                        )}
                                        <span className="text-blue-600 font-bold text-lg">₫{product.price}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-4">
                                        {renderStars(product.rating)}
                                        <span className="text-sm text-gray-500">({product.reviews})</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Product Detail Modal */}
            {selectedProduct && (
                <ProductDetail
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}

            {/* Edit Modal */}
            {editModalHook.isOpen && (
                <Modal
                    isOpen={editModalHook.isOpen}
                    onClose={editModalHook.closeModal}
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Giá (VND)</label>
                            <input
                                type="text"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                placeholder="29,990,000"
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

            {/* Add Modal */}
            {addModalHook.isOpen && (
                <Modal
                    isOpen={addModalHook.isOpen}
                    onClose={addModalHook.closeModal}
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Giá (VND)</label>
                            <input
                                type="text"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                placeholder="29,990,000"
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
                                onClick={addModalHook.closeModal}
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