import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setToken } from '../slices/auth';
import { setSignupData } from "../slices/auth"
import "../App.css"

export const Navbar = ({ manualLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { token } = useSelector((state) => state.auth);
  const { signupData } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  // Memoize route matching function
  const matchRoutes = useCallback((path) => {
    return path === location.pathname;
  }, [location.pathname]);

  // Memoize user data calculations
  const userInitials = useMemo(() => {
    if (user && user.firstName && user.lastName) {
      return `${user.firstName.charAt(0).toUpperCase()}${user.lastName.charAt(0).toUpperCase()}`;
    } else if (signupData && signupData.firstName && signupData.lastName) {
      return `${signupData.firstName.charAt(0).toUpperCase()}${signupData.lastName.charAt(0).toUpperCase()}`;
    } else if (user && user.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    } else if (signupData && signupData.firstName) {
      return signupData.firstName.charAt(0).toUpperCase();
    }
    return null;
  }, [user, signupData, token]);

  const userName = useMemo(() => {
    if (user && user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (signupData && signupData.firstName && signupData.lastName) {
      return `${signupData.firstName} ${signupData.lastName}`;
    } else if (user && user.firstName) {
      return user.firstName;
    } else if (signupData && signupData.firstName) {
      return signupData.firstName;
    }
    return null;
  }, [user, signupData, token]);

  const userEmail = useMemo(() => {
    return user?.email || signupData?.email || '';
  }, [user, signupData]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = useCallback(() => {
    if (manualLogout) {
      // Use the auto-logout system's manual logout function
      manualLogout();
    } else {
      // Fallback to regular logout
      dispatch(setToken(null));
      dispatch(setSignupData(null));
      toast.success("Logged Out Successfully");
      navigate("/");
    }
    setIsDropdownOpen(false);
  }, [manualLogout, dispatch, navigate]);

  // Handle profile click
  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen(prev => !prev);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  // Memoize navigation items
  const navItems = useMemo(() => [
    { path: "/", label: "Home" },
    { path: "/about", label: "About Us" }
  ], []);

  // Memoize conditional renders to prevent unnecessary recalculations
  const showAuthButtons = useMemo(() => {
    // Hide auth buttons if user has a token (authenticated)
    return token === null;
  }, [token]);
  
  const showUserProfile = useMemo(() => {
    // Show user profile if user is authenticated AND has name data
    const isAuthenticated = token !== null;
    const hasUserData = userName && userInitials;
    return isAuthenticated && hasUserData;
  }, [token, userName, userInitials]);
  
  const showFallbackLogout = useMemo(() => {
    // Show fallback logout if user is authenticated but missing name data
    const isAuthenticated = token !== null;
    const missingUserData = !userName || !userInitials;
    return isAuthenticated && missingUserData;
  }, [token, userName, userInitials]);
// const{firstName,LastName}=signupData;
  return (
    <div className='navbar flex h-[60px] justify-around items-center border-b-2 border-gray-600 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 shadow-lg'>
       
       <div className='flex justify-center items-center hover:scale-105 transition-transform duration-300'>
         <Link to="/" className="flex items-center space-x-3 group">
           <div className="relative">
             <img 
               src="Ld.png" 
               alt="Lead Management Logo" 
               className='w-[45px] h-[45px] rounded-full border-2 border-white/20 shadow-lg group-hover:border-orange-400 transition-all duration-300'
             />
             <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 group-hover:from-orange-400/30 group-hover:to-yellow-400/30 transition-all duration-300"></div>
           </div>
           <div className="flex flex-col">
             <span className='text-white font-bold text-xl tracking-wide group-hover:text-orange-300 transition-colors duration-300'>
               Lead Management
             </span>
             <span className='text-gray-300 text-xs font-medium tracking-wider'>
               Smart Lead Solutions
             </span>
           </div>
         </Link>
       </div>
        <nav className='flex justify-center items-center'>
          <ul className='flex gap-5 text-white font-semibold text-lg'>
            {navItems.map(({ path, label }) => (
              <li key={path}>
                <Link to={path}>
                  <p className={`${matchRoutes(path) ? "text-orange-500" : "text-white"}`}>
                    {label}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Login, signup etc */}
        <div className='flex gap-4 justify-center items-center relative'>
          {/* Show login/signup buttons if user is not logged in (no token) */}
          {showAuthButtons && (
            <>
              <Link to="/login">
                <button className='rounded-md text-white border-slate-400 bg-slate-500 p-1 m-2 w-fit hover:bg-slate-400 transition-colors'>
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className='rounded-md text-white border-slate-400 bg-slate-500 p-1 m-2 w-fit hover:bg-slate-400 transition-colors'>
                  Sign Up
                </button>
              </Link>
            </>
          )}

          {/* User Profile Dropdown */}
          {showUserProfile && (
            <div className="relative" ref={dropdownRef}>
              {/* Profile Avatar */}
              <div 
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                onClick={toggleDropdown}
                title={userName}
              >
                {userInitials}
              </div>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {/* User Info */}
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">{userName}</p>
                    <p className="text-xs text-gray-500">{userEmail}</p>
                  </div>
                  
                  {/* Menu Items */}
                  <Link 
                    to="/dashboard" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={closeDropdown}
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Dashboard
                  </Link>
                  
                  <button 
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left"
                    onClick={handleLogout}
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Fallback: Show logout button if user data is incomplete */}
          {showFallbackLogout && (
            <button 
              className='rounded-md text-white border-slate-400 bg-slate-500 p-2 m-2 w-fit hover:bg-slate-400 transition-colors' 
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
    </div>
  )
}
