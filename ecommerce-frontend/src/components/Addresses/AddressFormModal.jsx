import { X, Check } from "lucide-react";
import FormInput from "@/components/Addresses/FormInput";
import FormSelect from "@/components/Addresses/FormSelect";
import FormTextarea from "@/components/Addresses/FormTextarea";

export default function AddressFormModal({
  show,
  editingAddress,
  formData,
  onChange,
  onSave,
  onClose,
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-opacity-10 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            {editingAddress ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Fields */}
        <div className="p-6 space-y-4">
          <FormInput
            label="Họ và tên"
            name="name"
            value={formData.name}
            onChange={onChange}
            required
            placeholder="Nhập họ và tên"
          />

          <FormInput
            label="Số điện thoại"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={onChange}
            required
            placeholder="Nhập số điện thoại"
          />

          <FormSelect
            label="Tỉnh/Thành phố"
            name="city"
            value={formData.city}
            onChange={onChange}
            options={["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng"]}
            required
          />

          <FormSelect
            label="Quận/Huyện"
            name="district"
            value={formData.district}
            onChange={onChange}
            options={["Cầu Giấy", "Đống Đa", "Ba Đình"]}
            required
          />

          <FormSelect
            label="Phường/Xã"
            name="ward"
            value={formData.ward}
            onChange={onChange}
            options={["Dịch Vọng", "Nghĩa Đô", "Mai Dịch"]}
            required
          />

          <FormTextarea
            label="Địa chỉ cụ thể"
            name="address"
            value={formData.address}
            onChange={onChange}
            required
            rows={3}
            placeholder="Số nhà, tên đường..."
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isDefault"
              id="isDefault"
              checked={formData.isDefault}
              onChange={onChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isDefault" className="text-sm text-gray-700">
              Đặt làm địa chỉ mặc định
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex gap-3 border-t">
          <button
            type="button"
            onClick={onSave}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Check size={18} />
            {editingAddress ? "Cập nhật" : "Thêm địa chỉ"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
