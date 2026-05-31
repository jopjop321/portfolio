import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

function CompoundInterest() {
  // 1. ตั้งค่า State สำหรับเก็บข้อมูลที่ผู้ใช้กรอก
  const [principal, setPrincipal] = useState(1000000); // เงินต้นเริ่มต้น (บาท)
  const [monthlyContribution, setMonthlyContribution] = useState(10000); // เงินเติมต่อเดือน (บาท)
  const [rate, setRate] = useState(7); // อัตราผลตอบแทนต่อปี (%)
  const [years, setYears] = useState(10); // ระยะเวลาลงทุน (ปี)

  // 2. ฟังก์ชันคำนวณดอกเบี้ยทบต้น (คำนวณใหม่เมื่อตัวเลขเปลี่ยน)
  const data = useMemo(() => {
    const result = [];
    let currentTotal = principal;
    let totalInvested = principal;

    for (let i = 0; i <= years; i++) {
      if (i > 0) {
        // เติมเงินรายเดือน (12 เดือน) และทบต้นด้วยผลตอบแทน
        for (let m = 0; m < 12; m++) {
          currentTotal += monthlyContribution;
          currentTotal = currentTotal * (1 + (rate / 100) / 12);
          totalInvested += monthlyContribution;
        }
      }
      result.push({
        year: `Year ${i}`,
        value: Math.round(currentTotal), // มูลค่ารวม
        invested: Math.round(totalInvested), // ทุนที่ลงไป
      });
    }
    return result;
  }, [principal, monthlyContribution, rate, years]);

  // ตัวแปรสำหรับแสดงผลสรุปตัวเลข
  const finalValue = data[data.length - 1].value;
  const totalInvested = data[data.length - 1].invested;
  const totalInterest = finalValue - totalInvested;

  // ฟังก์ชันจัดรูปแบบตัวเลขให้มีลูกน้ำ
  const formatCurrency = (val) => new Intl.NumberFormat('th-TH').format(val);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-xl shadow-2xl col-span-1 lg:col-span-2"
    >
      <div className="flex flex-col md:flex-row gap-12">
        
        {/* แผงควบคุมตัวเลข (Inputs) */}
        <div className="w-full md:w-1/3 flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-semibold mb-1 text-white">Wealth Growth</h2>
            <p className="text-sm text-gray-400 mb-6 font-light">Compound Interest Calculator</p>
          </div>

          <div className="space-y-5">
            <InputField label="Initial Investment (฿)" value={principal} setValue={setPrincipal} step={100000} />
            <InputField label="Monthly Contribution (฿)" value={monthlyContribution} setValue={setMonthlyContribution} step={5000} />
            <InputField label="Expected Return (%)" value={rate} setValue={setRate} step={1} max={30} />
            <InputField label="Time Horizon (Years)" value={years} setValue={setYears} step={1} max={50} />
          </div>

          {/* สรุปตัวเลข (Summary) */}
          <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Projected Wealth</p>
              <p className="text-3xl font-semibold text-[#C5A059]">฿{formatCurrency(finalValue)}</p>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 font-light">Total Contributions</span>
              <span className="text-white">฿{formatCurrency(totalInvested)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 font-light">Total Interest Earned</span>
              <span className="text-[#C5A059]">฿{formatCurrency(totalInterest)}</span>
            </div>
          </div>
        </div>

        {/* ส่วนแสดงกราฟ (Chart) */}
        {/* แก้ไขตรงนี้: เปลี่ยนความสูงเป็น h-[400px] md:h-[500px] */}
        <div className="w-full md:w-2/3 h-[400px] md:h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            {/* แก้ไขตรงนี้: ปรับ margin ให้กราฟไม่ชิดขอบเกินไป */}
            <AreaChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C5A059" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="year" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              
              <YAxis 
                tickFormatter={(value) => `฿${(value / 1000000).toFixed(1)}M`} 
                stroke="rgba(255,255,255,0.3)" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                // แก้ไขตรงนี้: เพิ่ม width={80} ให้ตัวเลขไม่ล้น
                width={80} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#C5A059" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>
    </motion.div>
  );
}

// Component ย่อย: ช่องกรอกตัวเลขแบบหรูหรา
const InputField = ({ label, value, setValue, step, max }) => (
  <div>
    <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">{label}</label>
    <input 
      type="number" 
      value={value} 
      onChange={(e) => setValue(Number(e.target.value))}
      step={step}
      max={max}
      className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all text-lg font-light"
    />
  </div>
);

// Component ย่อย: ปรับแต่ง Tooltip เวลานำเมาส์ชี้กราฟให้ดูพรีเมียม
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#11141C] border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-md">
        <p className="text-white text-sm mb-2">{label}</p>
        <p className="text-[#C5A059] font-semibold text-lg">
          Value: ฿{new Intl.NumberFormat('th-TH').format(payload[0].value)}
        </p>
        <p className="text-gray-400 text-sm mt-1">
          Invested: ฿{new Intl.NumberFormat('th-TH').format(payload[0].payload.invested)}
        </p>
      </div>
    );
  }
  return null;
};

export default CompoundInterest;