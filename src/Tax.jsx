// src/Tax.jsx
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useLanguage } from './App';
import { translations } from './data/translations';
import { Link } from 'react-router-dom';

function Tax() {
  const { lang, toggleLanguage } = useLanguage();
  const t = translations[lang];

  // State เก็บข้อมูลค่าว่าง รอใส่ตัวเลขเหมือนแอปการเงินจริง
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [bonus, setBonus] = useState('');
  const [ssf, setSsf] = useState(0);
  const [rmf, setRmf] = useState(0);
  const [esg, setEsg] = useState(0);

  // ฟังก์ชันคำนวณภาษีบุคคลธรรมดาแบบขั้นบันไดของไทย (0% - 35%)
  const calculateThaiTax = (taxableIncome) => {
    if (taxableIncome <= 150000) return 0;
    let tax = 0;
    
    if (taxableIncome > 750000) {
      if (taxableIncome > 5000000) {
        tax += (taxableIncome - 5000000) * 0.35;
        taxableIncome = 5000000;
      }
      if (taxableIncome > 2000000) {
        tax += (taxableIncome - 2000000) * 0.30;
        taxableIncome = 2000000;
      }
      if (taxableIncome > 1000000) {
        tax += (taxableIncome - 1000000) * 0.25;
        taxableIncome = 1000000;
      }
      if (taxableIncome > 75000) {
        tax += (taxableIncome - 750000) * 0.20;
        taxableIncome = 750000;
      }
    }
    if (taxableIncome > 500000) {
      tax += (taxableIncome - 500000) * 0.15;
      taxableIncome = 500000;
    }
    if (taxableIncome > 300000) {
      tax += (taxableIncome - 300000) * 0.10;
      taxableIncome = 300000;
    }
    if (taxableIncome > 150000) {
      tax += (taxableIncome - 150000) * 0.05;
    }
    return Math.round(tax);
  };

  // ดำเนินการคำนวณประมวลผลผ่าน useMemo (Real-time Computing)
  const taxData = useMemo(() => {
    const totalIncome = (Number(monthlyIncome) * 12) + Number(bonus);
    
    // หักค่าใช้จ่ายเหมา 50% สูงสุด 100,000 + ลดหย่อนส่วนตัวพื้นฐาน 60,000 ตามกฎหมายไทย
    const standardDeductions = Math.min(totalIncome * 0.5, 100000) + 60000;
    
    // 1. คำนวณแบบก่อนวางแผน
    const netIncomeBefore = Math.max(0, totalIncome - standardDeductions);
    const taxBefore = calculateThaiTax(netIncomeBefore);

    // 2. คำนวณแบบหลังวางแผนลดหย่อน (ดักจับกฎหมายสูงสุดไม่เกินสัดส่วนรายได้)
    const allowedSSF = Math.min(ssf, totalIncome * 0.3, 200000);
    const allowedRMF = Math.min(rmf, totalIncome * 0.3, 500000);
    const allowedESG = Math.min(esg, totalIncome * 0.3, 300000);
    
    const totalInvestmentDeduction = allowedSSF + allowedRMF + allowedESG;
    const netIncomeAfter = Math.max(0, totalIncome - standardDeductions - totalInvestmentDeduction);
    const taxAfter = calculateThaiTax(netIncomeAfter);

    const taxSaved = Math.max(0, taxBefore - taxAfter);

    return {
      netIncome: netIncomeAfter,
      taxBefore,
      taxAfter,
      taxSaved,
      chartPayload: [
        { name: t.taxGraphBefore, amount: taxBefore, fill: '#4A5568' },
        { name: t.taxGraphAfter, amount: taxAfter, fill: '#C5A059' }
      ]
    };
  }, [monthlyIncome, bonus, ssf, rmf, esg, t]);

  const formatCurrency = (val) => new Intl.NumberFormat('th-TH').format(val || 0);

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white selection:bg-[#C5A059] selection:text-black font-sans relative overflow-hidden">
      
      {/* Background Soft Glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#4A72FF] opacity-[0.04] blur-[120px] rounded-full pointer-events-none"></div>

      {/* Navbar หน้าภาษี */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-xl font-semibold tracking-tighter flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#4A72FF] to-[#C5A059]"></div>
          Tax<span className="text-white/50 font-light">OS</span>
        </div>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={toggleLanguage} 
            className="text-xs font-semibold tracking-widest text-gray-400 hover:text-[#C5A059] border border-white/10 bg-white/5 rounded-full px-4 py-1.5 backdrop-blur-md transition-all duration-300"
          >
            {lang === 'en' ? 'TH' : 'EN'}
          </button>
          <Link to="/wealth" className="text-sm text-gray-400 hover:text-white transition-colors duration-300">
            Back to Wealth
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
        <p className="text-[#C5A059] text-xs font-medium tracking-[0.2em] uppercase mb-4">{t.taxDesc}</p>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-4">
          {t.taxHero1} <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4A72FF] to-[#C5A059]">{t.taxHero2}</span>
        </h1>
        <p className="text-sm md:text-base text-gray-400 max-w-xl mx-auto font-light leading-relaxed">{t.taxHeroDesc}</p>
      </header>

      {/* Calculator Workspace */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 md:p-10 rounded-[2rem] bg-[#11141C] border border-white/5 shadow-2xl w-full"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 w-full">
            
            {/* ฝั่งซ้าย: ข้อมูลรายได้จำลอง */}
            <div className="col-span-1 flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-semibold mb-1 text-white">{t.taxTitle}</h2>
                <p className="text-xs text-gray-400 font-light">{t.taxSubtitle}</p>
              </div>

              <div className="space-y-4">
                <TaxInput label={t.taxMonthly} value={monthlyIncome} setValue={setMonthlyIncome} placeholder="60000" />
                <TaxInput label={t.taxBonus} value={bonus} setValue={setBonus} placeholder="120000" />
                
                <div className="pt-4 border-t border-white/5 space-y-4">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t.taxDeduct}</h3>
                  
                  {/* Slider ปรับค่าลดหย่อนกองทุนต่างๆ */}
                  <TaxSlider label={t.taxSSF} value={ssf} setValue={setSsf} max={200000} step={5000} />
                  <TaxSlider label={t.taxRMF} value={rmf} setValue={setRmf} max={500000} step={5000} />
                  <TaxSlider label={t.taxESG} value={esg} setValue={setEsg} max={300000} step={5000} />
                </div>
              </div>

              {/* บล็อกสรุปตัวเลขความคุ้มค่าด้านล่าง */}
              <div className="mt-4 pt-6 border-t border-white/10 space-y-3 bg-black/20 p-4 rounded-xl">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">{t.taxNet}</span>
                  <span className="text-white font-medium">฿{formatCurrency(taxData.netIncome)}</span>
                </div>
                <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                  <span className="text-gray-400">{t.taxPayable}</span>
                  <span className="text-white font-medium text-red-400">฿{formatCurrency(taxData.taxAfter)}</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-1">
                  <span className="text-gray-200 font-medium">{t.taxSaved}</span>
                  <span className="text-[#00B884] font-bold text-lg">฿{formatCurrency(taxData.taxSaved)}</span>
                </div>
              </div>
            </div>

            {/* ฝั่งขวา: แสดงผลแบบกราฟแท่งคู่เปรียบเทียบ (Bar Chart) */}
            <div className="col-span-1 lg:col-span-2 w-full flex items-center justify-center min-h-[350px] lg:min-h-[450px]">
              <div className="w-full h-full min-h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={taxData.chartPayload} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} />
                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} width={60} tickFormatter={(val) => `฿${formatCurrency(val)}`} />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} content={<CustomTaxTooltip />} />
                    <Bar dataKey="amount" radius={[8, 8, 0, 0]} barSize={65}>
                      {taxData.chartPayload.map((entry, index) => (
                        <motion.rect key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </motion.div>
      </section>
    </div>
  );
}

// คอมโพเนนต์ย่อย: รับข้อมูลตัวเลขแบบพรีเมียม (ไม่มีลูกศรกวนใจ)
const TaxInput = ({ label, value, setValue, placeholder }) => (
  <div>
    <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">{label}</label>
    <input 
      type="number" 
      value={value} 
      onChange={(e) => {
        const val = e.target.value;
        setValue(val === '' ? '' : Number(val));
      }}
      placeholder={placeholder}
      className="w-full bg-[#1A1D24] border border-white/5 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all text-base font-light [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    />
  </div>
);

// คอมโพเนนต์ย่อย: ตัวเลื่อนลดหย่อนภาษี
const TaxSlider = ({ label, value, setValue, max, step }) => (
  <div>
    <div className="flex justify-between items-center text-xs text-gray-400 mb-1.5">
      <span>{label}</span>
      <span className="text-white font-medium">฿{new Intl.NumberFormat('th-TH').format(value)}</span>
    </div>
    <input 
      type="range" 
      min="0" 
      max={max} 
      step={step}
      value={value} 
      onChange={(e) => setValue(Number(e.target.value))}
      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
    />
  </div>
);

// คอมโพเนนต์ย่อย: กล่องข้อมูลเด้งตอนชี้กราฟแท่ง
const CustomTaxTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#11141C] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-md">
        <p className="text-gray-400 text-xs mb-1">{payload[0].name}</p>
        <p className="text-white font-semibold text-base">
          ฿{new Intl.NumberFormat('th-TH').format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export default Tax;