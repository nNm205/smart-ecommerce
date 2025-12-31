import { useState } from "react";
import { Eye, EyeOff, ChevronRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Shared/Navbar";
import Footer from "@/components/Shared/Footer";
import { authService } from "@/services/authService";
import useAuth from "@/contexts/useAuth";
import useCart from "@/contexts/useCart";

function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === "/login";

  const { syncCartAfterLogin } = useCart();
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Vui lòng nhập email hoặc số điện thoại";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[0-9]{10,11}$/;

      if (
        !emailRegex.test(formData.username) &&
        !phoneRegex.test(formData.username)
      ) {
        newErrors.username = "Email hoặc số điện thoại không hợp lệ";
      }
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const responseData = await authService.login({
        email: formData.username,
        password: formData.password,
      });

      console.log("Đăng nhập thành công:", responseData);

      const { email, role, fullName, accessToken, refreshToken, userId } =
        responseData;

      if (role === "ADMIN") {
        setErrorMessage(
          "Tài khoản Admin không có quyền truy cập vào giao diện user"
        );
        setIsLoading(false);
        return;
      }

      localStorage.setItem("accessToken", accessToken);

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      const userData = {
        userId,
        email,
        fullName,
        role,
      };
      localStorage.setItem("user", JSON.stringify(userData));

      login(email, fullName, role, userId);

      setSuccessMessage("Đăng nhập thành công! Đang chuyển hướng...");

      // Đồng bộ giỏ hảng từ localStorage lên backend
      await syncCartAfterLogin();

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1500);
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);

      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else if (error.response?.status === 401) {
        setErrorMessage("Email/Số điện thoại hoặc mật khẩu không đúng");
      } else if (error.response?.status === 400) {
        setErrorMessage("Thông tin đăng nhập không hợp lệ");
      } else if (error.request) {
        setErrorMessage(
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối!"
        );
      } else {
        setErrorMessage("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (errorMessage) {
      setErrorMessage("");
    }

    if (successMessage) {
      setSuccessMessage("");
    }
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
        <span className="text-gray-800 font-medium">Đăng nhập</span>
      </div>

      <main className="flex-1 flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white w-full max-w-xl">
          <div className="text-center pt-8 pb-6">
            <h1 className="text-2xl font-bold text-gray-800 tracking-wide">
              ĐĂNG NHẬP TÀI KHOẢN
            </h1>
          </div>

          <div className="flex border-b border-gray-200">
            <Link
              to="/login"
              className={`flex-1 py-4 text-center font-bold transition-all ${
                isLogin
                  ? "text-black border-b-2 border-black"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              ĐĂNG NHẬP
            </Link>
            <Link
              to="/register"
              className={`flex-1 py-4 text-center font-bold transition-all ${
                !isLogin
                  ? "text-black border-b-2 border-black"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              ĐĂNG KÝ
            </Link>
          </div>

          <div className="p-8">
            {/* Hiển thị thông báo thành công */}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {successMessage}
              </div>
            )}

            {/* Hiển thị thông báo lỗi */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Input Username (Email hoặc SĐT) */}
              <div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${
                    errors.username ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:border-black transition`}
                  placeholder="Nhập số điện thoại hoặc email"
                  disabled={isLoading}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              {/* Input Password */}
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:border-black transition pr-12`}
                    placeholder="Mật khẩu"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
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

              {/* Nút Đăng nhập */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 font-bold transition ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {isLoading ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP"}
              </button>

              {/* Link Quên mật khẩu */}
              <div className="text-center">
                <Link
                  to="/forgot-password"
                  className="text-sm text-gray-600 hover:text-black transition"
                >
                  Quên mật khẩu?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default LoginPage;
