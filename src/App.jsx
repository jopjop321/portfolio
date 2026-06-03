// src/App.jsx
import React, { useState, createContext, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home'; // หน้า Gateway ตัวเลือกใหม่
import Portfolio from './Portfolio'; // ผลงานเดิมที่เปลี่ยนชื่อไฟล์
import Wealth from './Wealth';
import Tax from './Tax';

const LanguageContext = createContext();

export function useLanguage() {
  return useContext(LanguageContext);
}

function App() {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('lang');
    if (saved) return saved;
    const browserLang = navigator.language || navigator.userLanguage;
    return browserLang.startsWith('th') ? 'th' : 'en';
  });

  const toggleLanguage = () => {
    setLang((prevLang) => {
      const next = prevLang === 'en' ? 'th' : 'en';
      localStorage.setItem('lang', next);
      return next;
    });
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/wealth" element={<Wealth />} />
        <Route path="/tax" element={<Tax />} />
      </Routes>
    </LanguageContext.Provider>
  );
}

export default App;