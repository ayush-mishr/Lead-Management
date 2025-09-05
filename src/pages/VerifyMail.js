import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signUp, sendOtp } from '../operations/AuthApi';

export const VerifyMail = () => {
  const navigate = useNavigate();
  const { signupData, loading } = useSelector((state) => state.auth);
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();

  // Safely extract signup data with useMemo to prevent re-computation
  const userSignupInfo = useMemo(() => {
    if (!signupData) return null;
    
    return {
      firstName: signupData.firstName || '',
      lastName: signupData.lastName || '',
      email: signupData.email || '',
      password: signupData.password || '',
      confirmPassword: signupData.confirmPassword || '',
      accountType: signupData.accountType || 'USER'
    };
  }, [signupData]);

  // Check if user should be redirected
  useEffect(() => {
    // Only allow access of this route when user has filled the signup form
    if (!signupData) {
      navigate("/signup");
    }
  }, [signupData, navigate]); // Added proper dependency array

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    if (!userSignupInfo || !otp.trim()) {
      return;
    }

    dispatch(
      signUp(
        userSignupInfo.firstName,
        userSignupInfo.lastName,
        userSignupInfo.email,
        userSignupInfo.password,
        userSignupInfo.confirmPassword,
        userSignupInfo.accountType,
        otp,
        navigate
      )
    );
  }, [dispatch, userSignupInfo, otp, navigate]);

  const handleOtpChange = useCallback((e) => {
    setOtp(e.target.value);
  }, []);

  // Don't render if no signup data
  if (!userSignupInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Enter OTP
        </h1>
        <p className="text-gray-500 mb-6">
          Please enter the OTP sent to your email or phone.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={handleOtpChange}
            className="text-center text-lg"
          />

          <button
            type="submit"
            disabled={loading || !otp.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 rounded-lg transition"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
      </div>
    </div>
  );
  
}
