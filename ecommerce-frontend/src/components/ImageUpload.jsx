import React, { useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

/**
 * Component để upload và preview ảnh
 * Đặt file này tại: src/components/VirtualTryOn/ImageUpload.jsx
 */
const ImageUpload = ({
  label,
  preview,
  onImageChange,
  disabled = false,
  accept = "image/jpeg,image/jpg,image/png,image/webp",
  maxSize = 10, // MB
  placeholder = "Chọn ảnh",
  className = "",
}) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onImageChange(file);
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-gray-700">{label}</label>
      )}

      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl overflow-hidden
          transition-all duration-200 cursor-pointer
          ${
            preview
              ? "border-purple-400 bg-purple-50"
              : "border-gray-300 bg-gray-50"
          }
          ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:border-purple-400 hover:bg-purple-50"
          }
          ${!preview ? "aspect-[3/4] min-h-[300px]" : ""}
        `}
      >
        {preview ? (
          // Preview Image
          <div className="relative group">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-auto object-cover"
            />

            {/* Overlay khi hover */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
              <button
                onClick={handleRemove}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-500 hover:bg-red-600 text-white rounded-full p-3 transform hover:scale-110"
                disabled={disabled}
                type="button"
              >
                <X size={24} />
              </button>
            </div>

            {/* Badge đã chọn */}
            <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <span>✓</span>
              <span>Đã chọn</span>
            </div>
          </div>
        ) : (
          // Upload placeholder
          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="mb-4 p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full">
              <Upload size={40} className="text-purple-600" />
            </div>
            <p className="text-base font-semibold text-gray-800 mb-2">
              {placeholder}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              Kéo thả ảnh vào đây hoặc click để chọn
            </p>
            <p className="text-xs text-gray-500">
              JPG, PNG hoặc WEBP (tối đa {maxSize}MB)
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default ImageUpload;
