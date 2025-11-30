import React from 'react';
import { Search } from 'lucide-react';

const Products = () => {
    const products = [
        { name: 'iPhone 15 Pro', price: '₫29,990,000', stock: 45, category: 'Điện thoại', image: '📱' },
        { name: 'MacBook Air M2', price: '₫28,490,000', stock: 23, category: 'Laptop', image: '💻' },
        { name: 'AirPods Pro', price: '₫6,490,000', stock: 120, category: 'Phụ kiện', image: '🎧' },
        { name: 'iPad Air', price: '₫15,990,000', stock: 67, category: 'Tablet', image: '📱' },
        { name: 'Apple Watch', price: '₫10,990,000', stock: 89, category: 'Phụ kiện', image: '⌚' },
        { name: 'Magic Keyboard', price: '₫3,490,000', stock: 156, category: 'Phụ kiện', image: '⌨️' },
        { name: 'iPhone 14', price: '₫19,990,000', stock: 34, category: 'Điện thoại', image: '📱' },
        { name: 'MacBook Pro', price: '₫45,990,000', stock: 12, category: 'Laptop', image: '💻' },
    ];

    return (
        <>
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
                    <button className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        + Thêm Sản Phẩm
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
                    {products.map((product, idx) => (
                        <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                            <div className="text-6xl text-center mb-4">{product.image}</div>
                            <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                            <p className="text-lg font-bold text-blue-600 mb-2">{product.price}</p>
                            <p className="text-sm text-gray-600 mb-4">Kho: {product.stock}</p>
                            <div className="flex gap-2">
                                <button className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors">
                                    Sửa
                                </button>
                                <button className="flex-1 px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors">
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Products;