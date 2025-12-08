import { Check, X } from "lucide-react";

export default function PasswordMatchIndicator({
  newPassword,
  confirmPassword,
}) {
  if (!confirmPassword) return null;

  const isMatch = newPassword === confirmPassword;

  return (
    <p
      className={`mt-1 text-sm flex items-center gap-1 ${
        isMatch ? "text-green-600" : "text-red-600"
      }`}
    >
      {isMatch ? (
        <>
          <Check size={14} />
          Mật khẩu khớp
        </>
      ) : (
        <>
          <X size={14} />
          Mật khẩu xác nhận không khớp
        </>
      )}
    </p>
  );
}
