import { INITIAL_ADDRESS, MOCK_ADDRESSES } from "@/data/addresses";
import { useState } from "react";
import { validateAddressForm } from "@/utils/addressValidation";

export function useAddressManagement(initialAddresses = MOCK_ADDRESSES) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState(INITIAL_ADDRESS);

  const resetForm = () => {
    setFormData(INITIAL_ADDRESS);
    setEditingAddress(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (address) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      phone: address.phone,
      address: address.address,
      city: address.city,
      district: address.district,
      ward: address.ward,
      isDefault: address.isDefault,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const updateFormField = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const saveAddress = () => {
    if (!validateAddressForm(formData)) return;

    if (editingAddress) {
      // Update existing address
      setAddresses((prev) =>
        prev.map((addr) => {
          if (addr.id === editingAddress.id) {
            return { ...addr, ...formData };
          }
          // Reset other addresses if this one is set as default
          if (formData.isDefault) {
            return { ...addr, isDefault: false };
          }
          return addr;
        })
      );
      alert("Cập nhật địa chỉ thành công!");
    } else {
      // Add new address
      const newAddress = {
        id: Date.now(),
        ...formData,
      };

      // Reset other addresses if new one is default
      if (formData.isDefault) {
        setAddresses((prev) =>
          prev.map((addr) => ({ ...addr, isDefault: false }))
        );
      }

      setAddresses((prev) => [...prev, newAddress]);
      alert("Thêm địa chỉ thành công!");
    }

    closeModal();
  };

  const deleteAddress = (id) => {
    if (confirm("Bạn có chắc muốn xóa địa chỉ này?")) {
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
      alert("Xóa địa chỉ thành công!");
    }
  };

  const setDefaultAddress = (id) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  return {
    // State
    addresses,
    showModal,
    editingAddress,
    formData,

    // Handlers
    openAddModal,
    openEditModal,
    closeModal,
    updateFormField,
    saveAddress,
    deleteAddress,
    setDefaultAddress,
  };
}
