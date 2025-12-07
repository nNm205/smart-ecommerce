import React from 'react';
import NotificationDropdown from '../common/NotificationDropdown.jsx';

const Header = () => {
    return (
        <header className="bg-white shadow-sm p-4 flex items-center justify-end">
            <div className="flex items-center gap-4">
                <NotificationDropdown />
            </div>
        </header>
    );
};

export default Header;