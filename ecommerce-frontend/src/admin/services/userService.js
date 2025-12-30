import api from '../utils/api';

const userService = {
    // Lấy danh sách users (có hỗ trợ tìm kiếm)
    getUsers: async (keyword = '', role) => {
        try {
            const params = {};
            if (keyword) {
                params.keyword = keyword;
            }
            if (role) {
                params.role = role;
            }
            const response = await api.get('/admin/users', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },

    // Lấy thông tin chi tiết user
    getUserById: async (id) => {
        try {
            const response = await api.get(`/admin/users/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user details:', error);
            throw error;
        }
    },

    // Cập nhật thông tin user
    updateUser: async (id, userData) => {
        try {
            const response = await api.put(`/admin/users/${id}`, userData);
            return response.data;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    },

    // Xóa user
    deleteUser: async (id) => {
        try {
            const response = await api.delete(`/admin/users/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }
};

export default userService;
