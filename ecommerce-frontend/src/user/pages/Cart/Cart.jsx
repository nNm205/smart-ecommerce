import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';

export default function Cart() {
    const [cartItems] = useState([
        { id: 1, name: 'Áo T-shirt Cotton Nam', price: 199000, quantity: 1, size: 'M', color: 'Đen', image: '👕' },
        { id: 2, name: 'Quần Jeans Nữ Skinny', price: 499000, quantity: 1, size: '28', color: 'Xanh đậm', image: '👖' },
        { id: 3, name: 'Áo Khoác Denim', price: 799000, quantity: 1, size: 'L', color: 'Xanh nhạt', image: '🧥' }
    ]);

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 1000000 ? 0 : 50000;
    const discount = subtotal > 2000000 ? Math.floor(subtotal * 0.1) : 0;
    const tax = (subtotal - discount) * 0.08;
    const total = subtotal - discount + shipping + tax;

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-2xl p-8 backdrop-blur-md">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                    <ShoppingCart size={32} className="text-blue-600" />
                    Giỏ hàng của bạn
                    <span className="text-2xl text-blue-600 font-semibold">({cartItems.length})</span>
                </h2>

                {cartItems.length > 0 ? (
                    <>
                        {/* Cart Items */}
                        <div className="space-y-4 mb-8 max-h-96 overflow-y-auto">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-6 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-100 hover:shadow-md transition">
                                    <div className="w-32 h-32 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-lg flex items-center justify-center text-6xl flex-shrink-0">
                                        {item.image}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-800 mb-3">{item.name}</h3>
                                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
                                            <div>
                                                <p className="text-gray-600">Kích thước: <span className="font-bold text-gray-800">{item.size}</span></p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Màu sắc: <span className="font-bold text-gray-800">{item.color}</span></p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-blue-600 font-bold text-2xl">
                                                {(item.price).toLocaleString('vi-VN')} đ
                                            </p>
                                            <p className="text-gray-700 font-semibold">
                                                Số lượng: <span className="text-lg text-blue-600">{item.quantity}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="border-t-2 border-gray-200 pt-8">
                            <div className="space-y-4 mb-8 bg-gray-50 p-6 rounded-xl">
                                <div className="flex justify-between text-lg text-gray-700">
                                    <span>Tiền hàng:</span>
                                    <span className="font-bold">{subtotal.toLocaleString('vi-VN')} đ</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-lg text-green-600 font-bold">
                                        <span>Giảm giá (10%):</span>
                                        <span>-{discount.toLocaleString('vi-VN')} đ</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg text-gray-700">
                                    <span>Vận chuyển:</span>
                                    <span className="font-bold">{shipping === 0 ? '🎉 Miễn phí' : shipping.toLocaleString('vi-VN') + ' đ'}</span>
                                </div>
                                <div className="flex justify-between text-lg text-gray-700">
                                    <span>Thuế (8%):</span>
                                    <span className="font-bold">{Math.round(tax).toLocaleString('vi-VN')} đ</span>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-white text-2xl font-bold">Tổng cộng:</span>
                                    <span className="text-white text-4xl font-bold">
                    {Math.round(total).toLocaleString('vi-VN')} đ
                  </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-lg transition text-xl shadow-lg hover:shadow-xl">
                                    💳 Thanh toán ngay
                                </button>
                                <button className="w-full border-2 border-blue-300 text-blue-600 font-bold py-3 rounded-lg hover:bg-blue-50 transition text-lg">
                                    Tiếp tục mua sắm
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-16">
                        <ShoppingCart size={64} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 text-2xl mb-6">Giỏ hàng của bạn đang trống</p>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition text-lg">
                            Quay lại
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}