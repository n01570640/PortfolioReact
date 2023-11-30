import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * A higher-order component that wraps around a component to provide route protection.
 * It checks if the user is authenticated and authorized to access the route.
 * 
 * @param {Object} props - Component properties.
 * @param {React.Component} props.component - The component to be rendered if the user is authorized.
 * @param {Array} props.allowedUserTypes - List of user types that are allowed to access the route.
 * @returns {React.Component} - A component if the user is authorized, otherwise redirects to the login page.
 */
const ProtectedRoute = ({ component: Component, allowedUserTypes }) => {
    // Retrieve the JWT token stored in local storage
    const userToken = localStorage.getItem('userToken');

    // Initialize user to null
    let user = null;

    // Decode the JWT token if present
    if (userToken) {
        // Split the JWT token to extract the payload part (base64 encoded)
        const base64Url = userToken.split('.')[1];
        
        // Replace URL-specific characters with base64 characters and decode the string
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = atob(base64);

        // Parse the JSON payload to get the user object
        user = JSON.parse(payload);
    }

    // Extract the userType from the user object, if the user is defined
    const userType = user ? user.userType : null;

    // Check if user is authenticated (user exists) and authorized (userType is in the allowed list)
    if (!user || !allowedUserTypes.includes(userType)) {
        // If not authenticated or not allowed, redirect to the login page
        return <Navigate to="/login" />;
    }

    // If authenticated and authorized, render the wrapped component
    return <Component />;
};

export default ProtectedRoute;
