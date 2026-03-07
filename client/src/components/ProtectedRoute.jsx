import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-medical-dark bg-opacity-5">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-blue"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect entirely to their specific dashboard based on role
        if (user.role === 'admin') return <Navigate to="/admin" replace />;
        if (user.role === 'doctor') return <Navigate to="/doctor" replace />;
        if (user.role === 'patient') return <Navigate to="/patient" replace />;
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
