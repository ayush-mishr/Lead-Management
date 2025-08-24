import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { createApi } from '@reduxjs/toolkit/query/react'
import React from 'react';
import { Navbar } from './components/Navbar';
import Login from './pages/Login';
import  Home  from './pages/Home';
import { Dashboard } from './pages/Dashboard';
// import { Login } from "./pages/Login"
import  SignUp  from './pages/SignUp';
import { AboutUs } from './pages/AboutUs';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { useEffect } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import rootReducer from './reducers'; 
import { Link } from 'react-router-dom';
import  {VerifyMail}  from './pages/VerifyMail';
import { AgGridReact } from 'ag-grid-react';

function App() {
  


  return (
    <div className="flex min-h-screen w-screen flex-col bg-slate-500 font-inter ">
      <Navbar  />
    
       <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/verify-email" element={<VerifyMail />} />
       </Routes>
    </div>
  );
}

export default App;
