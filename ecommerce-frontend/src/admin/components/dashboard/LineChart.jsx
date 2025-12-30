import React from 'react';

const LineChart = ({ data = [], title = 'Biểu đồ' }) => {
    const padding = 20;
    const w = 700;
    const h = 300;
    const values = (Array.isArray(data) ? data : []).map((d) => (typeof d.value === 'number' ? d.value : parseFloat(d.value || 0) || 0));
    const max = Math.max(1, ...values);
    const stepX = (w - padding * 2) / Math.max(1, Math.max(0, data.length - 1));
    const points = (Array.isArray(data) ? data : []).map((d, i) => {
        const v = typeof d.value === 'number' ? d.value : parseFloat(d.value || 0) || 0;
        const x = padding + i * stepX;
        const y = h - padding - (v / max) * (h - padding * 2);
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-6">{title}</h3>
            <div className="h-80 relative">
                <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full">
                    <polyline points={points} fill="none" stroke="#3b82f6" strokeWidth="3" />
                    {(Array.isArray(data) ? data : []).map((d, i) => {
                        const v = typeof d.value === 'number' ? d.value : parseFloat(d.value || 0) || 0;
                        const x = padding + i * stepX;
                        const y = h - padding - (v / max) * (h - padding * 2);
                        return (
                            <g key={i}>
                                <circle cx={x} cy={y} r="3" fill="#3b82f6" />
                                <text x={x} y={h - 4} fontSize="10" textAnchor="middle" fill="#6b7280">{d.label}</text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};

export default LineChart;
