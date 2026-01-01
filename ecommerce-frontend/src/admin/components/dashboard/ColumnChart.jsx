import React from 'react';

const ColumnChart = ({ data }) => {
    const maxRevenue = 100;
    const maxOrders = 300;

    return (
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-6">Doanh Thu & Đơn Hàng Theo Tháng</h3>
            <div className="h-80 flex items-end justify-around gap-4 px-4 border-l-2 border-b-2 border-gray-300">
                {data.map((item, index) => (
                    <div key={index} className="flex flex-col items-center gap-3 flex-1 h-full">
                        <div className="w-full flex gap-2 items-end h-full pb-8">
                            <div className="flex-1 flex items-end h-full">
                                <div
                                    className="w-full bg-blue-500 rounded-t-lg hover:bg-blue-600 cursor-pointer transition-all duration-300 relative group"
                                    style={{
                                        height: `${(item.revenue / maxRevenue) * 100}%`
                                    }}
                                >
                                    <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {item.revenue}tr
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 flex items-end h-full">
                                <div
                                    className="w-full bg-green-500 rounded-t-lg hover:bg-green-600 cursor-pointer transition-all duration-300 relative group"
                                    style={{
                                        height: `${(item.orders / maxOrders) * 100}%`
                                    }}
                                >
                                    <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {item.orders} đơn
                                    </div>
                                </div>
                            </div>
                        </div>
                        <span className="text-xs font-medium text-gray-600">{item.month}</span>
                    </div>
                ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-6 text-sm border-t pt-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span>Doanh thu (triệu)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Đơn hàng</span>
                </div>
            </div>
        </div>
    );
};

export default ColumnChart;