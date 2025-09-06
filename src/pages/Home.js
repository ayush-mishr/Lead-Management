import React, { useEffect, useState } from "react";
import { setToken } from "../slices/auth";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Exact match to screenshot */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image - Full screen */}
        <div className="absolute inset-0">
          <img 
            src="BestBg.jpg" 
            className="w-full h-full object-cover"
            alt="City Skyline"
          />
          {/* Gray overlay to match screenshot */}
          <div className="absolute inset-0 bg-gray-600/60"></div>
        </div>

        {/* Centered Content - Exact match to screenshot */}
        <div className="relative z-10 text-center px-6 md:px-16 max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-8 whitespace-nowrap">
            Manage Your <span className="text-yellow-400">Leads</span> Smarter
          </h1>
          
          <p className="text-xl md:text-2xl text-white mb-12 leading-relaxed max-w-4xl mx-auto font-light">
            A clean, powerful, and modern platform to organize, track, and manage 
            your leads effortlessly. Stay productive and grow your business faster.
          </p>
          
          <button 
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-12 py-4 rounded-full text-xl font-semibold shadow-2xl hover:from-yellow-500 hover:to-orange-600 hover:scale-105 transition-all duration-300 transform"
            onClick={() => {
              if (token === null) {
                navigate("/signup");
              } else {
                navigate("/dashboard");
              }
            }}
          >
            Get Started Today
          </button>
        </div>
      </section>

      {/* Enhanced Features Section with Colorful Design */}
      <section className="py-24 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-green-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16">
          <div className="text-center mb-20">
            <div className="inline-block bg-white/20 backdrop-blur-lg rounded-full px-6 py-3 mb-6">
              <span className="text-white font-semibold">🚀 Powerful Features</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Why Choose Our <span className="text-yellow-300">Platform</span>?
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Revolutionary features designed to transform your lead management experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🤖",
                title: "AI-Powered Analytics",
                description: "Advanced machine learning algorithms analyze your leads and predict conversion probabilities with 95% accuracy.",
                gradient: "from-pink-500 to-rose-500",
                bgColor: "bg-pink-500/10"
              },
              {
                icon: "⚡",
                title: "Lightning Automation",
                description: "Automate repetitive tasks and focus on what matters most - building relationships and closing deals.",
                gradient: "from-yellow-400 to-orange-500",
                bgColor: "bg-yellow-400/10"
              },
              {
                icon: "🎯",
                title: "Smart Lead Scoring",
                description: "Our intelligent scoring system prioritizes your hottest prospects automatically for maximum conversion.",
                gradient: "from-green-400 to-emerald-500",
                bgColor: "bg-green-400/10"
              },
              {
                icon: "📱",
                title: "Mobile Excellence",
                description: "Native mobile apps that work seamlessly across all devices with offline sync capabilities.",
                gradient: "from-blue-500 to-cyan-500",
                bgColor: "bg-blue-500/10"
              },
              {
                icon: "🔒",
                title: "Enterprise Security",
                description: "Bank-level encryption, SOC 2 compliance, and 99.99% uptime guarantee for your peace of mind.",
                gradient: "from-purple-500 to-violet-500",
                bgColor: "bg-purple-500/10"
              },
              {
                icon: "🌐",
                title: "Global Integration",
                description: "Connect with 1000+ tools including CRM, email platforms, and marketing automation systems.",
                gradient: "from-indigo-500 to-blue-600",
                bgColor: "bg-indigo-500/10"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`group relative ${feature.bgColor} backdrop-blur-lg p-8 rounded-3xl border border-white/20 shadow-2xl hover:shadow-white/25 transition-all duration-500 hover:-translate-y-4 hover:rotate-1`}
              >
                {/* Glowing border effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500`}></div>
                
                <div className="relative">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6 text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-300 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-blue-100 leading-relaxed group-hover:text-white transition-colors duration-300">
                    {feature.description}
                  </p>
                  
                  {/* Animated bottom accent */}
                  <div className={`absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-3xl`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Creator Section with Ayush.png */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-purple-900 to-blue-900"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl animate-bounce"></div>
          <div className="absolute bottom-32 right-32 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-bounce delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-yellow-400/20 rounded-full blur-3xl animate-bounce delay-2000"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-16">
          <div className="text-center mb-16">
            <div className="inline-block bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full px-8 py-3 mb-6">
              <span className="text-white font-bold text-lg">✨ Meet the Visionary</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              The Mind Behind <span className="text-gradient bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Innovation</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover the passionate creator who revolutionized lead management
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="group relative max-w-4xl">
              {/* Ultra-glowing background effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition duration-1000 animate-pulse"></div>
              
              {/* Main Card */}
              <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-2xl p-12 rounded-3xl shadow-2xl border border-slate-700/50">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                  
                  {/* Enhanced Full Profile Image */}
                  <div className="relative group/image">
                    {/* Multiple glow layers */}
                    <div className="absolute -inset-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-3xl blur-2xl opacity-70 group-hover/image:opacity-100 transition duration-700 animate-pulse"></div>
                    <div className="absolute -inset-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-50 group-hover/image:opacity-80 transition duration-500"></div>
                    
                    {/* Full Image container with advanced effects - Face-focused crop */}
                    <div className="relative w-80 h-96 lg:w-96 lg:h-[28rem] rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl group-hover/image:scale-105 group-hover/image:rotate-1 transition duration-700">
                      <img 
                        src="Ayush.png" 
                        alt="Ayush - Lead Management Innovator" 
                        className="w-full h-full object-cover object-top group-hover/image:scale-110 transition duration-700"
                        style={{ objectPosition: '50% 20%' }}
                      />
                      {/* Overlay effects */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-transparent to-purple-500/20 opacity-0 group-hover/image:opacity-100 transition duration-500"></div>
                      
                      {/* Professional overlay gradient - lighter to show face better */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                    </div>
                    
                    {/* Floating badges */}
                    <div className="absolute -top-6 -right-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 px-6 py-3 rounded-full font-bold shadow-lg animate-bounce">
                      🏆 Innovator
                    </div>
                    <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-3 rounded-full font-bold shadow-lg animate-bounce delay-500">
                      💡 Visionary
                    </div>
                    
                    {/* Additional floating elements */}
                    <div className="absolute top-1/2 -left-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full font-bold shadow-lg animate-pulse">
                      ✨ Creator
                    </div>
                    <div className="absolute top-1/4 -right-8 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full font-bold shadow-lg animate-pulse delay-1000">
                      🚀 Visionary
                    </div>
                  </div>
                  
                  {/* Enhanced Content */}
                  <div className="flex-1 text-center lg:text-left">
                    <h3 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                      <span className="text-gradient bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Ayush Mishra
                      </span>
                    </h3>
                    <div className="text-cyan-300 text-xl font-semibold mb-6">
                      Lead Management Pioneer & Full-Stack Innovator
                    </div>
                    
                    <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                      A passionate technologist who recognized the gap in modern lead management solutions. 
                      With expertise spanning full-stack development, UI/UX design, and business strategy, 
                      Ayush created this revolutionary platform to empower businesses worldwide. His vision 
                      combines cutting-edge technology with intuitive design to deliver exceptional results.
                    </p>
                    
                    {/* Enhanced Skills */}
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                      {[
                        { skill: "React Expert", color: "from-blue-500 to-cyan-500" },
                        { skill: "UI/UX Designer", color: "from-purple-500 to-pink-500" },
                        { skill: "Business Strategist", color: "from-green-500 to-emerald-500" },
                        { skill: "Innovation Leader", color: "from-yellow-500 to-orange-500" }
                      ].map((item, index) => (
                        <span 
                          key={index}
                          className={`bg-gradient-to-r ${item.color} text-white px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform duration-300 cursor-default`}
                        >
                          {item.skill}
                        </span>
                      ))}
                    </div>
                    
                    {/* Enhanced Social Links */}
                    <div className="flex justify-center lg:justify-start space-x-6">
                      {[
                        { icon: "💼", label: "LinkedIn", color: "from-blue-600 to-blue-700", image: "Linkdin.jpg" },
                        { icon: "💻", label: "GitHub", color: "from-gray-700 to-gray-900", image: "githubImg.png" },
                        { icon: "✉️", label: "Email", color: "from-red-500 to-red-600", image: "mail.png" }
                      ].map((social, index) => (
                        <a 
                          key={index}
                          href="#" 
                          className={`group/social w-16 h-16 bg-gradient-to-r ${social.color} rounded-full flex items-center justify-center hover:scale-125 hover:rotate-12 transition-all duration-300 shadow-lg hover:shadow-2xl relative overflow-hidden`}
                        >
                          <img 
                            src={social.image} 
                            alt={social.label} 
                            className="w-8 h-8 object-cover group-hover/social:scale-110 transition-transform duration-300" 
                          />
                          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/social:opacity-100 transition duration-300"></div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Quote Section */}
                <div className="mt-12 pt-8 border-t border-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30">
                  <blockquote className="text-center relative">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-6xl text-cyan-400/30">"</div>
                    <p className="text-2xl italic text-gray-200 mb-6 leading-relaxed relative z-10">
                      "Innovation isn't just about technology—it's about understanding human needs and 
                      creating solutions that truly make a difference. This platform represents my 
                      commitment to empowering every business to reach their full potential."
                    </p>
                    <div className="flex justify-center space-x-2 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-3xl text-yellow-400 animate-pulse" style={{animationDelay: `${i * 0.2}s`}}>⭐</span>
                      ))}
                    </div>
                    <div className="text-cyan-300 font-semibold">- Ayush Mishra, Founder & Lead Developer</div>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Trusted by Growing Businesses
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of companies already accelerating their growth
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "50K+", label: "Active Users", color: "text-blue-600" },
              { number: "2M+", label: "Leads Managed", color: "text-green-600" },
              { number: "98%", label: "Customer Satisfaction", color: "text-purple-600" },
              { number: "24/7", label: "Support Available", color: "text-orange-600" }
            ].map((stat, index) => (
              <div key={index} className="p-6">
                <div className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2`}>
                  {stat.number}
                </div>
                <div className="text-gray-600 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in just 3 simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Sign Up & Setup",
                description: "Create your account and customize your workspace in minutes. Import existing leads or start fresh.",
                image: "mail.png"
              },
              {
                step: "02",
                title: "Manage & Track",
                description: "Organize your leads, track interactions, and monitor progress through our intuitive dashboard.",
                image: "About.jpg"
              },
              {
                step: "03",
                title: "Convert & Grow",
                description: "Use our analytics and automation tools to convert more leads and scale your business.",
                image: "banner.jpg"
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-8">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-yellow-400 shadow-lg">
                    <img 
                      src={step.image} 
                      className="w-full h-full object-cover"
                      alt={step.title}
                    />
                  </div>
                  <div className="absolute -top-4 -right-4 bg-yellow-400 text-gray-800 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Real results from real businesses
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Sales Director",
                company: "TechCorp Inc.",
                testimonial: "This platform transformed our lead management process. We've seen a 300% increase in conversion rates since implementation."
              },
              {
                name: "Michael Chen",
                role: "Marketing Manager", 
                company: "Growth Solutions",
                testimonial: "The automation features saved us countless hours. Our team can now focus on what matters most - closing deals."
              },
              {
                name: "Emily Rodriguez",
                role: "CEO",
                company: "StartUp Pro",
                testimonial: "User-friendly interface and powerful analytics. It's exactly what we needed to scale our business efficiently."
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl border border-gray-100">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">
                  "{testimonial.testimonial}"
                </p>
                <div>
                  <div className="font-semibold text-gray-800">{testimonial.name}</div>
                  <div className="text-gray-600">{testimonial.role}</div>
                  <div className="text-gray-500 text-sm">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional CTA Section */}
      <section className="py-20 bg-slate-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="frontImg.jpg" 
            className="w-full h-full object-cover opacity-20"
            alt="Background"
          />
          <div className="absolute inset-0 bg-slate-800/80"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 md:px-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Lead Management?
          </h2>
          <p className="text-xl text-slate-200 mb-12 leading-relaxed">
            Join thousands of successful businesses and start converting more leads today.
            No credit card required. Get started in minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-lg text-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              onClick={() => {
                if (token === null) {
                  navigate("/signup");
                } else {
                  navigate("/dashboard");
                }
              }}
            >
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white px-10 py-4 rounded-lg text-xl font-semibold hover:bg-white hover:text-slate-800 transition-all duration-300">
              Schedule Demo
            </button>
          </div>
          
          <div className="mt-8 flex flex-wrap justify-center items-center gap-8 text-slate-300">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              14-Day Free Trial
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              No Credit Card Required
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Cancel Anytime
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center mb-6">
                <img src="Ld.png" alt="Logo" className="w-10 h-10 rounded-full mr-3" />
                <span className="text-white font-bold text-2xl">LeadManager</span>
              </div>
              <p className="text-gray-400 mb-6">
                The most powerful and intuitive lead management platform for growing businesses.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6 text-lg">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6 text-lg">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6 text-lg">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 LeadManager. All rights reserved. Built with ❤️ for growing businesses.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
