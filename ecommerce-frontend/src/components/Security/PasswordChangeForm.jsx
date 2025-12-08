import PasswordInput from "@/components/Security/PasswordInput";
import PasswordStrengthIndicator from "@/components/Security/PasswordStrengthIndicator";
import PasswordMatchIndicator from "@/components/Security/PasswordMatchIndicator";

export default function PasswordChangeForm({
  formData,
  showPasswords,
  onInputChange,
  onToggleVisibility,
}) {
  return (
    <div className="space-y-5 max-w-xl mx-auto w-full">
      {/* Current Password */}
      <PasswordInput
        label="Mật khẩu hiện tại"
        name="currentPassword"
        value={formData.currentPassword}
        onChange={onInputChange}
        placeholder="Nhập mật khẩu hiện tại"
        showPassword={showPasswords.current}
        onToggleVisibility={() => onToggleVisibility("current")}
      />

      {/* New Password */}
      <div>
        <PasswordInput
          label="Mật khẩu mới"
          name="newPassword"
          value={formData.newPassword}
          onChange={onInputChange}
          placeholder="Nhập mật khẩu mới"
          showPassword={showPasswords.new}
          onToggleVisibility={() => onToggleVisibility("new")}
        />
        <PasswordStrengthIndicator password={formData.newPassword} />
      </div>

      {/* Confirm Password */}
      <div>
        <PasswordInput
          label="Xác nhận mật khẩu mới"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={onInputChange}
          placeholder="Nhập lại mật khẩu mới"
          showPassword={showPasswords.confirm}
          onToggleVisibility={() => onToggleVisibility("confirm")}
        />
        <PasswordMatchIndicator
          newPassword={formData.newPassword}
          confirmPassword={formData.confirmPassword}
        />
      </div>
    </div>
  );
}
