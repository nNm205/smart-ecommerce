import { CheckCircle, XCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function Toast({
  message,
  type = "success",
  onClose,
  duration = 3000,
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const bgColor = type === "success" ? "bg-green-50" : "bg-red-50";
  const borderColor =
    type === "success" ? "border-green-200" : "border-red-200";
  const textColor = type === "success" ? "text-green-800" : "text-red-800";
  const Icon = type === "success" ? CheckCircle : XCircle;
  const iconColor = type === "success" ? "text-green-500" : "text-red-500";

  return (
    <div
      className={`fixed top-20 right-4 left-4 sm:left-auto z-[9999] transition-all duration-300 transform ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
      style={{ zIndex: 9999 }}
    >
      <div
        className={`${bgColor} ${borderColor} border rounded-lg shadow-lg p-4 pr-10 w-full sm:min-w-[300px] sm:max-w-md relative`}
      >
        <div className="flex items-start gap-3">
          <Icon size={20} className={iconColor} />
          <p className={`${textColor} text-sm font-medium flex-1`}>{message}</p>
        </div>
        <button
          onClick={handleClose}
          className={`absolute top-3 right-3 ${textColor} hover:opacity-70 transition-opacity`}
          aria-label="Đóng thông báo"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
