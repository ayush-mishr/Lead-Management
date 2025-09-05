import React, { useMemo, useCallback, useEffect } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import SignUp from './pages/SignUp';
import { AboutUs } from './pages/AboutUs';
import { VerifyMail } from './pages/VerifyMail';
import PasswordReset from "./pages/resetPasswordPage";
import EnterMail from './pages/EnterMail';
import { VerifyLogin } from './pages/VerifyLogin';
import Chatbot from './components/Chatbot';
import useAutoLogout from './hooks/useAutoLogout';
import SessionTimer from './components/SessionTimer';
import ErrorBoundary from './components/ErrorBoundary';
import { useDispatch } from 'react-redux';
import { setToken, setSignupData } from './slices/auth';
import { setUser } from './slices/profile';
import { clearAuthData } from './utils/tokenUtils';

function App() {
  const dispatch = useDispatch();
  
  // Initialize auto-logout hook with 30 minutes timeout
  const { manualLogout } = useAutoLogout(30 * 60 * 1000);

  // Auto logout on page load/refresh
  useEffect(() => {
    console.log('Website opened/refreshed - automatically logging out user');
    
    // Clear Redux state
    dispatch(setToken(null));
    dispatch(setSignupData(null));
    dispatch(setUser(null));
    
    // Clear all authentication data from localStorage
    clearAuthData();
    
    // Clear additional localStorage items that might contain auth data
    localStorage.removeItem('userEmail'); // Used in password reset flow
    
    // Clear sessionStorage as well
    sessionStorage.clear();
    
    console.log('Authentication cleared - user logged out automatically');
    
  }, [dispatch]); // Include dispatch in dependencies

  // Memoize the routes to prevent unnecessary re-renders
  const routes = useMemo(() => (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/verify-email" element={<VerifyMail />} />
      <Route path="/checkEmail" element={<EnterMail />} />
      <Route path="/verify-Login" element={<VerifyLogin />} />
      <Route path='/reset-password-page' element={<PasswordReset />} />
    </Routes>
  ), []);

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen w-screen flex-col bg-slate-500 font-inter">
        <Navbar manualLogout={manualLogout} />
        <SessionTimer />
        <Chatbot />
        {routes}
      </div>
    </ErrorBoundary>
  );
}

export default App;
