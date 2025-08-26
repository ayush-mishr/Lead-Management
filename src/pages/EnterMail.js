import React, { useState } from "react";
import { sendOtp } from "../operations/AuthApi"
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";

export default function EmailInput() {
  const [email, setEmail] = useState("");
   const dispatch =useDispatch();
   const navigate =useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email.");
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    const response = await axios.post("https://lead-management-2-wnen.onrender.com/api/v1/auth/checkEmail",{ email });
 
    alert(`Email submitted successfully: ${email}`);
    dispatch(sendOtp(email, navigate));
    setEmail("");
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
