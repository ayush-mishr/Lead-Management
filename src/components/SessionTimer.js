import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { isTokenExpired, getTokenExpirationTime } from '../utils/tokenUtils';

const SessionTimer = () => {
  const { token } = useSelector((state) => state.auth);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showTimer, setShowTimer] = useState(false);
  const [sessionStatus, setSessionStatus] = useState('active');

  // Memoize the timer update function
  const updateTimer = useCallback(() => {
    if (!token) {
      setShowTimer(false);
      setSessionStatus('inactive');
      return;
    }

    // Check if token is already expired
    if (isTokenExpired(token)) {
      setShowTimer(false);
      setSessionStatus('expired');
      return;
    }

    const expirationTime = getTokenExpirationTime(token);
    if (!expirationTime) return;
    
    const currentTime = Date.now();
    const remaining = Math.max(0, expirationTime - currentTime);
    const remainingSeconds = Math.floor(remaining / 1000);
    
    setTimeLeft(remainingSeconds);
    
    // Show timer when 10 minutes or less remaining
    if (remainingSeconds <= 600 && remainingSeconds > 0) {
      setShowTimer(true);
      setSessionStatus('warning');
    } else if (remainingSeconds <= 300 && remainingSeconds > 0) {
      setShowTimer(true);
      setSessionStatus('critical');
    } else if (remainingSeconds <= 0) {
      setShowTimer(false);
      setSessionStatus('expired');
    } else {
      setShowTimer(false);
      setSessionStatus('active');
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      setShowTimer(false);
      setSessionStatus('inactive');
      return;
    }

    // Use setTimeout for the initial update to avoid immediate state change
    const initialTimeout = setTimeout(() => {
      updateTimer();
    }, 0);
    
    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [token, updateTimer]);

  const formatTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const timerColor = useMemo(() => {
    switch (sessionStatus) {
      case 'warning':
        return 'bg-yellow-500 text-black';
      case 'critical':
        return 'bg-red-500 text-white animate-pulse';
      default:
        return 'bg-blue-500 text-white';
    }
  }, [sessionStatus]);

  const timerIcon = useMemo(() => {
    switch (sessionStatus) {
      case 'warning':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.982 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'critical':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  }, [sessionStatus]);

  if (!token || !showTimer) return null;

  return (
    <div className={`fixed top-20 right-4 z-50 px-4 py-2 rounded-lg shadow-lg ${timerColor}`}>
      <div className="flex items-center space-x-2">
        {timerIcon}
        <span className="text-sm font-semibold">
          Session expires: {formatTime(timeLeft)}
        </span>
      </div>
      {sessionStatus === 'critical' && (
        <div className="text-xs mt-1 opacity-90">
          Click anywhere to extend session
        </div>
      )}
    </div>
  );
};

export default SessionTimer;
