import React from 'react'
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signUp,sendOtp } from '../operations/AuthApi';
import { useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';



export const VerifyMail = () => {

  const navigate = useNavigate();
   const {signupData,loading,token} = useSelector((state) => state.auth);
   const{firstName,lastName,email,password,confirmPassword,accountType}=signupData;
    

    const [otp, setOtp] = useState("");
    const dispatch = useDispatch();
    useEffect(() => {
        // Only allow access of this route when user has filled the signup form
        if (!signupData) {
          navigate("/signup");
        }
        
      }, []);
   const handleSubmit = async(e) => {
    e.preventDefault();
     setOtp(otp);
      
if(firstName||lastName||email||password||confirmPassword||accountType||otp){
       dispatch(
      signUp(
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
       otp,
       navigate
    )
)}
else{
  const res = axios.post(`https://lead-management-2-wnen.onrender.com/api/v1/auth/verify-otp-forsign`);
  if(!res){
    toast.error("otp is not valid");
    console.log("something is wrong");
  }
  else{
    dispatch("/Enter-email");
  }
}


  };

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
            onChange={(e) => setOtp(e.target.value)}
            className="text-center text-lg"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
  
}
