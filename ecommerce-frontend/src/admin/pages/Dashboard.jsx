import React from 'react';
import { DollarSign, ShoppingCart, UserPlus, Package, ArrowUp, ArrowDown, TrendingUp } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import ColumnChart from '../components/dashboard/ColumnChart';
import PieChart from '../components/dashboard/PieChart';
import RecentOrders from '../components/dashboard/RecentOrders';

const Dashboard = () => {
    const stats = [
        {
            title: 'Tổng Doanh Thu',
            value: '₫125,430,000',
            change: '+12.5%',
            icon: DollarSign,
            color: 'bg-blue-500',
            trend: 'up'
        },
        {
            title: 'Đơn Hàng Mới',
            value: '234',
            change: '+8.2%',
            icon: ShoppingCart,
            color: 'bg-green-500',
            trend: 'up'
        },
        {
            title: 'Khách Hàng',
            value: '1,429',
            change: '+23.1%',
            icon: UserPlus,
            color: 'bg-purple-500',
            trend: 'up'
        },
        {
            title: 'Sản Phẩm',
            value: '856',
            change: '-2.4%',
            icon: Package,
            color: 'bg-orange-500',
            trend: 'down'
        }
    ];

    const chartData = [
        { month: 'T1', revenue: 45, orders: 120 },
        { month: 'T2', revenue: 52, orders: 145 },
        { month: 'T3', revenue: 48, orders: 135 },
        { month: 'T4', revenue: 68, orders: 180 },
        { month: 'T5', revenue: 75, orders: 210 },
        { month: 'T6', revenue: 82, orders: 234 },
        { month: 'T7', revenue: 95, orders: 268 },
    ];

    const categories = [
        { name: 'Điện thoại', value: 35, color: 'bg-blue-500' },
        { name: 'Laptop', value: 28, color: 'bg-green-500' },
        { name: 'Phụ kiện', value: 20, color: 'bg-yellow-500' },
        { name: 'Tablet', value: 17, color: 'bg-purple-500' },
    ];

    return (
        <>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
                <p className="text-gray-600">Tổng quan và thống kê hệ thống</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {stats.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <ColumnChart data={chartData} />
                <PieChart data={categories} />
            </div>

            {/* Recent Orders */}
            <RecentOrders />
        </>
    );
};

export default Dashboard;