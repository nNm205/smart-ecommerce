import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "@/components/Shared/Navbar";
import Footer from "@/components/Shared/Footer";
import { ChevronRight } from "lucide-react";

function RegisterPage() {
  const [registerData, setRegisterData] = useState({ phone: "" });
  const [registerErrors, setRegisterErrors] = useState({});

  const location = useLocation();
  const isLogin = location.pathname === "/login";

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateRegisterForm = () => {
    const newErrors = {};

    if (!registerData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else {
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(registerData.phone)) {
        newErrors.phone = "Số điện thoại không hợp (10 - 11 số)";
      }
    }

    setRegisterErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendVerifyCode = () => {
    if (!validateRegisterForm()) return;

    console.log("Gửi mã xác nhận tới: ", registerData.phone);
    alert(`Đã gửi mã xác nhận tới số điện thoại ${registerData.phone}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="bg-gray-100 h-[50px] flex items-center px-6 lg:px-16 border-b border-gray-200">
        <Link
          to="/"
          className="hover:text-blue-700 transition-colors duration-200"
        >
          Trang chủ
        </Link>
        <ChevronRight size={14} />
        <Link
          to="#"
          className="hover:text-blue-700 transition-colors duration-200"
        >
          Danh mục
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-800 font-medium">Đăng ký</span>
      </div>

      <main
        className="flex-1 flex 
                    items-center 
                    justify-center 
                    bg-gray-50 p-4"
      >
        <div className="bg-white w-full max-w-xl">
          <div className="text-center pt-8 pb-6">
            <h1
              className="text-2xl font-bold 
                        text-gray-800 
                        tracking-wide"
            >
              ĐĂNG KÝ TÀI KHOẢN
            </h1>
          </div>

          <div className="flex border-b border-gray-200">
            <Link
              to="/login"
              className={`flex-1 py-4 text-center 
                        font-bold transition-all 
                        ${
                          isLogin
                            ? "text-black border-b-2 border-black"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
            >
              ĐĂNG NHẬP
            </Link>
            <Link
              to="/register"
              className={`flex-1 py-4 text-center 
                        font-bold transition-all 
                        ${
                          !isLogin
                            ? "text-black border-b-2 border-black"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
            >
              ĐĂNG KÝ
            </Link>
          </div>

          <div className="p-8">
            <div className="space-y-6">
              <div>
                <input
                  type="tel"
                  name="phone"
                  value={registerData.phone}
                  onChange={handleRegisterChange}
                  className={`w-full px-4 py-3 border 
                  ${
                    registerErrors.phone ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:border-black transition`}
                  placeholder="Nhập số điện thoại"
                />
                {registerErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {registerErrors.phone}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleSendVerifyCode}
                className="w-full bg-black 
                          text-white py-3 
                          font-bold 
                          hover:bg-gray-800 
                          transition"
              >
                GỬI MÃ XÁC NHẬN
              </button>

              <div className="text-xs text-gray-500 text-center">
                Bằng việc tiếp tục, bạn đồng ý với Điều khoản &amp; Chính sách
                bảo mật.
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default RegisterPage;
