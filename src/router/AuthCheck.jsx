import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthCheck = ({ children }) => {
    // Check token directly instead of using state
    const token = localStorage.getItem('token');

    // Decode token and console log
    try {
        const decoded = jwtDecode(token);
        if (!token || decoded.exp < Date.now() / 1000 || decoded.role !== 'admin') {
            return <Navigate to="/login" />;
        }
    } catch (error) {
        console.error('Failed to decode token:', error);
    }

    return children;
}

export default AuthCheck