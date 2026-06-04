// src/FinancialPlanning.jsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from './App';
import joppyLogo from './assets/Joppy.svg';

const localLang = {
  en: {
    title: "Financial Planning Engine",
    subtitle: "Interactive Wealth Design & Priority Mapping",
    backBtn: "← Back to Home",
    step1Title: "Step 1: Priority Sorting Slots",
    step1Sub: "Drag financial cards from the pool below and drop them into the 8 high-end tracking slots. Drag them out or swap to reorganize instantly.",
    step2Title: "Step 2: The Folded Paper Challenge (Action Required!)",
    step2Sub: "Stop right here! Please grab a real sheet of paper and a pen. Fold the paper in half. We are going to physical-blueprint your ecosystem together right now.",
    poolTitle: "Available Financial Concern Cards (Drag from here)",
    row1Label: "🔥 High Priority Focus (Ranks 1 - 4)",
    row2Label: "⏳ Medium & Long-Term Focus (Ranks 5 - 8)",
    proceedBtn: "Proceed to Tax Optimization (TaxOS) →",
    
    // คอนเซปต์แผ่นกระดาษจริง (Real Physical Paper Metaphor)
    frontPage: "📝 Paper: Front Side (Cash Flow)",
    backPage: "📝 Paper: Flip to Back (Wealth Balance)",
    incomeTitle: "✍️ Left Column: Write down your Income",
    expenseTitle: "✍️ Right Column: Write down your Expenses",
    assetTitle: "✍️ Flip Back - Left Column: All Assets",
    liabilityTitle: "✍️ Flip Back - Right Column: All Liabilities",
    
    incomeInput: "Monthly Gross Income",
    otherIncomeInput: "Other Income / Annual Lump Sum (Bonus, Incentives)",
    fixedExpenseTitle: "1. Regular / Monthly Expenses (Split in half)",
    essentialLabel: "Essential Costs (Bills, Rent, Commute, Insurance)",
    rewardLabel: "Self-Rewards (Dining out, Shopping, Entertainment)",
    bigTicketTitle: "2. Annual Big-Ticket Expenses (Lump sums)",
    bigTicketLabel: "Large Sums Due This Year (Annual Insurance, Big Trips, Tax)",
    assetLabel: "Total Investment Assets & Cash (Stocks, Land, Savings)",
    liabilityLabel: "Total Debts & Financial Liabilities (Mortgage, Car Loans)",
    
    summaryTitle: "Physical Sheet Analytics Dashboard",
    totalIncome: "Regular Monthly Income",
    totalExpense: "Regular Monthly Expenses",
    netCashflow: "Monthly Cash Surplus",
    netCashflowYear: "Annual Cash Surplus (With Lump Sums)",
    netWorth: "Total Net Worth (Wealth Stability)",
    currency: "THB"
  },
  th: {
    title: "ระบบวางแผนการเงิน",
    subtitle: "ห้องทดลองออกแบบความมั่งคั่งและจัดหมวดหมู่กระแสเงินสด",
    backBtn: "← กลับสู่หน้าหลัก",
    step1Title: "ขั้นตอนที่ 1: ตารางจัดอันดับความกังวล (Slot Sorting)",
    step1Sub: "ลากการ์ดความกังวลทางการเงินจากคลังด้านล่าง ขึ้นมาวางในช่องเป้าหมายทั้ง 8 ช่อง (แบ่งเป็น 2 แถวใหญ่) สามารถลากสลับตำแหน่งหรือลากกลับลงมาเพื่อแก้ไขได้อย่างอิสระ",
    step2Title: "ขั้นตอนที่ 2: กิจกรรมพับกระดาษวางแผนชีวิตจริง (The Real Paper Challenge)",
    step2Sub: "หยุดตรงนี้สักครู่! ขอความกรุณาหยิบกระดาษจริง ๆ ขึ้นมา 1 แผ่นและปากกา จากนั้นพับครึ่งกระดาษแผ่นนั้นเลยครับ เราจะใช้พื้นที่กระดาษจริงจดบันทึกควบคู่ไปกับระบบเพื่อประสิทธิภาพสูงสุด",
    poolTitle: "คลังการ์ดความกังวลทางการเงิน (ลากการ์ดจากตรงนี้ขึ้นไปวาง)",
    row1Label: "🔥 แถวที่ 1: กลุ่มความกังวลวิกฤตเร่งด่วนสูงสุด (อันดับ 1 - 4)",
    row2Label: "⏳ แถวที่ 2: กลุ่มเป้าหมายและการวางแผนระยะยาว (อันดับ 5 - 8)",
    proceedBtn: "วางแผนกลยุทธ์ลดหย่อนภาษีต่อ (TaxOS) →",
    
    // คอนเซปต์แผ่นกระดาษจริง (Real Physical Paper Metaphor)
    frontPage: "📝 หน้ากระดาษฝั่งขวา-ซ้าย: รายรับ - รายจ่าย",
    backPage: "📝 พลิกหลังกระดาษฝั่งขวา-ซ้าย: ทรัพย์สิน - หนี้สิน",
    incomeTitle: "✍️ ฝั่งซ้ายของกระดาษ: เขียนรายได้ของคุณ",
    expenseTitle: "✍️ ฝั่งขวาของกระดาษ: เขียนรายจ่าย",
    assetTitle: "✍️ พลิกแผ่นหลัง ฝั่งซ้าย: เขียนสินทรัพย์ทั้งหมดที่มี",
    liabilityTitle: "✍️ พลิกแผ่นหลัง ฝั่งขวา: เขียนหนี้สินทั้งหมดที่มี",
    
    incomeInput: "จำนวนรายได้พึงประเมินรวม (ต่อเดือน)",
    otherIncomeInput: "รายได้อื่นๆ / เงินก้อนรายปี (โบนัส, เงินพิเศษ)",
    fixedExpenseTitle: "1. รายจ่ายประจำทุกเดือน (แบ่งครึ่งตะกร้าเงิน)",
    essentialLabel: "ส่วนที่จำเป็น (ค่าบ้าน, ค่าน้ำไฟ, ของใช้, ประกัน, หนี้สินล็อกตายตัว)",
    rewardLabel: "ส่วนรางวัลตัวเอง (กินเที่ยวช้อปปิ้ง, ค่าความสุข, ปาร์ตี้สังสรรค์, บริการต่างๆ)",
    bigTicketTitle: "2. รายจ่ายก้อนใหญ่ที่ต้องจ่ายในรอบปีนี้",
    bigTicketLabel: "เงินก้อนใหญ่สะสม (เบี้ยประกันรายปี, ท่องเที่ยวใหญ่, ภาษีประจำปี)",
    assetLabel: "มูลค่าสินทรัพย์สะสมรวมทั้งหมด (เงินสด, พอร์ตหุ้น, กองทุน, ที่ดิน, ทองคำ)",
    liabilityLabel: "มูลค่าภาระหนี้สินคงค้างทั้งหมด (ยอดกู้บ้านที่เหลือ, ยอดรถ, หนี้สินอื่น)",
    
    summaryTitle: "แดชบอร์ดสรุปผลการพับกระดาษทางการเงิน",
    totalIncome: "รายได้ประจำต่อเดือน",
    totalExpense: "รายจ่ายประจำต่อเดือน",
    netCashflow: "กระแสเงินสดคงเหลือสุทธิ (Surplus / เดือน)",
    netCashflowYear: "กระแสเงินสดคงเหลือสุทธิ (Surplus / ปี)",
    netWorth: "ความมั่งคั่งสุทธิรวม (Net Worth)",
    currency: "บาท"
  }
};

