import React from 'react';
import { TrendingUp } from 'lucide-react';

const PieChart = ({ data }) => {
    const colors = {
        'bg-blue-500': '#3b82f6',
        'bg-green-500': '#10b981',
        'bg-yellow-500': '#eab308',
        'bg-purple-500': '#a855f7'
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-6">Danh Mục Sản Phẩm</h3>
            <div className="flex items-center justify-center mb-6">
                <div className="relative w-48 h-48">
                    <svg viewBox="0 0 200 200" className="transform -rotate-90">
                        {(() => {
                            let currentAngle = 0;
                            return data.map((cat, index) => {
                                const percentage = cat.value / 100;
                                const angle = percentage * 360;
                                const endAngle = currentAngle + angle;

                                const startX = 100 + 80 * Math.cos((currentAngle * Math.PI) / 180);
                                const startY = 100 + 80 * Math.sin((currentAngle * Math.PI) / 180);
                                const endX = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
                                const endY = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);

                                const largeArc = angle > 180 ? 1 : 0;
                                const pathData = `M 100 100 L ${startX} ${startY} A 80 80 0 ${largeArc} 1 ${endX} ${endY} Z`;

                                const result = (
                                    <path
                                        key={index}
                                        d={pathData}
                                        fill={colors[cat.color]}
                                        className="hover:opacity-80 transition-opacity cursor-pointer"
                                        stroke="white"
                                        strokeWidth="2"
                                    />
                                );

                                currentAngle = endAngle;
                                return result;
                            });
                        })()}
                        <circle cx="100" cy="100" r="45" fill="white" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-800">100%</div>
                            <div className="text-xs text-gray-500">Tổng</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="space-y-3">
                {data.map((cat, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 ${cat.color} rounded-full`}></div>
                            <span className="text-sm text-gray-700">{cat.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{cat.value}%</span>
                    </div>
                ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700">
                    <TrendingUp size={20} />
                    <span className="text-sm font-semibold">Tăng trưởng 15% so với tháng trước</span>
                </div>
            </div>
        </div>
    );
};

export default PieChart;