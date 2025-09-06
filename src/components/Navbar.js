import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setToken } from '../slices/auth';
import {setSignupData} from "../slices/auth"
import "../App.css"

export const Navbar = () => {
  const [flag, setFlag]=useState(true);
  const location =useLocation();
  function matchRoutes(path){
    return (path===location.pathname);
  }
const navigate=useNavigate();
const dispatch=useDispatch();
const{token}=useSelector((state)=>state.auth);
const{signupData}=useSelector((state)=>state.auth);
const{user}=useSelector((state)=>state.profile);

// Get user data from either profile or signupData
const userData = user || signupData;
const firstName = userData?.firstName || 'User';
const lastName = userData?.lastName || '';
const email = userData?.email || 'user@email.com';

// Generate initials
const firstInitial = firstName.charAt(0).toUpperCase();
const lastInitial = lastName.charAt(0).toUpperCase();
const userInitials = `${firstInitial}${lastInitial}`;

// const{firstName,LastName}=signupData;
 function clickHandler(){
  // return (
  //   <div>`${firstName} ${LastName}` </div>

  // )
  console.log("finalllllllll",signupData)
  console.log(token);
 }
  return (
    <nav className='fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 backdrop-blur-lg border-b border-gray-700/50 shadow-2xl'>
       <div className='max-w-7xl mx-auto px-6 h-20 flex justify-between items-center'>
         
         {/* Enhanced Logo Section */}
         <Link to="/" className='group flex items-center space-x-4 hover:scale-105 transition-all duration-300'>
           <div className='relative'>
             {/* Glowing background for logo */}
             <div className='absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full blur-lg opacity-60 group-hover:opacity-100 transition duration-500 animate-pulse'></div>
             <div className='relative w-14 h-14 rounded-full overflow-hidden border-2 border-white/30 shadow-xl group-hover:border-white/60 transition duration-300'>
               <img 
                 src="Ld.png" 
                 alt="LeadFlow Logo" 
                 className='w-full h-full object-cover group-hover:scale-110 transition duration-300'
               />
             </div>
           </div>
           
           {/* Enhanced Brand Text */}
           <div className='flex flex-col'>
             <h1 className='text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text group-hover:from-yellow-400 group-hover:via-orange-400 group-hover:to-red-400 transition-all duration-500'>
               LeadFlow
             </h1>
             <p className='text-xs text-gray-400 font-medium tracking-wider uppercase group-hover:text-gray-300 transition duration-300'>
               Management Suite
             </p>
           </div>
         </Link>

         {/* Enhanced Navigation Menu */}
         <div className='hidden md:flex items-center space-x-8'>
           <ul className='flex items-center space-x-8'>
             <li>
               <Link to="/" className='group relative'>
                 <span className={`text-lg font-semibold transition-all duration-300 ${
                   matchRoutes("/") 
                     ? "text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text" 
                     : "text-gray-300 hover:text-white"
                 }`}>
                   Home
                 </span>
                 <div className={`absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-300 ${
                   matchRoutes("/") ? "w-full" : "w-0 group-hover:w-full"
                 }`}></div>
               </Link>
             </li>
             
             <li>
               <Link to="/about" className='group relative'>
                 <span className={`text-lg font-semibold transition-all duration-300 ${
                   matchRoutes("/about") 
                     ? "text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text" 
                     : "text-gray-300 hover:text-white"
                 }`}>
                   About Us
                 </span>
                 <div className={`absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-300 ${
                   matchRoutes("/about") ? "w-full" : "w-0 group-hover:w-full"
                 }`}></div>
               </Link>
             </li>
           </ul>
         </div>
         {/* Enhanced Action Buttons */}
         <div className='flex items-center space-x-4'>
           {token === null && (
             <>
               <Link to="/login">
                 <button className='group relative px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white font-semibold rounded-xl border border-gray-600 hover:border-gray-400 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-1'>
                   <span className='relative z-10'>Login</span>
                   <div className='absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300'></div>
                   <span className='absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition duration-300 z-20 font-semibold'>Login</span>
                 </button>
               </Link>
               
               <Link to="/signup">
                 <button className='group relative px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-orange-500/40 hover:scale-105 transition-all duration-300 hover:-translate-y-1 overflow-hidden'>
                   <span className='relative z-20 group-hover:opacity-0 transition-opacity duration-300'>Sign Up</span>
                   <div className='absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300'></div>
                   <span className='absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition duration-300 z-30 font-bold'>Get Started</span>
                 </button>
               </Link>
             </>
           )}
           
           {token !== null && (
             <div className='relative group'>
               {/* User Profile Avatar - Dynamic AM for Ayush Mishra */}
               <div className='w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-blue-500/50'>
                 <span className='text-white font-bold text-lg'>
                   {userInitials}
                 </span>
               </div>
               
               {/* Dropdown Menu - Shows Ayush Mishra and actual email */}
               <div className='absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50 border border-gray-200'>
                 {/* Arrow */}
                 <div className='absolute -top-2 right-6 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45'></div>
                 
                 {/* User Info Section - Shows actual user data */}
                 <div className='p-4 border-b border-gray-100'>
                   <div className='flex items-center space-x-3'>
                     {/* Small Avatar - Shows AM */}
                     <div className='w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full flex items-center justify-center'>
                       <span className='text-white font-bold text-sm'>
                         {userInitials}
                       </span>
                     </div>
                     
                     {/* User Details - Shows Ayush Mishra and actual email */}
                     <div className='flex-1'>
                       <p className='text-gray-900 font-semibold text-base leading-tight'>
                         {firstName} {lastName}
                       </p>
                       <p className='text-gray-500 text-sm'>
                         {email}
                       </p>
                     </div>
                   </div>
                 </div>
                 
                 {/* Menu Items */}
                 <div className='py-1'>
                   <Link 
                     to="/dashboard"
                     onClick={clickHandler}
                     className='flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200 text-gray-700 hover:text-gray-900'
                   >
                     <span className='text-gray-600'>
                       <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                         <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' />
                       </svg>
                     </span>
                     <span className='font-medium'>Dashboard</span>
                   </Link>
                   
                   <button 
                     onClick={() => {
                       dispatch(setToken(null));
                       toast.success("Logged Out Successfully");
                       navigate("/login");
                     }}
                     className='w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200 text-gray-700 hover:text-gray-900'
                   >
                     <span className='text-gray-600'>
                       <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                         <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                       </svg>
                     </span>
                     <span className='font-medium'>Logout</span>
                   </button>
                 </div>
               </div>
             </div>
           )}
         </div>
         
         {/* Mobile Menu Button */}
         <div className='md:hidden'>
           <button className='text-gray-300 hover:text-white transition duration-300'>
             <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
               <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
             </svg>
           </button>
         </div>
       </div>
     </nav>
  )
}
