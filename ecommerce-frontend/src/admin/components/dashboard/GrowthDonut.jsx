import React from 'react';

const GrowthDonut = ({ value = 0, total = 100, label = '', color = '#14b8a6' }) => {
    const size = 120;
    const stroke = 10;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const safeTotal = total > 0 ? total : 100;
    const percent = Math.max(0, Math.min(100, (value / safeTotal) * 100));
    const dashOffset = circumference * (1 - percent / 100);

    return (
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size}>
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#e5e7eb"
                        strokeWidth={stroke}
                        fill="none"
                    />
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={color}
                        strokeWidth={stroke}
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        strokeLinecap="round"
                        transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-sm md:text-base font-semibold text-gray-800">
                        {typeof value === 'number' ? `${Math.round(value)}%` : String(value || '')}
                    </div>
                </div>
            </div>
            {label && <div className="mt-2 text-xs text-gray-600">{label}</div>}
        </div>
    );
};

export default GrowthDonut;
