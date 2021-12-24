import React from 'react';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const AuthRoute = ({ authenticated, children}) => {
    return authenticated ? <Navigate to='/' /> : children;
}

const mapStateToPros = (state) => ({
    authenticated: state.user.authenticated,
    user: state.user
});

AuthRoute.propTypes = {
    user: PropTypes.object
}

export default connect(mapStateToPros)(AuthRoute);