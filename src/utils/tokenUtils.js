// Token validation and utility functions

export const isValidToken = (token) => {
  if (!token) return false;
  
  try {
    // Check if token is expired (basic check)
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    if (tokenData.exp < currentTime) {
      return false; // Token is expired
    }
    
    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

// Session management for auto-logout on website close
export const initializeSession = () => {
  // Set session flag in sessionStorage
  sessionStorage.setItem('sessionActive', 'true');
  sessionStorage.setItem('sessionStartTime', Date.now().toString());
};

export const isSessionActive = () => {
  return sessionStorage.getItem('sessionActive') === 'true';
};

export const clearSession = () => {
  sessionStorage.removeItem('sessionActive');
  sessionStorage.removeItem('sessionStartTime');
};

export const getTokenFromStorage = () => {
  try {
    const token = localStorage.getItem("token");
    const sessionActive = isSessionActive();
    
    // If no active session, return null (auto-logout)
    if (!sessionActive) {
      return null;
    }
    
    return token ? JSON.parse(token) : null;
  } catch (error) {
    console.error('Error getting token from storage:', error);
    localStorage.removeItem("token");
    return null;
  }
};

export const setTokenInStorage = (token) => {
  try {
    if (token) {
      localStorage.setItem("token", JSON.stringify(token));
    } else {
      localStorage.removeItem("token");
    }
  } catch (error) {
    console.error('Error setting token in storage:', error);
  }
};

export const clearTokenFromStorage = () => {
  try {
    localStorage.removeItem("token");
  } catch (error) {
    console.error('Error clearing token from storage:', error);
  }
};

export const getAuthHeaders = (token) => {
  if (!token || !isValidToken(token)) {
    throw new Error('Invalid or expired authentication token');
  }
  
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};
