import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Chat from './pages/Chat';
import Settings from './pages/Settings';

function App() {
    return (
        <AdminLayout>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/products" element={<Products />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </AdminLayout>
    );
}

export default App;