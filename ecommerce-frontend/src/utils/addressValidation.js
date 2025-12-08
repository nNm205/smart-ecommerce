export function validateAddressForm(formData) {
  const requiredFields = [
    { field: "name", message: "Vui lòng nhập họ tên!" },
    { field: "phone", message: "Vui lòng nhập số điện thoại!" },
    { field: "address", message: "Vui lòng nhập địa chỉ!" },
    { field: "city", message: "Vui lòng chọn Tỉnh/Thành phố!" },
    { field: "district", message: "Vui lòng chọn Quận/Huyện!" },
    { field: "ward", message: "Vui lòng chọn Phường/Xã!" },
  ];

  for (const { field, message } of requiredFields) {
    if (!formData[field]?.trim()) {
      alert(message);
      return false;
    }
  }

  return true;
}
