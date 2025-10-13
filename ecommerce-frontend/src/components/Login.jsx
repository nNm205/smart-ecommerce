import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [activeTab, setActiveTab] = useState('login');

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Vui lòng nhập email hoặc số điện thoại';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^[0-9]{10,11}$/;

            if (!emailRegex.test(formData.username) && !phoneRegex.test(formData.username)) {
                newErrors.username = 'Email hoặc số điện thoại không hợp lệ';
            }
        }

        if (!formData.password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            console.log('Đăng nhập:', formData);
            alert('Đăng nhập thành công!');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-xl">
                <div className="text-center pt-8 pb-6">
                    <h1 className="text-2xl font-bold text-gray-800 tracking-wide">ĐĂNG NHẬP TÀI KHOẢN</h1>
                </div>

                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('login')}
                        className={`flex-1 py-4 text-center font-bold transition-all ${
                            activeTab === 'login'
                                ? 'text-black border-b-2 border-black'
                                : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        ĐĂNG NHẬP
                    </button>
                    <button
                        onClick={() => setActiveTab('register')}
                        className={`flex-1 py-4 text-center font-bold transition-all ${
                            activeTab === 'register'
                                ? 'text-black border-b-2 border-black'
                                : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        ĐĂNG KÝ
                    </button>
                </div>

                <div className="p-8">
                    {activeTab === 'login' ? (
                        <div className="space-y-6">
                            <div>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border ${
                                        errors.username ? 'border-red-500' : 'border-gray-300'
                                    } focus:outline-none focus:border-black transition`}
                                    placeholder="Nhập số điện thoại hoặc email"
                                />
                                {errors.username && (
                                    <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                                )}
                            </div>

                            <div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border ${
                                            errors.password ? 'border-red-500' : 'border-gray-300'
                                        } focus:outline-none focus:border-black transition pr-12`}
                                        placeholder="Mật khẩu"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                                )}
                            </div>

                            <button
                                onClick={handleSubmit}
                                className="w-full bg-black text-white py-3 font-bold hover:bg-gray-800 transition"
                            >
                                ĐĂNG NHẬP
                            </button>

                            <div className="text-center">
                                <a href="#" className="text-sm text-gray-600 hover:text-black">
                                    Quên mật khẩu?
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            Chức năng đăng ký - Vui lòng chuyển sang component Register
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}