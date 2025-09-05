import React from 'react'
import { useNavigate } from 'react-router-dom';

export const AboutUs = () => {
    const navigate = useNavigate();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Hero Section with Background */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="/About.jpg" 
              alt="About Us Background" 
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80"></div>
          </div>
          
          {/* Hero Content */}
          <div className="relative z-10 px-6 py-20 sm:py-32">
            <div className="max-w-7xl mx-auto text-center">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                Lead Management
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  System
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Empowering businesses with intelligent lead management solutions that drive growth, 
                enhance customer relationships, and maximize conversion rates.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-xl"
                >
                  Get Started Today
                </button>
                <button 
                  onClick={() => navigate('/signup')}
                  className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-slate-900 transition-all duration-300"
                >
                  Join Our Platform
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                About Our Platform
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                We're revolutionizing how businesses manage their leads with cutting-edge technology, 
                intuitive design, and powerful analytics that deliver real results.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-20">
              {/* Mission Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300 opacity-20"></div>
                <div className="relative bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                  <p className="text-gray-600 leading-relaxed">
                    To empower businesses of all sizes with simple yet powerful tools for managing leads, 
                    improving customer relationships, and boosting conversions through intelligent automation 
                    and data-driven insights.
                  </p>
                </div>
              </div>

              {/* Vision Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl transform -rotate-3 group-hover:-rotate-6 transition-transform duration-300 opacity-20"></div>
                <div className="relative bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                  <p className="text-gray-600 leading-relaxed">
                    To become the leading platform for lead management by delivering innovative, 
                    user-friendly, and scalable solutions that transform how businesses connect 
                    with their customers and grow their revenue.
                  </p>
                </div>
              </div>

              {/* Team Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300 opacity-20"></div>
                <div className="relative bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Team</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our passionate team of developers, designers, and business experts work together 
                    to craft seamless experiences that drive business success and create lasting 
                    value for our users worldwide.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-12 text-center">
              <h3 className="text-3xl font-bold text-white mb-8">Trusted by Businesses Worldwide</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <div className="text-4xl font-bold text-blue-400 mb-2">5</div>
                  <div className="text-gray-300">Active Users</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-green-400 mb-2">6</div>
                  <div className="text-gray-300">Leads Managed</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-purple-400 mb-2">98%</div>
                  <div className="text-gray-300">Satisfaction Rate</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-yellow-400 mb-2">24/7</div>
                  <div className="text-gray-300">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact/Social Section */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 py-16">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h3 className="text-3xl font-bold text-white mb-8">Connect With Us</h3>
            <p className="text-gray-300 mb-12 max-w-2xl mx-auto">
              Follow our journey and stay updated with the latest features, updates, and industry insights.
            </p>
            
            <div className="flex justify-center space-x-8">
              <a 
                href="https://www.linkedin.com/in/ayush-mishra-1a0793303/" 
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-3 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full transition-all duration-300 hover:scale-105"
              >
                <img src="/Linkdin.jpg" className="h-8 w-8 rounded-full" alt="LinkedIn" />
                <span className="text-white font-medium">LinkedIn</span>
              </a>
              
              <a 
                href="https://github.com/ayush-mishr" 
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-3 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full transition-all duration-300 hover:scale-105"
              >
                <img src="/githubImg.png" className="h-8 w-8 rounded-full" alt="GitHub" />
                <span className="text-white font-medium">GitHub</span>
              </a>
              
              <a 
                href="https://shiksha-mitra-85gg.vercel.app/" 
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-3 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full transition-all duration-300 hover:scale-105"
              >
                <img src="/favicon.png" className="h-8 w-8 rounded-full" alt="Website" />
                <span className="text-white font-medium">Portfolio</span>
              </a>
              
              <a 
                href="mailto:ayushmishramay22@gmail.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-3 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full transition-all duration-300 hover:scale-105"
              >
                <img src="/mail.png" className="h-8 w-8 rounded-full" alt="Email" />
                <span className="text-white font-medium">Email</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-slate-900 border-t border-slate-700 py-8">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-gray-400">
              © 2025 Lead Management System. Built with ❤️ for growing businesses.
            </p>
          </div>
        </footer>
      </div>
    )
}
