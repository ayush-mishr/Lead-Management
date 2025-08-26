import React from 'react'
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signUp,sendOtp } from '../operations/AuthApi';
import { useEffect } from 'react';
import axios from 'axios';
import toast from "react-hot-toast";



export const VerifyLogin = () => {

  const navigate = useNavigate();
  
    

    const [otp, setOtp] = useState("");
    const dispatch = useDispatch();

   const handleSubmit = async(e) => {
    e.preventDefault();
     setOtp(otp);
     const toastId = toast.loading("Verifiying otp");
      try{
       const email =  localStorage.getItem("userEmail");  
       console.log("print toooooo ho gaya bhai..........",email)  
     const res = await axios.post("https://lead-management-2-wnen.onrender.com/api/v1/auth/verify-otp-forsign",{email,otp});
     toast.dismiss(toastId);
     
     if(res.data.success){
     toast.success("Otp is Verified");
     navigate("/reset-password-page")
     }
      }catch (error) {
    toast.dismiss(toastId);

    if (error.response) {
      // Handle server responses properly
      if (error.response.status === 404) {
        toast.error("otp not found.");
      } else if (error.response.status === 400) {
        toast.error("Please enter a valid otp.");
      }
    } else {
      toast.error("Network error. Check your connection.");
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
