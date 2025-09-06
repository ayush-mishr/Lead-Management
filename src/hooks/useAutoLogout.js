import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../slices/auth';
import { isSessionActive, clearSession, initializeSession } from '../utils/tokenUtils';

export const useAutoLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    // Initialize session if user is logged in
    if (token) {
      initializeSession();
    }

    // Handle website close vs refresh
    const handleBeforeUnload = (event) => {
      // Check if this is a refresh (F5 or Ctrl+R) or navigation within the site
      const isRefresh = (
        event.type === 'beforeunload' && 
        (performance.navigation?.type === 1 || // TYPE_RELOAD
         event.target?.location?.href === window.location.href)
      );

      // Check if user is navigating to another page within the same domain
      const isInternalNavigation = event.target?.activeElement?.href?.includes(window.location.origin);

      // Only clear session if it's actually closing the website/tab
      if (!isRefresh && !isInternalNavigation) {
        clearSession();
      }
    };

    // Handle page visibility change (when tab becomes hidden/visible)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // User switched tabs or minimized window
        // Don't logout immediately, just mark the time
        sessionStorage.setItem('lastVisibilityHidden', Date.now().toString());
      } else if (document.visibilityState === 'visible') {
        // User came back to the tab
        if (token && !isSessionActive()) {
          // Session was cleared (website was closed in another tab or window)
          dispatch(setToken(null));
          navigate('/login');
        }
      }
    };

    // Check session on window focus
    const handleFocus = () => {
      if (token && !isSessionActive()) {
        // Session was cleared (website was closed)
        dispatch(setToken(null));
        navigate('/login');
      } else if (token) {
        // Reinitialize session if user is still logged in
        initializeSession();
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [token, dispatch, navigate]);

  // Check session status periodically
  useEffect(() => {
    const checkSession = () => {
      if (token && !isSessionActive()) {
        dispatch(setToken(null));
        navigate('/login');
      }
    };

    // Check every 5 seconds
    const interval = setInterval(checkSession, 5000);

    return () => clearInterval(interval);
  }, [token, dispatch, navigate]);
};