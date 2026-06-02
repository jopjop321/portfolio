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


// ─── MAIN APP WORKSPACE ───

function Tax() {
  const { lang, toggleLanguage } = useLanguage();
  const t = translations[lang];

  // คีย์ภาษาภายในระบบตามที่คุณ Job ฝังข้อความลง translations.js
  const localTxt = useMemo(() => {
    return lang === 'en' ? {
      incomeTitle: "1. Sources of Income", incomeTab1: "Salary/General", incomeTab2: "Investment", incomeTab3: "Property Rent", incomeTab4: "Independent", incomeTab5: "Business/Commerce",
      deductTitle: "2. Tax Deductions & Allowances", deductTab1: "Personal/Family", deductTab2: "Insurance", deductTab3: "Retirement", deductTab4: "Stimulus / Gov", deductTab5: "Donations",
      grossLabel: "Total Annual Gross Income", expenseLabel: "Deducted Expenses by Category", deductLabel: "Total Deductions & Allowances Used",
      backBtn: "← Back to Wealth", actualBtn: "Toggle Actual Expenses Document Claim", actualPlh: "Specify documented actual expenses",
      footerNotice: "* The system processes progressive tax steps and deduction capping algorithms dynamically according to Thai Revenue Department tax laws.",
      salaryLabel: "40(1) Regular Salary", salarySub: "Deduct 50% max 100k THB", bonusSub: "Grouped expenses deduction", freelanceLabel: "40(2) Freelance / Commissions", freelanceSub: "Grouped max 100k THB", copyrightLabel: "40(3) Copyrights & Royalties", copyrightSub: "Eligible for actual expenses", dividendLabel: "40(4) Stocks Dividends / Interest", dividendSub: "Expenses cannot be deducted (0%)",
      rentBuild: "Building & House Rent", rentBuildSub: "Standard deduction 30%", rentAgri: "Agricultural Land Rent", rentAgriSub: "Standard deduction 20%", rentOtherLand: "Non-Agri Land Rent", rentOtherLandSub: "Standard deduction 15%", rentVehicle: "Vehicles Rent (Car / Boat)", rentVehicleSub: "Standard deduction 30%", rentOtherAsset: "Other Asset Rent", rentOtherAssetSub: "Standard deduction 10%",
      medExpert: "40(6) Medical Practice (Doctor)", medExpertSub: "Standard deduction 60%", othExpert: "40(6) Law / Eng / Arch / Account", othExpertSub: "Standard deduction 30%", contractor: "40(7) Construction Contracting", contractorSub: "Must supply materials, standard 60%", actor: "40(8) Public Actor & Entertainer", actorSub: "Special progressive standard rate", commerce43: "40(8) 43 Listed Business Types", commerce43Sub: "Retail/Restaurant standard 60%", commerceOther: "40(8) Non-43 Business Types", commerceOtherSub: "Content Creator / Forced actual rate"
    } : {
      incomeTitle: "1. Sources of Income (หมวดหมู่ประเภทรายได้)", incomeTab1: "เงินเดือน/งานทั่วไป", incomeTab2: "การลงทุน/หุ้น", incomeTab3: "ค่าเช่าสินทรัพย์", incomeTab4: "วิชาชีพอิสระ", incomeTab5: "รับเหมา/พาณิชย์",
      deductTitle: "2. Select Tax Category (เลือกกลุ่มลดหย่อน)", deductTab1: "ส่วนตัว/ครอบครัว", deductTab2: "ประกัน/สุขภาพ", deductTab3: "การออมเพื่อเกษียณ", deductTab4: "อสังหาฯ/มาตรการรัฐ", deductTab5: "กลุ่มเงินบริจาค",
      grossLabel: "รายได้สะสมพึงประเมินทั้งปี (Gross)", expenseLabel: "หักต้นทุนค่าใช้จ่ายตามประเภทมาตรา", deductLabel: "หักสิทธิ์รายการลดหย่อนรวม",
      backBtn: "← Back to Wealth", actualBtn: "ต้องการแสดงหลักฐานหักค่าใช้จ่ายตามจริง", actualPlh: "ระบุเอกสารค่าใช้จ่ายจริงที่จำเป็นและสมควรตามหลักฐาน",
      footerNotice: "* สถาปัตยกรรมประมวลผลแยกคำนวณฐานหักค่าใช้จ่ายและกลุ่มเพดานสิทธิ์ลดหย่อนอ้างอิงตามประมวลรัษฎากรกรมสรรพากรไทยปี 2569",
      salaryLabel: "ม.40(1) เงินเดือนประจำ", salarySub: "หักเหมา 50% กลุ่มแรงงาน", bonusSub: "หักค่าใช้จ่ายเหมากลุ่มร่วมกัน", freelanceLabel: "ม.40(2) นายหน้า / ฟรีแลนซ์", freelanceSub: "หักรวมกลุ่มสูงสุด 1 แสนบ.", copyrightLabel: "ม.40(3) ค่าลิขสิทธิ์เพลง/หนังสือ", copyrightSub: "สิทธิ์เลือกหักตามจริงได้", dividendLabel: "ม.40(4) ดอกเบี้ย / เงินปันผลจากหุ้น", dividendSub: "ตามประมวลรัษฎากรหักค่าใช้จ่ายไม่ได้ (0%)",
      rentBuild: "บ้าน / โรงเรือน / แพ", rentBuildSub: "ม.40(5) หักอัตราเหมา 30%", rentAgri: "ที่ดินใช้ทำเกษตรกรรม", rentAgriSub: "ม.40(5) หักอัตราเหมา 20%", rentOtherLand: "ที่ดินที่ไม่ได้ใช้ทำเกษตร", rentOtherLandSub: "ม.40(5) หักอัตราเหมา 15%", rentVehicle: "ยานพาหนะ (รถยนต์ / เรือ)", rentVehicleSub: "ม.40(5) หักอัตราเหมา 30%", rentOtherAsset: "ทรัพย์สินประเภทอื่นๆ", rentOtherAssetSub: "ม.40(5) หักอัตราเหมา 10%",
      medExpert: "ม.40(6) วิชาชีพแพทย์", medExpertSub: "กลุ่มประกอบโรคศิลป์ หักเหมา 60%", othExpert: "ม.40(6) ทนาย/วิศวกร/สถาปนิก/บัญชี", othExpertSub: "กลุ่มวิชาชีพเฉพาะ หักเหมา 30%", contractor: "ม.40(7) การรับเหมาก่อสร้าง", contractorSub: "ต้องจัดหาวัสดุเอง หักเหมา 60%", actor: "ม.40(8) ดารานักแสดงสาธารณะ", actorSub: "หักเหมาแบบขั้นบันไดพิเศษ", commerce43: "ม.40(8) ธุรกิจกลุ่ม 43 ประเภท", commerce43Sub: "ร้านอาหาร/ค้าขาย หักเหมา 60% หรือตามจริง", commerceOther: "ม.40(8) ธุรกิจนอกเหนือ 43 ประเภท", commerceOtherSub: "ทำคอนเทนต์/ยูทูบเบอร์ บังคับหักตามจริง"
    };
  }, [lang]);

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

  // --- STATE 2: NEW DEDUCTION ARCHITECTURE (แบ่งเป็น 5 กลุ่มตามโจทย์ใหม่) ---
  const [activeDeductionCat, setActiveDeductionCat] = useState('personal');
  const [activeDeductions, setActiveDeductions] = useState({
    // 1. ครอบครัว
    spouse: false, childrenOld: false, childrenNew: false, fosterChild: false, parentsCare: false, disabledCare: false, maternity: false,
    // 2. ประกัน
    lifeInsurance: false, healthOwn: false, healthParents: false,
    // 3. กองทุนเกษียณ
    socialSecurity: false, pvdGbk: false, nsf: false, pensionInsurance: false, rmf: false, ssf: false, thaiESG: false,
    // 4. มาตรการรัฐ
    homeLoanInterest: false, easyReceipt: false, localTravel: false,
    // 5. บริจาค
    donationEdu: false, donationGeneral: false, donationPolitical: false
  });

  const [deductionValues, setDeductionValues] = useState({
    childrenOldCount: '', childrenNewCount: '', fosterChildCount: '', parentsCount: '', disabledCount: '', maternityAmount: '',
    lifeInsuranceAmount: '', healthOwnAmount: '', healthParentsAmount: '',
    socialSecurityAmount: '', pvdGbkAmount: '', nsfAmount: '', pensionAmount: '', rmfAmount: '', ssfAmount: '', thaiESGAmount: '',
    homeLoanAmount: '', easyReceiptAmount: '', localTravelAmount: '',
    donationEduAmount: '', donationGeneralAmount: '', donationPoliticalAmount: ''
  });

  // Dynamic Toggles & Cleanups
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
      setDeductionValues(prev => ({ ...prev, [key]: '' }));
    }
  };

  // --- USEMEMO COMPREHENSIVE CALCULATION PIPELINE ---
  const taxData = useMemo(() => {
    // รายได้สะสมพึงประเมิน
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

    // หักค่าใช้จ่ายรายมาตรา
    const expType12 = Math.min((vSalary + vBonus + vFreelance) * 0.5, 100000);
    const expCopyright = activeIncomes.copyright ? (useActualExpenses.copyright ? Number(actualExpenseValues.copyright) : Math.min(vCopyright * 0.5, 100000)) : 0;
    const expRentBuild = activeIncomes.rentBuilding ? (useActualExpenses.rentBuilding ? Number(actualExpenseValues.rentBuilding) : vRentBuild * 0.30) : 0;
    const expRentAgri = activeIncomes.rentAgriLand ? (useActualExpenses.rentAgriLand ? Number(actualExpenseValues.rentAgriLand) : vRentAgri * 0.20) : 0;
    const expRentOtherLand = activeIncomes.rentOtherLand ? (useActualExpenses.rentOtherLand ? Number(actualExpenseValues.rentOtherLand) : vRentOtherLand * 0.15) : 0;
    const expRentVehicle = activeIncomes.rentVehicle ? (useActualExpenses.rentVehicle ? Number(actualExpenseValues.rentVehicle) : vRentVehicle * 0.30) : 0;
    const expRentOtherAsset = activeIncomes.rentOtherAsset ? (useActualExpenses.rentOtherAsset ? Number(actualExpenseValues.rentOtherAsset) : vRentOtherAsset * 0.10) : 0;
    const expMed = activeIncomes.medicalExpert ? (useActualExpenses.medicalExpert ? Number(actualExpenseValues.medicalExpert) : vMedExpert * 0.60) : 0;
    const expOth = activeIncomes.otherExpert ? (useActualExpenses.otherExpert ? Number(actualExpenseValues.otherExpert) : vOthExpert * 0.30) : 0;
    const expContractor = activeIncomes.contractor ? (useActualExpenses.contractor ? Number(actualExpenseValues.contractor) : vContractor * 0.60) : 0;
    let expActor = activeIncomes.actor ? (vActor <= 300000 ? vActor * 0.60 : 180000 + (vActor - 300000) * 0.40) : 0;
    if (activeIncomes.actor) expActor = Math.min(expActor, 600000);
    const expCommerce43 = activeIncomes.commerce43 ? (useActualExpenses.commerce43 ? Number(actualExpenseValues.commerce43) : vCommerce43 * 0.60) : 0;
    const expCommerceOther = activeIncomes.commerceOther ? Number(actualExpenseValues.commerceOther) : 0;

    const totalExpenses = expType12 + expCopyright + expRentBuild + expRentAgri + expRentOtherLand + expRentVehicle + expRentOtherAsset + expMed + expOth + expContractor + expActor + expCommerce43 + expCommerceOther;

    // ─── คำนวณหักลดหย่อนกลุ่มใหม่ (Deductions Validation Engine) ───
    
    // กลุ่ม 1: ส่วนตัวและครอบครัว
    const dPersonal = 60000; // ส่วนตัวพื้นฐาน
    const dSpouse = activeDeductions.spouse ? 60000 : 0;
    const dChildOld = activeDeductions.childrenOld ? Number(deductionValues.childrenOldCount) * 30000 : 0;
    const dChildNew = activeDeductions.childrenNew ? Number(deductionValues.childrenNewCount) * 60000 : 0;
    const dFosterChild = activeDeductions.fosterChild ? Math.min(Number(deductionValues.fosterChildCount), 3) * 30000 : 0;
    const dParents = activeDeductions.parentsCare ? Number(deductionValues.parentsCount) * 30000 : 0;
    const dDisabled = activeDeductions.disabledCare ? Number(deductionValues.disabledCount) * 60000 : 0;
    const dMaternity = activeDeductions.maternity ? Math.min(Number(deductionValues.maternityAmount), 60000) : 0;

    const totalGroup1 = dPersonal + dSpouse + dChildOld + dChildNew + dFosterChild + dParents + dDisabled + dMaternity;

    // กลุ่ม 2: ประกันและหลักประกันสุขภาพ
    const vLifeIns = activeDeductions.lifeInsurance ? Number(deductionValues.lifeInsuranceAmount) : 0;
    const vHealthOwn = activeDeductions.healthOwn ? Number(deductionValues.healthOwnAmount) : 0;
    // Logic ดักเงื่อนไข: ประกันสุขภาพตนเองไม่เกิน 25,000 และเมื่อรวมประกันชีวิตต้องไม่เกิน 100,000 บาท
    const safeHealthOwn = Math.min(vHealthOwn, 25000);
    const totalLifeAndHealthOwn = Math.min(vLifeIns + safeHealthOwn, 100000);
    const dHealthParents = activeDeductions.healthParents ? Math.min(Number(deductionValues.healthParentsAmount), 15000) : 0;

    const totalGroup2 = totalLifeAndHealthOwn + dHealthParents;

    // กลุ่ม 3: การออมและการลงทุนเพื่อการเกษียณ (คุมเพดานรวมกันไม่เกิน 500,000 บาท ยกเว้น ประกันสังคม และ ThaiESG)
    const dSocial = activeDeductions.socialSecurity ? Math.min(Number(deductionValues.socialSecurityAmount), 9000) : 0;
    const vPvdGbk = activeDeductions.pvdGbk ? Math.min(Number(deductionValues.pvdGbkAmount), totalAnnualIncome * 0.15, 500000) : 0;
    const vNsf = activeDeductions.nsf ? Math.min(Number(deductionValues.nsfAmount), 30000) : 0;
    const vPension = activeDeductions.pensionInsurance ? Math.min(Number(deductionValues.pensionAmount), totalAnnualIncome * 0.15, 200000) : 0;
    const vRmf = activeDeductions.rmf ? Math.min(Number(deductionValues.rmfAmount), totalAnnualIncome * 0.30, 500000) : 0;
    const vSsf = activeDeductions.ssf ? Math.min(Number(deductionValues.ssfAmount), totalAnnualIncome * 0.30, 200000) : 0;
    
    // ประมวลผลกลุ่มบำนาญสะสมรวม (คุม Cap 500k ตามกฎหมาย)
    const retirementPoolSum = Math.min(vPvdGbk + vNsf + vPension + vRmf + vSsf, 500000);
    // วงเงินแยกอิสระของ ThaiESG (ไม่รวมใน 500k แต่อยู่ในกลุ่มออม)
    const dThaiESG = activeDeductions.thaiESG ? Math.min(Number(deductionValues.thaiESGAmount), totalAnnualIncome * 0.30, 300000) : 0;

    const totalGroup3 = dSocial + retirementPoolSum + dThaiESG;

    // กลุ่ม 4: อสังหาริมทรัพย์และมาตรการรัฐ
    const dHome = activeDeductions.homeLoanInterest ? Math.min(Number(deductionValues.homeLoanAmount), 100000) : 0;
    const dEasyReceipt = activeDeductions.easyReceipt ? Math.min(Number(deductionValues.easyReceiptAmount), 50000) : 0;
    const dTravel = activeDeductions.localTravel ? Math.min(Number(deductionValues.localTravelAmount), 30000) : 0;

    const totalGroup4 = dHome + dEasyReceipt + dTravel;

    // คำนวณเงินได้ก่อนหักเงินบริจาคเพื่อประเมินเพดานสูงสุด 10%
    const baseDeductionsSum = totalGroup1 + totalGroup2 + totalGroup3 + totalGroup4;
    const incomeBeforeDonations = Math.max(0, totalAnnualIncome - totalExpenses - baseDeductionsSum);

    // กลุ่ม 5: เงินบริจาค (หลังหักลดหย่อนอื่นแล้ว คุมเพดาน 10% ของเงินได้สุทธิ)
    const vDonationEdu = activeDeductions.donationEdu ? (Number(deductionValues.donationEduAmount) * 2) : 0;
    const safeDonationEdu = Math.min(vDonationEdu, incomeBeforeDonations * 0.10);

    const remIncomeAfterEdu = incomeBeforeDonations - (safeDonationEdu / 2);
    const vDonationGen = activeDeductions.donationGeneral ? Number(deductionValues.donationGeneralAmount) : 0;
    const safeDonationGen = Math.min(vDonationGen, remIncomeAfterEdu * 0.10);

    const dPolitical = activeDeductions.donationPolitical ? Math.min(Number(deductionValues.donationPoliticalAmount), 10000) : 0;

    const totalGroup5 = safeDonationEdu + safeDonationGen + dPolitical;

    const totalDeductions = baseDeductionsSum + totalGroup5;
    const netIncome = Math.max(0, incomeBeforeDonations - (safeDonationEdu / 2) - safeDonationGen - dPolitical);
    const taxPayable = calculateThaiTax(netIncome);

    return { totalAnnualIncome, totalExpenses, totalDeductions, netIncome, taxPayable };
  }, [incomeValues, activeIncomes, deductionValues, activeDeductions, useActualExpenses, actualExpenseValues]);

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans antialiased selection:bg-[#C5A059]/30 relative overflow-hidden">
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#C5A059] opacity-[0.04] blur-[120px] rounded-full pointer-events-none"></div>

      {/* Header Panel */}
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
            {localTxt.backBtn}
          </Link>
        </div>
      </header>

      {/* Main Framework */}
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
            
            {/* 1. SOURCES OF INCOME BLOCK */}
            <div className="bg-[#0A0A0C] border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-md">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-1.5 h-6 bg-[#C5A059] rounded-full" />
                <h2 className="text-lg font-medium text-white tracking-wide">{localTxt.incomeTitle}</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 p-1.5 bg-[#121215] rounded-2xl border border-white/5">
                <CategoryTab label={localTxt.incomeTab1} active={activeIncomeCat === 'job'} onClick={() => setActiveIncomeCat('job')} />
                <CategoryTab label={localTxt.incomeTab2} active={activeIncomeCat === 'invest'} onClick={() => setActiveIncomeCat('invest')} />
                <CategoryTab label={localTxt.incomeTab3} active={activeIncomeCat === 'rent'} onClick={() => setActiveIncomeCat('rent')} />
                <CategoryTab label={localTxt.incomeTab4} active={activeIncomeCat === 'expert'} onClick={() => setActiveIncomeCat('expert')} />
                <CategoryTab label={localTxt.incomeTab5} active={activeIncomeCat === 'business'} onClick={() => setActiveIncomeCat('business')} />
              </div>

              <div className="pt-4 border-t border-white/5">
                <AnimatePresence mode="wait">
                  {activeIncomeCat === 'job' && (
                    <motion.div key="job" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ToggleButton label={localTxt.salaryLabel} subtitle={localTxt.salarySub} active={activeIncomes.salary} onClick={() => toggleIncome('salary')} />
                      <ToggleButton label={t.taxBonus} subtitle={localTxt.bonusSub} active={activeIncomes.bonus} onClick={() => toggleIncome('bonus')} />
                      <ToggleButton label={localTxt.freelanceLabel} subtitle={localTxt.freelanceSub} active={activeIncomes.freelance} onClick={() => toggleIncome('freelance')} />
                      <ToggleButton label={localTxt.copyrightLabel} subtitle={localTxt.copyrightSub} active={activeIncomes.copyright} onClick={() => toggleIncome('copyright')} />
                    </motion.div>
                  )}

                  {activeIncomeCat === 'invest' && (
                    <motion.div key="invest" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 gap-4">
                      <ToggleButton label={localTxt.dividendLabel} subtitle={localTxt.dividendSub} active={activeIncomes.dividend} onClick={() => toggleIncome('dividend')} />
                    </motion.div>
                  )}

                  {activeIncomeCat === 'rent' && (
                    <motion.div key="rent" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ToggleButton label={localTxt.rentBuild} subtitle={localTxt.rentBuildSub} active={activeIncomes.rentBuilding} onClick={() => toggleIncome('rentBuilding')} />
                      <ToggleButton label={localTxt.rentAgri} subtitle={localTxt.rentAgriSub} active={activeIncomes.rentAgriLand} onClick={() => toggleIncome('rentAgriLand')} />
                      <ToggleButton label={localTxt.rentOtherLand} subtitle={localTxt.rentOtherLandSub} active={activeIncomes.rentOtherLand} onClick={() => toggleIncome('rentOtherLand')} />
                      <ToggleButton label={localTxt.rentVehicle} subtitle={localTxt.rentVehicleSub} active={activeIncomes.rentVehicle} onClick={() => toggleIncome('rentVehicle')} />
                      <ToggleButton label={localTxt.rentOtherAsset} subtitle={localTxt.rentOtherAssetSub} active={activeIncomes.rentOtherAsset} onClick={() => toggleIncome('rentOtherAsset')} />
                    </motion.div>
                  )}

                  {activeIncomeCat === 'expert' && (
                    <motion.div key="expert" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ToggleButton label={localTxt.medExpert} subtitle={localTxt.medExpertSub} active={activeIncomes.medicalExpert} onClick={() => toggleIncome('medicalExpert')} />
                      <ToggleButton label={localTxt.othExpert} subtitle={localTxt.othExpertSub} active={activeIncomes.otherExpert} onClick={() => toggleIncome('otherExpert')} />
                    </motion.div>
                  )}

                  {activeIncomeCat === 'business' && (
                    <motion.div key="business" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ToggleButton label={localTxt.contractor} subtitle={localTxt.contractorSub} active={activeIncomes.contractor} onClick={() => toggleIncome('contractor')} />
                      <ToggleButton label={localTxt.actor} subtitle={localTxt.actorSub} active={activeIncomes.actor} onClick={() => toggleIncome('actor')} />
                      <ToggleButton label={localTxt.commerce43} subtitle={localTxt.commerce43Sub} active={activeIncomes.commerce43} onClick={() => toggleIncome('commerce43')} />
                      <ToggleButton label={localTxt.commerceOther} subtitle={localTxt.commerceOtherSub} active={activeIncomes.commerceOther} onClick={() => toggleIncome('commerceOther')} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ฟิลด์กรอกตัวเลขฝั่งรายได้ */}
              <div className="space-y-4 pt-2">
                <AnimatePresence>
                  {activeIncomes.salary && activeIncomeCat === 'job' && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden"><Input label={localTxt.inputSalaryLabel} value={incomeValues.salary} onChange={(e) => setIncomeValues({ ...incomeValues, salary: e.target.value })} placeholder="0" /></motion.div>}
                  {activeIncomes.bonus && activeIncomeCat === 'job' && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden"><Input label={localTxt.inputBonusLabel} value={incomeValues.bonus} onChange={(e) => setIncomeValues({ ...incomeValues, bonus: e.target.value })} placeholder="0" /></motion.div>}
                  {activeIncomes.freelance && activeIncomeCat === 'job' && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden"><Input label={localTxt.inputFreelanceLabel} value={incomeValues.freelance} onChange={(e) => setIncomeValues({ ...incomeValues, freelance: e.target.value })} placeholder="0" /></motion.div>}
                  {activeIncomes.copyright && activeIncomeCat === 'job' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-3 bg-zinc-900/20 p-4 rounded-2xl border border-white/5">
                      <Input label={localTxt.inputCopyrightLabel} value={incomeValues.copyright} onChange={(e) => setIncomeValues({ ...incomeValues, copyright: e.target.value })} placeholder="0" />
                      <ExpenseToggle label={localTxt.btnActual} active={useActualExpenses.copyright} onClick={() => setUseActualExpenses({...useActualExpenses, copyright: !useActualExpenses.copyright})} />
                      {useActualExpenses.copyright && <Input label={localTxt.actualInput} value={actualExpenseValues.copyright} onChange={(e) => setActualExpenseValues({...actualExpenseValues, copyright: e.target.value})} placeholder="0" />}
                    </motion.div>
                  )}
                  {activeIncomes.dividend && activeIncomeCat === 'invest' && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden"><Input label={localTxt.inputDividendLabel} value={incomeValues.dividend} onChange={(e) => setIncomeValues({ ...incomeValues, dividend: e.target.value })} placeholder="0" /></motion.div>}
                  {activeIncomes.rentBuilding && activeIncomeCat === 'rent' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-3 bg-zinc-900/20 p-4 rounded-2xl border border-white/5">
                      <Input label={localTxt.inputRentBuild} value={incomeValues.rentBuilding} onChange={(e) => setIncomeValues({ ...incomeValues, rentBuilding: e.target.value })} placeholder="0" />
                      <ExpenseToggle label={localTxt.btnActual} active={useActualExpenses.rentBuilding} onClick={() => setUseActualExpenses({...useActualExpenses, rentBuilding: !useActualExpenses.rentBuilding})} />
                      {useActualExpenses.rentBuilding && <Input label={localTxt.actualRentBuild} value={actualExpenseValues.rentBuilding} onChange={(e) => setActualExpenseValues({...actualExpenseValues, rentBuilding: e.target.value})} placeholder="0" />}
                    </motion.div>
                  )}
                  {activeIncomes.rentAgriLand && activeIncomeCat === 'rent' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-3 bg-zinc-900/20 p-4 rounded-2xl border border-white/5">
                      <Input label={localTxt.inputRentAgri} value={incomeValues.rentAgriLand} onChange={(e) => setIncomeValues({ ...incomeValues, rentAgriLand: e.target.value })} placeholder="0" />
                      <ExpenseToggle label={localTxt.btnActual} active={useActualExpenses.rentAgriLand} onClick={() => setUseActualExpenses({...useActualExpenses, rentAgriLand: !useActualExpenses.rentAgriLand})} />
                      {useActualExpenses.rentAgriLand && <Input label={localTxt.actualRentAgri} value={actualExpenseValues.rentAgriLand} onChange={(e) => setActualExpenseValues({...actualExpenseValues, rentAgriLand: e.target.value})} placeholder="0" />}
                    </motion.div>
                  )}
                  {activeIncomes.rentOtherLand && activeIncomeCat === 'rent' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-3 bg-zinc-900/20 p-4 rounded-2xl border border-white/5">
                      <Input label={localTxt.inputRentOtherLand} value={incomeValues.rentOtherLand} onChange={(e) => setIncomeValues({ ...incomeValues, rentOtherLand: e.target.value })} placeholder="0" />
                      <ExpenseToggle label={localTxt.btnActual} active={useActualExpenses.rentOtherLand} onClick={() => setUseActualExpenses({...useActualExpenses, rentOtherLand: !useActualExpenses.rentOtherLand})} />
                      {useActualExpenses.rentOtherLand && <Input label={localTxt.actualRentOtherLand} value={actualExpenseValues.rentOtherLand} onChange={(e) => setActualExpenseValues({...actualExpenseValues, rentOtherLand: e.target.value})} placeholder="0" />}
                    </motion.div>
                  )}
                  {activeIncomes.rentVehicle && activeIncomeCat === 'rent' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-3 bg-zinc-900/20 p-4 rounded-2xl border border-white/5">
                      <Input label={localTxt.inputRentVehicle} value={incomeValues.rentVehicle} onChange={(e) => setIncomeValues({ ...incomeValues, rentVehicle: e.target.value })} placeholder="0" />
                      <ExpenseToggle label={localTxt.btnActual} active={useActualExpenses.rentVehicle} onClick={() => setUseActualExpenses({...useActualExpenses, rentVehicle: !useActualExpenses.rentVehicle})} />
                      {useActualExpenses.rentVehicle && <Input label={localTxt.actualRentVehicle} value={actualExpenseValues.rentVehicle} onChange={(e) => setActualExpenseValues({...actualExpenseValues, rentVehicle: e.target.value})} placeholder="0" />}
                    </motion.div>
                  )}
                  {activeIncomes.rentOtherAsset && activeIncomeCat === 'rent' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-3 bg-zinc-900/20 p-4 rounded-2xl border border-white/5">
                      <Input label={localTxt.inputRentOtherAsset} value={incomeValues.rentOtherAsset} onChange={(e) => setIncomeValues({ ...incomeValues, rentOtherAsset: e.target.value })} placeholder="0" />
                      <ExpenseToggle label={localTxt.btnActual} active={useActualExpenses.rentOtherAsset} onClick={() => setUseActualExpenses({...useActualExpenses, rentOtherAsset: !useActualExpenses.rentOtherAsset})} />
                      {useActualExpenses.rentOtherAsset && <Input label={localTxt.actualRentOtherAsset} value={actualExpenseValues.rentOtherAsset} onChange={(e) => setActualExpenseValues({...actualExpenseValues, rentOtherAsset: e.target.value})} placeholder="0" />}
                    </motion.div>
                  )}
                  {activeIncomes.medicalExpert && activeIncomeCat === 'expert' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-3 bg-zinc-900/20 p-4 rounded-2xl border border-white/5">
                      <Input label={t.inputMed} value={incomeValues.medicalExpert} onChange={(e) => setIncomeValues({ ...incomeValues, medicalExpert: e.target.value })} placeholder="0" />
                      <ExpenseToggle label={localTxt.btnActual} active={useActualExpenses.medicalExpert} onClick={() => setUseActualExpenses({...useActualExpenses, medicalExpert: !useActualExpenses.medicalExpert})} />
                      {useActualExpenses.medicalExpert && <Input label={localTxt.actualMed} value={actualExpenseValues.medicalExpert} onChange={(e) => setActualExpenseValues({...actualExpenseValues, medicalExpert: e.target.value})} placeholder="0" />}
                    </motion.div>
                  )}
                  {activeIncomes.otherExpert && activeIncomeCat === 'expert' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-3 bg-zinc-900/20 p-4 rounded-2xl border border-white/5">
                      <Input label={localTxt.inputOthExpert} value={incomeValues.otherExpert} onChange={(e) => setIncomeValues({ ...incomeValues, otherExpert: e.target.value })} placeholder="0" />
                      <ExpenseToggle label={localTxt.btnActual} active={useActualExpenses.otherExpert} onClick={() => setUseActualExpenses({...useActualExpenses, otherExpert: !useActualExpenses.otherExpert})} />
                      {useActualExpenses.otherExpert && <Input label={localTxt.actualOthExpert} value={actualExpenseValues.otherExpert} onChange={(e) => setActualExpenseValues({...actualExpenseValues, otherExpert: e.target.value})} placeholder="0" />}
                    </motion.div>
                  )}
                  {activeIncomes.contractor && activeIncomeCat === 'business' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-3 bg-zinc-900/20 p-4 rounded-2xl border border-white/5">
                      <Input label={localTxt.inputContractor} value={incomeValues.contractor} onChange={(e) => setIncomeValues({ ...incomeValues, contractor: e.target.value })} placeholder="0" />
                      <ExpenseToggle label={localTxt.btnActual} active={useActualExpenses.contractor} onClick={() => setUseActualExpenses({...useActualExpenses, contractor: !useActualExpenses.contractor})} />
                      {useActualExpenses.contractor && <Input label={localTxt.actualContractor} value={actualExpenseValues.contractor} onChange={(e) => setActualExpenseValues({...actualExpenseValues, contractor: e.target.value})} placeholder="0" />}
                    </motion.div>
                  )}
                  {activeIncomes.actor && activeIncomeCat === 'business' && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden"><Input label={t.inputActor} value={incomeValues.actor} onChange={(e) => setIncomeValues({ ...incomeValues, actor: e.target.value })} placeholder="0" /></motion.div>}
                  {activeIncomes.commerce43 && activeIncomeCat === 'business' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-3 bg-zinc-900/20 p-4 rounded-2xl border border-white/5">
                      <Input label={localTxt.inputCommerce43} value={incomeValues.commerce43} onChange={(e) => setIncomeValues({ ...incomeValues, commerce43: e.target.value })} placeholder="0" />
                      <ExpenseToggle label={localTxt.btnActual} active={useActualExpenses.commerce43} onClick={() => setUseActualExpenses({...useActualExpenses, commerce43: !useActualExpenses.commerce43})} />
                      {useActualExpenses.commerce43 && <Input label={localTxt.actualCommerce43} value={actualExpenseValues.commerce43} onChange={(e) => setActualExpenseValues({...actualExpenseValues, commerce43: e.target.value})} placeholder="0" />}
                    </motion.div>
                  )}
                  {activeIncomes.commerceOther && activeIncomeCat === 'business' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-3 bg-zinc-900/20 p-4 rounded-2xl border border-white/5">
                      <Input label={localTxt.inputCommerceOther} value={incomeValues.commerceOther} onChange={(e) => setIncomeValues({ ...incomeValues, commerceOther: e.target.value })} placeholder="0" />
                      <Input label={localTxt.actualCommerceOther} value={actualExpenseValues.commerceOther} onChange={(e) => setActualExpenseValues({...actualExpenseValues, commerceOther: e.target.value})} placeholder="0" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* 2. DEDUCTIONS BLOCK (แยก 5 กลุ่มพรีเมียมตามข้อมูลใหม่) */}
            <div className="bg-[#0A0A0C] border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-md">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-1.5 h-6 bg-[#C5A059] rounded-full" />
                <h2 className="text-lg font-medium text-white tracking-wide">{localTxt.deductTitle}</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 p-1.5 bg-[#121215] rounded-2xl border border-white/5">
                <CategoryTab label={localTxt.deductTab1} active={activeDeductionCat === 'personal'} onClick={() => setActiveDeductionCat('personal')} />
                <CategoryTab label={localTxt.deductTab2} active={activeDeductionCat === 'insurance'} onClick={() => setActiveDeductionCat('insurance')} />
                <CategoryTab label={activeDeductionCat === 'retirement' ? (lang === 'en' ? 'Retire' : 'การออม') : localTxt.deductTab3} active={activeDeductionCat === 'retirement'} onClick={() => setActiveDeductionCat('retirement')} />
                <CategoryTab label={localTxt.deductTab4} active={activeDeductionCat === 'economy'} onClick={() => setActiveDeductionCat('economy')} />
                <CategoryTab label={localTxt.deductTab5} active={activeDeductionCat === 'donation'} onClick={() => setActiveDeductionCat('donation')} />
              </div>

              <div className="pt-4 border-t border-white/5">
                <AnimatePresence mode="wait">
                  {/* กลุ่ม 1: ครอบครัว */}
                  {activeDeductionCat === 'personal' && (
                    <motion.div key="personal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ToggleButton label={lang === 'en' ? 'Spouse Allowance' : 'ลดหย่อนคู่สมรส'} subtitle="60,000 บ." active={activeDeductions.spouse} onClick={() => toggleDeduction('spouse')} />
                      <ToggleButton label={lang === 'en' ? 'Child (Before 2018)' : 'บุตร (เกิดก่อนปี 61)'} subtitle="คนละ 30,000 บ." active={activeDeductions.childrenOld} onClick={() => toggleDeduction('childrenOld')} />
                      <ToggleButton label={lang === 'en' ? 'Child (2018 onwards)' : 'บุตร (เกิดตั้งแต่ปี 61)'} subtitle="คนละ 60,000 บ." active={activeDeductions.childrenNew} onClick={() => toggleDeduction('childrenNew')} />
                      <ToggleButton label={lang === 'en' ? 'Foster Child' : 'บุตรบุญธรรม'} subtitle="คนละ 30,000 บ. (Max 3)" active={activeDeductions.fosterChild} onClick={() => toggleDeduction('fosterChild')} />
                      <ToggleButton label={localTxt.parentsCare} subtitle={localTxt.parentsCareSub} active={activeDeductions.parentsCare} onClick={() => toggleDeduction('parentsCare')} />
                      <ToggleButton label={lang === 'en' ? 'Care for Disabled' : 'อุปการะคนพิการ'} subtitle="คนละ 60,000 บ." active={activeDeductions.disabledCare} onClick={() => toggleDeduction('disabledCare')} />
                      <ToggleButton label={lang === 'en' ? 'Maternity Costs' : 'ค่าฝากครรภ์/คลอดบุตร'} subtitle="ตามจริง Max 60,000 บ." active={activeDeductions.maternity} onClick={() => toggleDeduction('maternity')} />
                    </motion.div>
                  )}

                  {/* กลุ่ม 2: ประกัน */}
                  {activeDeductionCat === 'insurance' && (
                    <motion.div key="insurance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ToggleButton label={lang === 'en' ? 'Life/Deposit Insurance' : 'ประกันชีวิต / เงินฝากแบบมีประกัน'} subtitle="ตามจริง Max 100,000 บ." active={activeDeductions.lifeInsurance} onClick={() => toggleDeduction('lifeInsurance')} />
                      <ToggleButton label={lang === 'en' ? 'Personal Health Ins.' : 'ประกันสุขภาพตนเอง'} subtitle="ตามจริง Max 25,000 บ." active={activeDeductions.healthOwn} onClick={() => toggleDeduction('healthOwn')} />
                      <ToggleButton label={lang === 'en' ? 'Parents Health Ins.' : 'ประกันสุขภาพพ่อแม่'} subtitle="ตามจริง Max 15,000 บ." active={activeDeductions.healthParents} onClick={() => toggleDeduction('healthParents')} />
                    </motion.div>
                  )}

                  {/* กลุ่ม 3: การออมเพื่อการเกษียณ */}
                  {activeDeductionCat === 'retirement' && (
                    <motion.div key="retirement" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ToggleButton label={localTxt.socialSecurity} subtitle={localTxt.socialSecuritySub} active={activeDeductions.socialSecurity} onClick={() => toggleDeduction('socialSecurity')} />
                      <ToggleButton label={lang === 'en' ? 'PVD / GPF / Teacher Fund' : 'กองทุนสำรองเลี้ยงชีพ (PVD)/กบข.'} subtitle="Max 15% (รวมกล่องเกษียณ)" active={activeDeductions.pvdGbk} onClick={() => toggleDeduction('pvdGbk')} />
                      <ToggleButton label={lang === 'en' ? 'NSF Saving' : 'กองทุนการออมแห่งชาติ (กอช.)'} subtitle="ตามจริง Max 30,000 บ." active={activeDeductions.nsf} onClick={() => toggleDeduction('nsf')} />
                      <ToggleButton label={localTxt.pension} subtitle={localTxt.pensionSub} active={activeDeductions.pensionInsurance} onClick={() => toggleDeduction('pensionInsurance')} />
                      <ToggleButton label={t.taxRMF || 'ลงทุน RMF'} subtitle="Max 30% (รวมกล่องเกษียณ)" active={activeDeductions.rmf} onClick={() => toggleDeduction('rmf')} />
                      <ToggleButton label={t.taxSSF || 'ลงทุน SSF'} subtitle="Max 30% (รวมกล่องเกษียณ)" active={activeDeductions.ssf} onClick={() => toggleDeduction('ssf')} />
                      <ToggleButton label={t.taxESG || 'ลงทุน ThaiESG'} subtitle="Max 30% สูงสุด 300,000 บ." active={activeDeductions.thaiESG} onClick={() => toggleDeduction('thaiESG')} />
                    </motion.div>
                  )}

                  {/* กลุ่ม 4: มาตรการรัฐ */}
                  {activeDeductionCat === 'economy' && (
                    <motion.div key="economy" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ToggleButton label={localTxt.homeLoan} subtitle={localTxt.homeLoanSub} active={activeDeductions.homeLoanInterest} onClick={() => toggleDeduction('homeLoanInterest')} />
                      <ToggleButton label="Easy e-Receipt 2.0" subtitle="ตามจริง Max 50,000 บ." active={activeDeductions.easyReceipt} onClick={() => toggleDeduction('easyReceipt')} />
                      <ToggleButton label={lang === 'en' ? 'Secondary City Travel' : 'เที่ยวเมืองรอง'} subtitle="ตามจริง Max 30,000 บ." active={activeDeductions.localTravel} onClick={() => toggleDeduction('localTravel')} />
                    </motion.div>
                  )}

                  {/* กลุ่ม 5: บริจาค */}
                  {activeDeductionCat === 'donation' && (
                    <motion.div key="donation" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ToggleButton label={lang === 'en' ? 'Edu/Sport/Gov Hospital' : 'บริจาคเพื่อการศึกษา/กีฬา/รพ.รัฐ'} subtitle="หักลดหย่อนได้ 2 เท่าของที่จ่ายจริง" active={activeDeductions.donationEdu} onClick={() => toggleDeduction('donationEdu')} />
                      <ToggleButton label={lang === 'en' ? 'General/Foundation Donation' : 'บริจาคทั่วไป / มูลนิธิ'} subtitle="ตามจริงไม่เกิน 10% ของสุทธิ" active={activeDeductions.donationGeneral} onClick={() => toggleDeduction('donationGeneral')} />
                      <ToggleButton label={lang === 'en' ? 'Political Party Donation' : 'บริจาคพรรคการเมือง'} subtitle="ตามจริง Max 10,000 บ." active={activeDeductions.donationPolitical} onClick={() => toggleDeduction('donationPolitical')} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ส่วน Input รับข้อมูลกลุ่มลดหย่อน */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <AnimatePresence>
                  {activeDeductions.childrenOld && activeDeductionCat === 'personal' && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden"><Input label={localTxt.inputChildren + " (เกิดก่อนปี 61)"} value={deductionValues.childrenOldCount} onChange={(e) => setDeductionValues({ ...deductionValues, childrenOldCount: e.target.value })} placeholder="0" suffix="คน / Persons" /></motion.div>}
                  {activeDeductions.childrenNew && activeDeductionCat === 'personal' && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden"><Input label={localTxt.inputChildren + " (เกิดตั้งแต่ปี 61)"} value={deductionValues.childrenNewCount} onChange={(e) => setDeductionValues({ ...deductionValues, childrenNewCount: e.target.value })} placeholder="0" suffix="คน / Persons" /></motion.div>}
                  {activeDeductions.fosterChild && activeDeductionCat === 'personal' && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden"><Input label={lang === 'en' ? 'Number of Foster Children (Max 3)' : 'จำนวนบุตรบุญธรรม (รวมสูงสุดไม่เกิน 3 คน)'} value={deductionValues.fosterChildCount} onChange={(e) => setDeductionValues({ ...deductionValues, fosterChildCount: e.target.value })} placeholder="0" suffix="คน / Persons" /></motion.div>}
                  {activeDeductions.parentsCare && activeDeductionCat === 'personal' && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden"><Input label={localTxt.inputParents} value={deductionValues.parentsCount} onChange={(e) => setDeductionValues({ ...deductionValues, parentsCount: e.target.value })} placeholder="0" suffix="คน / Persons" /></motion.div>}
                  {activeDeductions.disabledCare && activeDeductionCat === 'personal' && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden"><Input label={lang === 'en' ? 'Number of disabled people under your care' : 'จำนวนคนพิการ/ทุพพลภาพที่คุณอุปการะ'} value={deductionValues.disabledCount} onChange={(e) => setDeductionValues({ ...deductionValues, disabledCount: e.target.value })} placeholder="0" suffix="คน / Persons" /></motion.div>}
                  {activeDeductions.maternity && activeDeductionCat === 'personal' && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden"><Input label={lang === 'en' ? 'Actual maternity and medical costs paid per pregnancy' : 'ระบุยอดรวมค่าฝากครรภ์/คลอดบุตรตามจ่ายจริง'} value={deductionValues.maternityAmount} onChange={(e) => setDeductionValues({ ...deductionValues, maternityAmount: e.target.value })} placeholder="0" /></motion.div>}
                  
                  {activeDeductions.lifeInsurance && activeDeductionCat === 'insurance' && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden"><Input label={lang === 'en' ? 'General life insurance premiums (10+ Year Contract)' : 'เบี้ยประกันชีวิตทั่วไป หรือ เงินฝากแบบมีประกัน'} value={deductionValues.lifeInsuranceAmount} onChange={(e) => setDeductionValues({ ...deductionValues, lifeInsuranceAmount: e.target.value })} placeholder="0" /></motion.div>}
                  {activeDeductions.healthOwn && activeDeductionCat === 'insurance' && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden"><Input label={localTxt.inputInsurance} value={deductionValues.healthOwnAmount} onChange={(e) => setDeductionValues({ ...deductionValues, healthOwnAmount: e.target.value })} placeholder="0" /></motion.div>}
                  {activeDeductions.healthParents && activeDeductionCat === 'insurance' && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden"><Input label={localTxt.inputInsurance + " (สำหรับบิดามารดา)"} value={deductionValues.healthParentsAmount} onChange={(e) => setDeductionValues({ ...deductionValues, healthParentsAmount: e.target.value })} placeholder="0" /></motion.div>}
                  
                  {activeDeductions.socialSecurity && activeDeductionCat === 'retirement' && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden"><Input label={localTxt.inputSocialSecurity} value={deductionValues.socialSecurityAmount} onChange={(e) => setDeductionValues({ ...deductionValues, socialSecurityAmount: e.target.value })} placeholder="0" /></motion.div>}
                  {activeDeductions.pvdGbk && activeDeductionCat === 'retirement' && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden"><Input label={lang === 'en' ? 'Accumulated Provident Fund (PVD) / GPF investment amount' : 'ยอดเงินสะสมเข้ากองทุนสำรองเลี้ยงชีพ/กบข./กองทุนครูโรงเรียนเอกชน'} value={deductionValues.pvdGbkAmount} onChange={(e) => setDeductionValues({ ...deductionValues, pvdGbkAmount: e.target.value })} placeholder="0" /></motion.div>}
                  {activeDeductions.nsf && activeDeductionCat === 'retirement' && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden"><Input label={lang === 'en' ? 'National Savings Fund (NSF) investment amount' : 'ยอดเงินออมสะสมกองทุนการออมแห่งชาติ (กอช.)'} value={deductionValues.nsfAmount} onChange={(e) => setDeductionValues({ ...deductionValues, nsfAmount: e.target.value })} placeholder="0" /></motion.div>}
                  {activeDeductions.pensionInsurance && activeDeductionCat === 'retirement' && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden"><Input label={localTxt.inputPension} value={deductionValues.pensionAmount} onChange={(e) => setDeductionValues({ ...deductionValues, pensionAmount: e.target.value })} placeholder="0" /></motion.div>}
                  {activeDeductions.rmf && activeDeductionCat === 'retirement' && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden"><Input label={localTxt.inputRMF} value={deductionValues.rmfAmount} onChange={(e) => setDeductionValues({ ...deductionValues, rmfAmount: e.target.value })} placeholder="0" /></motion.div>}
                  {activeDeductions.ssf && activeDeductionCat === 'retirement' && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden"><Input label={lang === 'en' ? 'Total SSF mutual fund investment amount' : 'ยอดลงทุนสะสมกองทุนรวมเพื่อการออม (SSF)'} value={deductionValues.ssfAmount} onChange={(e) => setDeductionValues({ ...deductionValues, ssfAmount: e.target.value })} placeholder="0" /></motion.div>}
                  {activeDeductions.thaiESG && activeDeductionCat === 'retirement' && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden"><Input label={localTxt.inputThaiESG} value={deductionValues.thaiESGAmount} onChange={(e) => setDeductionValues({ ...deductionValues, thaiESGAmount: e.target.value })} placeholder="0" /></motion.div>}
                  
                  {activeDeductions.homeLoanInterest && activeDeductionCat === 'economy' && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden"><Input label={localTxt.inputHomeLoan} value={deductionValues.homeLoanAmount} onChange={(e) => setDeductionValues({ ...deductionValues, homeLoanAmount: e.target.value })} placeholder="0" /></motion.div>}
                  {activeDeductions.easyReceipt && activeDeductionCat === 'economy' && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden"><Input label={lang === 'en' ? 'Easy e-Receipt 2.0 total spending amount' : 'ยอดช้อปปิ้งสะสมตามใบกำกับภาษีมาตรการ Easy e-Receipt'} value={deductionValues.easyReceiptAmount} onChange={(e) => setDeductionValues({ ...deductionValues, easyReceiptAmount: e.target.value })} placeholder="0" /></motion.div>}
                  {activeDeductions.localTravel && activeDeductionCat === 'economy' && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden"><Input label={lang === 'en' ? 'Secondary city travel verified expenses amount' : 'ยอดค่าใช้จ่ายท่องเที่ยวเมืองรองตามเงื่อนไขมาตรการ'} value={deductionValues.localTravelAmount} onChange={(e) => setDeductionValues({ ...deductionValues, localTravelAmount: e.target.value })} placeholder="0" /></motion.div>}
                  
                  {activeDeductions.donationEdu && activeDeductionCat === 'donation' && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden"><Input label={lang === 'en' ? 'Actual donation paid for Education/Sport/Gov Hospital' : 'จำนวนเงินที่บริจาคจริง (ระบบประมวลคูณ 2 ให้เอง)'} value={deductionValues.donationEduAmount} onChange={(e) => setDeductionValues({ ...deductionValues, donationEduAmount: e.target.value })} placeholder="0" /></motion.div>}
                  {activeDeductions.donationGeneral && activeDeductionCat === 'donation' && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden"><Input label={lang === 'en' ? 'Actual donation paid for general charities or foundations' : 'จำนวนเงินที่บริจาคจริงให้แก่มูลนิธิ/สถานสาธารณกุศล'} value={deductionValues.donationGeneralAmount} onChange={(e) => setDeductionValues({ ...deductionValues, donationGeneralAmount: e.target.value })} placeholder="0" /></motion.div>}
                  {activeDeductions.donationPolitical && activeDeductionCat === 'donation' && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden"><Input label={lang === 'en' ? 'Actual donation amount paid to political parties' : 'จำนวนเงินบริจาคให้แก่พรรคการเมืองตามจ่ายจริง'} value={deductionValues.donationPoliticalAmount} onChange={(e) => setDeductionValues({ ...deductionValues, donationPoliticalAmount: e.target.value })} placeholder="0" /></motion.div>}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ฝั่งขวา แดชบอร์ดสรุปผลความมั่งคั่งและภาษีสไตล์โมเดิร์นคลาสสิก */}
          <div className="lg:col-span-5 lg:sticky lg:top-12">
            <div className="bg-gradient-to-b from-[#0F0F12] to-[#070709] border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

              <h3 className="text-lg font-semibold tracking-wide text-zinc-200">{t.taxSummary}</h3>

              <div className="space-y-4 text-sm font-sans">
                <div className="flex justify-between pb-3.5 border-b border-white/5 text-zinc-400">
                  <span>{localTxt.grossLabel}</span>
                  <span className="text-white font-medium">฿{taxData.totalAnnualIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pb-3.5 border-b border-white/5 text-zinc-400">
                  <span>{localTxt.expenseLabel}</span>
                  <span className="text-white font-medium text-red-400/80">- ฿{taxData.totalExpenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pb-3.5 border-b border-white/5 text-zinc-400">
                  <span>{localTxt.deductLabel}</span>
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
                {localTxt.footerNotice}
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

export default Tax;