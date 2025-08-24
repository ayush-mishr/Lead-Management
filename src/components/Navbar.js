import React from 'react'
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setToken } from '../slices/auth';
import {setSignupData} from "../slices/auth"


export const Navbar = () => {
const navigate=useNavigate();
const dispatch=useDispatch();
const{token}=useSelector((state)=>state.auth);
const{signupData}=useSelector((state)=>state.auth);
// const{firstName,LastName}=signupData;
 function clickHandler(){
  // return (
  //   <div>`${firstName} ${LastName}` </div>

  // )
  console.log("finalllllllll",signupData)
  console.log(token);
 }
  return (
    <div className='flex h-[50px] justify-around items-center border-b-2 border-gray-600 bg-slate-700 '>
       
       <div className='flex justify-center items-center '>
         <Link to="/"><img src="Ld.png" alt="logo" className='w-[50px] h-[50px]  rounded-full  -translate-x-[30px] '></img></Link>
         <p className='text-white -translate-x-7'>Lead Management</p>
       </div>
        <nav className='flex justify-center items-center '>
            <ul className='flex gap-5 text-white font-semibold text-lg '>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About Us</Link></li>
                
            </ul>
        </nav>
        {/* Login , signup etc */}
        <div className='flex gap-4 justify-center items-center '>
{ token===null &&
            <Link to="/login"><button className='rounded-md text-white border-slate-400 bg-slate-500 p-1 m-2 w-fit' onClick={()=>{
              
              
            }}>Login</button></Link>
}
{ token===null&&
            <Link to="/signup"><button className='rounded-md text-white  border-slate-400 bg-slate-500 p-1 m-2 w-fit'
          >Sign Up</button></Link>
}
{ token!==null &&
            <Link to="/"><button className='rounded-md text-white   border-slate-400 bg-slate-500 p-1 m-2 w-fit' onClick={()=>{
              dispatch(setToken(null));
              toast.success("Logged Out Successfully");
              navigate("/login");
              
            }}>Logout</button></Link>
}
{token!==null &&
            <Link to="/dashboard"><button className='rounded-md text-white  border-slate-400 bg-slate-500 p-1 m-2 w-fit ' onClick={clickHandler}>Dashboard</button></Link>
}
        </div>
    </div>
  )
}
