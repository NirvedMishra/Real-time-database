import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";
const LoginRoute = ({children}) => {
    const token = useAuth().token;
    return !token ? children : <Navigate to="/dashboard" />;
};

export default LoginRoute;
