// src/App.jsx
import React, { useState, createContext, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Wealth from './Wealth';
import Tax from './Tax'; // Import หน้าคำนวณภาษีใหม่เข้ามา

const LanguageContext = createContext();

export function useLanguage() {
  return useContext(LanguageContext);
}

function App() {
  const [lang, setLang] = useState(() => {
    // อ่านจาก localStorage ก่อน ถ้าไม่มีค่อย detect จาก browser
    const saved = localStorage.getItem('lang');
    if (saved) return saved;
    const browserLang = navigator.language || navigator.userLanguage;
    return browserLang.startsWith('th') ? 'th' : 'en';
  });

  const toggleLanguage = () => {
    setLang((prevLang) => {
      const next = prevLang === 'en' ? 'th' : 'en';
      localStorage.setItem('lang', next); // บันทึกทุกครั้งที่กดสลับ
      return next;
    });
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wealth" element={<Wealth />} />
        <Route path="/tax" element={<Tax />} /> {/* เพิ่มเส้นทางไปหน้าภาษี */}
      </Routes>
    </LanguageContext.Provider>
  );
}

export default App;