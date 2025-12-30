import api from '../utils/api';

const orderService = {
    getOrders: async (keyword = '') => {
        try {
            const params = {};
            if (keyword) params.keyword = keyword;
            const response = await api.get('/admin/orders', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    },

    getOrderById: async (id) => {
        try {
            const response = await api.get(`/admin/orders/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching order details:', error);
            throw error;
        }
    },

    updateOrderStatus: async (id, status) => {
        try {
            const response = await api.put(`/admin/orders/${id}/status`, { status });
            return response.data;
        } catch (error) {
            console.error('Error updating order status:', error);
            throw error;
        }
    }
};

export default orderService;

