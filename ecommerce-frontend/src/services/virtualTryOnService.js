import api from "./api";

const virtualTryOnService = {
  performTryOn: async (modelPhoto, clothingPhoto) => {
    try {
      if (!modelPhoto || !clothingPhoto) {
        throw new Error(
          "Vui lòng cung cấp đầy đủ ảnh người dùng và ảnh sản phẩm"
        );
      }

      const validImageTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];

      if (
        !validImageTypes.includes(modelPhoto.type) ||
        !validImageTypes.includes(clothingPhoto.type)
      ) {
        throw new Error("Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc WEBP");
      }

      const maxSize = 10 * 1024 * 1024;
      if (modelPhoto.size > maxSize || clothingPhoto.size > maxSize) {
        throw new Error("Kích thước ảnh không được vượt quá 1024MB");
      }

      const formData = new FormData();
      formData.append("modelPhoto", modelPhoto);
      formData.append("clothingPhoto", clothingPhoto);

      console.log("Đang gửi request virtual try-on...");

      const response = await api.post("/virtual-try-on", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 120000,
      });

      if (!response.data) {
        throw new Error("Không nhận được kết quả từ server");
      }

      console.log("Virtual try-on thành công:", response.data);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi thực hiện virtual try-on:", error);

      if (error.response) {
        // Server trả về lỗi
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data;

        if (status === 400) {
          throw new Error(`Dữ liệu không hợp lệ: ${message}`);
        } else if (status === 401) {
          throw new Error("Vui lòng đăng nhập để sử dụng tính năng này");
        } else if (status === 413) {
          throw new Error("Kích thước ảnh quá lớn");
        } else if (status === 500) {
          throw new Error("Lỗi server. Vui lòng thử lại sau");
        } else {
          throw new Error(`Lỗi: ${message}`);
        }
      } else if (error.request) {
        throw new Error(
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng"
        );
      } else {
        // Lỗi khác
        throw new Error(error.message || "Có lỗi xảy ra khi thử đồ");
      }
    }
  },

  urlToFile: async (imageUrl, filename = "product-name.jpg") => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      return new File([blob], filename, { type: blob.type });
    } catch (error) {
      console.error("Lỗi khi tải ảnh:", error);
      throw new Error("Không thể tải ảnh sản phẩm");
    }
  },

  validateImage: (file) => {
    const errors = [];

    const validImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    if (!validImageTypes.includes(file.type)) {
      errors.push("Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc WEBP");
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      errors.push("Kích thước ảnh không được vượt quá 10MB");
    }

    const minSize = 10 * 1024;
    if (file.size < minSize) {
      errors.push("Ảnh quá nhỏ, vui lòng chọn ảnh khác");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

export default virtualTryOnService;
