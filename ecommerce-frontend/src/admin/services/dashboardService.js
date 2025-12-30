import api from '../utils/api';

const dashboardService = {
    getStats: async (statuses) => {
        const params = {};
        if (Array.isArray(statuses) && statuses.length) {
            params.statuses = statuses.join(',');
        }
        const response = await api.get('/admin/dashboard/stats', { params });
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
    getLowStockProducts: async () => {
        const response = await api.get('/admin/dashboard/low-stock-products');
        return response.data;
    },
};

export default dashboardService;
