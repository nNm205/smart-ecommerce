import { getPasswordStrength } from "@/utils/passwordValidation";

export default function PasswordStrengthIndicator({ password }) {
  const passwordStrength = getPasswordStrength(password);

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-1">
        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${passwordStrength.color}`}
            style={{ width: `${passwordStrength.strength}%` }}
          />
        </div>
        <span className="text-xs font-medium text-gray-600">
          {passwordStrength.label}
        </span>
      </div>
    </div>
  );
}
