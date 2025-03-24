import React from "react";

import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated, children }) => {  
    if(isAuthenticated) {
        return children
    }
    else {
        return <Navigate to="/signin" replace />;
    }
 };

export default ProtectedRoute;