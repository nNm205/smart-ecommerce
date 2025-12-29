import api from '../utils/api';

const dataURLtoBlob = (dataurl) => {
    if (dataurl instanceof Blob) return dataurl;
    if (typeof dataurl !== 'string') return new Blob([]);
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/png';
    const bstr = atob(arr[1] || '');
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
};

const productService = {
    // Lấy tất cả sản phẩm
    getAllProducts: async () => {
        try {
            const response = await api.get('/products');
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    // Lấy danh sách ảnh theo sản phẩm
    getProductImages: async (id) => {
        try {
            const response = await api.get(`/products/${id}/images`);
            const data = response.data;
            if (Array.isArray(data)) return data;
            if (Array.isArray(data?.imageUrls)) return data.imageUrls;
            if (Array.isArray(data?.images)) return data.images;
            if (Array.isArray(data?.data)) return data.data;
            return [];
        } catch (error) {
            console.error('Error fetching product images:', error);
            return [];
        }
    },

    // Lấy sản phẩm theo ID
    getProductById: async (id) => {
        try {
            const response = await api.get(`/products/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    },

    // Tạo sản phẩm mới (multipart/form-data)
    createProduct: async (productData) => {
        try {
            const fd = new FormData();
            const productJson = {
                name: String(productData.name || '').trim(),
                price: Number(productData.price ?? 0),
                description: String(productData.description || '').trim(),
                categoryId: Number(productData.categoryId ?? 0),
                variants: Array.isArray(productData.variants) ? productData.variants : [],
            };
            fd.append('product', new Blob([JSON.stringify(productJson)], { type: 'application/json' }));
            (Array.isArray(productData.images) ? productData.images : []).forEach((img, idx) => {
                const blob = dataURLtoBlob(img);
                fd.append('images', blob, `image_${idx + 1}.png`);
            });
            const response = await api.post('/products', fd);
            return response.data;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    },

    // Cập nhật sản phẩm (multipart/form-data)
    updateProduct: async (id, productData) => {
        try {
            const fd = new FormData();
            const productJson = {
                name: String(productData.name || '').trim(),
                price: Number(productData.price ?? 0),
                description: String(productData.description || '').trim(),
                categoryId: Number(productData.categoryId ?? 0),
                variants: Array.isArray(productData.variants) ? productData.variants : [],
            };
            fd.append('product', new Blob([JSON.stringify(productJson)], { type: 'application/json' }));
            const imgs = Array.isArray(productData.images) ? productData.images : [];
            const appendable = imgs.filter((img) => {
                if (img instanceof Blob) return true;
                if (typeof File !== 'undefined' && img instanceof File) return true;
                return typeof img === 'string' && img.startsWith('data:');
            });
            appendable.forEach((img, idx) => {
                const blob = img instanceof Blob ? img : dataURLtoBlob(img);
                fd.append('images', blob, `image_${idx + 1}.png`);
            });
            const response = await api.put(`/products/${id}`, fd);
            return response.data;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    },

    // Xóa sản phẩm
    deleteProduct: async (id) => {
        try {
            const response = await api.delete(`/products/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    },

    // Tìm kiếm sản phẩm
    searchProducts: async (params = {}) => {
        try {
            const {
                keyword,
                categoryId,
                minPrice,
                maxPrice,
                sortBy = 'createdAt',
                direction = 'DESC',
                page = 0,
                size = 12,
            } = params;
            const response = await api.get(`/products/search`, {
                params: {
                    keyword,
                    categoryId,
                    minPrice,
                    maxPrice,
                    sortBy,
                    direction,
                    page,
                    size,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error searching products:', error);
            throw error;
        }
    },
};

export default productService;
