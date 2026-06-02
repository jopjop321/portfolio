// src/Tax.jsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from './App';
import { translations } from './data/translations';

function Tax() {
  const { lang, toggleLanguage } = useLanguage();
  const t = translations[lang];

  // --- STATE 1: สำหรับกลุ่มรายได้ (8 ประเภท แยก ม.40(5) และ ม.40(8) ตามสเปก) ---
  const [activeIncomeCat, setActiveIncomeCat] = useState('job'); // 'job' | 'invest' | 'rent' | 'expert' | 'business'
  
  const [activeIncomes, setActiveIncomes] = useState({
    salary: false,         // 40(1) เงินเดือน
    bonus: false,          // 40(1) โบนัส
    freelance: false,      // 40(2) ค่านายหน้า/รับงานทั่วไป
    copyright: false,      // 40(3) ค่าลิขสิทธิ์
    dividend: false,       // 40(4) ดอกเบี้ย/เงินปันผล
    rentBuilding: false,   // 40(5) บ้าน โรงเรือน สิ่งปลูกสร้าง แพ (หักเหมา 30%)
    rentAgriLand: false,   // 40(5) ที่ดินเกษตรกรรม (หักเหมา 20%)
    rentOtherLand: false,  // 40(5) ที่ดินไม่ใช้เกษตรกรรม (หักเหมา 15%)
    rentVehicle: false,    // 40(5) ยานพาหนะ รถ เรือ (หักเหมา 30%)
    rentOtherAsset: false, // 40(5) ทรัพย์สินอย่างอื่น (หักเหมา 10%)
    medicalExpert: false,  // 40(6) วิชาชีพแพทย์
    otherExpert: false,    // 40(6) วิชาชีพอื่น
    contractor: false,     // 40(7) รับเหมาก่อสร้าง
    actor: false,          // 40(8) นักแสดงสาธารณะ (หักเหมาพิเศษขั้นบันได)
    commerce43: false,     // 40(8) กลุ่มธุรกิจ 43 ประเภท (เลือกหักเหมา 60% หรือตามจริง)
    commerceOther: false,  // 40(8) กลุ่มธุรกิจนอกเหนือ 43 ประเภท (บังคับหักตามจริงเท่านั้น)
  });

  const [incomeValues, setIncomeValues] = useState({
    salary: '', bonus: '', freelance: '', copyright: '', dividend: '',
    rentBuilding: '', rentAgriLand: '', rentOtherLand: '', rentVehicle: '', rentOtherAsset: '',
    medicalExpert: '', otherExpert: '', contractor: '', actor: '', commerce43: '', commerceOther: ''
  });

  // State สำหรับสลับหักค่าใช้จ่าย "ตามจริง" (สำหรับรายการที่กฎหมายเปิดสิทธิ์ให้เลือก)
  const [useActualExpenses, setUseActualExpenses] = useState({
    copyright: false,
    rentBuilding: false,
    rentAgriLand: false,
    rentOtherLand: false,
    rentVehicle: false,
    rentOtherAsset: false,
    medicalExpert: false,
    otherExpert: false,
    contractor: false,
    commerce43: false
    // Note: commerceOther บังคับตามจริงอยู่แล้วใน Logic ไม่ต้องสลับ
  });

  // State สำหรับเก็บมูลค่าเงินค่าใช้จ่ายตามจริง
  const [actualExpenseValues, setActualExpenseValues] = useState({
    copyright: '', rentBuilding: '', rentAgriLand: '', rentOtherLand: '', rentVehicle: '', rentOtherAsset: '',
    medicalExpert: '', otherExpert: '', contractor: '', commerce43: '', commerceOther: ''
  });

  // --- STATE 2: สำหรับกลุ่มลดหย่อน (คงสไตล์เดิมไว้ทั้งหมด) ---
  const [activeDeductionCat, setActiveDeductionCat] = useState('personal'); // 'personal' | 'economy' | 'insurance' | 'funds' | 'donation'
  
  const [activeDeductions, setActiveDeductions] = useState({
    socialSecurity: false, insurance: false, pensionInsurance: false,
    thaiESG: false, rmfPvd: false, homeLoanInterest: false,
    solarRooftop: false, parentsCare: false, childrenCare: false, donationGeneral: false
  });

  const [deductionValues, setDeductionValues] = useState({
    socialSecurity: '', insurance: '', pensionInsurance: '', thaiESG: '', rmfPvd: '',
    homeLoanInterest: '', solarRooftop: '', parentsCount: '', childrenCount: '', donationAmount: ''
  });

  // ฟังก์ชันสลับสถานะเปิดปิดปุ่มสว่างย่อย - ฝั่งรายได้
  const toggleIncome = (key) => {
    setActiveIncomes(prev => ({ ...prev, [key]: !prev[key] }));
    if (activeIncomes[key]) {
      setIncomeValues(prev => ({ ...prev, [key]: '' }));
      if (key in useActualExpenses) {
        setUseActualExpenses(prev => ({ ...prev, [key]: false }));
      }
      if (key in actualExpenseValues) {
        setActualExpenseValues(prev => ({ ...prev, [key]: '' }));
      }
    }
  };

  // ฟังก์ชันสลับสถานะเปิดปิดปุ่มสว่างย่อย - ฝั่งลดหย่อน
  const toggleDeduction = (key) => {
    setActiveDeductions(prev => ({ ...prev, [key]: !prev[key] }));
    if (activeDeductions[key]) {
      setDeductionValues(prev => ({
        ...prev, [key]: '',
        ...(key === 'parentsCare' ? { parentsCount: '' } : {}),
        ...(key === 'childrenCare' ? { childrenCount: '' } : {}),
        ...(key === 'donationGeneral' ? { donationAmount: '' } : {})
      }));
    }
  };

  // --- LOGIC ARCHITECTURE: ประมวลผลภาษีแยกตามสัดส่วนที่ถูกต้องของสรรพากร ---
  const taxData = useMemo(() => {
    const vSalary = activeIncomes.salary ? Number(incomeValues.salary) * 12 : 0;
    const vBonus = activeIncomes.bonus ? Number(incomeValues.bonus) : 0;
    const vFreelance = activeIncomes.freelance ? Number(incomeValues.freelance) : 0;
    const vCopyright = activeIncomes.copyright ? Number(incomeValues.copyright) : 0;
    const vDividend = activeIncomes.dividend ? Number(incomeValues.dividend) : 0;
    
    // ม.40(5) ค่าเช่าย่อย
    const vRentBuild = activeIncomes.rentBuilding ? Number(incomeValues.rentBuilding) : 0;
    const vRentAgri = activeIncomes.rentAgriLand ? Number(incomeValues.rentAgriLand) : 0;
    const vRentOtherLand = activeIncomes.rentOtherLand ? Number(incomeValues.rentOtherLand) : 0;
    const vRentVehicle = activeIncomes.rentVehicle ? Number(incomeValues.rentVehicle) : 0;
    const vRentOtherAsset = activeIncomes.rentOtherAsset ? Number(incomeValues.rentOtherAsset) : 0;

    const vMedExpert = activeIncomes.medicalExpert ? Number(incomeValues.medicalExpert) : 0;
    const vOthExpert = activeIncomes.otherExpert ? Number(incomeValues.otherExpert) : 0;
    const vContractor = activeIncomes.contractor ? Number(incomeValues.contractor) : 0;
    const vActor = activeIncomes.actor ? Number(incomeValues.actor) : 0;
    
    // ม.40(8) ย่อยแยกกลุ่มตามเงื่อนไขของพระราชกฤษฎีกาฯ (ฉบับที่ 11)
    const vCommerce43 = activeIncomes.commerce43 ? Number(incomeValues.commerce43) : 0;
    const vCommerceOther = activeIncomes.commerceOther ? Number(incomeValues.commerceOther) : 0;

    const totalAnnualIncome = vSalary + vBonus + vFreelance + vCopyright + vDividend + 
                             vRentBuild + vRentAgri + vRentOtherLand + vRentVehicle + vRentOtherAsset + 
                             vMedExpert + vOthExpert + vContractor + vActor + vCommerce43 + vCommerceOther;

    // ── คำนวณหักต้นทุนค่าใช้จ่าย (Expenses) ──
    
    // 1. ม.40(1) และ ม.40(2) รวมกัน หักเหมา 50% สูงสุดไม่เกิน 100,000 บาท
    const sumType12 = vSalary + vBonus + vFreelance;
    const expType12 = Math.min(sumType12 * 0.5, 100000);

    // 2. ม.40(3) ค่าลิขสิทธิ์ หักเหมา 50% ไม่เกิน 1 แสน หรือตามจริง
    const expCopyright = activeIncomes.copyright 
      ? (useActualExpenses.copyright ? Number(actualExpenseValues.copyright) : Math.min(vCopyright * 0.5, 100000)) 
      : 0;

    // 3. ม.40(4) ดอกเบี้ย/ปันผล หักค่าใช้จ่ายไม่ได้ (0%)
    const expType4 = 0;

    // 4. ม.40(5) ค่าเช่าทรัพย์สิน แยกประเภทหักเหมา/ตามจริง
    const expRentBuild = activeIncomes.rentBuilding ? (useActualExpenses.rentBuilding ? Number(actualExpenseValues.rentBuilding) : vRentBuild * 0.30) : 0;
    const expRentAgri = activeIncomes.rentAgriLand ? (useActualExpenses.rentAgriLand ? Number(actualExpenseValues.rentAgriLand) : vRentAgri * 0.20) : 0;
    const expRentOtherLand = activeIncomes.rentOtherLand ? (useActualExpenses.rentOtherLand ? Number(actualExpenseValues.rentOtherLand) : vRentOtherLand * 0.15) : 0;
    const expRentVehicle = activeIncomes.rentVehicle ? (useActualExpenses.rentVehicle ? Number(actualExpenseValues.rentVehicle) : vRentVehicle * 0.30) : 0;
    const expRentOtherAsset = activeIncomes.rentOtherAsset ? (useActualExpenses.rentOtherAsset ? Number(actualExpenseValues.rentOtherAsset) : vRentOtherAsset * 0.10) : 0;
    const totalRentExpenses = expRentBuild + expRentAgri + expRentOtherLand + expRentVehicle + expRentOtherAsset;

    // 5. ม.40(6) วิชาชีพอิสระ
    const expMed = activeIncomes.medicalExpert ? (useActualExpenses.medicalExpert ? Number(actualExpenseValues.medicalExpert) : vMedExpert * 0.60) : 0;
    const expOth = activeIncomes.otherExpert ? (useActualExpenses.otherExpert ? Number(actualExpenseValues.otherExpert) : vOthExpert * 0.30) : 0;

    // 6. ม.40(7) การรับเหมาก่อสร้าง
    const expContractor = activeIncomes.contractor ? (useActualExpenses.contractor ? Number(actualExpenseValues.contractor) : vContractor * 0.60) : 0;

    // 7. ม.40(8) ดารานักแสดงสาธารณะ หักเหมาขั้นบันไดพิเศษไม่เกิน 600,000 บาท
    let expActor = 0;
    if (activeIncomes.actor) {
      expActor = vActor <= 300000 ? vActor * 0.60 : (300000 * 0.60) + ((vActor - 300000) * 0.40);
      expActor = Math.min(expActor, 600000);
    }

    // 8. ม.40(8) ย่อยแยกกลุ่มตาม พ.ร.ฎ. (ฉบับที่ 11)
    // กลุ่ม 43 ประเภท: หักเหมา 60% หรือระบุตามจริง
    const expCommerce43 = activeIncomes.commerce43 
      ? (useActualExpenses.commerce43 ? Number(actualExpenseValues.commerce43) : vCommerce43 * 0.60) 
      : 0;

    // กลุ่มนอกเหนือ 43 ประเภท: บังคับตามจริงเท่านั้น หักเหมาไม่ได้
    const expCommerceOther = activeIncomes.commerceOther ? Number(actualExpenseValues.commerceOther) : 0;

    const totalExpenses = expType12 + expCopyright + expType4 + totalRentExpenses + expMed + expOth + expContractor + expActor + expCommerce43 + expCommerceOther;

    // ── คำนวณหักกลุ่มรายการลดหย่อน ──
    const personalDeduction = 60000;
    const ssVal = activeDeductions.socialSecurity ? Math.min(Number(deductionValues.socialSecurity), 9000) : 0;
    const insVal = activeDeductions.insurance ? Math.min(Number(deductionValues.insurance), 100000) : 0;
    const esgVal = activeDeductions.thaiESG ? Math.min(Number(deductionValues.thaiESG), totalAnnualIncome * 0.3, 300000) : 0;
    
    const rmfVal = activeDeductions.rmfPvd ? Math.min(Number(deductionValues.rmfPvd), totalAnnualIncome * 0.3, 500000) : 0;
    const pensionVal = activeDeductions.pensionInsurance ? Math.min(Number(deductionValues.pensionInsurance), totalAnnualIncome * 0.15, 200000) : 0;
    const retirementGroupSum = Math.min(rmfVal + pensionVal, 500000);

    const homeVal = activeDeductions.homeLoanInterest ? Math.min(Number(deductionValues.homeLoanInterest), 100000) : 0;
    const solarVal = activeDeductions.solarRooftop ? Math.min(Number(deductionValues.solarRooftop), 200000) : 0;
    
    const parentsVal = activeDeductions.parentsCare ? (Math.min(Number(deductionValues.parentsCount), 4) * 30000) : 0;
    const childrenVal = activeDeductions.childrenCare ? (Number(deductionValues.childrenCount) * 30000) : 0;

    const baseDeductions = personalDeduction + ssVal + insVal + esgVal + retirementGroupSum + homeVal + solarVal + parentsVal + childrenVal;
    
    const incomeBeforeDonation = Math.max(0, totalAnnualIncome - totalExpenses - baseDeductions);
    const donationVal = activeDeductions.donationGeneral ? Math.min(Number(deductionValues.donationAmount), incomeBeforeDonation * 0.1) : 0;

    const totalDeductions = baseDeductions + donationVal;
    const netIncome = Math.max(0, incomeBeforeDonation - donationVal);
    const taxPayable = calculateThaiTax(netIncome);

    return { totalAnnualIncome, totalExpenses, totalDeductions, netIncome, taxPayable };
  }, [incomeValues, activeIncomes, deductionValues, activeDeductions, useActualExpenses, actualExpenseValues]);

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans antialiased selection:bg-[#C5A059]/30 relative overflow-hidden">
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#C5A059] opacity-[0.04] blur-[120px] rounded-full pointer-events-none"></div>

      {/* Header Bar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-xl font-semibold tracking-tighter flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#4A72FF] to-[#C5A059]"></div>
          Tax<span className="text-white/50 font-light">OS</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={toggleLanguage} className="text-xs font-semibold tracking-widest text-zinc-400 hover:text-[#C5A059] border border-white/10 bg-white/5 rounded-full px-4 py-1.5 backdrop-blur-md transition-all duration-300 uppercase">
            {lang === 'en' ? 'TH' : 'EN'}
          </button>
          <Link to="/wealth" className="text-sm text-zinc-400 hover:text-white transition-colors duration-300">
            ← Back to Wealth
          </Link>
        </div>
      </header>

      {/* Main Container Workspace */}
      <main className="max-w-7xl mx-auto pb-24 px-6 md:px-12 pt-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 border-b border-white/5 pb-8">
          <span className="text-xs uppercase tracking-widest text-[#C5A059] font-medium mb-2 block">Algorithmic Taxation Engine</span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            Tax Optimization Planner
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ฝั่งซ้าย: กล่องควบคุมข้อมูลและประเภทฝั่งรายได้ (7 คอลัมน์) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* ── หมวดที่ 1: รายได้พึงประเมิน 8 ประเภทแยกโครงสร้างย่อย ── */}
            <div className="bg-[#0A0A0C] border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-md">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-1.5 h-6 bg-[#C5A059] rounded-full" />
                <h2 className="text-lg font-medium text-white tracking-wide">1. Sources of Income (หมวดหมู่ประเภทรายได้)</h2>
              </div>

              {/* แท็บบาร์เลือกกลุ่มรายได้ใหญ่ */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 p-1.5 bg-[#121215] rounded-2xl border border-white/5">
                <CategoryTab label="เงินเดือน/งานทั่วไป" active={activeIncomeCat === 'job'} onClick={() => setActiveIncomeCat('job')} />
                <CategoryTab label="การลงทุน/หุ้น" active={activeIncomeCat === 'invest'} onClick={() => setActiveIncomeCat('invest')} />
                <CategoryTab label="ค่าเช่าสินทรัพย์" active={activeIncomeCat === 'rent'} onClick={() => setActiveIncomeCat('rent')} />
                <CategoryTab label="วิชาชีพอิสระ" active={activeIncomeCat === 'expert'} onClick={() => setActiveIncomeCat('expert')} />
                <CategoryTab label="รับเหมา/พาณิชย์" active={activeIncomeCat === 'business'} onClick={() => setActiveIncomeCat('business')} />
              </div>

              {/* ปุ่มย่อยสว่างฝั่งรายได้แสดงผลตามกลุ่มแท็บใหญ่ที่กดเลือก */}
              <div className="pt-4 border-t border-white/5">
                <AnimatePresence mode="wait">
                  {activeIncomeCat === 'job' && (
                    <motion.div key="job" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ToggleButton label="ม.40(1) เงินเดือนประจำ" subtitle="หักเหมา 50% กลุ่มแรงงาน" active={activeIncomes.salary} onClick={() => toggleIncome('salary')} />
                      <ToggleButton label="ม.40(1) โบนัสประจำปี" subtitle="หักค่าใช้จ่ายเหมากลุ่มร่วมกัน" active={activeIncomes.bonus} onClick={() => toggleIncome('bonus')} />
                      <ToggleButton label="ม.40(2) นายหน้า / ฟรีแลนซ์" subtitle="หักรวมกลุ่มสูงสุด 1 แสนบ." active={activeIncomes.freelance} onClick={() => toggleIncome('freelance')} />
                      <ToggleButton label="ม.40(3) ค่าลิขสิทธิ์เพลง/หนังสือ" subtitle="สิทธิ์เลือกหักตามจริงได้" active={activeIncomes.copyright} onClick={() => toggleIncome('copyright')} />
                    </motion.div>
                  )}

                  {activeIncomeCat === 'invest' && (
                    <motion.div key="invest" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 gap-4">
                      <ToggleButton label="ม.40(4) ดอกเบี้ย / เงินปันผลจากหุ้น" subtitle="ตามประมวลรัษฎากรหักค่าใช้จ่ายไม่ได้ (0%)" active={activeIncomes.dividend} onClick={() => toggleIncome('dividend')} />
                    </motion.div>
                  )}

                  {activeIncomeCat === 'rent' && (
                    <motion.div key="rent" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ToggleButton label="บ้าน / โรงเรือน / แพ" subtitle="ม.40(5) หักอัตราเหมา 30%" active={activeIncomes.rentBuilding} onClick={() => toggleIncome('rentBuilding')} />
                      <ToggleButton label="ที่ดินใช้ทำเกษตรกรรม" subtitle="ม.40(5) หักอัตราเหมา 20%" active={activeIncomes.rentAgriLand} onClick={() => toggleIncome('rentAgriLand')} />
                      <ToggleButton label="ที่ดินที่ไม่ได้ใช้ทำเกษตร" subtitle="ม.40(5) หักอัตราเหมา 15%" active={activeIncomes.rentOtherLand} onClick={() => toggleIncome('rentOtherLand')} />
                      <ToggleButton label="ยานพาหนะ (รถยนต์ / เรือ)" subtitle="ม.40(5) หักอัตราเหมา 30%" active={activeIncomes.rentVehicle} onClick={() => toggleIncome('rentVehicle')} />
                      <ToggleButton label="ทรัพย์สินประเภทอื่นๆ" subtitle="ม.40(5) หักอัตราเหมา 10%" active={activeIncomes.rentOtherAsset} onClick={() => toggleIncome('rentOtherAsset')} />
                    </motion.div>
                  )}

                  {activeIncomeCat === 'expert' && (
                    <motion.div key="expert" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ToggleButton label="ม.40(6) วิชาชีพแพทย์" subtitle="กลุ่มประกอบโรคศิลป์ หักเหมา 60%" active={activeIncomes.medicalExpert} onClick={() => toggleIncome('medicalExpert')} />
                      <ToggleButton label="ม.40(6) ทนาย/วิศวกร/สถาปนิก/บัญชี" subtitle="กลุ่มวิชาชีพเฉพาะ หักเหมา 30%" active={activeIncomes.otherExpert} onClick={() => toggleIncome('otherExpert')} />
                    </motion.div>
                  )}

                  {activeIncomeCat === 'business' && (
                    <motion.div key="business" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ToggleButton label="ม.40(7) การรับเหมาก่อสร้าง" subtitle="ต้องจัดหาวัสดุเอง หักเหมา 60%" active={activeIncomes.contractor} onClick={() => toggleIncome('contractor')} />
                      <ToggleButton label="ม.40(8) ดารานักแสดงสาธารณะ" subtitle="หักเหมาแบบขั้นบันไดพิเศษ" active={activeIncomes.actor} onClick={() => toggleIncome('actor')} />
                      <ToggleButton label="ม.40(8) ธุรกิจกลุ่ม 43 ประเภท" subtitle="ร้านอาหาร/ค้าขาย หักเหมา 60% หรือตามจริง" active={activeIncomes.commerce43} onClick={() => toggleIncome('commerce43')} />
                      <ToggleButton label="ม.40(8) ธุรกิจนอกเหนือ 43 ประเภท" subtitle="ทำคอนเทนต์/สตรีมเมอร์ บังคับหักตามจริง" active={activeIncomes.commerceOther} onClick={() => toggleIncome('commerceOther')} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* กล่องกรอกตัวเลข Input รายได้และเมนูสลับตามจริง ขยายตัวอย่างนุ่มนวล */}
              <div className="space-y-4 pt-2">
                <AnimatePresence>
                  {activeIncomes.salary && activeIncomeCat === 'job' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <Input label="เงินเดือนพึงประเมินต่อเดือน (ระบบนำไป x12 ให้อัตโนมัติ)" value={incomeValues.salary} onChange={(e) => setIncomeValues({ ...incomeValues, salary: e.target.value })} placeholder="0" />
                    </motion.div>
                  )}
                  {activeIncomes.bonus && activeIncomeCat === 'job' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <Input label="ยอดเงินโบนัสประจำปีพึงประเมิน" value={incomeValues.bonus} onChange={(e) => setIncomeValues({ ...incomeValues, bonus: e.target.value })} placeholder="0" />
                    </motion.div>
                  )}
                  {activeIncomes.freelance && activeIncomeCat === 'job' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <Input label="ค่านายหน้า เบี้ยประชุม หรือค่ารับงานอิสระครั้งคราวรวมทั้งปี" value={incomeValues.freelance} onChange={(e) => setIncomeValues({ ...incomeValues, freelance: e.target.value })} placeholder="0" />
                    </motion.div>
                  )}
                  {activeIncomes.copyright && activeIncomeCat === 'job' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-3 bg-zinc-900/20 p-4 rounded-2xl border border-white/5">
                      <Input label="รายได้จากค่าลิขสิทธิ์เพลง/หนังสือ/สิทธิบัตร รวมทั้งปี" value={incomeValues.copyright} onChange={(e) => setIncomeValues({ ...incomeValues, copyright: e.target.value })} placeholder="0" />
                      <ExpenseToggle active={useActualExpenses.copyright} onClick={() => setUseActualExpenses({...useActualExpenses, copyright: !useActualExpenses.copyright})} />
                      {useActualExpenses.copyright && <Input label="ระบุเอกสารค่าใช้จ่ายจริงที่จำเป็นและสมควรตามหลักฐาน" value={actualExpenseValues.copyright} onChange={(e) => setActualExpenseValues({...actualExpenseValues, copyright: e.target.value})} placeholder="กรอกค่าใช้จ่ายจริง" />}
                    </motion.div>
                  )}
                  {activeIncomes.dividend && activeIncomeCat === 'invest' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <Input label="รายได้รวมจากดอกเบี้ยเงินฝาก/พันธบัตร/เงินปันผลจากหุ้น" value={incomeValues.dividend} onChange={(e) => setIncomeValues({ ...incomeValues, dividend: e.target.value })} placeholder="0" />
                    </motion.div>
                  )}

                  {/* ฟิลด์กรอกย่อยกลุ่ม ม.40(5) ค่าเช่าแต่ละประเภท */}
                  {activeIncomes.rentBuilding && activeIncomeCat === 'rent' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-3 bg-zinc-900/20 p-4 rounded-2xl border border-white/5">
                      <Input label="รายได้จากค่าเช่า บ้าน โรงเรือน สิ่งปลูกสร้าง หรือแพ รวมทั้งปี" value={incomeValues.rentBuilding} onChange={(e) => setIncomeValues({ ...incomeValues, rentBuilding: e.target.value })} placeholder="0" />
                      <ExpenseToggle active={useActualExpenses.rentBuilding} onClick={() => setUseActualExpenses({...useActualExpenses, rentBuilding: !useActualExpenses.rentBuilding})} />
                      {useActualExpenses.rentBuilding && <Input label="ระบุต้นทุนค่าใช้จ่ายจริงตามหลักฐานบิล" value={actualExpenseValues.rentBuilding} onChange={(e) => setActualExpenseValues({...actualExpenseValues, rentBuilding: e.target.value})} placeholder="กรอกค่าใช้จ่ายจริง" />}
                    </motion.div>
                  )}
                  {activeIncomes.rentAgriLand && activeIncomeCat === 'rent' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-3 bg-zinc-900/20 p-4 rounded-2xl border border-white/5">
                      <Input label="รายได้จากค่าเช่าที่ดินเพื่อใช้ในการเกษตรกรรม รวมทั้งปี" value={incomeValues.rentAgriLand} onChange={(e) => setIncomeValues({ ...incomeValues, rentAgriLand: e.target.value })} placeholder="0" />
                      <ExpenseToggle active={useActualExpenses.rentAgriLand} onClick={() => setUseActualExpenses({...useActualExpenses, rentAgriLand: !useActualExpenses.rentAgriLand})} />
                      {useActualExpenses.rentAgriLand && <Input label="ระบุต้นทุนค่าใช้จ่ายจริงตามหลักฐานบิล" value={actualExpenseValues.rentAgriLand} onChange={(e) => setActualExpenseValues({...actualExpenseValues, rentAgriLand: e.target.value})} placeholder="กรอกค่าใช้จ่ายจริง" />}
                    </motion.div>
                  )}
                  {activeIncomes.rentOtherLand && activeIncomeCat === 'rent' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-3 bg-zinc-900/20 p-4 rounded-2xl border border-white/5">
                      <Input label="รายได้จากค่าเช่าที่ดินที่ไม่ได้ใช้ในการเกษตรกรรม รวมทั้งปี" value={incomeValues.rentOtherLand} onChange={(e) => setIncomeValues({ ...incomeValues, rentOtherLand: e.target.value })} placeholder="0" />
                      <ExpenseToggle active={useActualExpenses.rentOtherLand} onClick={() => setUseActualExpenses({...useActualExpenses, rentOtherLand: !useActualExpenses.rentOtherLand})} />
                      {useActualExpenses.rentOtherLand && <Input label="ระบุต้นทุนค่าใช้จ่ายจริงตามหลักฐานบิล" value={actualExpenseValues.rentOtherLand} onChange={(e) => setActualExpenseValues({...actualExpenseValues, rentOtherLand: e.target.value})} placeholder="กรอกค่าใช้จ่ายจริง" />}
                    </motion.div>
                  )}
                  {activeIncomes.rentVehicle && activeIncomeCat === 'rent' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-3 bg-zinc-900/20 p-4 rounded-2xl border border-white/5">
                      <Input label="รายได้จากค่าเช่ายานพาหนะ (รถยนต์ เรือ เครื่องบิน) รวมทั้งปี" value={incomeValues.rentVehicle} onChange={(e) => setIncomeValues({ ...incomeValues, rentVehicle: e.target.value })} placeholder="0" />
                      <ExpenseToggle active={useActualExpenses.rentVehicle} onClick={() => setUseActualExpenses({...useActualExpenses, rentVehicle: !useActualExpenses.rentVehicle})} />
                      {useActualExpenses.rentVehicle && <Input label="ระบุต้นทุนค่าใช้จ่ายจริงตามหลักฐานบิล" value={actualExpenseValues.rentVehicle} onChange={(e) => setActualExpenseValues({...actualExpenseValues, rentVehicle: e.target.value})} placeholder="กรอกค่าใช้จ่ายจริง" />}
                    </motion.div>
                  )}
                  {activeIncomes.rentOtherAsset && activeIncomeCat === 'rent' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-3 bg-zinc-900/20 p-4 rounded-2xl border border-white/5">
                      <Input label="รายได้จากค่าเช่าทรัพย์สินประเภทอื่นๆ รวมทั้งปี" value={incomeValues.rentOtherAsset} onChange={(e) => setIncomeValues({ ...incomeValues, rentOtherAsset: e.target.value })} placeholder="0" />
                      <ExpenseToggle active={useActualExpenses.rentOtherAsset} onClick={() => setUseActualExpenses({...useActualExpenses, rentOtherAsset: !useActualExpenses.rentOtherAsset})} />
                      {useActualExpenses.rentOtherAsset && <Input label="ระบุต้นทุนค่าใช้จ่ายจริงตามหลักฐานบิล" value={actualExpenseValues.rentOtherAsset} onChange={(e) => setActualExpenseValues({...actualExpenseValues, rentOtherAsset: e.target.value})} placeholder="กรอกค่าใช้จ่ายจริง" />}
                    </motion.div>
                  )}

                  {activeIncomes.medicalExpert && activeIncomeCat === 'expert' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-3 bg-zinc-900/20 p-4 rounded-2xl border border-white/5">
                      <Input label="รายได้จากการประกอบโรคศิลป์ (แพทย์/หมอ)" value={incomeValues.medicalExpert} onChange={(e) => setIncomeValues({ ...incomeValues, medicalExpert: e.target.value })} placeholder="0" />
                      <ExpenseToggle active={useActualExpenses.medicalExpert} onClick={() => setUseActualExpenses({...useActualExpenses, medicalExpert: !useActualExpenses.medicalExpert})} />
                      {useActualExpenses.medicalExpert && <Input label="ระบุต้นทุนหลักฐานค่าใช้จ่ายจริงจากการประกอบโรคศิลป์" value={actualExpenseValues.medicalExpert} onChange={(e) => setActualExpenseValues({...actualExpenseValues, medicalExpert: e.target.value})} placeholder="กรอกค่าใช้จ่ายจริง" />}
                    </motion.div>
                  )}
                  {activeIncomes.otherExpert && activeIncomeCat === 'expert' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-3 bg-zinc-900/20 p-4 rounded-2xl border border-white/5">
                      <Input label="รายได้ทนายความ/วิศวกร/สถาปนิก/บัญชีพึงประเมิน" value={incomeValues.otherExpert} onChange={(e) => setIncomeValues({ ...incomeValues, otherExpert: e.target.value })} placeholder="0" />
                      <ExpenseToggle active={useActualExpenses.otherExpert} onClick={() => setUseActualExpenses({...useActualExpenses, otherExpert: !useActualExpenses.otherExpert})} />
                      {useActualExpenses.otherExpert && <Input label="ระบุหลักฐานค่าใช้จ่ายจริงตามความจำเป็นและสมควร" value={actualExpenseValues.otherExpert} onChange={(e) => setActualExpenseValues({...actualExpenseValues, otherExpert: e.target.value})} placeholder="กรอกค่าใช้จ่ายจริง" />}
                    </motion.div>
                  )}
                  {activeIncomes.contractor && activeIncomeCat === 'business' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-3 bg-zinc-900/20 p-4 rounded-2xl border border-white/5">
                      <Input label="รายได้รวมรับเหมาก่อสร้าง (รวมค่าจัดหาวัสดุสัมภาระสำคัญ)" value={incomeValues.contractor} onChange={(e) => setIncomeValues({ ...incomeValues, contractor: e.target.value })} placeholder="0" />
                      <ExpenseToggle active={useActualExpenses.contractor} onClick={() => setUseActualExpenses({...useActualExpenses, contractor: !useActualExpenses.contractor})} />
                      {useActualExpenses.contractor && <Input label="ระบุต้นทุนหน้าบิลค่าอิฐ หิน ปูน เหล็ก และค่าแรงรับเหมาตามจริง" value={actualExpenseValues.contractor} onChange={(e) => setActualExpenseValues({...actualExpenseValues, contractor: e.target.value})} placeholder="กรอกค่าใช้จ่ายจริง" />}
                    </motion.div>
                  )}
                  {activeIncomes.actor && activeIncomeCat === 'business' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <Input label="รายได้รวมของดารานักแสดงสาธารณะ" value={incomeValues.actor} onChange={(e) => setIncomeValues({ ...incomeValues, actor: e.target.value })} placeholder="0" />
                    </motion.div>
                  )}

                  {/* ฟิลด์กรอกย่อยกลุ่ม ม.40(8) แยก 43 ประเภท และนอกเหนือประเภทตามพระราชกฤษฎีกาฯ */}
                  {activeIncomes.commerce43 && activeIncomeCat === 'business' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-3 bg-zinc-900/20 p-4 rounded-2xl border border-white/5">
                      <Input label="รายได้รวมกลุ่มธุรกิจ 43 ประเภท (ร้านอาหาร/ค้าขายปลีก-ส่ง/ขนส่ง)" value={incomeValues.commerce43} onChange={(e) => setIncomeValues({ ...incomeValues, commerce43: e.target.value })} placeholder="0" />
                      <ExpenseToggle active={useActualExpenses.commerce43} onClick={() => setUseActualExpenses({...useActualExpenses, commerce43: !useActualExpenses.commerce43})} />
                      {useActualExpenses.commerce43 && <Input label="ระบุหลักฐานต้นทุนสต๊อกสินค้าหรือใบเสร็จดำเนินกิจการตามจริง" value={actualExpenseValues.commerce43} onChange={(e) => setActualExpenseValues({...actualExpenseValues, commerce43: e.target.value})} placeholder="กรอกค่าใช้จ่ายจริง" />}
                    </motion.div>
                  )}
                  {activeIncomes.commerceOther && activeIncomeCat === 'business' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-3 bg-zinc-900/20 p-4 rounded-2xl border border-white/5">
                      <Input label="รายได้ธุรกิจนอกเหนือ 43 ประเภท (เช่น ทำคอนเทนต์/ยูทูบเบอร์/บริการสมัยใหม่)" value={incomeValues.commerceOther} onChange={(e) => setIncomeValues({ ...incomeValues, commerceOther: e.target.value })} placeholder="0" />
                      <Input label="ระบุเอกสารหลักฐานรายจ่ายจริงที่จำเป็นและสมควร (กฎหมายบังคับตามจริงเท่านั้น)" value={actualExpenseValues.commerceOther} onChange={(e) => setActualExpenseValues({...actualExpenseValues, commerceOther: e.target.value})} placeholder="กรอกค่าใช้จ่ายจริง" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── หมวดที่ 2: รายการหักลดหย่อนภาษี ── */}
            <div className="bg-[#0A0A0C] border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-md">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-1.5 h-6 bg-[#C5A059] rounded-full" />
                <h2 className="text-lg font-medium text-white tracking-wide">2. Select Tax Category (เลือกกลุ่มลดหย่อน)</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 p-1.5 bg-[#121215] rounded-2xl border border-white/5">
                <CategoryTab label="ส่วนตัว/ครอบครัว" active={activeDeductionCat === 'personal'} onClick={() => setActiveDeductionCat('personal')} />
                <CategoryTab label="กระตุ้นเศรษฐกิจ" active={activeDeductionCat === 'economy'} onClick={() => setActiveDeductionCat('economy')} />
                <CategoryTab label="ประกัน" active={activeDeductionCat === 'insurance'} onClick={() => setActiveDeductionCat('insurance')} />
                <CategoryTab label="กองทุนรวม" active={activeDeductionCat === 'funds'} onClick={() => setActiveDeductionCat('funds')} />
                <CategoryTab label="เงินบริจาค" active={activeDeductionCat === 'donation'} onClick={() => setActiveDeductionCat('donation')} />
              </div>

              <div className="pt-4 border-t border-white/5">
                <AnimatePresence mode="wait">
                  {activeDeductionCat === 'personal' && (
                    <motion.div key="personal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ToggleButton label="อุปการะเลี้ยงดูบิดามารดา" subtitle="คนละ 30,000 บ." active={activeDeductions.parentsCare} onClick={() => toggleDeduction('parentsCare')} />
                      <ToggleButton label="ค่าลดหย่อนบุตร" subtitle="คนละ 30,000 บ." active={activeDeductions.childrenCare} onClick={() => toggleDeduction('childrenCare')} />
                    </motion.div>
                  )}

                  {activeDeductionCat === 'economy' && (
                    <motion.div key="economy" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ToggleButton label="ดอกเบี้ยเงินกู้ยืมบ้าน" subtitle="สูงสุด 100,000 บ." active={activeDeductions.homeLoanInterest} onClick={() => toggleDeduction('homeLoanInterest')} />
                      <ToggleButton label="ติดตั้ง Solar Rooftop" subtitle="สูงสุด 200,000 บ." active={activeDeductions.solarRooftop} onClick={() => toggleDeduction('solarRooftop')} />
                    </motion.div>
                  )}

                  {activeDeductionCat === 'insurance' && (
                    <motion.div key="insurance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <ToggleButton label="ประกันสังคม" subtitle="สูงสุด 9,000 บ." active={activeDeductions.socialSecurity} onClick={() => toggleDeduction('socialSecurity')} />
                      <ToggleButton label="ประกันชีวิต/สุขภาพ" subtitle="สูงสุด 100,000 บ." active={activeDeductions.insurance} onClick={() => toggleDeduction('insurance')} />
                      <ToggleButton label="ประกันชีวิตแบบบำนาญ" subtitle="สูงสุด 200,000 บ." active={activeDeductions.pensionInsurance} onClick={() => toggleDeduction('pensionInsurance')} />
                    </motion.div>
                  )}

                  {activeDeductionCat === 'funds' && (
                    <motion.div key="funds" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ToggleButton label="กองทุน ThaiESG" subtitle="สูงสุด 300,000 บ." active={activeDeductions.thaiESG} onClick={() => toggleDeduction('thaiESG')} />
                      <ToggleButton label="กองทุน RMF / PVD" subtitle="สูงสุด 500,000 บ." active={activeDeductions.rmfPvd} onClick={() => toggleDeduction('rmfPvd')} />
                    </motion.div>
                  )}

                  {activeDeductionCat === 'donation' && (
                    <motion.div key="donation" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 gap-4">
                      <ToggleButton label="เงินบริจาคทั่วไป / เพื่อการศึกษา" subtitle="ลดหย่อนได้ไม่เกิน 10% ของเงินได้สุทธิ" active={activeDeductions.donationGeneral} onClick={() => toggleDeduction('donationGeneral')} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <AnimatePresence>
                  {activeDeductions.parentsCare && activeDeductionCat === 'personal' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <Input label="จำนวนบิดา/มารดา ที่คุณดูแล (ระบุจำนวนคน)" value={deductionValues.parentsCount} onChange={(e) => setDeductionValues({ ...deductionValues, parentsCount: e.target.value })} placeholder="เช่น 2" />
                    </motion.div>
                  )}
                  {activeDeductions.childrenCare && activeDeductionCat === 'personal' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <Input label="จำนวนบุตร (ระบุจำนวนคน)" value={deductionValues.childrenCount} onChange={(e) => setDeductionValues({ ...deductionValues, childrenCount: e.target.value })} placeholder="เช่น 1" />
                    </motion.div>
                  )}
                  {activeDeductions.homeLoanInterest && activeDeductionCat === 'economy' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <Input label="ดอกเบี้ยเงินกู้ยืมเพื่อซื้อที่อยู่อาศัยที่จ่ายจริง" value={deductionValues.homeLoanInterest} onChange={(e) => setDeductionValues({ ...deductionValues, homeLoanInterest: e.target.value })} placeholder="สูงสุดไม่เกิน 100,000" />
                    </motion.div>
                  )}
                  {activeDeductions.solarRooftop && activeDeductionCat === 'economy' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <Input label="ค่าซื้อและติดตั้งระบบ Solar Rooftop" value={deductionValues.solarRooftop} onChange={(e) => setDeductionValues({ ...deductionValues, solarRooftop: e.target.value })} placeholder="สูงสุดไม่เกิน 200,000" />
                    </motion.div>
                  )}
                  {activeDeductions.socialSecurity && activeDeductionCat === 'insurance' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <Input label="ยอดเงินประกันสังคมสะสมประจำปี" value={deductionValues.socialSecurity} onChange={(e) => setDeductionValues({ ...deductionValues, socialSecurity: e.target.value })} placeholder="สูงสุดไม่เกิน 9,000" />
                    </motion.div>
                  )}
                  {activeDeductions.insurance && activeDeductionCat === 'insurance' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <Input label="เบี้ยประกันชีวิตและสุขภาพรวมกัน" value={deductionValues.insurance} onChange={(e) => setDeductionValues({ ...deductionValues, insurance: e.target.value })} placeholder="สูงสุดไม่เกิน 100,000" />
                    </motion.div>
                  )}
                  {activeDeductions.pensionInsurance && activeDeductionCat === 'insurance' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <Input label="เบี้ยประกันชีวิตแบบบำนาญ" value={deductionValues.pensionInsurance} onChange={(e) => setDeductionValues({ ...deductionValues, pensionInsurance: e.target.value })} placeholder="สูงสุดไม่เกิน 200,000" />
                    </motion.div>
                  )}
                  {activeDeductions.thaiESG && activeDeductionCat === 'funds' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <Input label="ยอดเงินลงทุนกองทุน ThaiESG" value={deductionValues.thaiESG} onChange={(e) => setDeductionValues({ ...deductionValues, thaiESG: e.target.value })} placeholder="สูงสุดไม่เกิน 300,000" />
                    </motion.div>
                  )}
                  {activeDeductions.rmfPvd && activeDeductionCat === 'funds' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <Input label="ยอดลงทุนกองทุน RMF / กองทุนสำรองเลี้ยงชีพ" value={deductionValues.rmfPvd} onChange={(e) => setDeductionValues({ ...deductionValues, rmfPvd: e.target.value })} placeholder="สูงสุดไม่เกิน 500,000" />
                    </motion.div>
                  )}
                  {activeDeductions.donationGeneral && activeDeductionCat === 'donation' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <Input label="จำนวนเงินที่บริจาค" value={deductionValues.donationAmount} onChange={(e) => setDeductionValues({ ...deductionValues, donationAmount: e.target.value })} placeholder="ระบบจะคุมเพดานหักลดหย่อนไม่เกิน 10% ให้" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ฝั่งขวา: รายงานแดชบอร์ดสรุปผลบัญชีลอยตามจอ (5 คอลัมน์) */}
          <div className="lg:col-span-5 lg:sticky lg:top-12">
            <div className="bg-gradient-to-b from-[#0F0F12] to-[#070709] border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

              <h3 className="text-lg font-semibold tracking-wide text-zinc-200">Tax Statement</h3>

              <div className="space-y-4 text-sm font-sans">
                <div className="flex justify-between pb-3.5 border-b border-white/5 text-zinc-400">
                  <span>รายได้สะสมพึงประเมินทั้งปี (Gross)</span>
                  <span className="text-white font-medium">฿{taxData.totalAnnualIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pb-3.5 border-b border-white/5 text-zinc-400">
                  <span>หักต้นทุนค่าใช้จ่ายตามมาตรา</span>
                  <span className="text-white font-medium text-red-400/80">- ฿{taxData.totalExpenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pb-3.5 border-b border-white/5 text-zinc-400">
                  <span>หักสิทธิ์รายการลดหย่อนรวม</span>
                  <span className="text-white font-medium text-red-400/80">- ฿{taxData.totalDeductions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pb-3.5 border-b border-white/5 text-zinc-400">
                  <span>เงินได้สุทธิคงเหลือ (Net Taxable)</span>
                  <span className="text-white font-medium">฿{taxData.netIncome.toLocaleString()}</span>
                </div>

                <div className="bg-gradient-to-r from-[#C5A059]/10 to-transparent border border-[#C5A059]/20 rounded-2xl p-5 mt-6 flex justify-between items-center">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-zinc-400 font-medium">ภาษีที่ต้องชำระทั้งหมด</p>
                    <p className="text-xs text-[#C5A059]/70 mt-0.5">Est. Tax Payable</p>
                  </div>
                  <span className="text-3xl font-extrabold text-[#C5A059] tracking-tight drop-shadow-[0_2px_10px_rgba(197,160,89,0.2)]">
                    ฿{taxData.taxPayable.toLocaleString()}
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-zinc-500 leading-relaxed text-center pt-2">
                * สถาปัตยกรรมประมวลผลแยกคำนวณฐานหักค่าใช้จ่ายและกลุ่มเพดานสิทธิ์ลดหย่อนอ้างอิงตามประมวลรัษฎากรกรมสรรพากรไทยปี 2569
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// อัตราก้าวหน้าภาษีเงินได้บุคคลธรรมดาของสรรพากรไทย 8 ขั้นบันได
function calculateThaiTax(net) {
  if (net <= 150000) return 0;
  if (net <= 300000) return (net - 150000) * 0.05;
  if (net <= 500000) return 7500 + (net - 300000) * 0.10;
  if (net <= 750000) return 27500 + (net - 500000) * 0.15;
  if (net <= 1000000) return 65000 + (net - 750000) * 0.20;
  if (net <= 2000000) return 115000 + (net - 1000000) * 0.25;
  if (net <= 5000000) return 365000 + (net - 2000000) * 0.30;
  return 1265000 + (net - 5000000) * 0.35;
}

// แถบแท็บกลุ่มเมนูใหญ่สไตล์แอปเปิ้ลแคปซูล
const CategoryTab = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`py-2 px-1 text-[11px] font-semibold rounded-xl text-center transition-all duration-300 ${
      active
        ? 'bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30 shadow-[0_2px_10px_rgba(197,160,89,0.1)]'
        : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
    }`}
  >
    {label}
  </button>
);

// ปุ่มสวิตช์ย่อยสว่างเมื่อ Active (สไตล์เดิมห้ามเปลี่ยน)
const ToggleButton = ({ label, subtitle, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`group flex flex-col items-start justify-center p-5 rounded-2xl border text-left transition-all duration-300 w-full relative overflow-hidden ${
      active
        ? 'bg-[#C5A059]/10 border-[#C5A059] shadow-[0_0_20px_rgba(197,160,89,0.12)] text-white'
        : 'bg-[#121215] border-white/5 text-zinc-400 hover:border-white/10 hover:bg-[#16161a] hover:text-white'
    }`}
  >
    <span className="text-sm font-semibold tracking-wide">{label}</span>
    <span className={`text-[11px] mt-1 ${active ? 'text-[#C5A059]' : 'text-zinc-500'}`}>{subtitle}</span>
    <span className={`absolute top-3 right-4 w-1.5 h-1.5 rounded-full transition-all duration-300 ${active ? 'bg-[#C5A059] shadow-[0_0_8px_#C5A059]' : 'bg-zinc-700 scale-75'}`} />
  </button>
);

// ช่องกรอกข้อมูลตัวเลขพรีเมียม (สไตล์เดิมห้ามเปลี่ยน)
const Input = ({ label, value, onChange, placeholder }) => (
  <div className="w-full flex flex-col">
    <label className="text-[11px] uppercase tracking-widest text-zinc-400 font-medium mb-2.5">{label}</label>
    <div className="relative">
      <input
        type="number"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-[#121214] border border-white/5 rounded-2xl px-5 py-4 outline-none text-white font-medium focus:border-[#C5A059] focus:bg-black/50 text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      {value && (
        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-500 select-none">
          THB
        </span>
      )}
    </div>
  </div>
);

// ปุ่มสวิตช์เลือกหักเหมาหรือตามจริงแบบมินิมอล
const ExpenseToggle = ({ active, onClick }) => (
  <div className="flex items-center space-x-3 pt-1">
    <button
      type="button"
      onClick={onClick}
      className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${active ? 'bg-[#C5A059]' : 'bg-zinc-800'}`}
    >
      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${active ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
    <span className="text-xs font-medium text-zinc-400">ต้องการแสดงหลักฐานหักค่าใช้จ่ายตามจริง</span>
  </div>
);

export default Tax;