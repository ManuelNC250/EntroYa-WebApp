import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';

const Layout = () => {
    return (
        <div style={{ minHeight: '100vh', overflowX: 'hidden' }}>
            <Navbar />
            <main style={{ padding: '2rem 0 3rem', minHeight: 'calc(100vh - 64px)' }}>
                <div className="container" style={{ padding: '0 16px' }}>
                    <Outlet />
                </div>
            </main>
            <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        </div>
    );
};

export default Layout;