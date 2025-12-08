export const validateCheckoutForm = (formData) => {
  const errors = {};

  // Validate họ tên
  if (!formData.fullName.trim()) {
    errors.fullName = "Vui lòng nhập họ và tên";
  } else if (formData.fullName.trim().length < 2) {
    errors.fullName = "Họ tên phải có ít nhất 2 ký tự";
  }

  // Validate số điện thoại
  const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
  if (!formData.phone.trim()) {
    errors.phone = "Vui lòng nhập số điện thoại";
  } else if (!phoneRegex.test(formData.phone)) {
    errors.phone = "Số điện thoại không hợp lệ";
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email.trim()) {
    errors.email = "Vui lòng nhập email";
  } else if (!emailRegex.test(formData.email)) {
    errors.email = "Email không hợp lệ";
  }

  // Validate địa chỉ
  if (!formData.address.trim()) {
    errors.address = "Vui lòng nhập địa chỉ";
  }

  // Validate thành phố
  if (!formData.city) {
    errors.city = "Vui lòng chọn tỉnh/thành phố";
  }

  // Validate quận/huyện
  if (!formData.district) {
    errors.district = "Vui lòng chọn quận/huyện";
  }

  return errors;
};
