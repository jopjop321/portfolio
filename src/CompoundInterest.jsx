import React, { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';

// ─── Sub-components ───────────────────────────────────────────

const InputField = ({ label, value, setValue, step, max }) => (
  <div>
    <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
      {label}
    </label>
    <input
      type="number"
      value={value}
      onChange={(e) => setValue(Number(e.target.value))}
      step={step}
      max={max}
      className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white
                 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]
                 transition-all text-lg font-light"
    />
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const fmt = (v) => new Intl.NumberFormat('th-TH').format(v);
    return (
      <div className="bg-[#11141C] border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-md">
        <p className="text-white text-sm mb-2 font-medium">{label}</p>
        <p className="text-[#C5A059] font-semibold text-base">
          Total Value: ฿{fmt(payload[0]?.value)}
        </p>
        <p className="text-[#5B8DEF] text-sm mt-1">
          Invested: ฿{fmt(payload[1]?.value)}
        </p>
        <p className="text-emerald-400 text-sm mt-1">
          Interest: ฿{fmt(payload[0]?.value - payload[1]?.value)}
        </p>
      </div>
    );
  }
  return null;
};

// ─── Main Component ───────────────────────────────────────────

export default function CompoundInterest() {
  const [principal, setPrincipal] = useState(1_000_000);
  const [monthlyContribution, setMonthlyContribution] = useState(10_000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(10);

  const data = useMemo(() => {
    const result = [];
    let current = principal;
    let invested = principal;

    for (let i = 0; i <= years; i++) {
      if (i > 0) {
        for (let m = 0; m < 12; m++) {
          current += monthlyContribution;
          current *= 1 + rate / 100 / 12;
          invested += monthlyContribution;
        }
      }
      result.push({
        year: `Year ${i}`,
        value: Math.round(current),
        invested: Math.round(invested),
      });
    }
    return result;
  }, [principal, monthlyContribution, rate, years]);

  const last = data[data.length - 1];
  const totalInterest = last.value - last.invested;
  const fmt = (v) => new Intl.NumberFormat('th-TH').format(v);
  const fmtM = (v) => {
    if (v >= 1e9) return `฿${(v / 1e9).toFixed(1)}B`;
    if (v >= 1e6) return `฿${(v / 1e6).toFixed(1)}M`;
    if (v >= 1e3) return `฿${(v / 1e3).toFixed(0)}K`;
    return `฿${v}`;
  };

  return (
    <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-xl shadow-2xl w-full max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-12">

        {/* ── Left Panel: Inputs + Summary ── */}
        <div className="w-full md:w-1/3 flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-semibold text-white">Wealth Growth</h2>
            <p className="text-sm text-gray-400 font-light">Compound Interest Calculator</p>
          </div>

          <div className="space-y-5">
            <InputField label="Initial Investment (฿)"     value={principal}            setValue={setPrincipal}            step={100_000} />
            <InputField label="Monthly Contribution (฿)"  value={monthlyContribution}  setValue={setMonthlyContribution}  step={5_000}   />
            <InputField label="Expected Return (%)"        value={rate}                 setValue={setRate}                 step={1} max={30} />
            <InputField label="Time Horizon (Years)"       value={years}                setValue={setYears}                step={1} max={50} />
          </div>

          {/* Summary */}
          <div className="mt-4 pt-6 border-t border-white/10 space-y-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Projected Wealth</p>
              <p className="text-3xl font-semibold text-[#C5A059]">฿{fmt(last.value)}</p>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 font-light">Total Contributions</span>
              <span className="text-white">฿{fmt(last.invested)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 font-light">Total Interest Earned</span>
              <span className="text-[#C5A059]">฿{fmt(totalInterest)}</span>
            </div>
          </div>
        </div>

        {/* ── Right Panel: Chart ── */}
        <div className="w-full md:w-2/3 flex flex-col gap-4">

          {/* Legend */}
          <div className="flex gap-6 text-xs text-gray-400">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#C5A059] inline-block" />
              Total Value
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#5B8DEF] inline-block" />
              Total Invested
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-emerald-500/60 inline-block" />
              Interest Earned
            </span>
          </div>

          <div className="h-[400px] md:h-[460px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 0 }}>
                <defs>
                  {/* Gold gradient — Total Value */}
                  <linearGradient id="gradValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#C5A059" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#C5A059" stopOpacity={0.02} />
                  </linearGradient>
                  {/* Blue gradient — Total Invested */}
                  <linearGradient id="gradInvested" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#5B8DEF" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#5B8DEF" stopOpacity={0.02} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />

                <XAxis
                  dataKey="year"
                  stroke="rgba(255,255,255,0.25)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tickFormatter={fmtM}
                  stroke="rgba(255,255,255,0.25)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={75}
                />

                <Tooltip content={<CustomTooltip />} />

                {/* Render Invested first so Value sits on top */}
                <Area
                  type="monotone"
                  dataKey="invested"
                  name="Total Invested"
                  stroke="#5B8DEF"
                  strokeWidth={2}
                  strokeDasharray="5 3"
                  fill="url(#gradInvested)"
                  fillOpacity={1}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  name="Total Value"
                  stroke="#C5A059"
                  strokeWidth={2.5}
                  fill="url(#gradValue)"
                  fillOpacity={1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}