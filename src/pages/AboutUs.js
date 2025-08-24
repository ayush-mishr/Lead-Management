import React from 'react'

import { useNavigate } from 'react-router-dom';

export const AboutUs = () => {
    const navigate = useNavigate();
  return (
    <div className='flex justify-center items-center'>
        <div>
        <img src="/About.jpg" alt="AboutPageImage" className='h-screen w-screen relative  flex'></img>
        </div>
        <div className='absolute   flex-col justify-center mt-8'>
              {/* Header */}
      <header className="bg-gray-600 shadow-md py-5 text-center">
        <h1 className="text-white text-2xl md:text-3xl font-bold">
          Lead Management System
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-6 py-10 mt-8 shadow-lg rounded-xl">
          {/* About Section */}
          <section className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-600 mb-3">About Us</h2>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              Welcome to <b>Lead Management System</b> — your trusted partner in
              managing, tracking, and converting leads efficiently. Our platform
              is designed to help businesses organize leads, enhance customer
              engagement, and drive growth.
            </p>
          </section>
         <div className='flex gap-3'>
       
          {/* Mission */}
          <section className="p-3 border-2 border-solid border-gray-400 rounded-md shadow-black shadow-md hover:scale-105">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">
              Our Mission
            </h3>
            <p className="text-gray-700 leading-relaxed">
              To empower businesses with simple yet powerful tools for managing
              leads, improving customer relationships, and boosting conversions.
            </p>
          </section>

          {/* Vision */}
          <section className="p-3 border-2 border-solid border-gray-400 rounded-md shadow-black shadow-md hover:scale-105">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">
              Our Vision
            </h3>
            <p className="text-gray-700 leading-relaxed">
              To become the leading platform for lead management by delivering
              innovative, user-friendly, and scalable solutions for businesses of
              all sizes.
            </p>
          </section>

          {/* Team */}
          <section className='p-3 border-2 border-solid border-gray-400 rounded-md shadow-black shadow-md hover:scale-105'>
            <h3 className="text-xl font-semibold text-blue-600 mb-2">
              Our Team
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Our passionate team of developers, designers, and business experts
              work together to craft a seamless experience that drives business
              success.
            </p>
          </section>
         </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-500 text-white text-center py-4 h-fit">
<div className='flex justify-evenly'>
<a href="https://www.linkedin.com/in/ayush-mishra-1a0793303/" target='blank'><img src="/Linkdin.jpg" className='h-[40px] w-[40px] rounded-full'></img></a>
<div>
    <a href="https://github.com/ayush-mishr" target='blank'><img src="/githubImg.png"className='h-[40px] w-[40px] rounded-full'></img></a>
</div>
<a href="https://shiksha-mitra-85gg.vercel.app/" target='blank'><img src="/favicon.png" className='h-[40px] w-[40px] rounded-full'></img></a>
<a href='mailto:ayushmishramay22@gmail.com' target='blank' className='flex justify-center items-center'><img src="/mail.png" className='h-[40px] w-[40px] rounded-full'></img></a>

</div>
      </footer>
        </div>
    </div>
  )
}
