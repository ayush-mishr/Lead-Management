import React from "react";
import { setToken } from "../slices/auth";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate=useNavigate();
  const {token}=useSelector((state)=>state.auth);
  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen flex flex-col">
     <div>
      <div>
       <img src="BestBg.jpg" className="h-screen w-screen flex-col relative"></img>
      </div>
      <div className="absolute -translate-y-full">
         {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 md:px-16 py-20">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight drop-shadow-sm">
          Manage Your <span className="text-indigo-700">Leads</span> Smarter
        </h1>
        <p className="mt-4 text-gray-600 text-2xl">
          A clean, powerful, and modern platform to organize, track, and manage your leads effortlessly. 
          Stay productive and grow your business faster.
        </p>
     
        <button className="mt-6 bg-zinc-700 text-white px-7 py-3 rounded-xl text-lg shadow-md hover:bg-yellow-800 hover:scale-105 transition-transform duration-300" onClick={()=>{
          if(token===null){
            navigate("/signup")
          }
          else{
            navigate("/dashboard");
          }
        }}>
          Get Started
        </button>
      </section>


      {/* Features Section */}
      <section className="py-16 px-6 md:px-16 text-center">
        <h2 className="text-3xl font-bold text-pink-900 -translate-y-16">Our Features</h2>
        <p className="text-stone-800 -translate-y-10 text-1.5xl">
          Powerful tools to boost your productivity.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-600 p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300 border border-gray-100">
            <h3 className="text-xl font-semibold text-blue-950">Easy to Use</h3>
            <p className="mt-2 text-white">
              A clean and intuitive interface to help you manage leads easily.
            </p>
          </div>
          <div className="bg-slate-600 p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300 border border-gray-100">
            <h3 className="text-xl font-semibold text-blue-950">Track Progress</h3>
            <p className="mt-2 text-white">
              Monitor your leads, analyze performance, and grow your business.
            </p>
          </div>
          <div className="bg-slate-600 p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300 border border-gray-100">
            <h3 className="text-xl font-semibold text-blue-950">Grow Faster</h3>
            <p className="mt-2 text-white">
              Accelerate your sales and close more deals with ease.
            </p>
          </div>
        </div>
      </section>
      </div>

     </div>

      
      
    </div>
  );
}
