import { useRef } from "react";
import { Camera } from "lucide-react";

export default function AvatarUpload({ avatar, previewImage, onImageChange }) {
  const fileInputRef = useRef(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4 pb-6">
      <div className="relative">
        <img
          src={previewImage || avatar}
          alt="Avatar"
          className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow-md"
        />
        <button
          type="button"
          onClick={triggerFileInput}
          className="absolute bottom-1 right-1 bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
          title="Thay đổi ảnh đại diện"
        >
          <Camera size={18} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onImageChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
