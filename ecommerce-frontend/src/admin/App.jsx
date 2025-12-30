import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Chat from './pages/Chat';
import Login from './pages/Login';

function App() {
    const location = useLocation();
    const isAuthRoute = location.pathname === '/login';
    const rawToken = localStorage.getItem('token');
    const token = rawToken && rawToken !== 'undefined' && rawToken !== 'null' && rawToken.trim() !== '' ? rawToken : null;

    if (isAuthRoute && token) {
        return <Navigate to="/" replace />;
    }

    if (!isAuthRoute && !token) {
        return <Navigate to="/login" replace />;
    }

    if (isAuthRoute) {
        return (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Login />} />
            </Routes>
        );
    }
    return (
        <AdminLayout>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/products" element={<Products />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/chat" element={<Chat />} />
            </Routes>
        </AdminLayout>
    );
}

export default App;
