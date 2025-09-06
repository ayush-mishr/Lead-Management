import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AboutUs = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-gray-900 to-black overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <div className="absolute inset-0">
          <img 
            src="/About.jpg" 
            alt="About Us Background" 
            className="w-full h-full object-cover"
            style={{ transform: `translateY(${scrollY * 0.5}px)` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-blue-900/50 to-black/70"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="mb-8">
            <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold text-lg mb-6 shadow-lg">
              ✨ Discover Our Story
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-8">
            About <span className="text-gradient bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">LeadFlow</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed max-w-4xl mx-auto">
            Empowering businesses worldwide with intelligent lead management solutions that drive growth and success
          </p>
          
          <button 
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            className="group bg-gradient-to-r from-blue-600 to-purple-700 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 transform"
          >
            <span className="flex items-center space-x-2">
              <span>Learn More</span>
              <span className="group-hover:translate-y-1 transition-transform duration-300">↓</span>
            </span>
          </button>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-cyan-900/20"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Our <span className="text-gradient bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">Purpose</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Driven by innovation, guided by purpose, focused on your success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Mission Card */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur opacity-60 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl p-10 rounded-3xl border border-slate-700/50 hover:border-slate-600/70 transition-all duration-500 hover:-translate-y-2">
                <div className="text-6xl mb-6">🎯</div>
                <h3 className="text-3xl font-bold text-white mb-6">Our Mission</h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  To empower businesses with simple yet powerful tools for managing leads, 
                  improving customer relationships, and boosting conversions. We believe 
                  in making complex processes simple and effective.
                </p>
                <div className="mt-8 flex space-x-4">
                  <span className="bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-full text-sm font-semibold">Innovation</span>
                  <span className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">Efficiency</span>
                </div>
              </div>
            </div>
            
            {/* Vision Card */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl blur opacity-60 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl p-10 rounded-3xl border border-slate-700/50 hover:border-slate-600/70 transition-all duration-500 hover:-translate-y-2">
                <div className="text-6xl mb-6">🚀</div>
                <h3 className="text-3xl font-bold text-white mb-6">Our Vision</h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  To become the leading platform for lead management by delivering 
                  innovative, user-friendly, and scalable solutions for businesses 
                  of all sizes. We envision a future where every business can thrive.
                </p>
                <div className="mt-8 flex space-x-4">
                  <span className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">Growth</span>
                  <span className="bg-pink-500/20 text-pink-300 px-4 py-2 rounded-full text-sm font-semibold">Excellence</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Meet Our <span className="text-gradient bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent">Team</span>
          </h2>
          <p className="text-xl text-gray-300 mb-16 max-w-3xl mx-auto">
            Passionate professionals dedicated to revolutionizing lead management
          </p>
          
          <div className="group relative max-w-4xl mx-auto">
            <div className="absolute -inset-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-2xl p-12 rounded-3xl border border-slate-700/50">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-xl opacity-70 animate-pulse"></div>
                  <div className="relative w-64 h-80 lg:w-80 lg:h-96 rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl">
                    <img 
                      src="Ayush.png" 
                      alt="Ayush Mishra - Founder" 
                      className="w-full h-full object-cover object-top"
                      style={{ objectPosition: '50% 20%' }}
                    />
                  </div>
                </div>
                
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-4xl font-bold text-white mb-4">
                    <span className="text-gradient bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                      Ayush Mishra
                    </span>
                  </h3>
                  <div className="text-emerald-300 text-xl font-semibold mb-6">
                    Founder & Lead Developer
                  </div>
                  <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                    A visionary developer and entrepreneur passionate about creating solutions 
                    that make a real difference. With expertise in full-stack development and 
                    business strategy, Ayush leads our mission to revolutionize lead management.
                  </p>
                  
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                    {[
                      { skill: "Full-Stack Expert", color: "from-green-500 to-emerald-500" },
                      { skill: "Business Strategy", color: "from-emerald-500 to-teal-500" },
                      { skill: "Innovation Leader", color: "from-teal-500 to-cyan-500" }
                    ].map((item, index) => (
                      <span 
                        key={index}
                        className={`bg-gradient-to-r ${item.color} text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform duration-300`}
                      >
                        {item.skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Our <span className="text-gradient bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">Values</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: "💡", 
                title: "Innovation", 
                description: "Continuously pushing boundaries to deliver cutting-edge solutions",
                gradient: "from-orange-500 to-red-500"
              },
              { 
                icon: "🤝", 
                title: "Partnership", 
                description: "Building lasting relationships with our clients based on trust and mutual success",
                gradient: "from-red-500 to-pink-500"
              },
              { 
                icon: "⭐", 
                title: "Excellence", 
                description: "Committed to delivering the highest quality in everything we create",
                gradient: "from-pink-500 to-purple-500"
              }
            ].map((value, index) => (
              <div key={index} className="group relative">
                <div className={`absolute -inset-1 bg-gradient-to-r ${value.gradient} rounded-3xl blur opacity-40 group-hover:opacity-70 transition duration-500`}></div>
                <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 hover:border-slate-600/70 transition-all duration-500 hover:-translate-y-2 text-center">
                  <div className="text-5xl mb-6">{value.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="relative py-16 bg-gradient-to-r from-slate-900 via-gray-900 to-black border-t border-gray-700/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Connect With Us</h3>
            <p className="text-gray-400">Follow our journey and stay updated with the latest innovations</p>
          </div>
          
          <div className="flex justify-center space-x-8 mb-12">
            {[
              { icon: "💼", label: "LinkedIn", link: "https://www.linkedin.com/in/ayush-mishra-1a0793303/", image: "/Linkdin.jpg", color: "from-blue-600 to-blue-700" },
              { icon: "💻", label: "GitHub", link: "https://github.com/ayush-mishr", image: "/githubImg.png", color: "from-gray-700 to-gray-900" },
              { icon: "🌐", label: "Website", link: "https://shiksha-mitra-85gg.vercel.app/", image: "/favicon.png", color: "from-green-600 to-green-700" },
              { icon: "✉️", label: "Email", link: "mailto:ayushmishramay22@gmail.com", image: "/mail.png", color: "from-red-500 to-red-600" }
            ].map((social, index) => (
              <a 
                key={index}
                href={social.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`group relative w-16 h-16 bg-gradient-to-r ${social.color} rounded-full flex items-center justify-center hover:scale-125 hover:rotate-12 transition-all duration-300 shadow-lg hover:shadow-2xl overflow-hidden`}
              >
                <img 
                  src={social.image} 
                  alt={social.label} 
                  className="w-10 h-10 object-cover group-hover:scale-110 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition duration-300"></div>
              </a>
            ))}
          </div>
          
          <div className="text-center border-t border-gray-700/50 pt-8">
            <p className="text-gray-500 text-lg">
              © 2025 LeadFlow. Built with ❤️ by Ayush Mishra
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
