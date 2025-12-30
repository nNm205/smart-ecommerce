import React, { useEffect, useState } from 'react';
import { DollarSign, ShoppingCart, UserPlus, Package } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import PieChart from '../components/dashboard/PieChart';
import LineChart from '../components/dashboard/LineChart';
import GrowthDonut from '../components/dashboard/GrowthDonut';
import dashboardService from '../services/dashboardService';

const Dashboard = () => {
    const [statsData, setStatsData] = useState(null);
    const [revenue7d, setRevenue7d] = useState([]);
    const [categoryRevenue, setCategoryRevenue] = useState([]);
    const [topCustomers, setTopCustomers] = useState([]);
    const [topProducts, setTopProducts] = useState([]);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const stats = await dashboardService.getStats();
                setStatsData(stats);
            } catch (error) {
                console.error("Failed to load stats:", error);
                setStatsData(null);
            }
        };

        const loadCharts = async () => {
            try {
                const [rev, cat, customers, products] = await Promise.all([
                    dashboardService.getRevenue(7),
                    dashboardService.getCategoryStats(),
                    dashboardService.getTopCustomers(5),
                    dashboardService.getTopProducts(5),
                ]);

                const revRaw =
                    Array.isArray(rev) ? rev :
                    Array.isArray(rev?.data) ? rev.data :
                    Array.isArray(rev?.content) ? rev.content : [];
                const revNorm = revRaw.map((r) => ({
                    label: r.date || r.day || r.label || '',
                    value: typeof r.revenue === 'number' ? r.revenue : parseFloat(r.revenue || 0) || 0,
                }));
                setRevenue7d(revNorm);

                const catRaw =
                    Array.isArray(cat) ? cat :
                    Array.isArray(cat?.data) ? cat.data :
                    Array.isArray(cat?.items) ? cat.items : [];
                const palette = ['bg-blue-500','bg-green-500','bg-yellow-500','bg-purple-500','bg-red-500','bg-indigo-500'];
                const catNorm = catRaw.map((c, i) => {
                    const valRaw = c.totalRevenue ?? c.revenue;
                    const val = typeof valRaw === 'number' ? valRaw : parseFloat(valRaw || 0) || 0;
                    return { name: c.categoryName || c.name || `Danh mục #${c.categoryId}`, value: val, color: palette[i % palette.length] };
                });
                setCategoryRevenue(catNorm);

                const custRaw =
                    Array.isArray(customers) ? customers :
                    Array.isArray(customers?.data) ? customers.data : [];
                setTopCustomers(custRaw);

                const prodRaw =
                    Array.isArray(products) ? products :
                    Array.isArray(products?.data) ? products.data : [];
                setTopProducts(prodRaw);
            } catch (error) {
                console.error("Failed to load charts:", error);
                setRevenue7d([]);
                setCategoryRevenue([]);
                setTopCustomers([]);
                setTopProducts([]);
            }
        };

        loadStats();
        loadCharts();
    }, []);

    const formatGrowth = (rate) => {
        if (rate === undefined || rate === null) return '0%';
        return `${rate > 0 ? '+' : ''}${rate}%`;
    };

    const formatCurrency = (value) => {
        const num = typeof value === 'number' ? value : parseFloat(value || 0) || 0;
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
    };

    const stats = [
        {
            title: 'Tổng Doanh Thu',
            value: statsData?.totalRevenue ?? 0,
            change: formatGrowth(statsData?.revenueGrowthRate),
            icon: DollarSign,
            color: 'bg-blue-300',
            trend: (statsData?.revenueGrowthRate || 0) < 0 ? 'down' : 'up'
        },
        {
            title: 'Đơn Hàng',
            value: statsData?.totalOrders ?? 0,
            change: formatGrowth(statsData?.orderGrowthRate),
            icon: ShoppingCart,
            color: 'bg-green-300',
            trend: (statsData?.orderGrowthRate || 0) < 0 ? 'down' : 'up'
        },
        {
            title: 'Khách Hàng',
            value: statsData?.totalUsers ?? 0,
            change: formatGrowth(statsData?.userGrowthRate),
            icon: UserPlus,
            color: 'bg-purple-300',
            trend: (statsData?.userGrowthRate || 0) < 0 ? 'down' : 'up'
        },
        {
            title: 'Sản Phẩm',
            value: statsData?.totalProducts ?? 0,
            change: '',
            icon: Package,
            color: 'bg-orange-300',
            trend: 'up'
        }
    ];

    const growthCards = [
        { label: 'Doanh thu', value: statsData?.revenueGrowthRate || 0, color: '#14b8a6' },
        { label: 'Đơn hàng', value: statsData?.orderGrowthRate || 0, color: '#3b82f6' },
        { label: 'Khách hàng', value: statsData?.userGrowthRate || 0, color: '#a855f7' },
    ];

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {stats.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <LineChart data={revenue7d} title="Doanh Thu 7 Ngày Gần Đây" />
                <PieChart data={categoryRevenue} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {growthCards.map((g, i) => (
                    <GrowthDonut key={i} value={g.value} total={100} label={g.label} color={g.color} />
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Top Khách Hàng</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách Hàng</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng Đơn Hàng</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng Chi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {(Array.isArray(topCustomers) ? topCustomers : []).map((c, i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {c.fullName || c.name || c.email || `Khách #${c.id}`}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                            {typeof c.totalOrders === 'number' ? c.totalOrders : (c.totalOrders || 0)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                            {formatCurrency(c.totalSpent)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Top Sản Phẩm</h3>
                    <div className="grid grid-cols-5 gap-4">
                        {(Array.isArray(topProducts) ? topProducts.slice(0, 5) : []).map((p, i) => (
                            <div key={i} className="w-32">
                                <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                                    {p.imageUrl ? (
                                        <img src={p.imageUrl} alt={p.productName || p.name || `SP #${p.id}`} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-gray-400 text-xs">No Image</div>
                                    )}
                                </div>
                                <div className="mt-2 text-xs text-center text-gray-700 truncate">
                                    {p.productName || p.name || `SP #${p.id}`}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