const INITIAL_CARDS = [
  { id: 'income', fill: '#E28743', labelTh: '💵 ความมั่นคงรายได้ประจำ', labelEn: '💵 Secure Income & Job' },
  { id: 'medical', fill: '#24A19C', labelTh: '🏥 สวัสดิการค่ารักษาพยาบาล', labelEn: '🏥 Medical Care Benefits' },
  { id: 'illness', fill: '#FF6F61', labelTh: '🩺 กองทุนป้องกันโรคร้ายแรง', labelEn: '🩺 Critical Illness Shield' },
  { id: 'dreams', fill: '#6B5B95', labelTh: '🌟 เงินทุนทำตามความฝัน', labelEn: '🌟 Goals & Dreams Fund' },
  { id: 'education', fill: '#34568B', labelTh: '🎓 ทุนการศึกษาของบุตร', labelEn: '🎓 Child Education Fund' },
  { id: 'retirement', fill: '#C5A059', labelTh: '⏳ กองเงินสำรองวัยเกษียณ', labelEn: '⏳ Retirement Reserves' },
  { id: 'debts', fill: '#92A8D1', labelTh: '💳 การเคลียร์ภาระหนี้สิน', labelEn: '💳 Debt Management' },
  { id: 'tax', fill: '#009B77', labelTh: '📉 การบริหารภาษีคืนเงินได้', labelEn: '📉 Tax Optimization' }
];

