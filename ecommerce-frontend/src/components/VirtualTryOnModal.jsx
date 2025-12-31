import { useEffect } from "react";
import { X, Loader2, Download, RefreshCw } from "lucide-react";
import useVirtualTryOn from "@/hooks/useVirtualTryOn";
import ImageUpload from "./ImageUpload";

const VirtualTryOnModal = ({
  isOpen,
  onClose,
  productImage,
  productName,
  onSuccess,
}) => {
  const {
    loading,
    error,
    resultImageUrl,
    modelImagePreview,
    handleModelImageChange,
    setClothingImageFromUrl,
    performTryOn,
    reset,
    resetResult,
    canTryOn,
  } = useVirtualTryOn();

  // Set clothing image khi modal mở
  useEffect(() => {
    if (isOpen && productImage) {
      setClothingImageFromUrl(productImage);
    }
  }, [isOpen, productImage, setClothingImageFromUrl]);

  // Reset khi đóng modal
  const handleClose = () => {
    reset();
    onClose();
  };

  // Thực hiện thử đồ
  const handleTryOn = async () => {
    try {
      await performTryOn();
      // Gọi callback khi thành công
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Try-on error:", error);
    }
  };

  // Thử lại
  const handleRetry = () => {
    resetResult();
  };

  // Tải ảnh xuống
  const handleDownload = () => {
    if (resultImageUrl) {
      const link = document.createElement("a");
      link.href = resultImageUrl;
      link.download = `virtual-tryon-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-50 to-pink-50">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Thử đồ ảo với AI
            </h2>
            <p className="text-sm text-gray-600 mt-1">{productName}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Đóng"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!resultImageUrl ? (
            // Upload & Preview Section
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ảnh của bạn */}
              <div>
                <ImageUpload
                  label="Ảnh của bạn"
                  preview={modelImagePreview}
                  onImageChange={handleModelImageChange}
                  disabled={loading}
                  placeholder="Tải ảnh của bạn lên"
                />
              </div>

              {/* Ảnh sản phẩm */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Ảnh sản phẩm
                </label>
                <div className="border-2 border-purple-400 rounded-lg overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 p-2">
                  <img
                    src={productImage}
                    alt={productName}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          ) : (
            // Result Section
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Ảnh gốc */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2 text-center">
                  Ảnh gốc
                </h3>
                <div className="rounded-lg overflow-hidden border-2 border-gray-200 shadow-md">
                  <img
                    src={modelImagePreview}
                    alt="Original"
                    className="w-full h-auto"
                  />
                </div>
              </div>

              {/* Kết quả */}
              <div>
                <h3 className="text-sm font-semibold text-center mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Kết quả thử đồ
                </h3>
                <div className="rounded-lg overflow-hidden border-4 border-purple-500 shadow-2xl transform scale-105">
                  <img
                    src={resultImageUrl}
                    alt="Result"
                    className="w-full h-auto"
                  />
                </div>
              </div>

              {/* Sản phẩm */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2 text-center">
                  Sản phẩm
                </h3>
                <div className="rounded-lg overflow-hidden border-2 border-gray-200 shadow-md">
                  <img
                    src={productImage}
                    alt="Product"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-shake">
              <p className="text-sm text-red-600 flex items-start gap-2">
                <span className="font-medium text-base"></span>
                <span>{error}</span>
              </p>
            </div>
          )}

          {/* Loading Message */}
          {loading && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-600 flex items-center gap-2 mb-3">
                <Loader2 className="animate-spin" size={16} />
                <span>
                  Đang xử lý ảnh của bạn... Vui lòng đợi trong giây lát
                </span>
              </p>
              <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full animate-progress w-3/4"></div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50">
          {!resultImageUrl ? (
            // Try-On Button
            <button
              onClick={handleTryOn}
              disabled={!canTryOn}
              className={`
                w-full py-3.5 px-6 rounded-lg font-semibold text-base
                transition-all duration-200 flex items-center justify-center gap-2
                ${
                  canTryOn
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <span className="text-xl"></span>
                  <span>Thử đồ ngay</span>
                  <span className="text-xl"></span>
                </>
              )}
            </button>
          ) : (
            // Action Buttons
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={handleRetry}
                className="py-3 px-6 rounded-lg font-semibold bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <RefreshCw size={20} />
                <span>Thử lại</span>
              </button>

              <button
                onClick={handleDownload}
                className="py-3 px-6 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
              >
                <Download size={20} />
                <span>Tải xuống</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        @keyframes progress {
          0% {
            width: 0%;
          }
          50% {
            width: 70%;
          }
          100% {
            width: 90%;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .animate-shake {
          animation: shake 0.4s ease-out;
        }

        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default VirtualTryOnModal;
