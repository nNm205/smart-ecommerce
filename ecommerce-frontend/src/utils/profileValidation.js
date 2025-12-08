export function validateProfileForm(formData) {
  if (!formData.name.trim()) {
    alert("Vui lòng nhập tên!");
    return false;
  }

  if (!formData.email.trim()) {
    alert("Vui lòng nhập email!");
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    alert("Email không hợp lệ!");
    return false;
  }

  if (!formData.phone.trim()) {
    alert("Vui lòng nhập số điện thoại!");
    return false;
  }

  return true;
}

export function validateImageFile(file) {
  if (!file.type.startsWith("image/")) {
    alert("Vui lòng chọn file ảnh!");
    return false;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("Kích thước ảnh không được vượt quá 5MB!");
    return false;
  }

  return true;
}
