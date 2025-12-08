export function validatePasswordForm(formData) {
  if (!formData.currentPassword) {
    alert("Vui lòng nhập mật khẩu hiện tại!");
    return false;
  }

  if (!formData.newPassword) {
    alert("Vui lòng nhập mật khẩu mới!");
    return false;
  }

  if (formData.newPassword.length < 8) {
    alert("Mật khẩu mới phải có ít nhất 8 ký tự!");
    return false;
  }

  const hasLetter = /[a-zA-Z]/.test(formData.newPassword);
  const hasNumber = /[0-9]/.test(formData.newPassword);
  if (!hasLetter || !hasNumber) {
    alert("Mật khẩu mới phải chứa cả chữ và số!");
    return false;
  }

  if (formData.currentPassword === formData.newPassword) {
    alert("Mật khẩu mới phải khác mật khẩu hiện tại!");
    return false;
  }

  if (!formData.confirmPassword) {
    alert("Vui lòng xác nhận mật khẩu mới!");
    return false;
  }

  if (formData.newPassword !== formData.confirmPassword) {
    alert("Mật khẩu xác nhận không khớp!");
    return false;
  }

  return true;
}

export function getPasswordStrength(password) {
  if (!password) return { strength: 0, label: "", color: "" };

  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  if (strength <= 2) return { strength: 33, label: "Yếu", color: "bg-red-500" };
  if (strength <= 4)
    return { strength: 66, label: "Trung bình", color: "bg-yellow-500" };
  return { strength: 100, label: "Mạnh", color: "bg-green-500" };
}
