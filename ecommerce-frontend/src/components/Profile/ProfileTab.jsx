import { Camera, User, Mail, Phone, Save, X } from "lucide-react";
import { useProfileForm } from "@/hooks/useProfileForm";
import AvatarUpload from "@/components/Profile/AvatarUpload";
import ProfileForm from "@/components/Profile/ProfileForm";
import ProfileActionButtons from "@/components/Profile/ProfileActionButtons";

export default function ProfileTab({ user = {} }) {
  const {
    formData,
    previewImage,
    hasChanges,
    handleInputChange,
    handleImageChange,
    handleSave,
    handleCancel,
  } = useProfileForm(user);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-3xl">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
          Hồ sơ của tôi
        </h2>

        <div className="space-y-8">
          <AvatarUpload
            avatar={formData.avatar}
            previewImage={previewImage}
            onImageChange={handleImageChange}
          />

          <ProfileForm formData={formData} onChange={handleInputChange} />

          <ProfileActionButtons
            hasChanges={hasChanges}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}
