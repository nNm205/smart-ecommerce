import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Navbar from "@/components/Shared/Navbar";
import Footer from "@/components/Shared/Footer";
import { authService } from "@/services/authService";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [countdown, setCountdown] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

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
  };

  const clearMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  const getPasswordStrength = (password) => {
    if (!password) return null;

    let strength = 0;
    const checks = {
      length: password.length >= 8,
      hasLower: /[a-z]/.test(password),
      hasUpper: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (checks.hasLower) strength += 1;
    if (checks.hasUpper) strength += 1;
    if (checks.hasNumber) strength += 1;
    if (checks.hasSpecial) strength += 1;

    if (strength <= 2) {
      return {
        level: "weak",
        text: "Yếu",
        color: "text-red-500",
        bgColor: "bg-red-500",
        percentage: 33,
        icon: XCircle,
        suggestions: [
          !checks.length && "Tối thiểu 8 ký tự",
          !checks.hasUpper && "Thêm chữ in hoa",
          !checks.hasNumber && "Thêm số",
        ].filter(Boolean),
      };
    } else if (strength <= 4) {
      return {
        level: "medium",
        text: "Trung bình",
        color: "text-yellow-500",
        bgColor: "bg-yellow-500",
        percentage: 66,
        icon: AlertCircle,
        suggestions: [
          !checks.length && "Nên có 8 ký tự trở lên",
          !checks.hasSpecial && "Thêm ký tự đặc biệt",
        ].filter(Boolean),
      };
    } else {
      return {
        level: "strong",
        text: "Mạnh",
        color: "text-green-500",
        bgColor: "bg-green-500",
        percentage: 100,
        icon: CheckCircle2,
        suggestions: [],
      };
    }
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  const handleApiError = (error, context) => {
    console.error(`Lỗi ${context}:`, error);

    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message;

      switch (status) {
        case 400:
          if (context === "sendOtp") {
            setErrorMessage(
              message || "Thông tin không hợp lệ. Vui lòng kiểm tra lại email."
            );
          } else if (context === "verifyOtp") {
            if (message?.includes("hết hạn")) {
              setErrorMessage("Mã OTP đã hết hạn. Vui lòng gửi lại mã mới.");
              setCountdown(0); // Reset countdown
            } else if (
              message?.includes("không hợp lệ") ||
              message?.includes("không đúng")
            ) {
              setErrorMessage("Mã OTP không đúng. Vui lòng kiểm tra lại.");
            } else if (message?.includes("đã được sử dụng")) {
              setErrorMessage(
                "Mã OTP đã được sử dụng. Vui lòng gửi lại mã mới."
              );
            } else {
              setErrorMessage(
                message || "Mã OTP không hợp lệ hoặc đã hết hạn."
              );
            }
          } else if (context === "resetPassword") {
            setErrorMessage(
              message || "Không thể đặt lại mật khẩu. Vui lòng thử lại."
            );
          }
          break;
        case 404:
          setErrorMessage(
            "Email không tồn tại trong hệ thống. Vui lòng kiểm tra lại."
          );
          break;

        case 429:
          setErrorMessage(
            "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau vài phút."
          );
          break;

        case 500:
          setErrorMessage("Lỗi server. Vui lòng thử lại sau.");
          break;

        default:
          setErrorMessage(message || "Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    } else if (error.request) {
      if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        setErrorMessage("Kết nối timeout. Vui lòng kiểm tra mạng và thử lại.");
      } else {
        setErrorMessage(
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng."
        );
      }
    } else {
      setErrorMessage(`Có lỗi xảy ra: ${error.message}`);
    }
  };

  const validateEmailForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Email không hợp lệ";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async () => {
    clearMessages();

    if (!validateEmailForm()) return;

    setIsLoading(true);

    try {
      await authService.forgotPassword(formData.email);
      setSuccessMessage(
        `Mã OTP đã được gửi đến email ${formData.email}. Vui lòng kiểm tra hộp thư.`
      );
      setStep(2);
      setCountdown(60);
    } catch (error) {
      handleApiError(error, "sendOtp");
    } finally {
      setIsLoading(false);
    }
  };

  const validateOtpForm = () => {
    const newErrors = {};

    if (!formData.otp.trim()) {
      newErrors.otp = "Vui lòng nhập mã OTP";
    } else if (!/^[0-9]{6}$/.test(formData.otp)) {
      newErrors.otp = "Mã OTP phải là 6 chữ số";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerifyOtp = async () => {
    clearMessages();

    if (!validateOtpForm()) return;

    setIsLoading(true);

    try {
      await authService.verifyOtp(formData.email, formData.otp);

      setSuccessMessage("Mã OTP hợp lệ. Vui lòng nhập mật khẩu mới.");
      setStep(3);
    } catch (error) {
      handleApiError(error, "verifyOtp");
    } finally {
      setIsLoading(false);
    }
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.confirmPassword != formData.newPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async () => {
    clearMessages();

    if (!validatePasswordForm()) return;

    setIsLoading(true);

    try {
      await authService.resetPassword(
        formData.email,
        formData.otp,
        formData.newPassword
      );

      setSuccessMessage(
        "Đặt lại mật khẩu thành công! Đang chuyển đến trang đăng nhập..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      handleApiError(error, "resetPassword");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    clearMessages();
    setIsLoading(true);

    try {
      await authService.forgotPassword(formData.email);
      setSuccessMessage("Đã gửi lại mã OTP đến email của bạn");
    } catch (error) {
      handleApiError(error, "sendOtp");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToStep = (targetStep) => {
    setStep(targetStep);
    clearMessages();
    setErrors({});

    if (targetStep === 1) {
      setFormData((prev) => ({
        ...prev,
        otp: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setCountdown(0);
    } else if (targetStep === 2) {
      setFormData((prev) => ({
        ...prev,
        newPassword: "",
        confirmPassword: "",
      }));
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
          to="/login"
          className="hover:text-blue-700 transition-colors duration-200"
        >
          Đăng nhập
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-800 font-medium">Quên mật khẩu</span>
      </div>

      <main className="flex-1 flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white w-full max-w-xl shadow-lg">
          <div className="text-center pt-8 pb-6">
            <h1 className="text-2xl font-bold text-gray-800 tracking-wide">
              QUÊN MẬT KHẨU
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              {step === 1 && "Nhập email để nhận mã xác thực"}
              {step === 2 && "Nhập mã OTP đã được gửi đến email"}
              {step === 3 && "Tạo mật khẩu mới cho tài khoản"}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center items-center px-8 pb-6">
            <div className="flex items-center w-full max-w-md">
              {/* Step 1 */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step >= 1
                      ? "bg-black text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  1
                </div>
                <span className="text-xs mt-2 text-gray-600">Email</span>
              </div>

              {/* Line 1 */}
              <div
                className={`flex-1 h-1 transition-all ${
                  step >= 2 ? "bg-black" : "bg-gray-300"
                }`}
              />

              {/* Step 2 */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step >= 2
                      ? "bg-black text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  2
                </div>
                <span className="text-xs mt-2 text-gray-600">OTP</span>
              </div>

              {/* Line 2 */}
              <div
                className={`flex-1 h-1 transition-all ${
                  step >= 3 ? "bg-black" : "bg-gray-300"
                }`}
              />

              {/* Step 3 */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step >= 3
                      ? "bg-black text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  3
                </div>
                <span className="text-xs mt-2 text-gray-600">Mật khẩu</span>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200" />

          <div className="p-8">
            {/* Thông báo thành công */}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded flex items-start">
                <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Thông báo lỗi */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-start">
                <XCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* BƯỚC 1: NHẬP EMAIL */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:border-black transition`}
                    placeholder="Nhập email của bạn"
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <XCircle className="h-4 w-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isLoading}
                  className={`w-full py-3 font-bold transition ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  {isLoading ? "ĐANG GỬI..." : "GỬI MÃ XÁC NHẬN"}
                </button>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="text-sm text-gray-600 hover:text-black transition"
                  >
                    ← Quay lại đăng nhập
                  </Link>
                </div>
              </div>
            )}

            {/* BƯỚC 2: NHẬP OTP */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    maxLength={6}
                    className={`w-full px-4 py-3 border ${
                      errors.otp ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:border-black transition text-center text-2xl tracking-widest`}
                    placeholder="000000"
                    disabled={isLoading}
                  />
                  {errors.otp && (
                    <p className="text-red-500 text-sm mt-1 flex items-center justify-center">
                      <XCircle className="h-4 w-4 mr-1" />
                      {errors.otp}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Nhập mã OTP gồm 6 chữ số đã được gửi đến email
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
                    onClick={() => handleBackToStep(1)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ← Quay lại
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading || countdown > 0}
                    className={`transition ${
                      countdown > 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-600 hover:text-blue-800"
                    }`}
                  >
                    {countdown > 0
                      ? `Gửi lại (${countdown}s)`
                      : "Gửi lại mã OTP"}
                  </button>
                </div>

                <div className="text-xs text-gray-500 text-center bg-gray-50 p-3 rounded">
                  <AlertCircle className="h-4 w-4 inline mr-1" />
                  Mã OTP có hiệu lực trong 15 phút
                </div>
              </div>
            )}

            {/* BƯỚC 3: ĐẶT MẬT KHẨU MỚI */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${
                        errors.newPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:outline-none focus:border-black transition pr-12`}
                      placeholder="Nhập mật khẩu mới"
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

                  {errors.newPassword && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <XCircle className="h-4 w-4 mr-1" />
                      {errors.newPassword}
                    </p>
                  )}

                  {/* Password Strength Indicator */}
                  {passwordStrength && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">
                          Độ mạnh mật khẩu:
                        </span>
                        <span
                          className={`text-sm font-semibold flex items-center ${passwordStrength.color}`}
                        >
                          <passwordStrength.icon className="h-4 w-4 mr-1" />
                          {passwordStrength.text}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.bgColor}`}
                          style={{ width: `${passwordStrength.percentage}%` }}
                        />
                      </div>

                      {/* Suggestions */}
                      {passwordStrength.suggestions.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {passwordStrength.suggestions.map(
                            (suggestion, index) => (
                              <p
                                key={index}
                                className="text-xs text-gray-500 flex items-center"
                              >
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {suggestion}
                              </p>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:outline-none focus:border-black transition pr-12`}
                      placeholder="Xác nhận mật khẩu mới"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      disabled={isLoading}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <XCircle className="h-4 w-4 mr-1" />
                      {errors.confirmPassword}
                    </p>
                  )}

                  {/* Match indicator */}
                  {formData.confirmPassword && (
                    <p
                      className={`text-sm mt-1 flex items-center ${
                        formData.newPassword === formData.confirmPassword
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formData.newPassword === formData.confirmPassword ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Mật khẩu khớp
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 mr-1" />
                          Mật khẩu không khớp
                        </>
                      )}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={isLoading}
                  className={`w-full py-3 font-bold transition ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  {isLoading ? "ĐANG XỬ LÝ..." : "ĐẶT LẠI MẬT KHẨU"}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => handleBackToStep(2)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    ← Quay lại
                  </button>
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
