import React, { useState } from "react";
import toast from "react-hot-toast"
import axios from "axios"
import { Navigate } from "react-router-dom";

export default function PasswordReset() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async(e) => {
    e.preventDefault();


    // Validation
    if (!email || !password || !confirmPassword) {
       alert("Please select the email")
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      alert("please select a valid email");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password do not match");
      return;
    }
    const toastId = toast.loading("waiting to change your password");
      try{
      const res =  axios.post("https://lead-management-2-wnen.onrender.com/api/v1/auth/reset-password",{email,password,confirmPassword});
           if(res.data.success){
             toast.dismiss(toastId);
              toast.success("Password reset Successfully");
              setEmail="";
              setConfirmPassword="";
              setPassword="";
              Navigate("/login");
           }
           else{
            toast.dismiss(toastId);
            toast.error("something is wrong");
           }
      }catch (error) {
     toast.dismiss(toastId);
     toast.error("Can not reset Password");
};
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96 text-center">
        <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
        <p className="text-gray-500 mb-6">
          Please confirm your email and enter a new password.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
          {/* Email Input */}
          <input
            type="email"
            placeholder="Enter Your Registered Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Password Input */}
          <input
            type="password"
            placeholder="Enter New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Confirm Password Input */}
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />


          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
