// src/CompoundInterest.jsx
import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

// ดึงไฟล์คำแปลภาษาเข้ามาใช้งาน (ปรับ path ย่อยตามโฟลเดอร์จริงที่คุณวางไฟล์ไว้ได้เลยครับ)
import { translations } from './data/translations'; 

function CompoundInterest() {
  const [lang, setLang] = useState('en');
  const t = translations[lang];

  const [principal, setPrincipal] = useState(''); 
  const [monthlyContribution, setMonthlyContribution] = useState(''); 
  const [rate, setRate] = useState(''); 
  const [years, setYears] = useState(10); 

  const data = useMemo(() => {
    const result = [];
    const p = Number(principal) || 0;
    const m = Number(monthlyContribution) || 0;
    const r = Number(rate) || 0;

    let currentTotal = p;
    let totalInvested = p;
    const annualContribution = m * 12;

    for (let i = 0; i <= years; i++) {
      if (i > 0) {
        currentTotal = currentTotal * (1 + (r / 100));
        currentTotal += annualContribution;
        totalInvested += annualContribution;
      }
      
      result.push({
        index: i, 
        value: Math.round(currentTotal), 
        invested: Math.round(totalInvested), 
      });
    }
    return result;
  }, [principal, monthlyContribution, rate, years]);

  const finalValue = data.length > 0 ? data[data.length - 1].value : 0;
  const totalInvested = data.length > 0 ? data[data.length - 1].invested : 0;
  const totalInterest = finalValue - totalInvested;

  const formatCurrency = (val) => new Intl.NumberFormat('th-TH').format(val || 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="p-6 md:p-10 rounded-[2rem] bg-[#11141C] border border-white/5 shadow-2xl w-full"
    >
      <div className="flex flex-col lg:flex-row gap-12 w-full">
        
        {/* ฝั่งซ้าย: แผงควบคุมตัวเลข */}
        <div className="w-full lg:w-[35%] flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-3 bg-white/5 rounded-full px-4 py-1.5 border border-white/10 w-fit mb-6">
              <button 
                onClick={() => setLang('en')} 
                className={`text-xs font-semibold tracking-widest transition-colors ${lang === 'en' ? 'text-[#C5A059]' : 'text-gray-500 hover:text-white'}`}
              >
                EN
              </button>
              <span className="text-gray-600 text-xs">|</span>
              <button 
                onClick={() => setLang('th')} 
                className={`text-xs font-semibold tracking-widest transition-colors ${lang === 'th' ? 'text-[#C5A059]' : 'text-gray-500 hover:text-white'}`}
              >
                TH
              </button>
            </div>

            <h2 className="text-3xl font-semibold mb-1 text-white transition-all">{t.title}</h2>
            <p className="text-sm text-gray-400 font-light transition-all">{t.subtitle}</p>
          </div>

          <div className="space-y-4">
            <InputField label={t.inv} value={principal} setValue={setPrincipal} placeholder="1000000" />
            <InputField label={t.mon} value={monthlyContribution} setValue={setMonthlyContribution} placeholder="10000" />
            <InputField label={t.rate} value={rate} setValue={setRate} placeholder="7" max={30} />
            
            <div className="pt-2">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide">
                  {t.time} <span className="text-white ml-2">— {years} {t.yr}</span>
                </label>
              </div>
              <input 
                type="range" 
                min="1" 
                max="50" 
                value={years} 
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
              />
            </div>
          </div>

          <div className="mt-4 pt-6 border-t border-white/10 space-y-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{t.proj}</p>
              <p className="text-3xl font-semibold text-[#C5A059]">฿{formatCurrency(finalValue)}</p>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 font-light">{t.totCont}</span>
              <span className="text-white font-medium">฿{formatCurrency(totalInvested)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 font-light">{t.totInt}</span>
              <span className="text-[#C5A059] font-medium">฿{formatCurrency(totalInterest)}</span>
            </div>
          </div>
        </div>

        {/* ฝั่งขวา: ส่วนแสดงกราฟ */}
        <div className="w-full lg:w-[65%] flex flex-col gap-4">
          <div className="flex justify-center gap-6 text-xs text-gray-400 font-light">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-[#C5A059]"></div> {t.val}</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-[#4A72FF]"></div> {t.invested}</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-[#00B884]"></div> {t.earn}</div>
          </div>

          <div className="relative w-full min-h-[400px] lg:min-h-[500px]">
            <div className="absolute inset-0 w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C5A059" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4A72FF" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#4A72FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  
                  <XAxis 
                    dataKey="index" 
                    stroke="rgba(255,255,255,0.3)" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickMargin={10} 
                    tickFormatter={(val) => val === 0 ? t.start : `${t.yearLabel} ${val}`}
                  />
                  <YAxis 
                    tickFormatter={(value) => `฿${(value / 1000000).toFixed(1)}M`} 
                    stroke="rgba(255,255,255,0.3)" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    width={65} 
                    tickMargin={10}
                  />
                  
                  <Tooltip content={<CustomTooltip t={t} />} />
                  
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#C5A059" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                    activeDot={{ r: 6, fill: '#C5A059', stroke: '#fff', strokeWidth: 2 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="invested" 
                    stroke="#4A72FF" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fillOpacity={1} 
                    fill="url(#colorInvested)" 
                    activeDot={{ r: 6, fill: '#4A72FF', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

const InputField = ({ label, value, setValue, step, max, placeholder }) => (
  <div>
    <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide transition-all">{label}</label>
    <input 
      type="number" 
      value={value} 
      onChange={(e) => {
        const val = e.target.value;
        setValue(val === '' ? '' : Number(val));
      }}
      step={step}
      max={max}
      placeholder={placeholder}
      className="w-full bg-[#1A1D24] border border-white/5 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all text-lg font-light [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    />
  </div>
);

const CustomTooltip = ({ active, payload, label, t }) => {
  if (active && payload && payload.length) {
    const rawData = payload[0].payload;
    const currentValue = rawData.value || 0;
    const currentInvested = rawData.invested || 0;
    const currentInterest = currentValue - currentInvested;
    
    const displayLabel = rawData.index === 0 ? t.start : `${t.yearLabel} ${rawData.index}`;

    return (
      <div className="bg-[#11141C] border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-md min-w-[220px]">
        <p className="text-white text-sm mb-3 font-medium border-b border-white/10 pb-2">{displayLabel}</p>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-2 text-gray-400">
              <div className="w-2 h-2 rounded-full bg-[#C5A059]"></div>{t.val}
            </span>
            <span className="text-[#C5A059] font-semibold">
              ฿{new Intl.NumberFormat('th-TH').format(currentValue)}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-2 text-gray-400">
              <div className="w-2 h-2 rounded-full bg-[#4A72FF]"></div>{t.invested}
            </span>
            <span className="text-white font-medium">
              ฿{new Intl.NumberFormat('th-TH').format(currentInvested)}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm pt-1 mt-1 border-t border-white/5">
            <span className="flex items-center gap-2 text-gray-400">
              <div className="w-2 h-2 rounded-full bg-[#00B884]"></div>{t.earn}
            </span>
            <span className="text-[#00B884] font-medium">
              + ฿{new Intl.NumberFormat('th-TH').format(currentInterest)}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default CompoundInterest;