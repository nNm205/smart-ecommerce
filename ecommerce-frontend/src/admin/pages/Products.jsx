import React, { useState, useEffect } from 'react';
import { Search, Maximize2, RefreshCw, Edit2, Trash2, Plus } from 'lucide-react';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import ImageUpload from '../components/common/ImageUpload';
import ProductDetail from '../components/products/ProductDetail';
import useModal from '../hooks/useModal';
import productService from '../services/productService';
import categoryService from '../services/categoryService';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [newCategoryName, setNewCategoryName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const editModalHook = useModal();
    const addModalHook = useModal();
    const addCategoryModalHook = useModal();
    const editCategoryModalHook = useModal();
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, product: null });
    const [deleteCategoryDialog, setDeleteCategoryDialog] = useState({ isOpen: false, category: null });
    const [imageTick, setImageTick] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        categoryId: '',
        description: '',
        variants: { S: 0, M: 0, L: 0, XL: 0 },
        images: [],
    });
    const [newCategoryDescription, setNewCategoryDescription] = useState('');
    const [categoryFormData, setCategoryFormData] = useState({ id: null, name: '' });
    const [totalProductCount, setTotalProductCount] = useState(0);
    const [categoryCounts, setCategoryCounts] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(24);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // Load dữ liệu khi component mount
    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    useEffect(() => {
        const t = setInterval(() => setImageTick((x) => x + 1), 5000);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        loadProducts();
    }, [searchTerm, selectedCategory, currentPage]);

    const toId = (v) => {
        if (v === '' || v === null || v === undefined) return '';
        if (typeof v === 'number') return v;
        const s = String(v);
        return /^\d+$/.test(s) ? parseInt(s, 10) : v;
    };

    const loadProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {
                keyword: String(searchTerm || '').trim() || undefined,
                categoryId: selectedCategory !== 'all' ? toId(selectedCategory) : undefined,
                page: currentPage,
                size: pageSize,
                sortBy: 'createdAt',
                direction: 'DESC',
            };
            const data = await productService.searchProducts(params);
            const rawList =
                Array.isArray(data) ? data :
                    Array.isArray(data?.products) ? data.products :
                        Array.isArray(data?.data) ? data.data :
                            Array.isArray(data?.items) ? data.items :
                                Array.isArray(data?.content) ? data.content :
                                    Array.isArray(data?.result) ? data.result : [];
            const list = Array.isArray(rawList) ? rawList : [];
            const normalized = list.map((p) => {
                const images = Array.isArray(p.imageUrls)
                    ? p.imageUrls
                    : Array.isArray(p.images)
                        ? p.images
                        : (p.image ? [p.image] : []);
                const catObj = (p && typeof p.category === 'object') ? p.category : null;
                const catIdRaw = catObj?.id ?? p.categoryId ?? (typeof p.category === 'number' ? p.category : null);
                const catName = catObj?.name ?? p.categoryName ?? (typeof p.category === 'string' ? p.category : '');
                const variantsArr = Array.isArray(p.variants)
                    ? p.variants
                    : Object.entries(p.variants || {}).map(([size, quantity]) => ({ size, quantity }));
                return {
                    id: p.id,
                    name: p.name,
                    price: typeof p.price === 'number' ? p.price : parseInt(String(p.price).replace(/[₫,]/g, ''), 10) || 0,
                    description: p.description || '',
                    categoryId: toId(catIdRaw),
                    categoryName: catName || undefined,
                    images,
                    variants: variantsArr,
                    rating: p.rating ?? 5,
                    reviews: p.reviews ?? 0,
                };
            });
            const withImages = await Promise.all(normalized.map(async (p) => {
                if (Array.isArray(p.images) && p.images.length) return p;
                try {
                    const imgs = await productService.getProductImages(p.id);
                    const arr =
                        Array.isArray(imgs) ? imgs :
                        Array.isArray(imgs?.images) ? imgs.images :
                        Array.isArray(imgs?.data) ? imgs.data : [];
                    return { ...p, images: arr };
                } catch {
                    return p;
                }
            }));
            setProducts(withImages);
            const total =
                typeof data?.totalElements === 'number' ? data.totalElements :
                typeof data?.data?.totalElements === 'number' ? data.data.totalElements :
                Array.isArray(data) ? data.length :
                Array.isArray(data?.data) ? data.data.length : 0;
            setTotalElements(total);
            const tp =
                typeof data?.totalPages === 'number' ? data.totalPages :
                typeof data?.data?.totalPages === 'number' ? data.data.totalPages :
                total > 0 ? Math.ceil(total / pageSize) : 0;
            setTotalPages(tp);
        } catch (err) {
            setError('Không thể tải danh sách sản phẩm');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const data = await categoryService.getAllCategories();
            setCategoryList(
                (Array.isArray(data) ? data : []).map((cat) => {
                    if (typeof cat === 'string') return { id: cat, name: cat, description: '' };
                    return { id: toId(cat.id), name: cat.name, description: cat.description || '' };
                })
            );
        } catch (err) {
            console.error('Error loading categories:', err);
        }
    };

    const loadCounts = async () => {
        try {
            // Tổng tất cả sản phẩm
            const overall = await productService.searchProducts({ page: 0, size: 1, sortBy: 'createdAt', direction: 'DESC' });
            const overallTotal =
                typeof overall?.totalElements === 'number' ? overall.totalElements :
                typeof overall?.data?.totalElements === 'number' ? overall.data.totalElements :
                Array.isArray(overall) ? overall.length :
                Array.isArray(overall?.data) ? overall.data.length : 0;
            setTotalProductCount(overallTotal);

            // Số lượng theo từng danh mục
            const countsEntries = await Promise.all(
                (Array.isArray(categoryList) ? categoryList : []).map(async (cat) => {
                    try {
                        const res = await productService.searchProducts({ categoryId: cat.id, page: 0, size: 1, sortBy: 'createdAt', direction: 'DESC' });
                        const total =
                            typeof res?.totalElements === 'number' ? res.totalElements :
                            typeof res?.data?.totalElements === 'number' ? res.data.totalElements : 0;
                        return [cat.id, total];
                    } catch {
                        return [cat.id, 0];
                    }
                })
            );
            setCategoryCounts(Object.fromEntries(countsEntries));
        } catch (err) {
            console.error('Error loading counts:', err);
        }
    };

    useEffect(() => {
        if (categoryList.length) {
            loadCounts();
        }
    }, [categoryList]);

    const categories = [
        { id: 'all', name: 'Tất cả sản phẩm', count: totalProductCount },
        ...categoryList.map(cat => ({
            id: cat.id,
            name: cat.name,
            count: categoryCounts[cat.id] ?? 0,
            _raw: cat,
        }))
    ];

    const filteredProducts = Array.isArray(products) ? products : [];

    const handleAddCategory = async () => {
        if (newCategoryName.trim() && !categoryList.some(c => c.name === newCategoryName.trim())) {
            try {
                await categoryService.createCategory({ name: newCategoryName.trim(), description: newCategoryDescription.trim() });
                await loadCategories();
                setNewCategoryName('');
                setNewCategoryDescription('');
                addCategoryModalHook.closeModal();
            } catch (err) {
                alert('Không thể thêm danh mục');
                console.error(err);
            }
        }
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
    };

    const handleEdit = (product, e) => {
        e.stopPropagation();
        const resolveCatId = () => {
            if (product.categoryId !== null && product.categoryId !== undefined) return toId(product.categoryId);
            const name = product.categoryName || product.category;
            if (name) {
                const found = categoryList.find((c) => c.name === name);
                if (found) return toId(found.id);
            }
            return '';
        };
        setFormData({
            name: product.name,
            price: product.price?.toString().replace(/[₫,]/g, ''),
            categoryId: resolveCatId(),
            description: product.description || '',
            variants: Array.isArray(product.variants)
                ? product.variants.reduce((acc, v) => ({ ...acc, [v.size]: v.quantity }), { S: 0, M: 0, L: 0, XL: 0 })
                : (product.variants || { S: 0, M: 0, L: 0, XL: 0 }),
            images: Array.isArray(product.images) ? product.images : (product.image ? [product.image] : []),
        });
        editModalHook.openModal(product);
    };

    const handleAdd = () => {
        if (!categoryList.length) {
            alert('Chưa có danh mục. Vui lòng tạo danh mục trước khi thêm sản phẩm.');
            return;
        }
        setFormData({
            name: '',
            price: '',
            categoryId: categoryList[0]?.id || '',
            description: '',
            variants: { S: 0, M: 0, L: 0, XL: 0 },
            images: [],
        });
        addModalHook.openModal();
    };

    const handleDelete = (product, e) => {
        e.stopPropagation();
        setDeleteDialog({ isOpen: true, product });
    };

    const confirmDelete = async () => {
        if (deleteDialog.product) {
            try {
                await productService.deleteProduct(deleteDialog.product.id);
                await loadProducts();
                await loadCounts();
                setDeleteDialog({ isOpen: false, product: null });
            } catch (err) {
                alert('Không thể xóa sản phẩm');
                console.error(err);
            }
        }
    };

    const handleSaveAdd = async () => {
        try {
            const name = String(formData.name || '').trim();
            const priceRaw = String(formData.price || '').replace(/[₫,.\s]/g, '');
            const price = parseInt(priceRaw, 10);
            const categoryId = toId(formData.categoryId);
            if (!name) {
                alert('Vui lòng nhập tên sản phẩm');
                return;
            }
            if (!priceRaw || isNaN(price) || price <= 0) {
                alert('Vui lòng nhập giá hợp lệ (> 0)');
                return;
            }
            if (categoryId === '' || categoryId === null || categoryId === undefined) {
                alert('Vui lòng chọn danh mục');
                return;
            }

            const variantsArr = ['S','M','L','XL'].map(sz => ({
                size: sz,
                quantity: parseInt(formData.variants[sz] || 0, 10) || 0,
            }));

            const productData = {
                name,
                price,
                categoryId,
                description: String(formData.description || '').trim(),
                variants: variantsArr,
                images: Array.isArray(formData.images) && formData.images.length ? formData.images : [],
                oldPrice: null,
                rating: 5,
                reviews: 0,
            };

                await productService.createProduct(productData);
                await loadProducts();
                await loadCounts();
                addModalHook.closeModal();
            } catch (err) {
                const msg = err?.response?.data?.message || err?.message || 'Không thể thêm sản phẩm';
                alert(msg);
                console.error(err);
        }
    };

    const handleSaveEdit = async () => {
        if (editModalHook.modalData) {
            try {
                const name = String(formData.name || '').trim();
                const priceRaw = String(formData.price || '').replace(/[₫,.\s]/g, '');
                const price = parseInt(priceRaw, 10);
                const categoryId = toId(formData.categoryId !== '' ? formData.categoryId : editModalHook.modalData.categoryId);
                if (!name) {
                    alert('Vui lòng nhập tên sản phẩm');
                    return;
                }
                if (!priceRaw || isNaN(price) || price <= 0) {
                    alert('Vui lòng nhập giá hợp lệ (> 0)');
                    return;
                }
                if (categoryId === '' || categoryId === null || categoryId === undefined) {
                    alert('Vui lòng chọn danh mục');
                    return;
                }

                const variantsArr = ['S','M','L','XL'].map(sz => ({
                    size: sz,
                    quantity: parseInt(formData.variants[sz] || 0, 10) || 0,
                }));

                const productData = {
                    name,
                    price,
                    categoryId,
                    description: String(formData.description || '').trim(),
                    variants: variantsArr,
                    images: Array.isArray(formData.images) ? formData.images : [],
                };

                await productService.updateProduct(editModalHook.modalData.id, productData);
                await loadProducts();
                await loadCounts();
                editModalHook.closeModal();
            } catch (err) {
                const msg = err?.response?.data?.message || err?.message || 'Không thể cập nhật sản phẩm';
                alert(msg);
                console.error(err);
            }
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

    if (loading && products.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải sản phẩm...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={loadProducts}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex gap-6">
            {/* Sidebar */}
            <div className="w-56 flex-shrink-0">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Danh Mục Sản Phẩm</h3>
                        <button
                            onClick={() => addCategoryModalHook.openModal()}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Thêm danh mục"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                    <div className="space-y-2">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => {
                                    setSelectedCategory(category.id);
                                    setCurrentPage(0);
                                }}
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
                                <span className="flex items-center gap-2">
                                    <span className="text-gray-500">{category.count}</span>
                                    {category.id !== 'all' && (
                                        <>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const raw = category._raw;
                                                    setCategoryFormData({ id: raw.id, name: raw.name, description: raw.description || '' });
                                                    editCategoryModalHook.openModal();
                                                }}
                                                className="p-1 rounded hover:bg-blue-100 text-blue-600"
                                                title="Sửa danh mục"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDeleteCategoryDialog({ isOpen: true, category: category._raw });
                                                }}
                                                className="p-1 rounded hover:bg-red-100 text-red-600"
                                                title="Xóa danh mục"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </>
                                    )}
                                </span>
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
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(0);
                                }}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-center gap-4 ml-6">
                            <span className="text-gray-600">
                                {totalElements === 0 ? '0–0' : `${currentPage * pageSize + 1}–${currentPage * pageSize + (filteredProducts.length || 0)}`} trong số {totalElements}
                            </span>
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
                                        src={(Array.isArray(product.images) && product.images.length
                                            ? product.images[imageTick % product.images.length]
                                            : (product.image || 'https://picsum.photos/600/400'))}
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
                                        <span className="text-blue-600 font-bold text-lg">
                                            ₫{(typeof product.price === 'number'
                                                ? product.price
                                                : Number(String(product.price).replace(/[₫,]/g, ''))).toLocaleString('vi-VN')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-4">
                                        {renderStars(product.rating || 5)}
                                        <span className="text-sm text-gray-500">({product.reviews || 0})</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-center gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                            disabled={currentPage === 0}
                            className={`px-3 py-2 rounded border ${currentPage === 0 ? 'text-gray-400 border-gray-200 bg-gray-100 cursor-not-allowed' : 'text-gray-700 border-gray-300 bg-white hover:bg-gray-50'}`}
                        >
                            Trước
                        </button>
                        <span className="px-3 py-2 text-gray-700">
                            Trang {currentPage + 1}/{totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                            disabled={currentPage >= totalPages - 1}
                            className={`px-3 py-2 rounded border ${currentPage >= totalPages - 1 ? 'text-gray-400 border-gray-200 bg-gray-100 cursor-not-allowed' : 'text-gray-700 border-gray-300 bg-white hover:bg-gray-50'}`}
                        >
                            Sau
                        </button>
                    </div>
                )}
            </div>

            {/* Add Category Modal */}
            {addCategoryModalHook.isOpen && (
                <Modal
                    isOpen={addCategoryModalHook.isOpen}
                    onClose={addCategoryModalHook.closeModal}
                    title="Thêm Danh Mục Mới"
                    size="sm"
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tên Danh Mục</label>
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="Nhập tên danh mục"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mô Tả</label>
                            <textarea
                                rows="3"
                                value={newCategoryDescription}
                                onChange={(e) => setNewCategoryDescription(e.target.value)}
                                placeholder="Mô tả danh mục"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                onClick={addCategoryModalHook.closeModal}
                                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleAddCategory}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Thêm
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {deleteDialog.isOpen && (
                <ConfirmDialog isOpen={deleteDialog.isOpen} onClose={() => setDeleteDialog({ isOpen: false, product: null })} onConfirm={confirmDelete} title="Xác Nhận Xóa" message={deleteDialog.product ? `Bạn có chắc chắn muốn xóa sản phẩm "${deleteDialog.product.name}"?` : ''} type="danger" />
            )}

            {selectedProduct && <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />}

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
                                multiple
                                value={formData.images}
                                onChange={(imagesData) => setFormData({ ...formData, images: imagesData })}
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Số Lượng Theo Size</label>
                            <div className="grid grid-cols-4 gap-3">
                                {['S','M','L','XL'].map((sz) => (
                                    <div key={sz}>
                                        <label className="text-xs text-gray-600 mb-1 block">{sz}</label>
                                        <input
                                            type="number"
                                            value={formData.variants[sz]}
                                            onChange={(e) => setFormData({ ...formData, variants: { ...formData.variants, [sz]: e.target.value } })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            min="0"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Danh Mục</label>
                            <select
                                value={String(formData.categoryId ?? '')}
                                onChange={(e) => setFormData({ ...formData, categoryId: toId(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {categoryList.map((cat) => (
                                    <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mô Tả</label>
                            <textarea
                                rows="3"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                                multiple
                                value={formData.images}
                                onChange={(imagesData) => setFormData({ ...formData, images: imagesData })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tên Sản Phẩm</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder=""
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Giá (VND)</label>
                            <input
                                type="text"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                placeholder=""
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Số Lượng Theo Size</label>
                            <div className="grid grid-cols-4 gap-3">
                                {['S','M','L','XL'].map((sz) => (
                                    <div key={sz}>
                                        <label className="text-xs text-gray-600 mb-1 block">{sz}</label>
                                        <input
                                            type="number"
                                            value={formData.variants[sz]}
                                            onChange={(e) => setFormData({ ...formData, variants: { ...formData.variants, [sz]: e.target.value } })}
                                            placeholder=""
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            min="0"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Danh Mục</label>
                            <select
                                value={String(formData.categoryId ?? '')}
                                onChange={(e) => setFormData({ ...formData, categoryId: toId(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {categoryList.map((cat) => (
                                    <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mô Tả</label>
                            <textarea
                                rows="3"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder=""
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
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

            {editCategoryModalHook.isOpen && (
                <Modal
                    isOpen={editCategoryModalHook.isOpen}
                    onClose={editCategoryModalHook.closeModal}
                    title="Sửa Danh Mục"
                    size="sm"
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tên Danh Mục</label>
                            <input
                                type="text"
                                value={categoryFormData.name}
                                onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onKeyDown={(e) => e.key === 'Enter' && (async () => {
                                    try {
                                        await categoryService.updateCategory(categoryFormData.id, { name: categoryFormData.name.trim(), description: categoryFormData.description?.trim() || '' });
                                        await loadCategories();
                                        editCategoryModalHook.closeModal();
                                    } catch {
                                        alert('Không thể cập nhật danh mục');
                                    }
                                })()}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mô Tả</label>
                            <textarea
                                rows="3"
                                value={categoryFormData.description || ''}
                                onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                onClick={editCategoryModalHook.closeModal}
                                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        await categoryService.updateCategory(categoryFormData.id, { name: categoryFormData.name.trim(), description: categoryFormData.description?.trim() || '' });
                                        await loadCategories();
                                        editCategoryModalHook.closeModal();
                                    } catch {
                                        alert('Không thể cập nhật danh mục');
                                    }
                                }}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {deleteCategoryDialog.isOpen && (
                <ConfirmDialog
                    isOpen={deleteCategoryDialog.isOpen}
                    onClose={() => setDeleteCategoryDialog({ isOpen: false, category: null })}
                    onConfirm={async () => {
                        if (deleteCategoryDialog.category) {
                            try {
                                await categoryService.deleteCategory(deleteCategoryDialog.category.id);
                                await loadCategories();
                                if (selectedCategory === deleteCategoryDialog.category.name) {
                                    setSelectedCategory('all');
                                }
                                setDeleteCategoryDialog({ isOpen: false, category: null });
                            } catch {
                                alert('Không thể xóa danh mục');
                            }
                        }
                    }}
                    title="Xác Nhận Xóa Danh Mục"
                    message={deleteCategoryDialog.category ? `Bạn có chắc chắn muốn xóa danh mục "${deleteCategoryDialog.category.name}"?` : ''}
                    type="danger"
                />
            )}
        </div>
    );
};

export default Products;
