import React from 'react';
import NotificationDropdown from '../common/NotificationDropdown.jsx';

const Header = () => {
    const adminName = localStorage.getItem('adminName') || 'Admin';
    return (
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
            <div className="text-sm text-gray-700">
                Xin chào, <span className="font-semibold">{adminName}</span>
            </div>
            <div className="flex items-center gap-4">
                <NotificationDropdown />
            </div>
        </header>
    );
};

export default Header;
