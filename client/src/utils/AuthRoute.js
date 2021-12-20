import React from 'react';
import { Navigate } from 'react-router-dom'

const AuthRoute = ({children}) => {
    return children.props.authenticated ? <Navigate to='/' /> : children;
}

export default AuthRoute;