import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:4000/api/v1';

export default function PasswordReset() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!email || !password || !confirmPassword) {
      toast.error("All fields are required!");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const toastId = toast.loading("Resetting your password...");

    try {
      console.log("print toooooo ho gaya bhai before..........",email)  
      const res = await axios.post(
        `${API_BASE_URL}/auth/reset-password`,
        { email, password, confirmPassword }
      );
     console.log("print toooooo ho gaya bhai.after.........",email)  
      if (res.data.success) {
        toast.dismiss(toastId);
        toast.success("Password reset successfully!");

        // 🔹 Store values in localStorage (Optional)
        // localStorage.setItem("resetEmail", email);
        // localStorage.setItem("resetPassword", password);
        // localStorage.setItem("resetConfirmPassword", confirmPassword);

        // Clear inputs
        setEmail("");
        setPassword("");
        setConfirmPassword("");

        // Redirect to login page
        navigate("/login");
      } else {
        toast.dismiss(toastId);
        toast.error(res.data.message || "Something went wrong!");
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(error.response?.data?.message || "Failed to reset password!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96 text-center">
        <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
        <p className="text-gray-500 mb-6">
          Please confirm your email and enter a new password.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-4"
        >
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
