import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../slices/auth';
import { setUser } from '../slices/profile';
import { isTokenExpired, clearAuthData } from '../utils/tokenUtils';

const useAutoLogout = (timeoutDuration = 30 * 60 * 1000) => { // 30 minutes default
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const timeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const tokenCheckRef = useRef(null);

  const logout = useCallback((reason = 'inactivity') => {
    try {
      // Clear all timeouts
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      if (tokenCheckRef.current) clearTimeout(tokenCheckRef.current);
      
      // Clear tokens and user data
      dispatch(setToken(null));
      dispatch(setUser(null));
      
      // Clear stored data
      clearAuthData();
      
      // Show appropriate logout message
      const messages = {
        inactivity: 'You have been automatically logged out due to inactivity. Please login again.',
        expired: 'Your session has expired. Please login again.',
        manual: 'You have been logged out successfully.'
      };
      
      alert(messages[reason] || messages.manual);
      
      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, [dispatch, navigate]);

  const checkTokenValidity = useCallback(() => {
    try {
      if (token && isTokenExpired(token)) {
        logout('expired');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error checking token validity:', error);
      return false;
    }
  }, [token, logout]);

  const resetTimeout = useCallback(() => {
    try {
      // Clear existing timeouts
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);

      // Only set timeout if user is logged in and token is valid
      if (token && checkTokenValidity()) {
        // Set warning timeout (5 minutes before logout)
        warningTimeoutRef.current = setTimeout(() => {
          if (checkTokenValidity()) {
            const shouldStayLoggedIn = window.confirm(
              'You will be logged out in 5 minutes due to inactivity. Click OK to stay logged in.'
            );
            
            if (shouldStayLoggedIn) {
              resetTimeout(); // Reset the timer
            }
          }
        }, timeoutDuration - 5 * 60 * 1000); // 5 minutes before logout

        // Set logout timeout
        timeoutRef.current = setTimeout(() => {
          if (checkTokenValidity()) {
            logout('inactivity');
          }
        }, timeoutDuration);
      }
    } catch (error) {
      console.error('Error resetting timeout:', error);
    }
  }, [token, checkTokenValidity, logout, timeoutDuration]);

  useEffect(() => {
    try {
      // Check token validity immediately on mount
      if (token && !checkTokenValidity()) {
        return; // Token is expired, logout already called
      }

      // Events that indicate user activity
      const events = [
        'mousedown',
        'mousemove',
        'keypress',
        'scroll',
        'touchstart',
        'click'
      ];

      const resetTimeoutHandler = () => {
        try {
          if (checkTokenValidity()) {
            resetTimeout();
          }
        } catch (error) {
          console.error('Error in resetTimeoutHandler:', error);
        }
      };

      // Add event listeners
      events.forEach(event => {
        document.addEventListener(event, resetTimeoutHandler, true);
      });

      // Initial timeout setup
      resetTimeout();

      // Periodic token validation (every 5 minutes)
      tokenCheckRef.current = setInterval(() => {
        try {
          checkTokenValidity();
        } catch (error) {
          console.error('Error in periodic token check:', error);
        }
      }, 5 * 60 * 1000);

      // Cleanup function
      return () => {
        events.forEach(event => {
          document.removeEventListener(event, resetTimeoutHandler, true);
        });
        
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
        if (tokenCheckRef.current) clearInterval(tokenCheckRef.current);
      };
    } catch (error) {
      console.error('Error in useAutoLogout useEffect:', error);
    }
  }, [token, checkTokenValidity, resetTimeout]);

  // Manual logout function
  const manualLogout = useCallback(() => {
    logout('manual');
  }, [logout]);

  return { manualLogout };
};

export default useAutoLogout;
