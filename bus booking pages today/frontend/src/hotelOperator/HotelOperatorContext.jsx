import React, { createContext, useContext, useState, useEffect } from 'react';

const HotelOperatorContext = createContext(null);

export const HotelOperatorProvider = ({ children }) => {
    const [operator, setOperator] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('hotelOperatorData');
        if (stored) {
            try { setOperator(JSON.parse(stored)); }
            catch { localStorage.removeItem('hotelOperatorData'); }
        }
    }, []);

    const login = (operatorData, token) => {
        localStorage.setItem('hotelOperatorToken', token);
        localStorage.setItem('hotelOperatorData', JSON.stringify(operatorData));
        setOperator(operatorData);
    };

    const logout = () => {
        localStorage.removeItem('hotelOperatorToken');
        localStorage.removeItem('hotelOperatorData');
        setOperator(null);
    };

    const hasPerm = (perm) => {
        if (!operator?.permissions) return false;
        // Permissions stored as array of strings e.g. ['Add Hotel', 'Manage Hotels', ...]
        const perms = operator.permissions.map(p => p.toLowerCase().replace(/\s+/g, ''));
        return perms.includes(perm.toLowerCase().replace(/\s+/g, ''));
    };

    return (
        <HotelOperatorContext.Provider value={{ operator, login, logout, hasPerm }}>
            {children}
        </HotelOperatorContext.Provider>
    );
};

export const useHotelOperator = () => useContext(HotelOperatorContext);
