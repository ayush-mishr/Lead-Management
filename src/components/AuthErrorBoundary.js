import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setToken } from '../slices/auth';

const AuthErrorBoundary = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Check for token expiration
  React.useEffect(() => {
    if (token) {
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        if (tokenData.exp < currentTime) {
          console.warn('Token expired, logging out user');
          dispatch(setToken(null));
          alert('Your session has expired. Please login again.');
        }
      } catch (error) {
        console.error('Invalid token format, logging out user');
        dispatch(setToken(null));
      }
    }
  }, [token, dispatch]);

  // Global error handler for axios responses
  React.useEffect(() => {
    const handleUnauthorized = (event) => {
      if (event.detail?.status === 401) {
        dispatch(setToken(null));
        alert('Authentication failed. Please login again.');
      }
    };

    window.addEventListener('auth-error', handleUnauthorized);
    return () => window.removeEventListener('auth-error', handleUnauthorized);
  }, [dispatch]);

  return children;
};

export default AuthErrorBoundary;
