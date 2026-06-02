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

  // === รายได้ ===
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [bonus, setBonus] = useState('');

  // === ส่วนตัว / ครอบครัว ===
  const [spouse, setSpouse] = useState(false);         // คู่สมรสไม่มีรายได้
  const [children, setChildren] = useState(0);         // จำนวนบุตร
  const [childrenPost61, setChildrenPost61] = useState(0); // บุตรที่เกิดหลัง 2561
  const [parents, setParents] = useState(0);           // จำนวนพ่อแม่ที่เลี้ยงดู (สูงสุด 4 คน)
  const [disabled, setDisabled] = useState(0);         // ผู้พิการ/ทุพพลภาพ

  // === ประกัน ===
  const [lifeInsurance, setLifeInsurance] = useState(0);    // ประกันชีวิต+สะสมทรัพย์ สูงสุด 100,000
  const [healthInsurance, setHealthInsurance] = useState(0); // ประกันสุขภาพตัวเอง สูงสุด 25,000
  const [parentHealthIns, setParentHealthIns] = useState(0); // ประกันสุขภาพพ่อแม่ สูงสุด 15,000
  const [spouseLifeIns, setSpouseLifeIns] = useState(0);    // ประกันชีวิตคู่สมรส สูงสุด 10,000
  const [socialSecurity, setSocialSecurity] = useState(0);  // ประกันสังคม สูงสุด 10,500
  const [pensionInsurance, setPensionInsurance] = useState(0); // ประกันบำนาญ 15% สูงสุด 200,000

  // === กองทุน ===
  const [rmf, setRmf] = useState(0);       // RMF 30% สูงสุด 500,000
  const [thaiEsg, setThaiEsg] = useState(0); // ThaiESG+ThaiESGX 30% สูงสุด 300,000
  const [pvd, setPvd] = useState(0);        // PVD 15% สูงสุด 500,000
  const [gpf, setGpf] = useState(0);        // กบข. 30% สูงสุด 500,000
  const [nsf, setNsf] = useState(0);        // กองทุนออมแห่งชาติ สูงสุด 30,000

  // === กระตุ้นเศรษฐกิจ ===
  const [homeLoan, setHomeLoan] = useState(0);    // ดอกเบี้ยบ้าน สูงสุด 100,000
  const [artPurchase, setArtPurchase] = useState(0); // ซื้องานศิลปะ สูงสุด 100,000
  const [solar, setSolar] = useState(0);           // Solar Rooftop สูงสุด 200,000

  // ฟังก์ชันคำนวณภาษีบุคคลธรรมดาแบบขั้นบันไดของไทย
  const calculateThaiTax = (taxableIncome) => {
    if (taxableIncome <= 150000) return 0;
    let tax = 0;
    if (taxableIncome > 5000000) { tax += (taxableIncome - 5000000) * 0.35; taxableIncome = 5000000; }
    if (taxableIncome > 2000000) { tax += (taxableIncome - 2000000) * 0.30; taxableIncome = 2000000; }
    if (taxableIncome > 1000000) { tax += (taxableIncome - 1000000) * 0.25; taxableIncome = 1000000; }
    if (taxableIncome > 750000)  { tax += (taxableIncome - 750000)  * 0.20; taxableIncome = 750000;  }
    if (taxableIncome > 500000)  { tax += (taxableIncome - 500000)  * 0.15; taxableIncome = 500000;  }
    if (taxableIncome > 300000)  { tax += (taxableIncome - 300000)  * 0.10; taxableIncome = 300000;  }
    if (taxableIncome > 150000)  { tax += (taxableIncome - 150000)  * 0.05; }
    return Math.round(tax);
  };

  const taxData = useMemo(() => {
    const totalIncome = (Number(monthlyIncome) * 12) + Number(bonus);

    // หักค่าใช้จ่ายเหมา 50% สูงสุด 100,000 + ส่วนตัว 60,000
    const expenseDeduction = Math.min(totalIncome * 0.5, 100000);
    const personalDeduction = 60000;

    // ก่อนวางแผน
    const netIncomeBefore = Math.max(0, totalIncome - expenseDeduction - personalDeduction);
    const taxBefore = calculateThaiTax(netIncomeBefore);

    // === คำนวณลดหย่อนทั้งหมด ===
    // ส่วนตัว/ครอบครัว
    const spouseDeduct    = spouse ? 60000 : 0;
    const childrenDeduct  = (children * 30000) + (childrenPost61 * 30000); // บุตรหลัง61 +30,000
    const parentsDeduct   = Math.min(parents, 4) * 30000;
    const disabledDeduct  = disabled * 60000;

    // ประกัน (รวมชีวิต+สุขภาพตัวเองไม่เกิน 100,000)
    const lifeHealthCombined = Math.min(Number(lifeInsurance) + Number(healthInsurance), 100000);
    const healthDeductAlone  = Math.min(Number(healthInsurance), 25000);
    // ถ้ารวมกันเกิน 100,000 ให้ใช้ combined cap แต่สุขภาพ alone cap 25k
    const lifeDeduct         = Math.min(lifeHealthCombined, 100000);
    const parentHealthDeduct = Math.min(Number(parentHealthIns), 15000);
    const spouseLifeDeduct   = Math.min(Number(spouseLifeIns), 10000);
    const socialSecDeduct    = Math.min(Number(socialSecurity), 10500);
    const pensionDeduct      = Math.min(Number(pensionInsurance), totalIncome * 0.15, 200000);

    // กองทุน (รวม RMF+ThaiESG+PVD+กบข.+ประกันบำนาญ ไม่เกิน 500,000)
    const rmfDeduct    = Math.min(Number(rmf),     totalIncome * 0.30, 500000);
    const esgDeduct    = Math.min(Number(thaiEsg), totalIncome * 0.30, 300000);
    const pvdDeduct    = Math.min(Number(pvd),     totalIncome * 0.15, 500000);
    const gpfDeduct    = Math.min(Number(gpf),     totalIncome * 0.30, 500000);
    const nsfDeduct    = Math.min(Number(nsf),     30000);
    // cap รวม retirement funds 500,000
    const retirementTotal = Math.min(rmfDeduct + esgDeduct + pvdDeduct + gpfDeduct + pensionDeduct, 500000);

    // กระตุ้นเศรษฐกิจ
    const homeLoanDeduct  = Math.min(Number(homeLoan),    100000);
    const artDeduct       = Math.min(Number(artPurchase), 100000);
    const solarDeduct     = Math.min(Number(solar),       200000);

    const totalDeductions =
      spouseDeduct + childrenDeduct + parentsDeduct + disabledDeduct +
      lifeDeduct + parentHealthDeduct + spouseLifeDeduct + socialSecDeduct +
      retirementTotal + nsfDeduct +
      homeLoanDeduct + artDeduct + solarDeduct;

    const netIncomeAfter = Math.max(0, totalIncome - expenseDeduction - personalDeduction - totalDeductions);
    const taxAfter = calculateThaiTax(netIncomeAfter);
    const taxSaved = Math.max(0, taxBefore - taxAfter);

    return {
      netIncome: netIncomeAfter,
      taxBefore,
      taxAfter,
      taxSaved,
      totalDeductions,
      chartPayload: [
        { name: t.taxGraphBefore, amount: taxBefore, fill: '#4A5568' },
        { name: t.taxGraphAfter,  amount: taxAfter,  fill: '#C5A059' }
      ]
    };
  }, [monthlyIncome, bonus, spouse, children, childrenPost61, parents, disabled,
      lifeInsurance, healthInsurance, parentHealthIns, spouseLifeIns, socialSecurity, pensionInsurance,
      rmf, thaiEsg, pvd, gpf, nsf, homeLoan, artPurchase, solar, t]);

  const formatCurrency = (val) => new Intl.NumberFormat('th-TH').format(val || 0);

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white selection:bg-[#C5A059] selection:text-black font-sans relative overflow-hidden">
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#4A72FF] opacity-[0.04] blur-[120px] rounded-full pointer-events-none"></div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-xl font-semibold tracking-tighter flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#4A72FF] to-[#C5A059]"></div>
          Tax<span className="text-white/50 font-light">OS</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={toggleLanguage} className="text-xs font-semibold tracking-widest text-gray-400 hover:text-[#C5A059] border border-white/10 bg-white/5 rounded-full px-4 py-1.5 backdrop-blur-md transition-all duration-300">
            {lang === 'en' ? 'TH' : 'EN'}
          </button>
          <Link to="/wealth" className="text-sm text-gray-400 hover:text-white transition-colors duration-300">
            Back to Wealth
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
        <p className="text-[#C5A059] text-xs font-medium tracking-[0.2em] uppercase mb-4">{t.taxDesc}</p>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-4">
          {t.taxHero1} <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4A72FF] to-[#C5A059]">{t.taxHero2}</span>
        </h1>
        <p className="text-sm md:text-base text-gray-400 max-w-xl mx-auto font-light leading-relaxed">{t.taxHeroDesc}</p>
      </header>

      {/* Calculator */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 md:p-10 rounded-[2rem] bg-[#11141C] border border-white/5 shadow-2xl w-full"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 w-full">

            {/* ฝั่งซ้าย: ฟอร์มทั้งหมด */}
            <div className="col-span-1 flex flex-col gap-6 overflow-y-auto max-h-[85vh] pr-1 scrollbar-thin scrollbar-thumb-white/10">

              {/* รายได้ */}
              <SectionHeader label={lang === 'en' ? 'Income' : 'รายได้'} />
              <div className="space-y-4">
                <TaxInput label={t.taxMonthly} value={monthlyIncome} setValue={setMonthlyIncome} placeholder="60000" />
                <TaxInput label={t.taxBonus} value={bonus} setValue={setBonus} placeholder="120000" />
              </div>

              {/* ส่วนตัว / ครอบครัว */}
              <SectionHeader label={lang === 'en' ? 'Personal & Family' : 'ส่วนตัว / ครอบครัว'} />
              <div className="space-y-4">
                <ToggleField
                  label={lang === 'en' ? 'Spouse (no income) +฿60,000' : 'คู่สมรสไม่มีรายได้ +฿60,000'}
                  value={spouse} setValue={setSpouse}
                />
                <CounterField
                  label={lang === 'en' ? 'Children ×฿30,000' : 'บุตร ×฿30,000'}
                  value={children} setValue={setChildren} max={10}
                />
                <CounterField
                  label={lang === 'en' ? 'Children born after 2018 (extra ×฿30,000)' : 'บุตรเกิดหลัง 2561 (เพิ่มเติม ×฿30,000)'}
                  value={childrenPost61} setValue={setChildrenPost61} max={10}
                />
                <CounterField
                  label={lang === 'en' ? 'Parents supported ×฿30,000 (max 4)' : 'เลี้ยงดูพ่อแม่ ×฿30,000 (สูงสุด 4 คน)'}
                  value={parents} setValue={setParents} max={4}
                />
                <CounterField
                  label={lang === 'en' ? 'Disabled dependents ×฿60,000' : 'ผู้พิการ/ทุพพลภาพ ×฿60,000'}
                  value={disabled} setValue={setDisabled} max={10}
                />
              </div>

              {/* ประกัน */}
              <SectionHeader label={lang === 'en' ? 'Insurance' : 'ประกัน'} />
              <div className="space-y-4">
                <TaxSlider label={lang === 'en' ? 'Life / Endowment Insurance (max ฿100,000)' : 'ประกันชีวิต/สะสมทรัพย์ (สูงสุด ฿100,000)'} value={lifeInsurance} setValue={setLifeInsurance} max={100000} step={1000} />
                <TaxSlider label={lang === 'en' ? 'Health Insurance — self (max ฿25,000, combined cap ฿100,000)' : 'ประกันสุขภาพตัวเอง (สูงสุด ฿25,000, รวมกับชีวิตไม่เกิน ฿100,000)'} value={healthInsurance} setValue={setHealthInsurance} max={25000} step={500} />
                <TaxSlider label={lang === 'en' ? "Parents' health insurance (max ฿15,000)" : 'ประกันสุขภาพพ่อแม่ (สูงสุด ฿15,000)'} value={parentHealthIns} setValue={setParentHealthIns} max={15000} step={500} />
                <TaxSlider label={lang === 'en' ? "Spouse life insurance (max ฿10,000)" : 'ประกันชีวิตคู่สมรส (สูงสุด ฿10,000)'} value={spouseLifeIns} setValue={setSpouseLifeIns} max={10000} step={500} />
                <TaxSlider label={lang === 'en' ? 'Social Security (max ฿10,500)' : 'ประกันสังคม (สูงสุด ฿10,500)'} value={socialSecurity} setValue={setSocialSecurity} max={10500} step={500} />
                <TaxSlider label={lang === 'en' ? 'Pension Insurance (15% income, max ฿200,000)' : 'ประกันบำนาญ (15% รายได้ สูงสุด ฿200,000)'} value={pensionInsurance} setValue={setPensionInsurance} max={200000} step={5000} />
              </div>

              {/* กองทุน */}
              <SectionHeader label={lang === 'en' ? 'Investment Funds (combined cap ฿500,000)' : 'กองทุนลงทุน (รวมไม่เกิน ฿500,000)'} />
              <div className="space-y-4">
                <TaxSlider label={lang === 'en' ? 'RMF (30% income, max ฿500,000)' : 'กองทุน RMF (30% รายได้ สูงสุด ฿500,000)'} value={rmf} setValue={setRmf} max={500000} step={5000} />
                <TaxSlider label={lang === 'en' ? 'ThaiESG / ThaiESGX (30% income, max ฿300,000)' : 'ThaiESG / ThaiESGX (30% รายได้ สูงสุด ฿300,000)'} value={thaiEsg} setValue={setThaiEsg} max={300000} step={5000} />
                <TaxSlider label={lang === 'en' ? 'PVD (15% income, max ฿500,000)' : 'กองทุนสำรองเลี้ยงชีพ PVD (15% รายได้ สูงสุด ฿500,000)'} value={pvd} setValue={setPvd} max={500000} step={5000} />
                <TaxSlider label={lang === 'en' ? 'GPF / กบข. (30% income, max ฿500,000)' : 'กบข. (30% รายได้ สูงสุด ฿500,000)'} value={gpf} setValue={setGpf} max={500000} step={5000} />
                <TaxSlider label={lang === 'en' ? 'National Savings Fund (max ฿30,000)' : 'กองทุนออมแห่งชาติ กอช. (สูงสุด ฿30,000)'} value={nsf} setValue={setNsf} max={30000} step={1000} />
              </div>

              {/* กระตุ้นเศรษฐกิจ */}
              <SectionHeader label={lang === 'en' ? 'Economic Stimulus' : 'กระตุ้นเศรษฐกิจ'} />
              <div className="space-y-4">
                <TaxSlider label={lang === 'en' ? 'Home Loan Interest (max ฿100,000)' : 'ดอกเบี้ยที่อยู่อาศัย (สูงสุด ฿100,000)'} value={homeLoan} setValue={setHomeLoan} max={100000} step={1000} />
                <TaxSlider label={lang === 'en' ? 'Art Purchase 2568–2570 (max ฿100,000)' : 'ซื้องานศิลปะ 2568–2570 (สูงสุด ฿100,000)'} value={artPurchase} setValue={setArtPurchase} max={100000} step={1000} />
                <TaxSlider label={lang === 'en' ? 'Solar Rooftop 2569–2571 (max ฿200,000)' : 'Solar Rooftop 2569–2571 (สูงสุด ฿200,000)'} value={solar} setValue={setSolar} max={200000} step={5000} />
              </div>

              {/* สรุป */}
              <div className="mt-4 pt-6 border-t border-white/10 space-y-3 bg-black/20 p-4 rounded-xl">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">{lang === 'en' ? 'Total Deductions' : 'ลดหย่อนรวมทั้งหมด'}</span>
                  <span className="text-[#C5A059] font-medium">฿{formatCurrency(taxData.totalDeductions)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">{t.taxNet}</span>
                  <span className="text-white font-medium">฿{formatCurrency(taxData.netIncome)}</span>
                </div>
                <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                  <span className="text-gray-400">{t.taxPayable}</span>
                  <span className="text-red-400 font-medium">฿{formatCurrency(taxData.taxAfter)}</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-1">
                  <span className="text-gray-200 font-medium">{t.taxSaved}</span>
                  <span className="text-[#00B884] font-bold text-lg">฿{formatCurrency(taxData.taxSaved)}</span>
                </div>
              </div>
            </div>

            {/* ฝั่งขวา: กราฟ */}
            <div className="col-span-1 lg:col-span-2 w-full flex items-center justify-center min-h-[350px] lg:min-h-[450px]">
              <div className="w-full h-full min-h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={taxData.chartPayload} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} />
                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} width={70} tickFormatter={(val) => `฿${formatCurrency(val)}`} />
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

// === Sub-components ===

const SectionHeader = ({ label }) => (
  <div className="flex items-center gap-3 pt-2">
    <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-widest">{label}</span>
    <div className="flex-1 h-px bg-white/5"></div>
  </div>
);

const TaxInput = ({ label, value, setValue, placeholder }) => (
  <div>
    <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">{label}</label>
    <input
      type="number"
      value={value}
      onChange={(e) => setValue(e.target.value === '' ? '' : Number(e.target.value))}
      placeholder={placeholder}
      className="w-full bg-[#1A1D24] border border-white/5 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all text-base font-light [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    />
  </div>
);

const TaxSlider = ({ label, value, setValue, max, step }) => (
  <div>
    <div className="flex justify-between items-center text-xs text-gray-400 mb-1.5">
      <span className="leading-relaxed">{label}</span>
      <span className="text-white font-medium ml-2 shrink-0">฿{new Intl.NumberFormat('th-TH').format(value)}</span>
    </div>
    <input
      type="range" min="0" max={max} step={step} value={value}
      onChange={(e) => setValue(Number(e.target.value))}
      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
    />
  </div>
);

const ToggleField = ({ label, value, setValue }) => (
  <div className="flex items-center justify-between">
    <span className="text-xs text-gray-400 leading-relaxed">{label}</span>
    <button
      onClick={() => setValue(!value)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-300 shrink-0 ml-3 ${value ? 'bg-[#C5A059]' : 'bg-white/10'}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  </div>
);

const CounterField = ({ label, value, setValue, max }) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-xs text-gray-400 leading-relaxed flex-1">{label}</span>
    <div className="flex items-center gap-2 shrink-0">
      <button onClick={() => setValue(Math.max(0, value - 1))} className="w-7 h-7 rounded-full bg-white/5 border border-white/10 text-white hover:border-[#C5A059] hover:text-[#C5A059] transition-colors text-sm font-medium">−</button>
      <span className="text-white font-semibold w-4 text-center text-sm">{value}</span>
      <button onClick={() => setValue(Math.min(max, value + 1))} className="w-7 h-7 rounded-full bg-white/5 border border-white/10 text-white hover:border-[#C5A059] hover:text-[#C5A059] transition-colors text-sm font-medium">+</button>
    </div>
  </div>
);

const CustomTaxTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#11141C] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-md">
        <p className="text-gray-400 text-xs mb-1">{payload[0].name}</p>
        <p className="text-white font-semibold text-base">฿{new Intl.NumberFormat('th-TH').format(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export default Tax;