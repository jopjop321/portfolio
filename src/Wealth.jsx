// src/Wealth.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import CompoundInterest from './CompoundInterest';
import { useLanguage } from './App'; 
import { translations } from './data/translations';

function Wealth() {
  const { lang, toggleLanguage } = useLanguage();
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white selection:bg-[#C5A059] selection:text-black font-sans relative overflow-hidden">
      
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#C5A059] opacity-[0.07] blur-[120px] rounded-full pointer-events-none"></div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-xl font-semibold tracking-tighter flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#E8D095]"></div>
          Wealth<span className="text-white/50 font-light">OS</span>
        </div>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={toggleLanguage} 
            className="text-xs font-semibold tracking-widest text-gray-400 hover:text-[#C5A059] border border-white/10 bg-white/5 rounded-full px-4 py-1.5 backdrop-blur-md transition-all duration-300 uppercase"
          >
            {lang === 'en' ? 'TH' : 'EN'}
          </button>

          <a href="/" className="text-sm text-gray-400 hover:text-white transition-colors duration-300">
            {t.returnPortfolio}
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-20 md:pt-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[#C5A059] text-xs md:text-sm font-medium tracking-[0.2em] uppercase mb-6">
            {t.portfolioDesc}
          </p>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-8 leading-[1.1]">
            {t.heroTitle1} <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#E8D095] to-[#C5A059]">
              {t.heroTitle2}
            </span>
          </h1>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">
            <a href="#calculator" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#C5A059] to-[#D4B872] text-black font-semibold rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(197,160,89,0.2)]">
                {t.btnCalculate}
              </button>
            </a>
            
            {/* 🛠️ ปุ่มเปิดระบบคำนวณภาษีชิ้นใหม่ เชื่อม Route สไตล์ Apple Glassmorphism */}
            <Link to="/tax" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-[#C5A059] font-medium rounded-full hover:bg-white/10 hover:border-[#C5A059]/40 transition-all duration-300 backdrop-blur-md flex items-center justify-center gap-2">
                <span>{t.taxNav}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Calculator Section */}
      <section id="calculator" className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
          <CompoundInterest />
      </section>

    </div>
  );
}

export default Wealth;