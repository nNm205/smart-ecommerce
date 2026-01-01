import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';

const ImageUpload = ({ value, onChange, multiple = false }) => {
    const [preview, setPreview] = useState(multiple ? (Array.isArray(value) ? value : []) : (value || null));

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        const validFiles = files.filter(f => f.type.startsWith('image/'));
        if (validFiles.length !== files.length) {
            alert('Vui lòng chỉ chọn file ảnh!');
        }

        const oversize = validFiles.find(f => f.size > 5 * 1024 * 1024);
        if (oversize) {
            alert('Kích thước mỗi file không được vượt quá 5MB!');
            return;
        }

        if (!multiple) {
            const file = validFiles[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setPreview(base64String);
                onChange(base64String);
            };
            reader.readAsDataURL(file);
            return;
        }

        Promise.all(validFiles.map(f => new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(f);
        }))).then((base64s) => {
            const next = [...(Array.isArray(preview) ? preview : []), ...base64s];
            setPreview(next);
            onChange(next);
        });
    };

    const handleRemove = (idx = null) => {
        if (!multiple) {
            setPreview(null);
            onChange(null);
            return;
        }
        const next = (Array.isArray(preview) ? preview : []).filter((_, i) => i !== idx);
        setPreview(next);
        onChange(next);
    };

    return (
        <div className="space-y-2">
            {multiple ? (
                <>
                    <div className="grid grid-cols-3 gap-3">
                        {(Array.isArray(preview) ? preview : []).map((src, idx) => (
                            <div key={idx} className="relative w-full h-32 border-2 border-gray-300 rounded-lg overflow-hidden">
                                <img src={src} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => handleRemove(idx)}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col items-center justify-center py-4">
                            <Upload className="w-10 h-10 text-gray-400 mb-2" />
                            <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Click để thêm ảnh</span> hoặc kéo thả
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 5MB mỗi ảnh)</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} multiple />
                    </label>
                </>
            ) : (
                <>
                    {preview ? (
                        <div className="relative w-full h-48 border-2 border-gray-300 rounded-lg overflow-hidden">
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => handleRemove()}
                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col items-center justify-center py-6">
                                <Upload className="w-12 h-12 text-gray-400 mb-3" />
                                <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">Click để upload</span> hoặc kéo thả
                                </p>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 5MB)</p>
                            </div>
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                    )}
                </>
            )}
        </div>
    );
};

export default ImageUpload;
