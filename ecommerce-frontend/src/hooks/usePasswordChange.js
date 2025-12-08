import { useState } from "react";
import { INITIAL_FORM_DATA, INITIAL_SHOW_PASSWORDS } from "@/data/security";
import { validatePasswordForm } from "@/utils/passwordValidation";

export function usePasswordChange() {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [showPasswords, setShowPasswords] = useState(INITIAL_SHOW_PASSWORDS);
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = () => {
    if (!validatePasswordForm(formData)) return;

    // TODO: Call API to change password
    console.log("Đổi mật khẩu:", {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    });

    alert("Đổi mật khẩu thành công!");
    handleReset();
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setShowPasswords(INITIAL_SHOW_PASSWORDS);
    setHasChanges(false);
  };

  return {
    formData,
    showPasswords,
    hasChanges,
    handleInputChange,
    togglePasswordVisibility,
    handleSubmit,
    handleReset,
  };
}
