import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import HotelOperatorSidebar from './components/HotelOperatorSidebar';
import HotelOperatorLogin from './pages/HotelOperatorLogin';
import HotelOperatorDashboard from './pages/HotelOperatorDashboard';
import RegisterHotel from './pages/RegisterHotel';
import MyHotels from './pages/MyHotels';
import AddRoom from './pages/AddRoom';
import ManageRooms from './pages/ManageRooms';
import ManageInventory from './pages/ManageInventory';
import UpdatePrices from './pages/UpdatePrices';
import HotelBookings from './pages/HotelBookings';
import Coupons from './pages/Coupons';
import { HotelOperatorProvider, useHotelOperator } from './HotelOperatorContext';

const AppContent = () => {
    const { operator } = useHotelOperator();
    const location = useLocation();
    const isLogin = location.pathname === '/hotel-operator/login';

    const handleLogout = () => {
        const { logout } = require('./HotelOperatorContext');
        // Actually, just redirecting or calling from context is better
        // since we are inside Provider, we can use the hook
    };

    const SidebarWrapper = () => {
        const { logout } = useHotelOperator();
        return <HotelOperatorSidebar onLogout={() => { logout(); window.location.href = '/hotel-operator/login'; }} />;
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {operator && !isLogin && <SidebarWrapper />}
            <main className={`${operator && !isLogin ? 'ml-72' : ''} min-h-screen p-0 md:p-12`}>
                <Routes>
                    <Route path="/login" element={operator ? <Navigate to="/hotel-operator/dashboard" replace /> : <HotelOperatorLogin />} />

                    <Route path="/dashboard" element={operator ? <HotelOperatorDashboard /> : <Navigate to="/hotel-operator/login" replace />} />
                    {/* Add Hotel */}
                    <Route path="/hotels/add" element={operator ? <RegisterHotel /> : <Navigate to="/hotel-operator/login" replace />} />
                    {/* My Hotels */}
                    <Route path="/hotels" element={operator ? <MyHotels /> : <Navigate to="/hotel-operator/login" replace />} />
                    {/* Add Room */}
                    <Route path="/rooms/add" element={operator ? <AddRoom /> : <Navigate to="/hotel-operator/login" replace />} />
                    {/* Manage Rooms */}
                    <Route path="/rooms" element={operator ? <ManageRooms /> : <Navigate to="/hotel-operator/login" replace />} />
                    {/* Room Inventory */}
                    <Route path="/rooms/inventory" element={operator ? <ManageInventory /> : <Navigate to="/hotel-operator/login" replace />} />
                    {/* Update Prices */}
                    <Route path="/rooms/prices" element={operator ? <UpdatePrices /> : <Navigate to="/hotel-operator/login" replace />} />
                    {/* Bookings */}
                    <Route path="/bookings" element={operator ? <HotelBookings /> : <Navigate to="/hotel-operator/login" replace />} />
                    {/* Coupons */}
                    <Route path="/coupons" element={operator ? <Coupons /> : <Navigate to="/hotel-operator/login" replace />} />

                    <Route path="/" element={<Navigate to={operator ? "/hotel-operator/dashboard" : "/hotel-operator/login"} replace />} />
                </Routes>
            </main>
        </div>
    );
};

const HotelOperatorApp = () => (
    <HotelOperatorProvider>
        <AppContent />
    </HotelOperatorProvider>
);

export default HotelOperatorApp;
