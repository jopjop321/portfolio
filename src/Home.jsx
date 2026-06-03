// src/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from './App';
import { translations } from './data/translations';

function Home() {
  const { lang, toggleLanguage } = useLanguage();
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col justify-between font-sans antialiased relative overflow-hidden select-none">
      {/* เอฟเฟกต์แสงไฟเรืองแสงตรงกลางฉากหลัง */}
      <div className="absolute w-[600px] h-[600px] bg-[#C5A059] opacity-[0.03] blur-[150px] rounded-full pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

      {/* Top Header Control */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 md:px-12 flex justify-between items-center relative z-10">
        <div className="text-xl font-semibold tracking-tighter flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#4A72FF] to-[#C5A059]"></div>
          Job<span className="text-white/40 font-light">.Hub</span>
        </div>
        <button 
          onClick={toggleLanguage} 
          className="text-[11px] font-bold tracking-widest text-zinc-400 hover:text-[#C5A059] border border-white/10 bg-white/5 rounded-full px-4 py-1.5 backdrop-blur-md transition-all duration-300 uppercase"
        >
          {lang === 'en' ? 'TH' : 'EN'}
        </button>
      </header>

      {/* Main Choice Portal */}
      <main className="w-full max-w-6xl mx-auto px-6 relative z-10 my-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* การ์ดฝั่งซ้าย: Portfolio (ผลงานพัฒนาซอฟต์แวร์) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to="/portfolio" className="group block h-full bg-[#0A0A0C] border border-white/5 hover:border-zinc-700/50 rounded-3xl p-8 md:p-12 relative overflow-hidden transition-all duration-500 shadow-2xl hover:shadow-[0_10px_40px_rgba(255,255,255,0.02)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.01] rounded-bl-full group-hover:bg-white/[0.02] transition-colors duration-500" />
              
              <span className="text-xs uppercase tracking-widest text-zinc-500 font-medium block mb-4">
                {lang === 'en' ? 'Engineering & Design' : 'วิศวกรรมและการออกแบบ'}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4 group-hover:text-zinc-200 transition-colors">
                {lang === 'en' ? 'Explore Portfolio.' : 'สำรวจพอร์ตโฟลิโอ.'}
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed font-light mb-12 max-w-sm">
                {lang === 'en' 
                  ? 'Dive into technical production-grade applications, full-stack architectures, and custom enterprise system deployments.' 
                  : 'เจาะลึกระบบซอฟต์แวร์ประยุกต์ สถาปัตยกรรมระบบ และแพลตฟอร์มบริหารจัดการหน้าร้านที่ถูกพัฒนาขึ้นจริง'}
              </p>
              
              <div className="text-xs font-semibold tracking-wider text-white bg-white/5 border border-white/10 rounded-full px-5 py-2.5 inline-flex items-center gap-2 group-hover:bg-white group-hover:text-black transition-all duration-300">
                {lang === 'en' ? 'View Works' : 'ดูรายการผลงาน'} <span>→</span>
              </div>
            </Link>
          </motion.div>

          {/* การ์ดฝั่งขวา: Wealth Management (Tax Engine & Analytics) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <Link to="/wealth" className="group block h-full bg-[#0A0A0C] border border-[#C5A059]/10 hover:border-[#C5A059]/40 rounded-3xl p-8 md:p-12 relative overflow-hidden transition-all duration-500 shadow-2xl hover:shadow-[0_10px_40px_rgba(197,160,89,0.03)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/[0.02] rounded-bl-full group-hover:bg-[#C5A059]/[0.04] transition-colors duration-500" />
              
              <span className="text-xs uppercase tracking-widest text-[#C5A059] font-medium block mb-4">
                {lang === 'en' ? 'Private Banking Tools' : 'ระบบจัดการความมั่งคั่ง'}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#C5A059] mb-4 group-hover:text-[#dfb76c] transition-colors">
                {lang === 'en' ? 'Wealth & Tax Engine.' : 'ระบบคำนวณและวางแผนภาษี.'}
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed font-light mb-12 max-w-sm">
                {lang === 'en' 
                  ? 'Simulate continuous compound interest forecasting alongside high-efficiency progressive personal tax optimization sandboxes.' 
                  : 'แบบจำลองการเติบโตของสินทรัพย์ทบต้น พร้อมห้องทดลองสิทธิ์หักลดหย่อนภาษีบุคคลธรรมดาที่มีความถูกต้องแม่นยำสูง'}
              </p>
              
              <div className="text-xs font-semibold tracking-wider text-[#C5A059] bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-full px-5 py-2.5 inline-flex items-center gap-2 group-hover:bg-[#C5A059] group-hover:text-black transition-all duration-300">
                {t.btnCalculate || 'Launch Tool'} <span>→</span>
              </div>
            </Link>
          </motion.div>

        </div>
      </main>

      {/* Footer Info */}
      <footer className="w-full text-center py-8 text-[11px] text-zinc-600 tracking-wide font-light relative z-10">
        <p>© 2026 Job. Driven by data & architectural precision.</p>
      </footer>
    </div>
  );
}

export default Home;