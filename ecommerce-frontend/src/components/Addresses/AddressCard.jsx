import { MapPin, Edit, Trash2 } from "lucide-react";

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <MapPin size={18} className="text-blue-600" />
            <h3 className="font-semibold text-gray-900">{address.name}</h3>
            {address.isDefault && (
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                Mặc định
              </span>
            )}
          </div>
          <div className="ml-7 space-y-1 text-gray-600">
            <p>Số điện thoại: {address.phone}</p>
            <p>
              Địa chỉ: {address.address}, {address.ward}, {address.district},{" "}
              {address.city}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(address)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Chỉnh sửa"
          >
            <Edit size={18} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(address.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Xóa"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {!address.isDefault && (
        <button
          type="button"
          onClick={() => onSetDefault(address.id)}
          className="ml-7 mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Đặt làm mặc định
        </button>
      )}
    </div>
  );
}
