import React, { useState } from "react";
import { sendOtp } from "../operations/AuthApi"
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";


export default function EmailInput() {
  const [email, setEmail] = useState("");
   const dispatch =useDispatch();
   const navigate =useNavigate();
   
  const handleSubmit = async (e) => {
  e.preventDefault();
  const toastId = toast.loading("Checking email...");

  if (!email) {
    toast.dismiss(toastId);
    toast.error("Please enter your email.");
    return;
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    toast.dismiss(toastId);
    toast.error("Please enter a valid email address.");
    return;
  }

  try {
    const response = await axios.post(
    "https://lead-management-2-wnen.onrender.com/api/v1/auth/otp-login", { email },{timeout: 8000 });
     toast.dismiss(toastId);
    if (response.data.success) {
      toast.success("Email found! Sending OTP...");
      localStorage.setItem("userEmail", email);
      navigate("/verify-Login");
      
    }
  } catch (error) {
    toast.dismiss(toastId);

    if (error.response) {
     
      if (error.response.status === 404) {
        toast.error("User not found. Please sign up first.");
      } else if (error.response.status === 400) {
        toast.error("Please enter a valid email.");
      } else {
        toast.error("Server error. Please try again later.");
      }
    } else {
      toast.error("Network error. Check your connection.");
    }
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96 text-center">
        <h2 className="text-2xl font-bold mb-2">Enter Email</h2>
        <p className="text-gray-500 mb-6">
          Please enter your email address to continue.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
