// src/Tax.jsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from './App';
import { translations } from './data/translations';

// ─── UI ATOMIC COMPONENTS (สไตล์ดั้งเดิมระดับลักชัวรีของหน้า Wealth) ───

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

const Input = ({ label, value, onChange, placeholder, suffix = "THB" }) => (
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
          {suffix}
        </span>
      )}
    </div>
  </div>
);

const ExpenseToggle = ({ label, active, onClick }) => (
  <div className="flex items-center space-x-3 pt-1">
    <button
      type="button"
      onClick={onClick}
      className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${active ? 'bg-[#C5A059]' : 'bg-zinc-800'}`}
    >
      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${active ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
    <span className="text-xs font-medium text-zinc-400">{label}</span>
  </div>
);

// ─── Component ขนาดเล็กสำหรับใช้กับการพิมพ์จำลองสิทธิ์ฝั่งขวา (Sandbox) ───
const SandboxInput = ({ label, value, onChange, placeholder, quota }) => (
  <div className="flex flex-col bg-black/30 border border-white/5 p-3 rounded-xl">
    <div className="flex justify-between items-center mb-1.5">
      <span className="text-[10px] uppercase text-zinc-500 tracking-wider font-medium">{label}</span>
      <span className="text-[10px] text-[#C5A059]/80 font-semibold">Max: ฿{Math.round(quota).toLocaleString()}</span>
    </div>
    <div className="relative">
      <input
        type="number"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-[#121214]/60 border border-white/5 rounded-xl px-3 py-1.5 outline-none text-white text-sm focus:border-[#C5A059] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
    </div>
  </div>
);

function Tax() {
  const { lang, toggleLanguage } = useLanguage();
  const t = translations[lang];

  // --- STATE 1: INCOME ARCHITECTURE ---
  const [activeIncomeCat, setActiveIncomeCat] = useState('job');
  const [activeIncomes, setActiveIncomes] = useState({
    salary: false, bonus: false, freelance: false, copyright: false, dividend: false,
    rentBuilding: false, rentAgriLand: false, rentOtherLand: false, rentVehicle: false, rentOtherAsset: false,
    medicalExpert: false, otherExpert: false, contractor: false, actor: false, commerce43: false, commerceOther: false,
  });
  const [incomeValues, setIncomeValues] = useState({
    salary: '', bonus: '', freelance: '', copyright: '', dividend: '',
    rentBuilding: '', rentAgriLand: '', rentOtherLand: '', rentVehicle: '', rentOtherAsset: '',
    medicalExpert: '', otherExpert: '', contractor: '', actor: '', commerce43: '', commerceOther: ''
  });
  const [useActualExpenses, setUseActualExpenses] = useState({
    copyright: false, rentBuilding: false, rentAgriLand: false, rentOtherLand: false, rentVehicle: false,
    rentOtherAsset: false, medicalExpert: false, otherExpert: false, contractor: false, commerce43: false
  });
  const [actualExpenseValues, setActualExpenseValues] = useState({
    copyright: '', rentBuilding: '', rentAgriLand: '', rentOtherLand: '', rentVehicle: '', rentOtherAsset: '',
    medicalExpert: '', otherExpert: '', contractor: '', commerce43: '', commerceOther: ''
  });

  // --- STATE 2: DEDUCTION ARCHITECTURE (ตัดสิทธิ์ SSF ออกถาวร) ---
  const [activeDeductionCat, setActiveDeductionCat] = useState('personal');
  const [activeDeductions, setActiveDeductions] = useState({
    spouse: false, childrenOld: false, childrenNew: false, fosterChild: false, parentsCare: false, disabledCare: false, maternity: false,
    lifeInsurance: false, healthOwn: false, healthParents: false,
    socialSecurity: false, pvdGbk: false, nsf: false, pensionInsurance: false, rmf: false, thaiESG: false,
    homeLoanInterest: false, easyReceipt: false, localTravel: false,
    donationEdu: false, donationGeneral: false, donationPolitical: false
  });

  const [deductionValues, setDeductionValues] = useState({
    childrenOldCount: '', childrenNewCount: '', fosterChildCount: '', parentsCount: '', disabledCount: '', maternityAmount: '',
    lifeInsuranceAmount: '', healthOwnAmount: '', healthParentsAmount: '',
    socialSecurityAmount: '', pvdGbkAmount: '', nsfAmount: '', pensionAmount: '', rmfAmount: '', thaiESGAmount: '',
    homeLoanAmount: '', easyReceiptGeneralAmount: '', easyReceiptOtopAmount: '', localTravelAmount: '',
    donationEduAmount: '', donationGeneralAmount: '', donationPoliticalAmount: ''
  });

  // ─── 🌟 STATE 3: SANDBOX SIMULATOR VALUE INPUTS (NO SLIDER) ───
  const [simLifeIns, setSimLifeIns] = useState('');
  const [simPension, setSimPension] = useState('');
  const [simRmf, setSimRmf] = useState('');
  const [simThaiEsg, setSimThaiEsg] = useState('');

  // Structural Cleanups
  const toggleIncome = (key) => {
    setActiveIncomes(prev => ({ ...prev, [key]: !prev[key] }));
    if (activeIncomes[key]) {
      setIncomeValues(prev => ({ ...prev, [key]: '' }));
      if (key in useActualExpenses) setUseActualExpenses(prev => ({ ...prev, [key]: false }));
      if (key in actualExpenseValues) setActualExpenseValues(prev => ({ ...prev, [key]: '' }));
    }
  };

  const toggleDeduction = (key) => {
    setActiveDeductions(prev => ({ ...prev, [key]: !prev[key] }));
    if (activeDeductions[key]) {
      if (key === 'easyReceipt') {
        setDeductionValues(prev => ({ ...prev, easyReceiptGeneralAmount: '', easyReceiptOtopAmount: '' }));
      } else {
        setDeductionValues(prev => ({ ...prev, [key + 'Amount']: '' }));
      }
    }
  };

  // ─── REUSABLE PROGRESSIVE TAX CALCULATOR ───
  const runTaxBracketCalculations = (netIncome) => {
    let taxPayable = 0;
    if (netIncome > 150000) {
      if (netIncome <= 300000) taxPayable = (netIncome - 150000) * 0.05;
      else if (netIncome <= 500000) taxPayable = 7500 + (netIncome - 300000) * 0.10;
      else if (netIncome <= 750000) taxPayable = 27500 + (netIncome - 500000) * 0.15;
      else if (netIncome <= 1000000) taxPayable = 65000 + (netIncome - 750000) * 0.20;
      else if (netIncome <= 2000000) taxPayable = 115000 + (netIncome - 1000000) * 0.25;
      else if (netIncome <= 5000000) taxPayable = 365000 + (netIncome - 2000000) * 0.30;
      else taxPayable = 1265000 + (netIncome - 5000000) * 0.35;
    }
    return taxPayable;
  };

  // --- PIPELINE TAX ENGINE ---
  const taxData = useMemo(() => {
    const vSalary = activeIncomes.salary ? Number(incomeValues.salary) * 12 : 0;
    const vBonus = activeIncomes.bonus ? Number(incomeValues.bonus) : 0;
    const vFreelance = activeIncomes.freelance ? Number(incomeValues.freelance) : 0;
    const vCopyright = activeIncomes.copyright ? Number(incomeValues.copyright) : 0;
    const vDividend = activeIncomes.dividend ? Number(incomeValues.dividend) : 0;
    const vRentBuild = activeIncomes.rentBuilding ? Number(incomeValues.rentBuilding) : 0;
    const vRentAgri = activeIncomes.rentAgriLand ? Number(incomeValues.rentAgriLand) : 0;
    const vRentOtherLand = activeIncomes.rentOtherLand ? Number(incomeValues.rentOtherLand) : 0;
    const vRentVehicle = activeIncomes.rentVehicle ? Number(incomeValues.rentVehicle) : 0;
    const vRentOtherAsset = activeIncomes.rentOtherAsset ? Number(incomeValues.rentOtherAsset) : 0;
    const vMedExpert = activeIncomes.medicalExpert ? Number(incomeValues.medicalExpert) : 0;
    const vOthExpert = activeIncomes.otherExpert ? Number(incomeValues.otherExpert) : 0;
    const vContractor = activeIncomes.contractor ? Number(incomeValues.contractor) : 0;
    const vActor = activeIncomes.actor ? Number(incomeValues.actor) : 0;
    const vCommerce43 = activeIncomes.commerce43 ? Number(incomeValues.commerce43) : 0;
    const vCommerceOther = activeIncomes.commerceOther ? Number(incomeValues.commerceOther) : 0;

    const totalAnnualIncome = vSalary + vBonus + vFreelance + vCopyright + vDividend + vRentBuild + vRentAgri + vRentOtherLand + vRentVehicle + vRentOtherAsset + vMedExpert + vOthExpert + vContractor + vActor + vCommerce43 + vCommerceOther;

    // หักค่าใช้จ่ายตามจริงเดี่ยวพึงประเมิน
    const expType12 = Math.min((vSalary + vBonus + vFreelance) * 0.5, 100000);
    const expCopyright = activeIncomes.copyright ? (useActualExpenses.copyright ? Math.min(Number(actualExpenseValues.copyright), vCopyright) : Math.min(vCopyright * 0.5, 100000)) : 0;
    const expRentBuild = activeIncomes.rentBuilding ? (useActualExpenses.rentBuilding ? Math.min(Number(actualExpenseValues.rentBuilding), vRentBuild) : vRentBuild * 0.30) : 0;
    const expRentAgri = activeIncomes.rentAgriLand ? (useActualExpenses.rentAgriLand ? Math.min(Number(actualExpenseValues.rentAgriLand), vRentAgri) : vRentAgri * 0.20) : 0;
    const expRentOtherLand = activeIncomes.rentOtherLand ? (useActualExpenses.rentOtherLand ? Math.min(Number(actualExpenseValues.rentOtherLand), vRentOtherLand) : vRentOtherLand * 0.15) : 0;
    const expRentVehicle = activeIncomes.rentVehicle ? (useActualExpenses.rentVehicle ? Math.min(Number(actualExpenseValues.rentVehicle), vRentVehicle) : vRentVehicle * 0.30) : 0;
    const expRentOtherAsset = activeIncomes.rentOtherAsset ? (useActualExpenses.rentOtherAsset ? Math.min(Number(actualExpenseValues.rentOtherAsset), vRentOtherAsset) : vRentOtherAsset * 0.10) : 0;
    const expMed = activeIncomes.medicalExpert ? (useActualExpenses.medicalExpert ? Math.min(Number(actualExpenseValues.medicalExpert), vMedExpert) : vMedExpert * 0.60) : 0;
    const expOth = activeIncomes.otherExpert ? (useActualExpenses.otherExpert ? Math.min(Number(actualExpenseValues.otherExpert), vOthExpert) : vOthExpert * 0.30) : 0;
    const expContractor = activeIncomes.contractor ? (useActualExpenses.contractor ? Math.min(Number(actualExpenseValues.contractor), vContractor) : vContractor * 0.60) : 0;
    let expActor = activeIncomes.actor ? (vActor <= 300000 ? vActor * 0.60 : 180000 + (vActor - 300000) * 0.40) : 0;
    if (activeIncomes.actor) expActor = Math.min(expActor, 600000);
    const expCommerce43 = activeIncomes.commerce43 ? (useActualExpenses.commerce43 ? Math.min(Number(actualExpenseValues.commerce43), vCommerce43) : vCommerce43 * 0.60) : 0;
    const expCommerceOther = activeIncomes.commerceOther ? Math.min(Number(actualExpenseValues.commerceOther), vCommerceOther) : 0;

    const totalExpenses = expType12 + expCopyright + expRentBuild + expRentAgri + expRentOtherLand + expRentVehicle + expRentOtherAsset + expMed + expOth + expContractor + expActor + expCommerce43 + expCommerceOther;

    // Group 1: Personal
    const dPersonal = 60000;
    const dSpouse = activeDeductions.spouse ? 60000 : 0;
    const dChildOld = activeDeductions.childrenOld ? Number(deductionValues.childrenOldCount) * 30000 : 0;
    const dChildNew = activeDeductions.childrenNew ? Number(deductionValues.childrenNewCount) * 60000 : 0;
    const dFosterChild = activeDeductions.fosterChild ? Math.min(Number(deductionValues.fosterChildCount), 3) * 30000 : 0;
    const dParents = activeDeductions.parentsCare ? Number(deductionValues.parentsCount) * 30000 : 0;
    const dDisabled = activeDeductions.disabledCare ? Number(deductionValues.disabledCount) * 60000 : 0;
    const dMaternity = activeDeductions.maternity ? Math.min(Number(deductionValues.maternityAmount), 60000) : 0;
    const totalGroup1 = dPersonal + dSpouse + dChildOld + dChildNew + dFosterChild + dParents + dDisabled + dMaternity;

    // Group 2: Insurance
    const vLifeIns = activeDeductions.lifeInsurance ? Number(deductionValues.lifeInsuranceAmount) : 0;
    const vHealthOwn = activeDeductions.healthOwn ? Number(deductionValues.healthOwnAmount) : 0;
    const safeHealthOwn = Math.min(vHealthOwn, 25000);
    const totalLifeAndHealthOwn = Math.min(vLifeIns + safeHealthOwn, 100000);
    const dHealthParents = activeDeductions.healthParents ? Math.min(Number(deductionValues.healthParentsAmount), 15000) : 0;
    const totalGroup2 = totalLifeAndHealthOwn + dHealthParents;

    // Group 3: Retirement (ตัด SSF ออกอย่างสมบูรณ์)
    const maxRetirementCap = 500000;
    const limit30Percent = totalAnnualIncome * 0.30;
    const limit15Percent = totalAnnualIncome * 0.15;

    const dSocial = activeDeductions.socialSecurity ? Math.min(Number(deductionValues.socialSecurityAmount), 9000) : 0;
    const vPvdGbk = activeDeductions.pvdGbk ? Math.min(Number(deductionValues.pvdGbkAmount), totalAnnualIncome * 0.15, maxRetirementCap) : 0;
    const vNsf = activeDeductions.nsf ? Math.min(Number(deductionValues.nsfAmount), 30000) : 0;
    const vPension = activeDeductions.pensionInsurance ? Math.min(Number(deductionValues.pensionAmount), limit15Percent, 200000) : 0;
    const vRmf = activeDeductions.rmf ? Math.min(Number(deductionValues.rmfAmount), limit30Percent, maxRetirementCap) : 0;
    
    const retirementPoolSum = Math.min(vPvdGbk + vNsf + vPension + vRmf, maxRetirementCap);
    const dThaiESG = activeDeductions.thaiESG ? Math.min(Number(deductionValues.thaiESGAmount), limit30Percent, 300000) : 0;
    const totalGroup3 = dSocial + retirementPoolSum + dThaiESG;

    // Group 4: Property/Gov Measures
    const dHome = activeDeductions.homeLoanInterest ? Math.min(Number(deductionValues.homeLoanAmount), 100000) : 0;
    const safeEasyGeneral = Math.min(Number(deductionValues.easyReceiptGeneralAmount) || 0, 30000);
    const safeEasyOtop = Math.min(Number(deductionValues.easyReceiptOtopAmount) || 0, 20000);
    const dEasyReceipt = activeDeductions.easyReceipt ? (safeEasyGeneral + safeEasyOtop) : 0;
    const dTravel = activeDeductions.localTravel ? Math.min(Number(deductionValues.localTravelAmount), 30000) : 0;
    const totalGroup4 = dHome + dEasyReceipt + dTravel;

    const baseDeductionsSum = totalGroup1 + totalGroup2 + totalGroup3 + totalGroup4;
    const incomeBeforeDonations = Math.max(0, totalAnnualIncome - totalExpenses - baseDeductionsSum);

    // Group 5: Donations
    const vDonationEdu = activeDeductions.donationEdu ? (Number(deductionValues.donationEduAmount) * 2) : 0;
    const safeDonationEdu = Math.min(vDonationEdu, incomeBeforeDonations * 0.10);
    const remIncomeAfterEdu = incomeBeforeDonations - safeDonationEdu;
    const vDonationGen = activeDeductions.donationGeneral ? Number(deductionValues.donationGeneralAmount) : 0;
    const safeDonationGen = Math.min(vDonationGen, remIncomeAfterEdu * 0.10);
    const dPolitical = activeDeductions.donationPolitical ? Math.min(Number(deductionValues.donationPoliticalAmount), 10000) : 0;

    const totalGroup5 = safeDonationEdu + safeDonationGen + dPolitical;
    const totalDeductions = baseDeductionsSum + totalGroup5;

    const netIncome = Math.max(0, incomeBeforeDonations - safeDonationEdu - safeDonationGen - dPolitical);
    const taxPayable = runTaxBracketCalculations(netIncome);

    // ─── 📊 ALGORITHM: คำนวณหาเพดานโควตาสิทธิ์คงเหลือรายหมวด (IC Complex 2 Logic - คุมเข้มกลุ่มเกษียณ 5 แสน) ───
    let insuranceQuotaRemaining = 0;
    let pensionQuotaRemaining = 0;
    let rmfQuotaRemaining = 0;
    let esgQuotaRemaining = 0;
    let currentPoolUsed = 0;

    if (totalAnnualIncome > 0) {
      // 1. โควตาประกันชีวิตทั่วไป (สูงสุด 100,000 หักลบยอดรวมชีวิตและสุขภาพที่ใช้ไปแล้ว)
      insuranceQuotaRemaining = Math.max(0, 100000 - totalLifeAndHealthOwn);

      // ตรวจเช็กข้อจำกัด Pool วงเงินเกษียณรวมของฝั่งซ้าย (PVD + NSF + บำนาญ + RMF ห้ามเกิน 500,000)
      currentPoolUsed = vPvdGbk + vNsf + vPension + vRmf;
      const poolRemainingRoom = Math.max(0, maxRetirementCap - currentPoolUsed);

      // 2. โควตาประกันบำนาญเดี่ยว (สูงสุด 15% ของรายได้ ไม่เกิน 200,000 และต้องไม่เกิน Pool ห้องว่างรวม)
      const maxPensionAllowed = Math.min(limit15Percent, 200000);
      const individualPensionRoom = Math.max(0, maxPensionAllowed - vPension);
      pensionQuotaRemaining = Math.min(individualPensionRoom, poolRemainingRoom);

      // 3. โควตา RMF เดี่ยว (สูงสุด 30% ของรายได้ ไม่เกิน 500,000 และต้องไม่เกิน Pool ห้องว่างรวม)
      const maxRmfAllowed = Math.min(limit30Percent, 500000);
      const individualRmfRoom = Math.max(0, maxRmfAllowed - vRmf);
      rmfQuotaRemaining = Math.min(individualRmfRoom, poolRemainingRoom);

      // 4. โควตา ThaiESG แยกอิสระนอก Pool เกษียณ (สูงสุด 30% ไม่เกิน 300,000)
      const maxEsgAllowed = Math.min(limit30Percent, 300000);
      esgQuotaRemaining = Math.max(0, maxEsgAllowed - dThaiESG);
    }

    const currentPoolUsedForCalc = vPvdGbk + vNsf + vPension + vRmf;
    const poolRemainingRoomForCalc = Math.max(0, maxRetirementCap - currentPoolUsedForCalc);

    // ─── 🌟 CALCULATION: ประมวลผลเงินจำลองที่ผู้ใช้พิมพ์กรอกเข้ามา (Sandbox Simulation Capping) ───
    const inputSimLife = Math.min(Number(simLifeIns) || 0, insuranceQuotaRemaining);
    const inputSimPension = Math.min(Number(simPension) || 0, pensionQuotaRemaining);
    const inputSimRmf = Math.min(Number(simRmf) || 0, rmfQuotaRemaining);
    const inputSimEsg = Math.min(Number(simThaiEsg) || 0, esgQuotaRemaining);

    // ดักจับข้ามช่องอินพุต (Cross-Input Validation) ร่วมกันภายใต้โควตากลุ่มเกษียณสะสมที่ยังเหลือรวม 5 แสนบ.
    let finalSimPension = inputSimPension;
    let finalSimRmf = inputSimRmf;
    if (finalSimPension + finalSimRmf > poolRemainingRoomForCalc) {
      const totalSimPool = finalSimPension + finalSimRmf;
      finalSimPension = (inputSimPension / totalSimPool) * poolRemainingRoomForCalc;
      finalSimRmf = (inputSimRmf / totalSimPool) * poolRemainingRoomForCalc;
    }

    const totalSimDeductionsAdded = inputSimLife + finalSimPension + finalSimRmf + inputSimEsg;

    // ประมวลผลเงินได้สุทธิจำลองและสิทธิ์บริจาคใหม่หลังหักเงินลงทุนจำลองออก
    const simIncomeBeforeDonations = Math.max(0, incomeBeforeDonations - totalSimDeductionsAdded);
    const safeSimDonationEdu = Math.min(vDonationEdu, simIncomeBeforeDonations * 0.10);
    const remSimIncomeAfterEdu = simIncomeBeforeDonations - safeSimDonationEdu;
    const safeSimDonationGen = Math.min(vDonationGen, remSimIncomeAfterEdu * 0.10);

    const simulatedNetIncome = Math.max(0, simIncomeBeforeDonations - safeSimDonationEdu - safeSimDonationGen - dPolitical);
    const simulatedTaxPayable = runTaxBracketCalculations(simulatedNetIncome);
    const potentialTaxSaved = Math.max(0, taxPayable - simulatedTaxPayable);

    return { 
      totalAnnualIncome, 
      totalExpenses, 
      totalDeductions, 
      netIncome, 
      taxPayable,
      insuranceQuotaRemaining,
      pensionQuotaRemaining,
      rmfQuotaRemaining,
      esgQuotaRemaining,
      simulatedTaxPayable,
      potentialTaxSaved
    };
  }, [incomeValues, activeIncomes, deductionValues, activeDeductions, useActualExpenses, actualExpenseValues, simLifeIns, simPension, simRmf, simThaiEsg]);

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans antialiased selection:bg-[#C5A059]/30 relative overflow-hidden">
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#C5A059] opacity-[0.04] blur-[120px] rounded-full pointer-events-none"></div>

      {/* Header Bar Panel */}
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
            {t.backBtn}
          </Link>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="max-w-7xl mx-auto pb-24 px-6 md:px-12 pt-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 border-b border-white/5 pb-8">
          <span className="text-xs uppercase tracking-widest text-[#C5A059] font-medium mb-2 block">{t.taxNav}</span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            {t.taxTitle}
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ฝั่งซ้ายแผงฟอร์มกรอกข้อมูล */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. SOURCES OF INCOME CONTAINER BLOCK */}
            <div className="bg-[#0A0A0C] border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-md">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-1.5 h-6 bg-[#C5A059] rounded-full" />
                <h2 className="text-lg font-medium text-white tracking-wide">{t.incomeTitle}</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 p-1.5 bg-[#121215] rounded-2xl border border-white/5">
                <CategoryTab label={t.incomeTab1} active={activeIncomeCat === 'job'} onClick={() => setActiveIncomeCat('job')} />
                <CategoryTab label={t.incomeTab2} active={activeIncomeCat === 'invest'} onClick={() => setActiveIncomeCat('invest')} />
                <CategoryTab label={t.incomeTab3} active={activeIncomeCat === 'rent'} onClick={() => setActiveIncomeCat('rent')} />
                <CategoryTab label={t.incomeTab4} active={activeIncomeCat === 'expert'} onClick={() => setActiveIncomeCat('expert')} />
                <CategoryTab label={t.incomeTab5} active={activeIncomeCat === 'business'} onClick={() => setActiveIncomeCat('business')} />
              </div>

              <div className="pt-4 border-t border-white/5">
                <AnimatePresence mode="wait">
                  {activeIncomeCat === 'job' && (
                    <motion.div key="job" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ToggleButton label={t.salaryLabel} subtitle={t.salarySub} active={activeIncomes.salary} onClick={() => toggleIncome('salary')} />
                      <ToggleButton label={t.taxBonus} subtitle={t.bonusSub} active={activeIncomes.bonus} onClick={() => toggleIncome('bonus')} />
                      <ToggleButton label={t.freelanceLabel} subtitle={t.freelanceSub} active={activeIncomes.freelance} onClick={() => toggleIncome('freelance')} />
                      <ToggleButton label={t.copyrightLabel} subtitle={t.copyrightSub} active={activeIncomes.copyright} onClick={() => toggleIncome('copyright')} />
                    </motion.div>
                  )}
                  {activeIncomeCat === 'invest' && (
                    <motion.div key="invest" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 gap-4">
                      <ToggleButton label={t.dividendLabel} subtitle={t.dividendSub} active={activeIncomes.dividend} onClick={() => toggleIncome('dividend')} />
                    </motion.div>
                  )}
                  {activeIncomeCat === 'rent' && (
                    <motion.div key="rent" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ToggleButton label={t.rentBuild} subtitle={t.rentBuildSub} active={activeIncomes.rentBuilding} onClick={() => toggleIncome('rentBuilding')} />
                      <ToggleButton label={t.rentAgri} subtitle={t.rentAgriSub} active={activeIncomes.rentAgriLand} onClick={() => toggleIncome('rentAgriLand')} />
                      <ToggleButton label={t.rentOtherLand} subtitle={t.rentOtherLandSub} active={activeIncomes.rentOtherLand} onClick={() => toggleIncome('rentOtherLand')} />
                      <ToggleButton label={t.rentVehicle} subtitle={t.rentVehicleSub} active={activeIncomes.rentVehicle} onClick={() => toggleIncome('rentVehicle')} />
                      <ToggleButton label={t.rentOtherAsset} subtitle={t.rentOtherAssetSub} active={activeIncomes.rentOtherAsset} onClick={() => toggleIncome('rentOtherAsset')} />
                    </motion.div>
                  )}
                  {activeIncomeCat === 'expert' && (
                    <motion.div key="expert" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ToggleButton label={t.medExpert} subtitle={t.medExpertSub} active={activeIncomes.medicalExpert} onClick={() => toggleIncome('medicalExpert')} />
                      <ToggleButton label={t.othExpert} subtitle={t.othExpertSub} active={activeIncomes.otherExpert} onClick={() => toggleIncome('otherExpert')} />
                    </motion.div>
                  )}
                  {activeIncomeCat === 'business' && (
                    <motion.div key="business" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ToggleButton label={t.contractor} subtitle={t.contractorSub} active={activeIncomes.contractor} onClick={() => toggleIncome('contractor')} />
                      <ToggleButton label={t.actor} subtitle={t.actorSub} active={activeIncomes.actor} onClick={() => toggleIncome('actor')} />
                      <ToggleButton label={t.commerce43} subtitle={t.commerce43Sub} active={activeIncomes.commerce43} onClick={() => toggleIncome('commerce43')} />
                      <ToggleButton label={t.commerceOther} subtitle={t.commerceOtherSub} active={activeIncomes.commerceOther} onClick={() => toggleIncome('commerceOther')} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* อนิเมชันซ่อนและขยายช่องข้อมูลฝั่งรายได้ตามเงื่อนไข */}
              <AnimatePresence>
                {Object.values(activeIncomes).some(Boolean) && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 pt-4 border-t border-white/5 overflow-hidden"
                  >
                    {activeIncomes.salary && activeIncomeCat === 'job' && <Input label={t.inputSalaryLabel} value={incomeValues.salary} onChange={(e) => setIncomeValues({ ...incomeValues, salary: e.target.value })} placeholder="0" />}
                    {activeIncomes.bonus && activeIncomeCat === 'job' && <Input label={t.inputBonusLabel} value={incomeValues.bonus} onChange={(e) => setIncomeValues({ ...incomeValues, bonus: e.target.value })} placeholder="0" />}
                    {activeIncomes.freelance && activeIncomeCat === 'job' && <Input label={t.inputFreelanceLabel} value={incomeValues.freelance} onChange={(e) => setIncomeValues({ ...incomeValues, freelance: e.target.value })} placeholder="0" />}
                    {activeIncomes.copyright && activeIncomeCat === 'job' && (
                      <div className="space-y-3 bg-zinc-900/20 p-4 rounded-2xl border border-white/5">
                        <Input label={t.inputCopyrightLabel} value={incomeValues.copyright} onChange={(e) => setIncomeValues({ ...incomeValues, copyright: e.target.value })} placeholder="0" />
                        <ExpenseToggle label={t.btnActual} active={useActualExpenses.copyright} onClick={() => setUseActualExpenses({...useActualExpenses, copyright: !useActualExpenses.copyright})} />
                        {useActualExpenses.copyright && <Input label={t.actualInput} value={actualExpenseValues.copyright} onChange={(e) => setActualExpenseValues({...actualExpenseValues, copyright: e.target.value})} placeholder="0" />}
                      </div>
                    )}
                    {activeIncomes.dividend && activeIncomeCat === 'invest' && <Input label={t.inputDividendLabel} value={incomeValues.dividend} onChange={(e) => setIncomeValues({ ...incomeValues, dividend: e.target.value })} placeholder="0" />}
                    {activeIncomes.rentBuilding && activeIncomeCat === 'rent' && (
                      <div className="space-y-3 bg-zinc-900/20 p-4 rounded-2xl border border-white/5">
                        <Input label={t.inputRentBuild} value={incomeValues.rentBuilding} onChange={(e) => setIncomeValues({ ...incomeValues, rentBuilding: e.target.value })} placeholder="0" />
                        <ExpenseToggle label={t.btnActual} active={useActualExpenses.rentBuilding} onClick={() => setUseActualExpenses({...useActualExpenses, rentBuilding: !useActualExpenses.rentBuilding})} />
                        {useActualExpenses.rentBuilding && <Input label={t.actualRentBuild} value={actualExpenseValues.rentBuilding} onChange={(e) => setActualExpenseValues({...actualExpenseValues, rentBuilding: e.target.value})} placeholder="0" />}
                      </div>
                    )}
                    {activeIncomes.rentAgriLand && activeIncomeCat === 'rent' && (
                      <div className="space-y-3 bg-zinc-900/20 p-4 rounded-2xl border border-white/5">
                        <Input label={t.inputRentAgri} value={incomeValues.rentAgriLand} onChange={(e) => setIncomeValues({ ...incomeValues, rentAgriLand: e.target.value })} placeholder="0" />
                        <ExpenseToggle label={t.btnActual} active={useActualExpenses.rentAgriLand} onClick={() => setUseActualExpenses({...useActualExpenses, rentAgriLand: !useActualExpenses.rentAgriLand})} />
                        {useActualExpenses.rentAgriLand && <Input label={t.actualRentAgri} value={actualExpenseValues.rentAgriLand} onChange={(e) => setActualExpenseValues({...actualExpenseValues, rentAgriLand: e.target.value})} placeholder="0" />}
                      </div>
                    )}
                    {activeIncomes.rentOtherLand && activeIncomeCat === 'rent' && (
                      <div className="space-y-3 bg-zinc-900/20 p-4 rounded-2xl border border-white/5">
                        <Input label={t.inputRentOtherLand} value={incomeValues.rentOtherLand} onChange={(e) => setIncomeValues({ ...incomeValues, rentOtherLand: e.target.value })} placeholder="0" />
                        <ExpenseToggle label={t.btnActual} active={useActualExpenses.rentOtherLand} onClick={() => setUseActualExpenses({...useActualExpenses, rentOtherLand: !useActualExpenses.rentOtherLand})} />
                        {useActualExpenses.rentOtherLand && <Input label={t.actualRentOtherLand} value={actualExpenseValues.rentOtherLand} onChange={(e) => setActualExpenseValues({...actualExpenseValues, rentOtherLand: e.target.value})} placeholder="0" />}
                      </div>
                    )}
                    {activeIncomes.rentVehicle && activeIncomeCat === 'rent' && (
                      <div className="space-y-3 bg-zinc-900/20 p-4 rounded-2xl border border-white/5">
                        <Input label={t.inputRentVehicle} value={incomeValues.rentVehicle} onChange={(e) => setIncomeValues({ ...incomeValues, rentVehicle: e.target.value })} placeholder="0" />
                        <ExpenseToggle label={t.btnActual} active={useActualExpenses.rentVehicle} onClick={() => setUseActualExpenses({...useActualExpenses, rentVehicle: !useActualExpenses.rentVehicle})} />
                        {useActualExpenses.rentVehicle && <Input label={t.actualRentVehicle} value={actualExpenseValues.rentVehicle} onChange={(e) => setActualExpenseValues({...actualExpenseValues, rentVehicle: e.target.value})} placeholder="0" />}
                      </div>
                    )}
                    {activeIncomes.rentOtherAsset && activeIncomeCat === 'rent' && (
                      <div className="space-y-3 bg-zinc-900/20 p-4 rounded-2xl border border-white/5">
                        <Input label={t.inputRentOtherAsset} value={incomeValues.rentOtherAsset} onChange={(e) => setIncomeValues({ ...incomeValues, rentOtherAsset: e.target.value })} placeholder="0" />
                        <ExpenseToggle label={t.btnActual} active={useActualExpenses.rentOtherAsset} onClick={() => setUseActualExpenses({...useActualExpenses, rentOtherAsset: !useActualExpenses.rentOtherAsset})} />
                        {useActualExpenses.rentOtherAsset && <Input label={t.actualRentOtherAsset} value={actualExpenseValues.rentOtherAsset} onChange={(e) => setActualExpenseValues({...actualExpenseValues, rentOtherAsset: e.target.value})} placeholder="0" />}
                      </div>
                    )}
                    {activeIncomes.medicalExpert && activeIncomeCat === 'expert' && (
                      <div className="space-y-3 bg-zinc-900/20 p-4 rounded-2xl border border-white/5">
                        <Input label={t.inputMed} value={incomeValues.medicalExpert} onChange={(e) => setIncomeValues({ ...incomeValues, medicalExpert: e.target.value })} placeholder="0" />
                        <ExpenseToggle label={t.btnActual} active={useActualExpenses.medicalExpert} onClick={() => setUseActualExpenses({...useActualExpenses, medicalExpert: !useActualExpenses.medicalExpert})} />
                        {useActualExpenses.medicalExpert && <Input label={t.actualMed} value={actualExpenseValues.medicalExpert} onChange={(e) => setActualExpenseValues({...actualExpenseValues, medicalExpert: e.target.value})} placeholder="0" />}
                      </div>
                    )}
                    {activeIncomes.otherExpert && activeIncomeCat === 'expert' && (
                      <div className="space-y-3 bg-zinc-900/20 p-4 rounded-2xl border border-white/5">
                        <Input label={t.inputOthExpert} value={incomeValues.otherExpert} onChange={(e) => setIncomeValues({ ...incomeValues, otherExpert: e.target.value })} placeholder="0" />
                        <ExpenseToggle label={t.btnActual} active={useActualExpenses.otherExpert} onClick={() => setUseActualExpenses({...useActualExpenses, otherExpert: !useActualExpenses.otherExpert})} />
                        {useActualExpenses.otherExpert && <Input label={t.actualOthExpert} value={actualExpenseValues.otherExpert} onChange={(e) => setActualExpenseValues({...actualExpenseValues, otherExpert: e.target.value})} placeholder="0" />}
                      </div>
                    )}
                    {activeIncomes.contractor && activeIncomeCat === 'business' && (
                      <div className="space-y-3 bg-zinc-900/20 p-4 rounded-2xl border border-white/5">
                        <Input label={t.inputContractor} value={incomeValues.contractor} onChange={(e) => setIncomeValues({ ...incomeValues, contractor: e.target.value })} placeholder="0" />
                        <ExpenseToggle label={t.btnActual} active={useActualExpenses.contractor} onClick={() => setUseActualExpenses({...useActualExpenses, contractor: !useActualExpenses.contractor})} />
                        {useActualExpenses.contractor && <Input label={t.actualContractor} value={actualExpenseValues.contractor} onChange={(e) => setActualExpenseValues({...actualExpenseValues, contractor: e.target.value})} placeholder="0" />}
                      </div>
                    )}
                    {activeIncomes.actor && activeIncomeCat === 'business' && <Input label={t.inputActor} value={incomeValues.actor} onChange={(e) => setIncomeValues({ ...incomeValues, actor: e.target.value })} placeholder="0" />}
                    {activeIncomes.commerce43 && activeIncomeCat === 'business' && (
                      <div className="space-y-3 bg-zinc-900/20 p-4 rounded-2xl border border-white/5">
                        <Input label={t.inputCommerce43} value={incomeValues.commerce43} onChange={(e) => setIncomeValues({ ...incomeValues, commerce43: e.target.value })} placeholder="0" />
                        <ExpenseToggle label={t.btnActual} active={useActualExpenses.commerce43} onClick={() => setUseActualExpenses({...useActualExpenses, commerce43: !useActualExpenses.commerce43})} />
                        {useActualExpenses.commerce43 && <Input label={t.actualCommerce43} value={actualExpenseValues.commerce43} onChange={(e) => setActualExpenseValues({...actualExpenseValues, commerce43: e.target.value})} placeholder="0" />}
                      </div>
                    )}
                    {activeIncomes.commerceOther && activeIncomeCat === 'business' && (
                      <div className="space-y-3 bg-zinc-900/20 p-4 rounded-2xl border border-white/5">
                        <Input label={t.inputCommerceOther} value={incomeValues.commerceOther} onChange={(e) => setIncomeValues({ ...incomeValues, commerceOther: e.target.value })} placeholder="0" />
                        <Input label={t.actualCommerceOther} value={actualExpenseValues.commerceOther} onChange={(e) => setActualExpenseValues({...actualExpenseValues, commerceOther: e.target.value})} placeholder="0" />
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. TAX DEDUCTIONS ARCHITECTURE BLOCK */}
            <div className="bg-[#0A0A0C] border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-md">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-1.5 h-6 bg-[#C5A059] rounded-full" />
                <h2 className="text-lg font-medium text-white tracking-wide">{t.deductTitle}</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 p-1.5 bg-[#121215] rounded-2xl border border-white/5">
                <CategoryTab label={t.deductTab1} active={activeDeductionCat === 'personal'} onClick={() => setActiveDeductionCat('personal')} />
                <CategoryTab label={t.deductTab2} active={activeDeductionCat === 'insurance'} onClick={() => setActiveDeductionCat('insurance')} />
                <CategoryTab label={t.deductTab3} active={activeDeductionCat === 'retirement'} onClick={() => setActiveDeductionCat('retirement')} />
                <CategoryTab label={t.deductTab4} active={activeDeductionCat === 'economy'} onClick={() => setActiveDeductionCat('economy')} />
                <CategoryTab label={t.deductTab5} active={activeDeductionCat === 'donation'} onClick={() => setActiveDeductionCat('donation')} />
              </div>

              <div className="pt-4 border-t border-white/5">
                <AnimatePresence mode="wait">
                  {activeDeductionCat === 'personal' && (
                    <motion.div key="personal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ToggleButton label={t.spouseLabel} subtitle={t.spouseSub} active={activeDeductions.spouse} onClick={() => toggleDeduction('spouse')} />
                      <ToggleButton label={t.childOldLabel} subtitle={t.childOldSub} active={activeDeductions.childrenOld} onClick={() => toggleDeduction('childrenOld')} />
                      <ToggleButton label={t.childNewLabel} subtitle={t.childNewSub} active={activeDeductions.childrenNew} onClick={() => toggleDeduction('childrenNew')} />
                      <ToggleButton label={t.fosterChildLabel} subtitle={t.fosterChildSub} active={activeDeductions.fosterChild} onClick={() => toggleDeduction('fosterChild')} />
                      <ToggleButton label={t.parentsCareLabel} subtitle={t.parentsCareSub} active={activeDeductions.parentsCare} onClick={() => toggleDeduction('parentsCare')} />
                      <ToggleButton label={t.disabledCareLabel} subtitle={t.disabledCareSub} active={activeDeductions.disabledCare} onClick={() => toggleDeduction('disabledCare')} />
                      <ToggleButton label={t.maternityLabel} subtitle={t.maternitySub} active={activeDeductions.maternity} onClick={() => toggleDeduction('maternity')} />
                    </motion.div>
                  )}
                  {activeDeductionCat === 'insurance' && (
                    <motion.div key="insurance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ToggleButton label={t.lifeInsLabel} subtitle={t.lifeInsSub} active={activeDeductions.lifeInsurance} onClick={() => toggleDeduction('lifeInsurance')} />
                      <ToggleButton label={t.healthOwnLabel} subtitle={t.healthOwnSub} active={activeDeductions.healthOwn} onClick={() => toggleDeduction('healthOwn')} />
                      <ToggleButton label={t.healthParentsLabel} subtitle={t.healthParentsSub} active={activeDeductions.healthParents} onClick={() => toggleDeduction('healthParents')} />
                    </motion.div>
                  )}
                  {activeDeductionCat === 'retirement' && (
                    <motion.div key="retirement" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ToggleButton label={t.socialSecurityLabel} subtitle={t.socialSecuritySub} active={activeDeductions.socialSecurity} onClick={() => toggleDeduction('socialSecurity')} />
                      <ToggleButton label={t.pvdGbkLabel} subtitle={t.pvdGbkSub} active={activeDeductions.pvdGbk} onClick={() => toggleDeduction('pvdGbk')} />
                      <ToggleButton label={t.nsfLabel} subtitle={t.nsfSub} active={activeDeductions.nsf} onClick={() => toggleDeduction('nsf')} />
                      <ToggleButton label={t.pensionLabel} subtitle={t.pensionSub} active={activeDeductions.pensionInsurance} onClick={() => toggleDeduction('pensionInsurance')} />
                      <ToggleButton label={t.rmfLabel} subtitle={t.rmfSub} active={activeDeductions.rmf} onClick={() => toggleDeduction('rmf')} />
                      <ToggleButton label={t.thaiESGLabel} subtitle={t.thaiESGSub} active={activeDeductions.thaiESG} onClick={() => toggleDeduction('thaiESG')} />
                    </motion.div>
                  )}
                  {activeDeductionCat === 'economy' && (
                    <motion.div key="economy" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ToggleButton label={t.homeLoanLabel} subtitle={t.homeLoanSub} active={activeDeductions.homeLoanInterest} onClick={() => toggleDeduction('homeLoanInterest')} />
                      <ToggleButton label={t.easyReceiptLabel} subtitle={t.easyReceiptSub} active={activeDeductions.easyReceipt} onClick={() => toggleDeduction('easyReceipt')} />
                      <ToggleButton label={t.localTravelLabel} subtitle={t.localTravelSub} active={activeDeductions.localTravel} onClick={() => toggleDeduction('localTravel')} />
                    </motion.div>
                  )}
                  {activeDeductionCat === 'donation' && (
                    <motion.div key="donation" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ToggleButton label={t.donationEduLabel} subtitle={t.donationEduSub} active={activeDeductions.donationEdu} onClick={() => toggleDeduction('donationEdu')} />
                      <ToggleButton label={t.donationGenLabel} subtitle={t.donationGenSub} active={activeDeductions.donationGeneral} onClick={() => toggleDeduction('donationGeneral')} />
                      <ToggleButton label={t.donationPolLabel} subtitle={t.donationPolSub} active={activeDeductions.donationPolitical} onClick={() => toggleDeduction('donationPolitical')} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ส่วนสไลด์เปิดฟิลด์กรอกข้อมูลฝั่งลดหย่อน */}
              <AnimatePresence>
                {Object.values(activeDeductions).some(Boolean) && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 pt-4 border-t border-white/5 overflow-hidden"
                  >
                    {activeDeductions.childrenOld && activeDeductionCat === 'personal' && <Input label={t.inputChildOldCount} value={deductionValues.childrenOldCount} onChange={(e) => setDeductionValues({ ...deductionValues, childrenOldCount: e.target.value })} placeholder="0" suffix={t.personsSuffix} />}
                    {activeDeductions.childrenNew && activeDeductionCat === 'personal' && <Input label={t.inputChildNewCount} value={deductionValues.childrenNewCount} onChange={(e) => setDeductionValues({ ...deductionValues, childrenNewCount: e.target.value })} placeholder="0" suffix={t.personsSuffix} />}
                    {activeDeductions.fosterChild && activeDeductionCat === 'personal' && <Input label={t.inputFosterCount} value={deductionValues.fosterChildCount} onChange={(e) => setDeductionValues({ ...deductionValues, fosterChildCount: e.target.value })} placeholder="0" suffix={t.personsSuffix} />}
                    {activeDeductions.parentsCare && activeDeductionCat === 'personal' && <Input label={t.inputParentsCount} value={deductionValues.parentsCount} onChange={(e) => setDeductionValues({ ...deductionValues, parentsCount: e.target.value })} placeholder="0" suffix={t.personsSuffix} />}
                    {activeDeductions.disabledCare && activeDeductionCat === 'personal' && <Input label={t.inputDisabledCount} value={deductionValues.disabledCount} onChange={(e) => setDeductionValues({ ...deductionValues, disabledCount: e.target.value })} placeholder="0" suffix={t.personsSuffix} />}
                    {activeDeductions.maternity && activeDeductionCat === 'personal' && <Input label={t.inputMaternityAmount} value={deductionValues.maternityAmount} onChange={(e) => setDeductionValues({ ...deductionValues, maternityAmount: e.target.value })} placeholder="0" />}
                    
                    {activeDeductions.lifeInsurance && activeDeductionCat === 'insurance' && <Input label={t.inputLifeInsAmount} value={deductionValues.lifeInsuranceAmount} onChange={(e) => setDeductionValues({ ...deductionValues, lifeInsuranceAmount: e.target.value })} placeholder="0" />}
                    {activeDeductions.healthOwn && activeDeductionCat === 'insurance' && <Input label={t.inputHealthOwnAmount} value={deductionValues.healthOwnAmount} onChange={(e) => setDeductionValues({ ...deductionValues, healthOwnAmount: e.target.value })} placeholder="0" />}
                    {activeDeductions.healthParents && activeDeductionCat === 'insurance' && <Input label={t.inputHealthParentsAmount} value={deductionValues.healthParentsAmount} onChange={(e) => setDeductionValues({ ...deductionValues, healthParentsAmount: e.target.value })} placeholder="0" />}
                    
                    {activeDeductions.socialSecurity && activeDeductionCat === 'retirement' && <Input label={t.inputSocialAmount} value={deductionValues.socialSecurityAmount} onChange={(e) => setDeductionValues({ ...deductionValues, socialSecurityAmount: e.target.value })} placeholder="0" />}
                    {activeDeductions.pvdGbk && activeDeductionCat === 'retirement' && <Input label={t.inputPvdAmount} value={deductionValues.pvdGbkAmount} onChange={(e) => setDeductionValues({ ...deductionValues, pvdGbkAmount: e.target.value })} placeholder="0" />}
                    {activeDeductions.nsf && activeDeductionCat === 'retirement' && <Input label={t.inputNsfAmount} value={deductionValues.nsfAmount} onChange={(e) => setDeductionValues({ ...deductionValues, nsfAmount: e.target.value })} placeholder="0" />}
                    {activeDeductions.pensionInsurance && activeDeductionCat === 'retirement' && <Input label={t.inputPensionAmount} value={deductionValues.pensionAmount} onChange={(e) => setDeductionValues({ ...deductionValues, pensionAmount: e.target.value })} placeholder="0" />}
                    {activeDeductions.rmf && activeDeductionCat === 'retirement' && <Input label={t.inputRmfAmount} value={deductionValues.rmfAmount} onChange={(e) => setDeductionValues({ ...deductionValues, rmfAmount: e.target.value })} placeholder="0" />}
                    {activeDeductions.thaiESG && activeDeductionCat === 'retirement' && <Input label={t.inputThaiESGAmount} value={deductionValues.thaiESGAmount} onChange={(e) => setDeductionValues({ ...deductionValues, thaiESGAmount: e.target.value })} placeholder="0" />}
                    
                    {activeDeductions.homeLoanInterest && activeDeductionCat === 'economy' && <Input label={t.inputHomeAmount} value={deductionValues.homeLoanAmount} onChange={(e) => setDeductionValues({ ...deductionValues, homeLoanAmount: e.target.value })} placeholder="0" />}
                    
                    {/* ─── แตกกล่อง Input ดีไซน์เดิมของ Easy E-Receipt เป็น 2 ช่อง ─── */}
                    {activeDeductions.easyReceipt && activeDeductionCat === 'economy' && (
                      <div className="space-y-4 p-4 rounded-2xl bg-[#121215] border border-white/5">
                        <Input 
                          label={t.inputEasyGeneralAmount} 
                          value={deductionValues.easyReceiptGeneralAmount} 
                          onChange={(e) => setDeductionValues({ ...deductionValues, easyReceiptGeneralAmount: e.target.value })} 
                          placeholder="0" 
                        />
                        <Input 
                          label={t.inputEasyOtopAmount} 
                          value={deductionValues.easyReceiptOtopAmount} 
                          onChange={(e) => setDeductionValues({ ...deductionValues, easyReceiptOtopAmount: e.target.value })} 
                          placeholder="0" 
                        />
                      </div>
                    )}
                    
                    {activeDeductions.localTravel && activeDeductionCat === 'economy' && <Input label={t.inputTravelAmount} value={deductionValues.localTravelAmount} onChange={(e) => setDeductionValues({ ...deductionValues, localTravelAmount: e.target.value })} placeholder="0" />}
                    
                    {activeDeductions.donationEdu && activeDeductionCat === 'donation' && <Input label={t.inputDonationEduAmount} value={deductionValues.donationEduAmount} onChange={(e) => setDeductionValues({ ...deductionValues, donationEduAmount: e.target.value })} placeholder="0" />}
                    {activeDeductions.donationGeneral && activeDeductionCat === 'donation' && <Input label={t.inputDonationGenAmount} value={deductionValues.donationGeneralAmount} onChange={(e) => setDeductionValues({ ...deductionValues, donationGeneralAmount: e.target.value })} placeholder="0" />}
                    {activeDeductions.donationPolitical && activeDeductionCat === 'donation' && <Input label={t.inputDonationPolAmount} value={deductionValues.donationPoliticalAmount} onChange={(e) => setDeductionValues({ ...deductionValues, donationPoliticalAmount: e.target.value })} placeholder="0" />}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ฝั่งขวา แดชบอร์ดสรุปผลภาษีและห้องจำลอง Sandbox สไตล์โมเดิร์นลักชัวรี */}
          <div className="lg:col-span-5 lg:sticky lg:top-12 space-y-6">
            
            {/* แผงหลัก: สรุปยอดภาษีพึงประเมิน */}
            <div className="bg-gradient-to-b from-[#0F0F12] to-[#070709] border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

              <h3 className="text-lg font-semibold tracking-wide text-zinc-200">{t.taxSummary}</h3>

              <div className="space-y-4 text-sm font-sans">
                <div className="flex justify-between pb-3.5 border-b border-white/5 text-zinc-400">
                  <span>{t.grossLabel}</span>
                  <span className="text-white font-medium">฿{taxData.totalAnnualIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pb-3.5 border-b border-white/5 text-zinc-400">
                  <span>{t.expenseLabel}</span>
                  <span className="text-white font-medium text-red-400/80">- ฿{taxData.totalExpenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pb-3.5 border-b border-white/5 text-zinc-400">
                  <span>{t.deductLabel}</span>
                  <span className="text-white font-medium text-red-400/80">- ฿{taxData.totalDeductions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pb-3.5 border-b border-white/5 text-zinc-400">
                  <span>{t.taxNet}</span>
                  <span className="text-white font-medium">฿{taxData.netIncome.toLocaleString()}</span>
                </div>

                <div className="bg-gradient-to-r from-[#C5A059]/10 to-transparent border border-[#C5A059]/20 rounded-2xl p-5 mt-6 flex justify-between items-center">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-zinc-400 font-medium">{t.taxPayable}</p>
                    <p className="text-xs text-[#C5A059]/70 mt-0.5">Est. Tax Payable</p>
                  </div>
                  <span className="text-3xl font-extrabold text-[#C5A059] tracking-tight drop-shadow-[0_2px_10px_rgba(197,160,89,0.2)]">
                    ฿{taxData.taxPayable.toLocaleString()}
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-zinc-500 leading-relaxed text-center pt-2">
                {t.footerNotice}
              </p>
            </div>

            {/* ─── 🌟 แผงรอง: ห้องทดลองจำลองภาษี SANDBOX (IC COMPLEX 2) ─── */}
            <AnimatePresence>
              {taxData.totalAnnualIncome > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: 15 }}
                  className="bg-gradient-to-br from-[#111115] via-[#0A0A0C] to-[#121216] border border-[#C5A059]/20 rounded-3xl p-6 space-y-5 shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 px-3 py-1 bg-[#C5A059]/10 border-b border-l border-[#C5A059]/20 rounded-bl-xl text-[9px] font-bold text-[#C5A059] tracking-widest uppercase">
                    IC Insight
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-white tracking-wide">{t.suggestTitle}</h4>
                    <p className="text-[11px] text-zinc-500 mt-0.5">{t.suggestSubtitle}</p>
                  </div>

                  {(taxData.insuranceQuotaRemaining > 0 || taxData.pensionQuotaRemaining > 0 || taxData.rmfQuotaRemaining > 0 || taxData.esgQuotaRemaining > 0) ? (
                    <div className="space-y-4">
                      
                      {/* ส่วนกรอกตัวเลขจำลองอิสระ (Sandbox Inputs) */}
                      <div className="space-y-3">
                        <h5 className="text-xs font-semibold text-zinc-400 tracking-wide border-b border-white/5 pb-1.5">
                          {t.simCardHeader}
                        </h5>
                        
                        <div className="grid grid-cols-1 gap-2.5">
                          <SandboxInput 
                            label={t.simLifeLabel} 
                            quota={taxData.insuranceQuotaRemaining} 
                            value={simLifeIns} 
                            onChange={(e) => setSimLifeIns(e.target.value)} 
                            placeholder="0" 
                          />
                          <SandboxInput 
                            label={t.simPensionLabel} 
                            quota={taxData.pensionQuotaRemaining} 
                            value={simPension} 
                            onChange={(e) => setSimPension(e.target.value)} 
                            placeholder="0" 
                          />
                          <SandboxInput 
                            label={t.simRmfLabel} 
                            quota={taxData.rmfQuotaRemaining} 
                            value={simRmf} 
                            onChange={(e) => setSimRmf(e.target.value)} 
                            placeholder="0" 
                          />
                          <SandboxInput 
                            label={t.simEsgLabel} 
                            quota={taxData.esgQuotaRemaining} 
                            value={simThaiEsg} 
                            onChange={(e) => setSimThaiEsg(e.target.value)} 
                            placeholder="0" 
                          />
                        </div>
                      </div>

                      {/* แดชบอร์ดแสดงผลลัพธ์พยากรณ์ภาษีสุทธิและยอดที่ประหยัดได้เพิ่ม */}
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="bg-black/60 border border-white/5 rounded-xl p-3 text-left">
                          <span className="text-[10px] block uppercase text-zinc-500 tracking-wider mb-1">{t.suggestSimulatedTaxPayable}</span>
                          <span className="text-sm font-bold text-zinc-300">฿{Math.round(taxData.simulatedTaxPayable).toLocaleString()}</span>
                        </div>
                        <div className="bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-xl p-3 text-left shadow-[0_4px_15px_rgba(197,160,89,0.05)]">
                          <span className="text-[10px] block uppercase text-[#C5A059] tracking-wider mb-1">{t.suggestPotentialSave}</span>
                          <span className="text-sm font-extrabold text-[#C5A059]">฿{Math.round(taxData.potentialTaxSaved).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                      <p className="text-xs font-medium text-emerald-400/90">{t.suggestMaximized}</p>
                    </div>
                  )}

                  <div className="pt-2 border-t border-white/5">
                    <p className="text-[9px] text-zinc-600 leading-normal italic">
                      {t.suggestDisclaimer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Tax;