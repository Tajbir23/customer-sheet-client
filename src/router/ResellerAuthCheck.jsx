import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ResellerAuthCheck = ({ children }) => {
    // Check token directly instead of using state
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" />;
    }

    // Decode token and console log
    try {
        const decoded = jwtDecode(token);
        if (!token || decoded.exp < Date.now() / 1000 || decoded.role !== 'reseller') {
            return <Navigate to="/login" />;
        }
    } catch (error) {
        console.error('Failed to decode token:', error);
    }

    return children;
}

export default ResellerAuthCheck