import { usePasswordChange } from "@/hooks/usePasswordChange";
import PasswordChangeForm from "@/components/Security/PasswordChangeForm";
import ActionButtons from "@/components/Security/ActionButtons";

export default function SecurityTab() {
  const {
    formData,
    showPasswords,
    hasChanges,
    handleInputChange,
    togglePasswordVisibility,
    handleSubmit,
    handleReset,
  } = usePasswordChange();

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-2xl">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center justify-center gap-2 mb-2">
            Đổi mật khẩu
          </h2>
        </div>

        <PasswordChangeForm
          formData={formData}
          showPasswords={showPasswords}
          onInputChange={handleInputChange}
          onToggleVisibility={togglePasswordVisibility}
        />

        <ActionButtons
          hasChanges={hasChanges}
          onSubmit={handleSubmit}
          onCancel={handleReset}
        />
      </div>
    </div>
  );
}
