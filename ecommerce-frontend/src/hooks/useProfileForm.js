import { useState, useEffect } from "react";
import {
  validateImageFile,
  validateProfileForm,
} from "@/utils/profileValidation";

export function useProfileForm(initialUser) {
  const [formData, setFormData] = useState({
    name: initialUser.name || "",
    email: initialUser.email || "",
    phone: initialUser.phone || "",
    avatar: initialUser.avatar || "",
  });
  const [originalData, setOriginalData] = useState({
    name: initialUser.name || "",
    email: initialUser.email || "",
    phone: initialUser.phone || "",
    avatar: initialUser.avatar || "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!initialUser) return;

    const normalizedUser = {
      name: initialUser.name || "",
      email: initialUser.email || "",
      phone: initialUser.phone || "",
      avatar: initialUser.avatar || "",
    };

    setFormData(normalizedUser);
    setOriginalData(normalizedUser);
    setPreviewImage(null);
    setHasChanges(false);
  }, [initialUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!validateImageFile(file)) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
      setHasChanges(true);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!validateProfileForm(formData)) return;

    const updatedData = {
      ...formData,
      avatar: previewImage || formData.avatar,
    };

    console.log("Lưu thông tin:", updatedData);

    setFormData(updatedData);
    setOriginalData(updatedData);
    setPreviewImage(null);
    setHasChanges(false);

    alert("Cập nhật thông tin thành công!");
  };

  const handleCancel = () => {
    setFormData(originalData);
    setPreviewImage(null);
    setHasChanges(false);
  };

  return {
    formData,
    previewImage,
    hasChanges,
    handleInputChange,
    handleImageChange,
    handleSave,
    handleCancel,
  };
}
