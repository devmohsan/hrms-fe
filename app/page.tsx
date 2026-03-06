'use client';

import Link from 'next/link';
import { 
  CheckCircle, Users, BarChart3, Clock, ArrowRight, Menu, X, Shield, Zap, 
  Globe, Search, UserPlus, Briefcase, Video, Phone, FileCheck, TrendingUp, 
  BrainCircuit, Rocket, Target, MessageSquare, Sparkles, ChevronRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] selection:bg-primary-blue/20 overflow-x-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-blue/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-success-green/5 rounded-full blur-[100px] animate-pulse delay-1000"></div>
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-warning-orange/5 rounded-full blur-[80px]"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'py-4' : 'py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`px-6 py-2 rounded-2xl border transition-all duration-500 flex justify-between items-center ${
              scrolled ? 'bg-white/70 backdrop-blur-xl border-gray-200/50 shadow-xl shadow-gray-200/20' : 'bg-transparent border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3">
                <img 
                  src="/logo.png" 
                  alt="Workforce One Logo" 
                  className="h-12 md:h-16 w-auto object-contain transition-all duration-500"
                />
                <span className="text-xl md:text-2xl font-black tracking-tighter text-gray-900">
                  WORKFORCE<span className="text-primary-blue">ONE</span>
                </span>
              </Link>
            </div>
            
            <div className="hidden lg:flex items-center space-x-8">
              {['Solutions', 'Assessment', 'Workforce', 'Pricing'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-bold text-gray-500 hover:text-primary-blue transition-colors tracking-tight">
                  {item}
                </a>
              ))}
              <div className="h-6 w-px bg-gray-200"></div>
              <Link href="/login" className="text-sm font-bold text-gray-900">Sign In</Link>
              <Link 
                href="/register-company" 
                className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-blue transition-all hover:scale-105 active:scale-95 shadow-lg shadow-gray-900/10"
              >
                Get Started
              </Link>
            </div>

            <div className="lg:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-900 bg-white rounded-lg shadow-sm border border-gray-100">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white/90 backdrop-blur-3xl border-b border-gray-100 px-6 py-8 space-y-6 mt-2 mx-4 rounded-3xl shadow-2xl overflow-hidden"
            >
              {['Solutions', 'Assessment', 'Workforce', 'Pricing'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="block text-2xl font-black tracking-tighter text-gray-900">{item}</a>
              ))}
              <hr className="border-gray-100" />
              <button className="w-full bg-primary-blue text-white px-6 py-4 rounded-2xl font-black text-lg italic shadow-xl shadow-primary-blue/20">
                GO PRO NOW
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section - Split Layout */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Decorative Blobs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary-blue/5 rounded-full blur-[100px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-success-green/5 rounded-full blur-[80px] -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Column: Content */}
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="lg:col-span-6 space-y-10 text-center lg:text-left"
            >
              <motion.div 
                variants={fadeIn}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm text-xs font-black uppercase tracking-[0.2em] text-gray-600"
              >
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-blue opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-blue"></span>
                </div>
                The Operating System for Modern Teams
              </motion.div>
              
              <motion.h1 
                variants={fadeIn}
                className="text-6xl md:text-8xl font-black text-gray-900 leading-[0.9] tracking-tighter"
              >
                Recruit. <br />
                <span className="text-primary-blue relative inline-block">
                  Manage.
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 400 20" fill="none">
                    <path d="M5 15C100 5 300 5 395 15" stroke="#1C6581" strokeWidth="6" strokeLinecap="round" opacity="0.3" />
                  </svg>
                </span>
                <br /> Scale.
              </motion.h1>
              
              <motion.p 
                variants={fadeIn}
                className="text-xl text-gray-500 max-w-2xl mx-auto lg:mx-0 leading-tight font-medium"
              >
                Workforce One is an AI-powered ecosystem that automates your entire employee lifecycle. 
                Efficiency is no longer optional. It's built-in.
              </motion.p>

              <motion.div 
                variants={fadeIn}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <Link 
                  href="/register-company" 
                  className="w-full sm:w-auto bg-gray-900 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-primary-blue transition-all shadow-2xl shadow-gray-900/20 flex items-center justify-center gap-3"
                >
                  Deploy System
                  <ChevronRight size={20} />
                </Link>
                <button className="w-full sm:w-auto bg-white text-gray-600 border border-gray-200 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-3">
                  Watch Demo
                </button>
              </motion.div>
            </motion.div>

            {/* Right Column: Visual Mockup */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="lg:col-span-6 relative group"
            >
              {/* Background Glow */}
              <div className="absolute -inset-10 bg-gradient-to-r from-primary-blue/10 via-success-green/10 to-primary-blue/10 rounded-[5rem] blur-[120px] opacity-30 group-hover:opacity-60 transition-opacity duration-1000"></div>
              
              <div className="relative bg-white rounded-[2.5rem] border border-gray-200/50 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] overflow-hidden">
                {/* Browser Header */}
                <div className="bg-gray-50/50 border-b border-gray-100 px-6 py-4 flex items-center">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                  </div>
                </div>
                
                {/* Image Content */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src="/analytics.png" 
                    alt="Workforce One Analytics Dashboard" 
                    className="w-full h-full object-cover transition-transform duration-[3000ms] ease-out group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/5 via-transparent to-transparent"></div>
                </div>
              </div>

              {/* Floating UI Card */}
              <div className="absolute -right-6 -bottom-6 bg-white p-6 rounded-[2rem] shadow-2xl border border-gray-100 hidden xl:block animate-bounce-slow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-success-green/10 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="text-success-green w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Efficiency</p>
                    <p className="text-xl font-black text-gray-900">98.4%</p>
                  </div>
                </div>
              </div>

              {/* Verified Team Float */}
              <div className="absolute -left-10 top-1/2 -translate-y-1/2 bg-white p-4 rounded-3xl shadow-2xl border border-gray-100 hidden xl:block animate-float">
                  <img src="/avatars.png" alt="Team" className="h-10 w-auto object-contain mb-1" />
                  <p className="text-[10px] font-black text-primary-blue uppercase text-center">AI Verified</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Recruitment Engine - Re-designed for "Sleek" look */}
      <section id="solutions" className="py-32 relative overflow-hidden">
        {/* Background Graphic */}
        <div className="absolute top-1/2 -right-64 w-[600px] h-[600px] bg-primary-blue/5 rounded-full blur-[120px] -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between mb-20 gap-16">
            <div className="max-w-2xl space-y-6 text-center lg:text-left">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                Hire without <br />
                <span className="text-primary-blue">the friction.</span>
              </h2>
              <p className="text-xl text-gray-500 font-medium tracking-tight">Create jobs. Auto-post to socials. Parse CVs. All in one click.</p>
              <div className="flex gap-4 justify-center lg:justify-start">
                <div className="w-14 h-14 bg-white rounded-2xl border border-gray-100 flex items-center justify-center shadow-lg"><MessageSquare className="text-primary-blue" /></div>
                <div className="w-14 h-14 bg-white rounded-2xl border border-gray-100 flex items-center justify-center shadow-lg"><Globe className="text-success-green" /></div>
                <div className="w-14 h-14 bg-white rounded-2xl border border-gray-100 flex items-center justify-center shadow-lg"><Zap className="text-warning-orange" /></div>
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="lg:col-span-6 relative flex justify-center lg:justify-end"
            >
              {/* Premium Container for Image */}
              <div className="relative w-full max-w-[500px] aspect-square group">
                {/* Background Dynamic Glows */}
                <div className="absolute -inset-10 bg-primary-blue/20 rounded-full blur-[100px] opacity-40 group-hover:opacity-70 transition-opacity duration-1000"></div>
                <div className="absolute -inset-10 bg-success-green/10 rounded-full blur-[80px] opacity-30 group-hover:opacity-60 transition-opacity duration-1000 animate-pulse"></div>
                
                {/* Image Wrap with Glass border */}
                <div className="relative h-full w-full rounded-[4rem] border border-white/40 p-2 shadow-2xl overflow-hidden backdrop-blur-sm bg-white/5">
                   <img 
                    src="/recruitment_engine.png" 
                    alt="Recruitment Engine Visual" 
                    className="w-full h-full object-cover rounded-[3.8rem] transition-transform duration-[4000ms] group-hover:scale-110"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary-blue/10 to-transparent"></div>
                </div>

                {/* Floating Meta Badge */}
                <motion.div 
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -right-6 bg-white p-4 rounded-3xl shadow-2xl border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-blue/10 rounded-xl flex items-center justify-center">
                       <Rocket className="text-primary-blue w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Status</p>
                      <p className="text-sm font-black text-gray-900">Live Delivery</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-10 bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/20 space-y-8 group"
            >
              <div className="w-14 h-14 bg-primary-blue text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary-blue/20 group-hover:rotate-6 transition-transform">
                <Search size={28} />
              </div>
              <h3 className="text-4xl font-black tracking-tighter">AI Ad Generation</h3>
              <p className="text-gray-500 text-lg leading-relaxed">
                System auto-generates platform-ready ads for LinkedIn, Instagram, and Meta. Ready to publish in seconds.
              </p>
              <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                <span className="text-sm font-black uppercase tracking-widest text-primary-blue">Analyze Channels</span>
                <ArrowRight className="text-primary-blue" />
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="p-10 bg-gray-900 text-white rounded-[3rem] space-y-8 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-blue/20 rounded-full blur-[100px] -mr-32 -mt-32 uppercase tracking-tighter"></div>
              <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 group-hover:-rotate-6 transition-transform">
                <Target size={28} className="text-success-green" />
              </div>
              <h3 className="text-4xl font-black tracking-tighter">Social Auto-Post</h3>
              <p className="text-white/50 text-lg leading-relaxed">
                Integrated with LinkedIn, Meta, and WhatsApp APIs. One dashboard to rule every acquisition channel.
              </p>
              <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                <span className="text-sm font-black uppercase tracking-widest text-success-green">Live Feed Status</span>
                <div className="flex h-2 w-2 rounded-full bg-success-green animate-ping"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Structured Assessment SECTION - Interactive Cards */}
      <section id="assessment" className="py-32 bg-white relative overflow-hidden">
        {/* Background Image/Glow */}
        <div className="absolute left-[-10%] top-[-10%] w-[500px] h-[500px] bg-primary-blue/5 rounded-full blur-[100px] -z-10"></div>
        <img 
          src="/ai_brain.png" 
          alt="AI Brain Background" 
          className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-96 h-auto object-contain opacity-20 pointer-events-none -z-10 blur-sm"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col lg:flex-row items-center gap-20 mb-24">
             <div className="lg:w-1/2 text-center lg:text-left">
               <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 tracking-tighter">
                 Intelligence <br /> <span className="text-primary-blue">Assessment.</span>
               </h2>
               <p className="text-xl text-gray-500 font-medium leading-relaxed tracking-tight">A cost-optimized, 3-stage model that filters candidates based on potential, behavior, and skill using neural-processing.</p>
             </div>
             
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               className="lg:w-1/2 relative group"
             >
                {/* Background Glow */}
                <div className="absolute -inset-10 bg-primary-blue/20 rounded-full blur-[100px] opacity-30 group-hover:opacity-60 transition-opacity"></div>
                
                {/* Image Container - Dark Theme for Dark Image */}
                <div className="relative bg-gray-900 rounded-[3.5rem] p-1 border border-white/10 shadow-3xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)]">
                   <img 
                    src="/ai_brain.png" 
                    alt="AI Intelligence" 
                    className="w-full h-auto object-cover transition-transform duration-[3000ms] group-hover:scale-110 opacity-90 group-hover:opacity-100"
                  />
                  
                  {/* Stats Overlay - Refined Positioning */}
                  <div className="absolute bottom-6 left-6 right-6 flex gap-3 z-10">
                     <div className="flex-1 bg-white/10 backdrop-blur-2xl p-4 rounded-2xl border border-white/10 shadow-2xl">
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Accuracy</p>
                        <p className="text-xl font-black text-primary-blue">99.8%</p>
                     </div>
                     <div className="flex-1 bg-white/10 backdrop-blur-2xl p-4 rounded-2xl border border-white/10 shadow-2xl">
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Processing</p>
                        <p className="text-xl font-black text-success-green">0.4s</p>
                     </div>
                  </div>

                  {/* Glass Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-60"></div>
                </div>

                {/* Decorative Element */}
                <div className="absolute -top-4 -left-4 bg-primary-blue p-3 rounded-2xl shadow-xl z-10 hidden xl:block">
                   <BrainCircuit className="text-white w-6 h-6" />
                </div>
             </motion.div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {[
               { title: 'Neural Form', icon: FileCheck, color: 'bg-primary-blue', light: 'bg-primary-blue/5', text: 'text-primary-blue', weight: '20%' },
               { title: 'Visual DNA', icon: Video, color: 'bg-success-green', light: 'bg-success-green/5', text: 'text-success-green', weight: '30%' },
               { title: 'Deep Skill', icon: BrainCircuit, color: 'bg-warning-orange', light: 'bg-warning-orange/5', text: 'text-warning-orange', weight: '50%' }
             ].map((card, i) => (
               <motion.div 
                 key={i}
                 whileHover={{ scale: 1.02 }}
                 className="p-1 bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden group cursor-pointer"
               >
                 <div className={`p-10 rounded-[2.8rem] transition-all duration-500 h-full flex flex-col ${card.light} group-hover:bg-white`}>
                    <div className={`w-14 h-14 ${card.color} text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-black/5`}>
                      <card.icon size={28} />
                    </div>
                    <div className="flex justify-between items-center mb-6">
                      <span className={`text-xs font-black uppercase tracking-widest ${card.text}`}>Phase 0{i+1}</span>
                      <span className="px-3 py-1 bg-white rounded-full border border-gray-100 text-[10px] font-black">{card.weight} Weight</span>
                    </div>
                    <h3 className="text-3xl font-black tracking-tight mb-4">{card.title}</h3>
                    <p className="text-gray-500 font-medium mb-10 flex-grow">Advanced scoring engine evaluating intent, clarity, and precision autonomously.</p>
                    <div className="flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                      <span className={`text-sm font-bold ${card.text}`}>View AI Model</span>
                      <ChevronRight size={16} className={card.text} />
                    </div>
                 </div>
               </motion.div>
             ))}
           </div>
        </div>
      </section>

      {/* OS Section - Modern Sleek Dashboard Look */}
      <section id="workforce" className="py-40 bg-gray-950 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
             <div className="space-y-12">
               <div className="flex items-center gap-6">
                 <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-primary-blue">Total Control</div>
                 <motion.img 
                   src="/os_core.png" 
                   alt="OS Core" 
                   initial={{ rotate: 0 }}
                   animate={{ rotate: 360 }}
                   transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                   className="h-12 w-12 object-contain"
                 />
               </div>
               <h2 className="text-6xl md:text-8xl font-black leading-none tracking-tighter">
                 The Unified <br />
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-blue to-success-green">OS for Teams.</span>
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {[
                   { icon: Clock, label: 'Attendance', desc: 'Neural-rule engine checks.' },
                   { icon: Briefcase, label: 'Payroll', desc: 'One-click global payments.' },
                   { icon: TrendingUp, label: 'Analytics', desc: 'Real-time performance mesh.' },
                   { icon: Shield, label: 'Security', desc: 'Enterprise-grade encryption.' }
                 ].map((feat, i) => (
                   <div key={i} className="space-y-3 group">
                     <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-primary-blue transition-colors">
                       <feat.icon size={20} className="text-white" />
                     </div>
                     <h4 className="font-black text-lg">{feat.label}</h4>
                     <p className="text-white/40 text-sm leading-tight">{feat.desc}</p>
                   </div>
                 ))}
               </div>
             </div>
             
             <div className="relative">
               <div className="absolute -inset-10 bg-primary-blue/30 rounded-full blur-[100px] opacity-20"></div>
               <div className="relative p-2 bg-gradient-to-br from-white/10 to-transparent rounded-[3rem] border border-white/10 backdrop-blur-3xl shadow-2xl rotate-3">
                 <div className="bg-gray-900 rounded-[2.5rem] p-8 aspect-[4/3] flex flex-col justify-between">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="text-[10px] font-black text-white/20 tracking-widest uppercase italic">Neural_Dashboard_v2.0</div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-4 w-32 bg-white/10 rounded"></div>
                      <div className="h-32 w-full bg-primary-blue/10 rounded-3xl border border-primary-blue/20 p-6">
                        <div className="flex items-end h-full gap-2">
                          {[40, 70, 45, 90, 65, 80, 50, 95].map((h, i) => (
                            <motion.div 
                              key={i} 
                              initial={{ height: 0 }} 
                              animate={{ height: `${h}%` }} 
                              className="flex-1 bg-primary-blue/40 rounded-t-lg border-t border-primary-blue/50"
                            ></motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1 h-12 bg-white/5 rounded-2xl flex items-center px-4 border border-white/5">
                        <div className="w-6 h-6 rounded-full bg-success-green/20 border border-success-green/40"></div>
                      </div>
                      <div className="flex-1 h-12 bg-white/5 rounded-2xl flex items-center px-4 border border-white/5">
                        <div className="w-6 h-6 rounded-full bg-primary-blue/20 border border-primary-blue/40"></div>
                      </div>
                    </div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Sleek & High Conversion */}
      <section id="pricing" className="py-32 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24 max-w-4xl mx-auto flex flex-col items-center gap-10">
            {/* <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <div className="absolute -inset-10 bg-gradient-to-r from-primary-blue/20 to-warning-orange/20 rounded-full blur-[120px] opacity-30"></div>
              <div className="relative bg-white p-8 rounded-[4rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border border-gray-100 group">
                <img 
                  src="/pricing_visual.png" 
                  alt="Pricing Visual" 
                  className="h-40 w-auto object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </motion.div> */}
            <div>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 tracking-tighter">
                SaaS <span className="text-primary-blue">Pricing.</span>
              </h2>
              <p className="text-xl text-gray-500 font-medium tracking-tight">Enterprise grade features with transparent, per-use scaling. No hidden costs.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Base Plan */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-10 rounded-[3rem] bg-white border border-gray-100 shadow-xl shadow-gray-200/20 space-y-8"
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight">Base Plan</h3>
                <p className="text-gray-400 text-sm font-medium italic">Core workforce management</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black tracking-tighter">₹299</span>
                <span className="text-gray-400 font-bold">/emp/mo</span>
              </div>
              <ul className="space-y-4 pt-4">
                {['Unlimited Departments', 'Neural Attendance', 'AI Task Intelligence', 'Audit Logs'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                    <CheckCircle className="text-success-green w-5 h-5" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 rounded-2xl bg-gray-50 text-gray-900 border border-gray-100 font-black hover:bg-gray-100 transition-all">Get Started</button>
            </motion.div>
            
            {/* Recruitment Add-On (Featured) */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-10 rounded-[3rem] bg-gray-900 text-white shadow-2xl shadow-primary-blue/20 space-y-8 relative overflow-hidden scale-105"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-blue/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <div className="inline-block px-4 py-1.5 rounded-full bg-primary-blue/20 text-primary-blue text-[10px] font-black uppercase tracking-[0.2em] mb-4">Most Popular</div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight">Recruitment AI</h3>
                <p className="text-white/40 text-sm font-medium italic">Screening fee you charge clients</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black tracking-tighter">₹499</span>
                <span className="text-white/40 font-bold">/candidate</span>
              </div>
              <ul className="space-y-4 pt-4">
                {['Social Auto-Post', '3-Stage Neural Assessment', 'Resume Parsing AI', 'Video Interviews'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm font-bold text-white/80">
                    <CheckCircle className="text-primary-blue w-5 h-5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/register-company" className="block w-full text-center py-4 rounded-2xl bg-primary-blue text-white font-black shadow-lg shadow-primary-blue/30 hover:scale-105 transition-all">Deploy Premium</Link>
            </motion.div>

            {/* Voice AI Add-on */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-10 rounded-[3rem] bg-white border border-gray-100 shadow-xl shadow-gray-200/20 space-y-8"
            >
               <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight">Voice AI</h3>
                <p className="text-gray-400 text-sm font-medium italic">AI Phone Screening</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black tracking-tighter uppercase italic">usage</span>
                <span className="text-gray-400 font-bold">/min</span>
              </div>
              <ul className="space-y-4 pt-4">
                {['Automated Call Scripts', 'NLP Sentiment Analysis', 'Transcription API', 'Candidate Reports'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                    <CheckCircle className="text-warning-orange w-5 h-5" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 rounded-2xl bg-gray-50 text-gray-900 border border-gray-100 font-black hover:bg-gray-100 transition-all">Enable Voice</button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer - Professional & Compact */}
      <footer className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
            <div className="md:col-span-5 space-y-6">
              <div className="flex items-center gap-2">
                <img 
                  src="/logo.png" 
                  alt="Workforce One" 
                  className="h-10 w-auto object-contain"
                />
                <span className="text-xl font-black tracking-tighter text-gray-900">
                  WORKFORCE<span className="text-primary-blue">ONE</span>
                </span>
              </div>
              <p className="text-gray-500 font-medium max-w-sm leading-relaxed">
                The unified AI operating system for modern workforce management. Streamline your entire employee lifecycle.
              </p>
              <div className="flex gap-4">
                {['Twitter', 'LinkedIn', 'Github'].map(platform => (
                  <button key={platform} className="text-gray-400 hover:text-primary-blue transition-colors font-bold text-xs uppercase tracking-widest">{platform}</button>
                ))}
              </div>
            </div>
            
            <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Platform</h5>
                <ul className="space-y-3 font-bold text-sm text-gray-700">
                  <li className="hover:text-primary-blue transition-colors cursor-pointer">Recruitment</li>
                  <li className="hover:text-primary-blue transition-colors cursor-pointer">Assessments</li>
                  <li className="hover:text-primary-blue transition-colors cursor-pointer">Workforce OS</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Support</h5>
                <ul className="space-y-3 font-bold text-sm text-gray-700">
                  <li className="hover:text-primary-blue transition-colors cursor-pointer">Help Center</li>
                  <li className="hover:text-primary-blue transition-colors cursor-pointer">API Docs</li>
                  <li className="hover:text-primary-blue transition-colors cursor-pointer">Safety</li>
                </ul>
              </div>
              <div className="space-y-4 col-span-2 md:col-span-1">
                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Get App</h5>
                <div className="flex flex-col gap-2">
                   <button className="bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:scale-105 transition-all">App Store</button>
                   <button className="bg-white border border-gray-200 text-gray-900 px-4 py-2 rounded-xl text-xs font-bold hover:scale-105 transition-all">Play Store</button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">© 2024 Workforce One Global</p>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
               <span className="hover:text-gray-900 cursor-pointer">Privacy</span>
               <span className="hover:text-gray-900 cursor-pointer">Terms</span>
               <span className="hover:text-gray-900 cursor-pointer">Cookies</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
