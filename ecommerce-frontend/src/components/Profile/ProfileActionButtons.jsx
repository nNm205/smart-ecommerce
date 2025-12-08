import { Save, X } from "lucide-react";

export default function ProfileActionButtons({ hasChanges, onSave, onCancel }) {
  if (!hasChanges) return null;

  return (
    <div className="flex justify-center gap-3 pt-4">
      <button
        type="button"
        onClick={onSave}
        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        <Save size={18} />
        Lưu thay đổi
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
      >
        <X size={18} />
        Hủy
      </button>
    </div>
  );
}
