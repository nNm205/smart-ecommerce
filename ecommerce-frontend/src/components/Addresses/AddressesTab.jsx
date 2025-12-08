import { Plus, MapPin, Edit, Trash2, X, Check } from "lucide-react";
import AddressList from "@/components/Addresses/AddressList";
import AddressFormModal from "@/components/Addresses/AddressFormModal";
import { useAddressManagement } from "@/hooks/useAddressManagement";

export default function AddressesTab() {
  const {
    addresses,
    showModal,
    editingAddress,
    formData,
    openAddModal,
    openEditModal,
    closeModal,
    updateFormField,
    saveAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAddressManagement();

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            Địa chỉ của tôi
          </h2>
        </div>

        <div className="mb-6">
          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus size={20} />
            Thêm địa chỉ
          </button>
        </div>

        <AddressList
          addresses={addresses}
          onEdit={openEditModal}
          onDelete={deleteAddress}
          onSetDefault={setDefaultAddress}
        />
      </div>

      <AddressFormModal
        show={showModal}
        editingAddress={editingAddress}
        formData={formData}
        onChange={updateFormField}
        onSave={saveAddress}
        onClose={closeModal}
      />
    </div>
  );
}
