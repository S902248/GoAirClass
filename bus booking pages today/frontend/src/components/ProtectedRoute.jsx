import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const location = useLocation();

    // Check for tokens
    const userToken = localStorage.getItem('token');
    const operatorToken = localStorage.getItem('operatorToken');

    // Get user data
    const userData = localStorage.getItem('userData');
    const operatorData = localStorage.getItem('operatorData');

    let user = null;
    let role = null;

    try {
        if (userToken && userData) {
            user = JSON.parse(userData);
            role = user.role;
        } else if (operatorToken && operatorData) {
            user = JSON.parse(operatorData);
            role = 'operator';
        }
    } catch (e) {
        console.error("Auth parsing error", e);
        localStorage.clear(); // Clear potentially corrupted data
    }

    // Bypass protection for login pages to allow role switching
    if (location.pathname === '/operator/login' || location.pathname === '/admin-login') {
        return children;
    }

    // Not logged in
    if (!role) {
        if (location.pathname.startsWith('/operator')) {
            return <Navigate to="/operator/login" state={{ from: location }} replace />;
        }
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // Role based protection
    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/access-denied" replace />;
    }

    return children;
};

export default ProtectedRoute;
