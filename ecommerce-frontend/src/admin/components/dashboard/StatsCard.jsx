import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const StatsCard = ({ title, value, change, icon, color, trend }) => {
    const IconComponent = icon;
    return (
        <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
            <div className="flex items-center justify-between mb-4">
                <div className={`${color} p-3 rounded-lg`}>
                    <IconComponent className="text-white" size={24} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${
                    trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                    {trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                    <span>{change}</span>
                </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">{title}</h3>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    );
};

export default StatsCard;
