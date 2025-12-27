import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Shared/Navbar";
import Footer from "@/components/Shared/Footer";
import { ChevronRight } from "lucide-react";
import { authService } from "@/services/authService";

function RegisterPage() {
  const [registerData, setRegisterData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [registerErrors, setRegisterErrors] = useState({});

  const [otpData, setOtpData] = useState({
    otp: "",
    email: "",
  });
  const [otpErrors, setOtpErrors] = useState({});

  const [step, setStep] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === "/login";

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (registerErrors[name]) {
      setRegisterErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleOtpChange = (e) => {
    const { value } = e.target;
    setOtpData((prev) => ({
      ...prev,
      otp: value,
    }));
    if (otpErrors.otp) {
      setOtpErrors((prev) => ({
        ...prev,
        otp: "",
      }));
    }
  };

  const validateRegisterForm = () => {
    const newErrors = {};

    // Validate họ tên
    if (!registerData.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ tên";
    }

    // Validate số điện thoại
    if (!registerData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else {
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(registerData.phone)) {
        newErrors.phone = "Số điện thoại không hợp (10-11 số)";
      }
    }

    // Validate email
    if (!registerData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(registerData.email)) {
        newErrors.email = "Email không hợp lệ";
      }
    }

    // Validate mật khẩu
    if (!registerData.password.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (registerData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    // Validate xác nhận mật khẩu
    if (!registerData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (registerData.confirmPassword !== registerData.password) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    setRegisterErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOtpForm = () => {
    const newErrors = {};

    if (!otpData.otp.trim()) {
      newErrors.otp = "Vui lòng nhập mã OTP";
    } else if (!/^[0-9]{6}$/.test(otpData.otp)) {
      newErrors.otp = "Mã OTP phải là 6 chữ số";
    }

    setOtpErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendVerifyCode = async () => {
    setSuccessMessage("");
    setErrorMessage("");

    if (!validateRegisterForm()) return;

    setIsLoading(true);

    try {
      await authService.register({
        fullName: registerData.fullName,
        email: registerData.email,
        phone: registerData.phone,
        password: registerData.password,
      });

      setOtpData((prev) => ({
        ...prev,
        email: registerData.email,
      }));

      setStep(2);
      setSuccessMessage(
        `Mã OTP đã được gửi đến email ${registerData.email}. Vui lòng kiểm tra hộp thư.`
      );
    } catch (error) {
      console.error("Lỗi khi gửi OTP:", error);

      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else if (error.response?.status === 400) {
        setErrorMessage("Thông tin đăng ký không hợp lệ");
      } else if (error.response?.status === 409) {
        setErrorMessage("Email hoặc số điện thoại đã được sử dụng");
      } else {
        setErrorMessage("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setSuccessMessage("");
    setErrorMessage("");

    if (!validateOtpForm()) return;

    setIsLoading(true);

    try {
      const response = await authService.verrifyRegistration(
        otpData.email,
        otpData.otp
      );

      console.log("Đăng ký thành công:", response);

      setSuccessMessage(
        "Đăng ký thành công! Đang chuyển đến trang đăng nhập..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Lỗi khi xác thực OTP:", error);

      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else if (error.response?.status === 400) {
        setErrorMessage("Mã OTP không hợp lệ hoặc đã hết hạn");
      } else {
        setErrorMessage("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setSuccessMessage("");
    setErrorMessage("");
    setIsLoading(true);

    try {
      await authService.register({
        fullName: registerData.fullName,
        email: registerData.email,
        phone: registerData.phone,
        password: registerData.password,
      });

      setSuccessMessage("Đã gửi lại mã OTP đến email của bạn");
    } catch (error) {
      console.error("Lỗi khi gửi lại OTP:", error);
      setErrorMessage("Không thể gửi lại OTP. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToStep1 = () => {
    setStep(1);
    setOtpData({ otp: "", email: "" });
    setOtpErrors({});
    setSuccessMessage("");
    setErrorMessage("");
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

      <main className="flex-1 flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white w-full max-w-xl">
          <div className="text-center pt-8 pb-6">
            <h1 className="text-2xl font-bold text-gray-800 tracking-wide">
              ĐĂNG KÝ TÀI KHOẢN
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

            {/* BƯỚC 1: Nhập thông tin đăng ký */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="fullName"
                    value={registerData.fullName}
                    onChange={handleRegisterChange}
                    className={`w-full px-4 py-3 border ${
                      registerErrors.fullName
                        ? "border-red-500"
                        : "border-gray-300"
                    } focus:outline-none focus:border-black transition`}
                    placeholder="Nhập họ tên"
                  />
                  {registerErrors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {registerErrors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="tel"
                    name="phone"
                    value={registerData.phone}
                    onChange={handleRegisterChange}
                    className={`w-full px-4 py-3 border ${
                      registerErrors.phone
                        ? "border-red-500"
                        : "border-gray-300"
                    } focus:outline-none focus:border-black transition`}
                    placeholder="Nhập số điện thoại"
                  />
                  {registerErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {registerErrors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    className={`w-full px-4 py-3 border ${
                      registerErrors.email
                        ? "border-red-500"
                        : "border-gray-300"
                    } focus:outline-none focus:border-black transition`}
                    placeholder="Nhập email"
                  />
                  {registerErrors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {registerErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="password"
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    className={`w-full px-4 py-3 border ${
                      registerErrors.password
                        ? "border-red-500"
                        : "border-gray-300"
                    } focus:outline-none focus:border-black transition`}
                    placeholder="Nhập mật khẩu"
                  />
                  {registerErrors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {registerErrors.password}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    className={`w-full px-4 py-3 border ${
                      registerErrors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    } focus:outline-none focus:border-black transition`}
                    placeholder="Xác nhận mật khẩu"
                  />
                  {registerErrors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {registerErrors.confirmPassword}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSendVerifyCode}
                  disabled={isLoading}
                  className={`w-full py-3 font-bold transition ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  {isLoading ? "ĐANG GỬI..." : "GỬI MÃ XÁC NHẬN"}
                </button>

                <div className="text-xs text-gray-500 text-center">
                  Bằng việc tiếp tục, bạn đồng ý với Điều khoản &amp; Chính sách
                  bảo mật.
                </div>
              </div>
            )}

            {/* BƯỚC 2: Nhập mã OTP */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="otp"
                    value={otpData.otp}
                    onChange={handleOtpChange}
                    maxLength={6}
                    className={`w-full px-4 py-3 border ${
                      otpErrors.otp ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:border-black transition text-center text-2xl tracking-widest`}
                    placeholder="000000"
                  />
                  {otpErrors.otp && (
                    <p className="text-red-500 text-sm mt-1">{otpErrors.otp}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Nhập mã OTP gồm 6 chữ số đã được gửi đến email của bạn
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isLoading}
                  className={`w-full py-3 font-bold transition ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  {isLoading ? "ĐANG XÁC THỰC..." : "XÁC THỰC"}
                </button>

                <div className="flex justify-between items-center text-sm">
                  <button
                    type="button"
                    onClick={handleBackToStep1}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ← Quay lại
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                  >
                    Gửi lại mã OTP
                  </button>
                </div>

                <div className="text-xs text-gray-500 text-center">
                  Mã OTP có hiệu lực trong 15 phút
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default RegisterPage;
