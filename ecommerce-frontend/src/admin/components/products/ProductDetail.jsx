import React from 'react';
import { X, Package, DollarSign, Tag } from 'lucide-react';

const ProductDetail = ({ product, onClose }) => {
    const priceNumber = typeof (product?.price) === 'number'
        ? product?.price
        : parseInt(String(product?.price || '').replace(/[₫,]/g, ''), 10) || 0;
    const categoryLabel =
        (product?.category && typeof product.category === 'object' && product.category?.name)
        || product?.categoryName
        || (typeof product?.category === 'string' ? product.category : null)
        || ((product?.categoryId !== null && product?.categoryId !== undefined) ? `Danh mục #${product?.categoryId}` : 'Không xác định');

    if (!product) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" onClick={onClose}>
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">Chi Tiết Sản Phẩm</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Product Image */}
                        <div>
                            <img
                                src={(Array.isArray(product.images) && product.images.length ? product.images[0] : product.image)}
                                alt={product.name}
                                className="w-full h-80 object-cover rounded-lg border border-gray-200"
                            />
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h3>
                                <div className="flex items-center gap-2">
                                    <Tag size={18} className="text-gray-400" />
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                        {categoryLabel}
                                    </span>
                                    {product.size && (
                                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                                            Size {product.size}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="border-t border-b border-gray-200 py-4">
                                <div className="flex items-baseline gap-2">
                                    <DollarSign size={24} className="text-blue-600" />
                                    <span className="text-4xl font-bold text-blue-600">
                                        ₫{priceNumber.toLocaleString('vi-VN')}
                                    </span>
                                </div>
                            </div>

                            {product.description && (
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 mb-2">Mô Tả</h4>
                                    <p className="text-gray-700 text-sm leading-relaxed">{product.description}</p>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Package size={20} className="text-gray-600" />
                                        <span className="text-gray-700 font-medium">Tồn kho</span>
                                    </div>
                                    {(() => {
                                        const total = Array.isArray(product.variants)
                                            ? product.variants.reduce((sum, v) => sum + parseInt(v.quantity || 0), 0)
                                            : parseInt(product.stock || 0) || 0;
                                        const color = total > 50 ? 'text-green-600' : total > 20 ? 'text-yellow-600' : 'text-red-600';
                                        return <span className={`text-lg font-bold ${color}`}>{total} sản phẩm</span>;
                                    })()}
                                </div>

                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 mb-2">Trạng Thái</h4>
                                    <div className="flex items-center gap-2">
                                        {(() => {
                                            const total = Array.isArray(product.variants)
                                                ? product.variants.reduce((sum, v) => sum + parseInt(v.quantity || 0), 0)
                                                : parseInt(product.stock || 0) || 0;
                                            return total > 0;
                                        })() ? (
                                            <>
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span className="text-green-700 font-medium">Còn hàng</span>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                <span className="text-red-700 font-medium">Hết hàng</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {(() => {
                                    const total = Array.isArray(product.variants)
                                        ? product.variants.reduce((sum, v) => sum + parseInt(v.quantity || 0), 0)
                                        : parseInt(product.stock || 0) || 0;
                                    return total < 20 && total > 0;
                                })() && (
                                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <p className="text-yellow-800 text-sm">
                                            ⚠️ <strong>Cảnh báo:</strong> Sản phẩm sắp hết hàng. Vui lòng nhập thêm!
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-6 p-6 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-4">Thông Tin Bổ Sung</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Mã sản phẩm</p>
                                <p className="font-medium text-gray-800">SP{product.id.toString().padStart(4, '0')}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Danh mục</p>
                                <p className="font-medium text-gray-800">{categoryLabel}</p>
                            </div>
                        </div>
                        {product.quantity && (
                            <div className="mt-4">
                                <h5 className="font-semibold text-gray-800 mb-2">Tồn kho theo size</h5>
                                <div className="grid grid-cols-4 gap-3">
                                    {(Array.isArray(product.variants) ? product.variants : []).map((v) => (
                                        <div key={v.size} className="p-3 bg-white border border-gray-200 rounded-lg text-center">
                                            <div className="text-xs text-gray-500 mb-1">{v.size}</div>
                                            <div className="text-sm font-semibold text-gray-800">{parseInt(v.quantity || 0)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6">
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
