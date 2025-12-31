import { useState, useCallback } from "react";
import virtualTryOnService from "@/services/virtualTryOnService";

const useVirtualTryOn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resultImageUrl, setResultImageUrl] = useState(null);
  const [modelImage, setModelImage] = useState(null);
  const [modelImagePreview, setModelImagePreview] = useState(null);
  const [clothingImage, setClothingImage] = useState(null);
  const [clothingImagePreview, setClothingImagePreview] = useState(null);

  const handleModelImageChange = useCallback((file) => {
    if (!file) {
      setModelImage(null);
      setModelImagePreview(null);
      return;
    }

    const validation = virtualTryOnService.validateImage(file);
    if (!validation.isValid) {
      setError(validation.errors.join(". "));
      return;
    }

    setModelImage(file);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setModelImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleClothingImageChange = useCallback((file) => {
    if (!file) {
      setClothingImage(null);
      setClothingImagePreview(null);
      return;
    }

    const validation = virtualTryOnService.validateImage(file);
    if (!validation.isValid) {
      setError(validation.errors.join(". "));
      return;
    }

    setClothingImage(file);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setClothingImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const setClothingImageFromUrl = useCallback(async (imageUrl) => {
    try {
      setLoading(true);
      setError(null);

      const file = await virtualTryOnService.urlToFile(imageUrl);
      setClothingImage(file);
      setClothingImagePreview(imageUrl);

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  const performTryOn = useCallback(async () => {
    if (!modelImage || !clothingImage) {
      setError("Vui lòng chọn đầy đủ ảnh của bạn và ảnh sản phẩm");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResultImageUrl(null);

      const resultUrl = await virtualTryOnService.performTryOn(
        modelImage,
        clothingImage
      );

      setResultImageUrl(resultUrl);
      setLoading(false);

      return resultUrl;
    } catch (error) {
      setError(error.message);
      setLoading(false);
      throw error;
    }
  }, [modelImage, clothingImage]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setResultImageUrl(null);
    setModelImage(null);
    setModelImagePreview(null);
    setClothingImage(null);
    setClothingImagePreview(null);
  }, []);

  const resetResult = useCallback(() => {
    setResultImageUrl(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    resultImageUrl,
    modelImage,
    modelImagePreview,
    clothingImage,
    clothingImagePreview,

    handleModelImageChange,
    handleClothingImageChange,
    setClothingImageFromUrl,
    performTryOn,
    reset,
    resetResult,
    clearError,

    canTryOn: modelImage && clothingImage && !loading,
  };
};

export default useVirtualTryOn;
