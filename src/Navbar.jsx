// src/Navbar.jsx
import React from 'react';
import { useLanguage } from './App'; 
import { translations } from './data/translations';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { lang, toggleLanguage } = useLanguage();
  const t = translations[lang];

  const navItems = [
    { name: lang === 'en' ? 'Works' : 'ผลงาน', href: '#works' },
    { name: lang === 'en' ? 'About' : 'เกี่ยวกับผม', href: '#about' },
    { name: lang === 'en' ? 'Contact' : 'ติดต่อ', href: '#contact' },
    { name: t.navWealth, href: '/wealth', isLink: true } 
  ];

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center py-4 px-6"
    >
      <div className="flex items-center gap-8 bg-black/40 backdrop-blur-md border border-white/10 px-8 py-3 rounded-full shadow-2xl">
        <a href="#" className="font-bold text-lg mr-2 hover:text-white/80 transition-colors">
          Job.
        </a>
        
        <div className="flex items-center gap-6">
          {navItems.map((item) => (
            item.isLink ? (
              <a 
                key={item.name} 
                href={item.href}
                className="text-sm font-medium text-[#C5A059] hover:text-[#E8D095] transition-colors"
              >
                {item.name}
              </a>
            ) : (
              <a 
                key={item.name} 
                href={item.href}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                {item.name}
              </a>
            )
          ))}

          <span className="text-white/10 text-xs font-light">|</span>

          {/* 🛠️ ปุ่มเปลี่ยนภาษาปุ่มเดียวสไตล์ Apple (One-Click Toggle) */}
          <button 
            onClick={toggleLanguage} 
            className="text-xs font-semibold tracking-widest text-gray-400 hover:text-[#C5A059] transition-all duration-300 uppercase active:scale-95"
          >
            {/* โชว์ภาษาปลายทางที่ผู้ใช้สามารถกดสลับไปได้ */}
            {lang === 'en' ? 'TH' : 'EN'}
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;