export default function FinancialPlanning() {
  const { lang, toggleLanguage } = useLanguage();
  const t = localLang[lang];

  // ─── STATE STEP 1: HIGH PERFORMANCE DRAG & DROP SLOTS ───
  const [slots, setSlots] = useState(Array(8).fill(null));
  const [pool, setPool] = useState(INITIAL_CARDS);
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = (e, card, source, sourceIndex = null) => {
    setDraggedItem({ card, source, sourceIndex });
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleSlotDrop = (e, targetSlotIndex) => {
    e.preventDefault();
    if (!draggedItem) return;
    const { card, source, sourceIndex } = draggedItem;
    const nextSlots = [...slots];
    const targetOccupant = nextSlots[targetSlotIndex];

    if (source === 'pool') {
      if (targetOccupant) {
        setPool(prev => [...prev.filter(c => c.id !== card.id), targetOccupant]);
      } else {
        setPool(prev => prev.filter(c => c.id !== card.id));
      }
      nextSlots[targetSlotIndex] = card;
    } else if (source === 'slot') {
      if (sourceIndex === targetSlotIndex) return;
      nextSlots[sourceIndex] = targetOccupant;
      nextSlots[targetSlotIndex] = card;
    }
    setSlots(nextSlots);
    setDraggedItem(null);
  };

  const handleReturnToPool = (e) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.source !== 'slot') return;
    const { card, sourceIndex } = draggedItem;
    const nextSlots = [...slots];
    nextSlots[sourceIndex] = null;
    setSlots(nextSlots);
    setPool(prev => [...prev, card]);
    setDraggedItem(null);
  };

  // ─── STATE STEP 2: PHYSICAL FOLDED PAPER SYSTEM ───
  const [paperPage, setPaperPage] = useState('front'); 
  
  const [income, setIncome] = useState('');
  const [otherIncome, setOtherIncome] = useState(''); 
  const [expenseEssential, setExpenseEssential] = useState('');
  const [expenseReward, setExpenseReward] = useState('');
  const [expenseBigTicket, setExpenseBigTicket] = useState('');
  
  const [assets, setAssets] = useState('');
  const [liabilities, setLiabilities] = useState('');

  const handleInputShield = (val, setter) => {
    if (val === '') {
      setter('');
      return;
    }
    const num = Number(val);
    setter(num < 0 ? 0 : num);
  };

  // ─── 📊 PIPELINE ENGINE: CALCULATE BALANCES (ตรรกะคุมระบบตามสั่งแยกรายเดือน/รายปี) ───
  const financialReport = useMemo(() => {
    const vIncome = Number(income) || 0;
    const vOtherIncomeAnnual = Number(otherIncome) || 0; 
    const vEssential = Number(expenseEssential) || 0;
    const vReward = Number(expenseReward) || 0;
    const vBigTicketAnnual = Number(expenseBigTicket) || 0; 

    // 1. กระแสเงินสดรายเดือน: สกัดรายได้ใหญ่และรายจ่ายใหญ่ออกอย่างเด็ดขาดตามสั่ง
    const totalIncomeMonthly = vIncome;
    const totalExpenseMonthly = vEssential + vReward;
    const netCashflowMonthly = totalIncomeMonthly - totalExpenseMonthly;

    // 2. กระแสเงินสดรายปี (ช่องบวกเพิ่มใหม่): นำส่วนต่างรายเดือนคูณ 12 แล้วบวกหักลบด้วยเงินก้อนประจำปี
    const netCashflowAnnual = (netCashflowMonthly * 12) + vOtherIncomeAnnual - vBigTicketAnnual;

    const vAssets = Number(assets) || 0;
    const vLiabilities = Number(liabilities) || 0;
    const netWorth = vAssets - vLiabilities;

    return { 
      totalIncome: totalIncomeMonthly, 
      totalExpense: totalExpenseMonthly, 
      netCashflow: netCashflowMonthly, 
      netCashflowYear: netCashflowAnnual,
      netWorth 
    };
  }, [income, otherIncome, expenseEssential, expenseReward, expenseBigTicket, assets, liabilities]);

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans antialiased selection:bg-[#C5A059]/30 relative overflow-hidden pb-24">
      <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#C5A059] opacity-[0.03] blur-[150px] rounded-full pointer-events-none" />

      {/* Header Panel */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-xl font-semibold tracking-tighter flex items-center gap-2.5">
          <img src={joppyLogo} alt="Joppy Logo" className="w-6 h-6 object-contain" />
          Plan<span className="text-white/50 font-light">OS</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={toggleLanguage} className="text-xs font-semibold tracking-widest text-zinc-400 hover:text-[#C5A059] border border-white/10 bg-white/5 rounded-full px-4 py-1.5 backdrop-blur-md transition-all duration-300 uppercase">
            {lang === 'en' ? 'TH' : 'EN'}
          </button>
          <Link to="/" className="text-sm text-zinc-400 hover:text-white transition-colors duration-300">
            {t.backBtn}
          </Link>
        </div>
      </header>

      {/* Main Workspace Container */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-6 relative z-10 space-y-12">
        
        {/* Headline Link */}
        <div className="border-b border-white/5 pb-6">
          <span className="text-xs uppercase tracking-widest text-[#C5A059] font-medium mb-1 block">Private Wealth Strategy</span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            {t.title}
          </h1>
          <p className="text-zinc-400 text-xs md:text-sm mt-1.5 font-light">{t.subtitle}</p>
        </div>

        {/* 💻 STEP 1: PRIORITY SORTING TIERS */}
        <section className="bg-[#0A0A0C] border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-md">
          <div className="space-y-1">
            <h2 className="text-base font-semibold tracking-wide text-[#C5A059]">{t.step1Title}</h2>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">{t.step1Sub}</p>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400 block pl-1">{t.row1Label}</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleSlotDrop(e, idx)}
                    className={`min-h-[110px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-3 text-center transition-all relative overflow-hidden group ${
                      slots[idx] ? 'border-[#C5A059]/40 bg-[#C5A059]/5 shadow-[0_4px_15px_rgba(197,160,89,0.05)]' : 'border-white/5 bg-black/40 hover:border-white/10'
                    }`}
                  >
                    <span className="absolute top-2 left-3 text-[9px] font-mono font-bold text-zinc-600">#{idx + 1}</span>
                    {slots[idx] ? (
                      <div draggable onDragStart={(e) => handleDragStart(e, slots[idx], 'slot', idx)} className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing text-xs font-semibold text-white select-none">
                        <span>{lang === 'en' ? slots[idx].labelEn : slots[idx].labelTh}</span>
                      </div>
                    ) : (
                      <span className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest group-hover:text-zinc-500 transition-colors select-none">Empty</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-600 block pl-1">{t.row2Label}</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[4, 5, 6, 7].map((idx) => (
                  <div
                    key={idx}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleSlotDrop(e, idx)}
                    className={`min-h-[110px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-3 text-center transition-all relative overflow-hidden group ${
                      slots[idx] ? 'border-zinc-500/40 bg-zinc-900/40' : 'border-white/5 bg-black/40 hover:border-white/10'
                    }`}
                  >
                    <span className="absolute top-2 left-3 text-[9px] font-mono font-bold text-zinc-600">#{idx + 1}</span>
                    {slots[idx] ? (
                      <div draggable onDragStart={(e) => handleDragStart(e, slots[idx], 'slot', idx)} className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing text-xs font-semibold text-zinc-300 select-none">
                        <span>{lang === 'en' ? slots[idx].labelEn : slots[idx].labelTh}</span>
                      </div>
                    ) : (
                      <span className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest group-hover:text-zinc-500 transition-colors select-none">Empty</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div onDragOver={handleDragOver} onDrop={handleReturnToPool} className="pt-4 border-t border-white/5 bg-black/30 p-4 rounded-xl border border-white/5">
            <h3 className="text-[10px] font-bold tracking-wider text-zinc-500 mb-3 uppercase select-none">{t.poolTitle}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {pool.map((card) => (
                <div key={card.id} draggable onDragStart={(e) => handleDragStart(e, card, 'pool')} className="p-3 bg-[#121215] border border-white/5 rounded-xl text-xs font-medium text-zinc-400 cursor-grab active:cursor-grabbing hover:border-zinc-700 transition-all flex items-center space-x-2 select-none">
                  <div className="w-1 h-2.5 rounded-full" style={{ backgroundColor: card.fill }} />
                  <span className="truncate">{lang === 'en' ? card.labelEn : card.labelTh}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 📄 STEP 2: THE PHYSICAL FOLDED PAPER COACHING CHALLENGE */}
        <section className="space-y-6">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-white/5 pb-4 gap-4">
            <div className="space-y-1.5 max-w-xl">
              <h2 className="text-base font-bold tracking-wide text-[#C5A059] flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                {t.step2Title}
              </h2>
              <p className="text-xs text-zinc-300 leading-relaxed font-medium bg-[#C5A059]/5 border border-[#C5A059]/20 p-3.5 rounded-2xl">
                {t.step2Sub}
              </p>
            </div>
            
            <div className="flex p-1 bg-[#121215] border border-white/5 rounded-xl gap-1 shrink-0">
              <button
                onClick={() => setPaperPage('front')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-300 ${
                  paperPage === 'front' ? 'bg-[#C5A059] text-black shadow-md' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {t.frontPage}
              </button>
              <button
                onClick={() => setPaperPage('back')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-300 ${
                  paperPage === 'back' ? 'bg-[#C5A059] text-black shadow-md' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {t.backPage}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* โครงสร้างตัวแผ่นกระดาษจําลองพับครึ่ง ซ้าย - ขวา (สมมาตรสมบูรณ์แบบ) */}
            <div className="lg:col-span-8 bg-[#070709] border-2 border-white/10 rounded-3xl min-h-[460px] relative overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/5">
              
              <AnimatePresence mode="wait">
                {paperPage === 'front' ? (
                  <>
                    {/* แผ่นหน้า - ฝั่งซ้ายกระดาษ: รายได้ประจำ และ รายได้ก้อนใหญ่ */}
                    <motion.div key="front-left" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="p-6 md:p-8 space-y-6">
                      <div className="flex items-center space-x-2 border-b border-white/5 pb-2.5">
                        <div className="w-1.5 h-3.5 bg-[#E28743] rounded-full" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">{t.incomeTitle}</h3>
                      </div>
                      
                      {/* รายได้ประจำหลัก */}
                      <div className="space-y-4 bg-black/40 p-4 rounded-2xl border border-white/5 min-h-[142px] flex flex-col justify-center">
                        <h4 className="text-xs font-extrabold text-[#C5A059] uppercase tracking-widest">{lang === 'th' ? "รายได้หลักประจำ" : "Primary Income"}</h4>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-zinc-400 block leading-tight">{t.incomeInput}</label>
                          <input
                            type="number"
                            min="0"
                            value={income}
                            placeholder="0"
                            onChange={(e) => handleInputShield(e.target.value, setIncome)}
                            className="w-full bg-[#121214] border border-white/5 rounded-xl px-4 py-2.5 text-white outline-none focus:border-[#C5A059] text-base font-bold"
                          />
                        </div>
                      </div>

                      {/* รายได้อื่นๆ / โบนัสก้อนใหญ่รายปี */}
                      <div className="space-y-4 bg-black/40 p-4 rounded-2xl border border-white/5 min-h-[118px] flex flex-col justify-center">
                        <h4 className="text-xs font-extrabold text-zinc-300 uppercase tracking-widest">{lang === 'th' ? "รายได้ก้อนใหญ่ / โบนัสรายปี" : "Annual Lump Sum"}</h4>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-zinc-500 block leading-tight">{t.otherIncomeInput}</label>
                          <input
                            type="number"
                            min="0"
                            value={otherIncome}
                            placeholder="0"
                            onChange={(e) => handleInputShield(e.target.value, setOtherIncome)}
                            className="w-full bg-[#121214] border border-white/5 rounded-xl px-4 py-2.5 text-white outline-none focus:border-[#C5A059] text-base font-bold"
                          />
                        </div>
                      </div>
                    </motion.div>

                    {/* แผ่นหน้า - ฝั่งขวากระดาษ: รายจ่ายประจำ และ รายจ่ายก้อนใหญ่รายปี */}
                    <motion.div key="front-right" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="p-6 md:p-8 space-y-6 bg-white/[0.01]">
                      <div className="flex items-center space-x-2 border-b border-white/5 pb-2.5">
                        <div className="w-1.5 h-3.5 bg-[#FF6F61] rounded-full" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">{t.expenseTitle}</h3>
                      </div>

                      {/* รายจ่ายประจำทุกเดือน (จำเป็น / รางวัล) */}
                      <div className="space-y-4 bg-black/40 p-4 rounded-2xl border border-white/5 min-h-[142px]">
                        <h4 className="text-xs font-extrabold text-[#C5A059] uppercase tracking-widest">{t.fixedExpenseTitle}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-zinc-400 block leading-tight">{t.essentialLabel}</label>
                            <input type="number" min="0" value={expenseEssential} placeholder="0" onChange={(e) => handleInputShield(e.target.value, setExpenseEssential)} className="w-full bg-[#121214] border border-white/5 rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#C5A059] text-sm font-semibold" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-zinc-400 block leading-tight">{t.rewardLabel}</label>
                            <input type="number" min="0" value={expenseReward} placeholder="0" onChange={(e) => handleInputShield(e.target.value, setExpenseReward)} className="w-full bg-[#121214] border border-white/5 rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#C5A059] text-sm font-semibold" />
                          </div>
                        </div>
                      </div>

                      {/* รายจ่ายก้อนใหญ่ในปีนี้ */}
                      <div className="space-y-4 bg-black/40 p-4 rounded-2xl border border-white/5 min-h-[118px] flex flex-col justify-center">
                        <h4 className="text-xs font-extrabold text-zinc-300 uppercase tracking-widest">{t.bigTicketTitle}</h4>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-zinc-500 block leading-tight">{t.bigTicketLabel}</label>
                          <input type="number" min="0" value={expenseBigTicket} placeholder="0" onChange={(e) => handleInputShield(e.target.value, setExpenseBigTicket)} className="w-full bg-[#121214] border border-white/5 rounded-xl px-4 py-2.5 text-white outline-none focus:border-[#C5A059] font-bold text-base text-right" />
                        </div>
                      </div>
                    </motion.div>
                  </>
                ) : (
                  <>
                    {/* พลิกแผ่นหลัง - ฝั่งซ้ายกระดาษ: สินทรัพย์ */}
                    <motion.div key="back-left" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="p-6 md:p-8 space-y-5">
                      <div className="flex items-center space-x-2 border-b border-white/5 pb-2.5">
                        <div className="w-1.5 h-3.5 bg-[#24A19C] rounded-full" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">{t.assetTitle}</h3>
                      </div>
                      <div className="space-y-4 bg-black/40 p-5 rounded-2xl border border-white/5 min-h-[200px] flex flex-col justify-center">
                        <label className="text-xs font-semibold text-zinc-400 block mb-1">{t.assetLabel}</label>
                        <input
                          type="number"
                          min="0"
                          value={assets}
                          placeholder="0"
                          onChange={(e) => handleInputShield(e.target.value, setAssets)}
                          className="w-full bg-[#121214] border border-white/5 rounded-xl px-5 py-4 text-white outline-none focus:border-[#C5A059] text-xl font-bold"
                        />
                      </div>
                    </motion.div>

                    {/* พลิกแผ่นหลัง - ฝั่งขวากระดาษ: หนี้สิน */}
                    <motion.div key="back-right" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="p-6 md:p-8 space-y-5 bg-white/[0.01]">
                      <div className="flex items-center space-x-2 border-b border-white/5 pb-2.5">
                        <div className="w-1.5 h-3.5 bg-[#92A8D1] rounded-full" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">{t.liabilityTitle}</h3>
                      </div>
                      <div className="space-y-4 bg-black/40 p-5 rounded-2xl border border-white/5 min-h-[200px] flex flex-col justify-center">
                        <label className="text-xs font-semibold text-zinc-400 block mb-1">{t.liabilityLabel}</label>
                        <input
                          type="number"
                          min="0"
                          value={liabilities}
                          placeholder="0"
                          onChange={(e) => handleInputShield(e.target.value, setLiabilities)}
                          className="w-full bg-[#121214] border border-white/5 rounded-xl px-5 py-4 text-white outline-none focus:border-[#C5A059] text-xl font-bold text-right"
                        />
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

            </div>

            {/* แดชบอร์ดสรุปผลการพับกระดาษทางการเงิน */}
            <div className="lg:col-span-4 bg-gradient-to-br from-[#0F0F12] via-[#070709] to-[#121216] border border-white/5 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl relative overflow-hidden lg:sticky lg:top-6">
              <h4 className="text-xs font-bold tracking-widest text-zinc-400 uppercase border-b border-white/5 pb-3 select-none">{t.summaryTitle}</h4>
              
              <div className="space-y-3.5 text-xs font-sans">
                <div className="flex justify-between items-center text-zinc-400">
                  <span>{t.totalIncome}</span>
                  <span className="text-white font-medium">฿{Math.round(financialReport.totalIncome).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400">
                  <span>{t.totalExpense}</span>
                  <span className="text-white font-medium">฿{Math.round(financialReport.totalExpense).toLocaleString()}</span>
                </div>
              </div>

              {/* 💵 ส่วนต่างกระแสเงินสดสภาพคล่องคงเหลือรายเดือน (สกัดเงินก้อนออกแล้ว) */}
              <div className="bg-[#C5A059]/5 border border-white/10 rounded-xl p-4 flex justify-between items-center">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-zinc-400 block font-bold uppercase tracking-wide">{t.netCashflow}</span>
                  <span className="text-[9px] text-zinc-500 block font-light">Regular Surplus / Mo.</span>
                </div>
                <span className={`text-base font-extrabold tracking-tight ${financialReport.netCashflow >= 0 ? 'text-zinc-200' : 'text-red-400'}`}>
                  ฿{Math.round(financialReport.netCashflow).toLocaleString()}
                </span>
              </div>

              {/* 🌟 ช่องบวกเพิ่มใหม่: กระแสเงินสดคงเหลือสะสมสุทธิรายปี (รวมโบนัสและรายจ่ายใหญ่) */}
              <div className="bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-xl p-4 flex justify-between items-center shadow-inner">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-zinc-400 block font-bold uppercase tracking-wide">{t.netCashflowYear}</span>
                  <span className="text-[9px] text-[#C5A059]/60 block font-light">Total Surplus / Yr.</span>
                </div>
                <span className={`text-lg font-extrabold tracking-tight ${financialReport.netCashflowYear >= 0 ? 'text-[#C5A059]' : 'text-red-400'}`}>
                  ฿{Math.round(financialReport.netCashflowYear).toLocaleString()}
                </span>
              </div>

              {/* มูลค่าความมั่งคั่งสุทธิรวม (Net Worth) */}
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex justify-between items-center">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-zinc-400 block font-bold uppercase tracking-wide">{t.netWorth}</span>
                  <span className="text-[9px] text-zinc-500 block font-light">Balance Sheet Net</span>
                </div>
                <span className={`text-lg font-bold tracking-tight ${financialReport.netWorth >= 0 ? 'text-zinc-200' : 'text-red-400'}`}>
                  ฿{financialReport.netWorth.toLocaleString()}
                </span>
              </div>

              <div className="pt-2">
                <Link to="/tax" className="w-full">
                  <button className="w-full py-4 bg-gradient-to-r from-[#C5A059] to-[#D4B872] text-black font-bold rounded-full hover:scale-[1.01] active:scale-[0.99] transition-transform duration-300 shadow-[0_0_30px_rgba(197,160,89,0.15)] text-xs tracking-wide">
                    {t.proceedBtn}
                  </button>
                </Link>
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}