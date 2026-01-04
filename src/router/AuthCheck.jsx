import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthCheck = ({ children }) => {
    // Check token directly instead of using state
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" />;
    }

    // Decode token and check validity
    try {
        const decoded = jwtDecode(token);

        // Check if token is expired
        if (decoded.exp < Date.now() / 1000) {
            localStorage.removeItem('token');
            return <Navigate to="/login" />;
        }

        // If user is reseller, redirect to reseller page
        if (decoded.role === 'reseller') {
            return <Navigate to="/reseller" />;
        }

        // If user is admin, render children (allow access)
        if (decoded.role === 'admin') {
            return children;
        }

        // If role is neither admin nor reseller, redirect to login
        return <Navigate to="/login" />;
    } catch (error) {
        console.error('Failed to decode token:', error);
        localStorage.removeItem('token');
        return <Navigate to="/login" />;
    }
}

export default AuthCheck