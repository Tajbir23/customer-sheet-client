import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthCheck = ({children}) => {
    // Check token directly instead of using state
    const token = localStorage.getItem('token');
    
    if (!token) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default AuthCheck