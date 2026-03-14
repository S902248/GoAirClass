import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import OperatorLogin from './pages/OperatorLogin';
import OperatorDashboard from './pages/OperatorDashboard';
import OperatorSidebar from './components/OperatorSidebar';
import MyBuses from './pages/MyBuses';
import OperatorRoutes from './pages/OperatorRoutes';
import OperatorCoupons from './pages/OperatorCoupons';
import OperatorSchedules from './pages/OperatorSchedules';
import OperatorBookings from './pages/OperatorBookings';
import AddBus from './pages/AddBus';
import CreateRoute from './pages/CreateRoute';
import CreateSchedule from './pages/CreateSchedule';
import AddCoupon from './pages/AddCoupon';
import useOperator from '../hooks/useOperator';

const OperatorApp = () => {
    const { operator, logout } = useOperator();
    const navigate = useNavigate();
    const location = useLocation();

    const isLoginPage = location.pathname === '/operator/login';

    const handleLogout = () => {
        logout();
        navigate('/operator/login');
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {operator && !isLoginPage && <OperatorSidebar operator={operator} onLogout={handleLogout} />}
            <main className={`${(operator && !isLoginPage) ? 'ml-80' : ''} min-h-screen p-0 md:p-12`}>
                <Routes>
                    {/* Public Route */}
                    <Route path="/login" element={<OperatorLogin />} />

                    {/* Protected routes wrapper or separate checks */}
                    <Route path="/dashboard" element={operator ? <OperatorDashboard /> : <Navigate to="/operator/login" replace />} />
                    <Route path="/buses" element={operator ? <MyBuses /> : <Navigate to="/operator/login" replace />} />
                    <Route path="/buses/add" element={operator ? <AddBus /> : <Navigate to="/operator/login" replace />} />
                    <Route path="/routes" element={operator ? <OperatorRoutes /> : <Navigate to="/operator/login" replace />} />
                    <Route path="/routes/create" element={operator ? <CreateRoute /> : <Navigate to="/operator/login" replace />} />
                    <Route path="/schedules" element={operator ? <OperatorSchedules /> : <Navigate to="/operator/login" replace />} />
                    <Route path="/schedules/create" element={operator ? <CreateSchedule /> : <Navigate to="/operator/login" replace />} />
                    <Route path="/coupons" element={operator ? <OperatorCoupons /> : <Navigate to="/operator/login" replace />} />
                    <Route path="/coupons/add" element={operator ? <AddCoupon /> : <Navigate to="/operator/login" replace />} />
                    <Route path="/bookings" element={operator ? <OperatorBookings /> : <Navigate to="/operator/login" replace />} />
                    <Route path="/passengers" element={operator ? <OperatorBookings /> : <Navigate to="/operator/login" replace />} />

                    <Route path="/" element={<Navigate to={operator ? "/operator/dashboard" : "/operator/login"} replace />} />
                </Routes>
            </main>
        </div>
    );
};

export default OperatorApp;
