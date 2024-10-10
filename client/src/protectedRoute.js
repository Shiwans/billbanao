// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
    const isAuthenticated = () => {
        const token = localStorage.getItem('token');
        return token !== null; // Return true if token exists
    };

    return isAuthenticated() ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
