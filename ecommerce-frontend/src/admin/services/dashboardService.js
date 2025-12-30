import api from '../utils/api';

const dashboardService = {
    getStats: async () => {
        const response = await api.get('/admin/dashboard/stats');
        return response.data;
    },
    getRevenue: async (days = 7) => {
        const response = await api.get('/admin/dashboard/revenue', { params: { days } });
        return response.data;
    },
    getCategoryStats: async () => {
        const response = await api.get('/admin/dashboard/category-stats');
        return response.data;
    },
    getTopCustomers: async (limit = 5) => {
        const response = await api.get('/admin/dashboard/top-customers', { params: { limit } });
        return response.data;
    },
    getTopProducts: async (limit = 5) => {
        const response = await api.get('/admin/dashboard/top-products', { params: { limit } });
        return response.data;
    },
};

export default dashboardService;
