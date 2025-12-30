import React from 'react';

const StatsCard = ({ title, value, icon, color }) => {
    const IconComponent = icon;
    return (
        <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
            <div className="flex items-center justify-between mb-4">
                <div className={`${color} p-3 rounded-lg`}>
                    <IconComponent className="text-gray-600" size={24} />
                </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">{title}</h3>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    );
};

export default StatsCard;
