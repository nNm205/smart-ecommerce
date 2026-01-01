import { AlertTriangle, X } from "lucide-react";

const DeleteConfirmModal = ({ review, onConfirm, onCancel }) => {
  if (!review) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl transform transition-all animate-scaleIn">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Xác nhận xóa</h3>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 leading-relaxed">
            Bạn có chắc chắn muốn xóa đánh giá của{" "}
            <span className="font-semibold text-gray-900">
              {review.userName}
            </span>{" "}
            cho sản phẩm{" "}
            <span className="font-semibold text-gray-900">
              {review.productName}
            </span>
            ?
          </p>
          <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg">
            <p className="text-sm text-red-800 font-medium">
              ⚠️ Hành động này không thể hoàn tác!
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 bg-gray-50 rounded-b-2xl flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Hủy bỏ
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-lg hover:shadow-xl"
          >
            Xác nhận xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
