import React, { createContext, useContext, useState, useEffect } from 'react';

const OperatorContext = createContext();

export const OperatorProvider = ({ children }) => {
    const [operator, setOperator] = useState(() => {
        const savedOperator = localStorage.getItem('operatorData');
        return savedOperator ? JSON.parse(savedOperator) : null;
    });

    const login = (operatorData, token) => {
        localStorage.setItem('operatorToken', token);
        localStorage.setItem('operatorData', JSON.stringify(operatorData));
        setOperator(operatorData);
    };

    const logout = () => {
        localStorage.removeItem('operatorToken');
        localStorage.removeItem('operatorData');
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        setOperator(null);
    };

    return (
        <OperatorContext.Provider value={{ operator, login, logout, isLoggedIn: !!operator }}>
            {children}
        </OperatorContext.Provider>
    );
};

export const useOperatorContext = () => {
    const context = useContext(OperatorContext);
    if (!context) {
        throw new Error('useOperatorContext must be used within an OperatorProvider');
    }
    return context;
};
