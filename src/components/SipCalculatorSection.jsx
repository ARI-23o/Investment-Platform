import React, { useState, useMemo } from "react";
import { 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Calculator, 
  RotateCcw,
  Landmark,
  Receipt,
  PiggyBank,
  Wallet,
  ArrowUpRight
} from "lucide-react";

// Reusable Calculator Slider Component
function CalculatorSlider({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  step = 1, 
  prefix = "", 
  suffix = "", 
  marks = [], 
  accentColor = "accent-[#0f4b32]" 
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <label className="text-sm sm:text-base font-bold text-gray-800">
          {label}
        </label>
        <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 px-3.5 py-1.5 rounded-xl text-base font-extrabold text-gray-900 shadow-2xs">
          {prefix && <span className="text-gray-400 text-xs font-semibold">{prefix}</span>}
          <input 
            type="number" 
            value={value} 
            onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value) || 0)))}
            className="w-24 bg-transparent outline-none text-right font-black"
            step={step}
            min={min}
            max={max}
          />
          {suffix && <span className="text-gray-500 text-xs font-medium">{suffix}</span>}
        </div>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step} 
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer ${accentColor}`}
      />
      {marks.length > 0 && (
        <div className="flex justify-between text-xs text-gray-400 font-medium mt-1">
          {marks.map((mark, idx) => (
            <span key={idx}>{mark}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SipCalculatorSection({ onStartInvesting }) {
  // Mode: 'sip' | 'lumpsum' | 'swp'
  const [calcMode, setCalcMode] = useState("sip");

  // SIP States
  const [monthlyInvestment, setMonthlyInvestment] = useState(25000);
  const [sipYears, setSipYears] = useState(10);
  const [sipReturn, setSipReturn] = useState(12);

  // Lumpsum States
  const [lumpsumAmount, setLumpsumAmount] = useState(500000);
  const [lumpYears, setLumpYears] = useState(10);
  const [lumpReturn, setLumpReturn] = useState(12);

  // SWP States
  const [swpTotalInvestment, setSwpTotalInvestment] = useState(5000000);
  const [swpMonthlyWithdrawal, setSwpMonthlyWithdrawal] = useState(35000);
  const [swpYears, setSwpYears] = useState(10);
  const [swpReturn, setSwpReturn] = useState(10);

  // Dynamic Calculation Engine
  const { 
    totalInvestment, 
    estimatedReturns, 
    totalWealth, 
    investmentRatio, 
    returnsRatio,
    labelTotalInvested,
    labelReturns,
    labelTotalWealth
  } = useMemo(() => {
    if (calcMode === "sip") {
      const P = Number(monthlyInvestment) || 0;
      const n = (Number(sipYears) || 1) * 12;
      const i = (Number(sipReturn) || 0) / 100 / 12;
      const invested = P * n;
      let wealth = 0;
      if (i > 0) {
        wealth = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
      } else {
        wealth = invested;
      }
      const returns = Math.max(0, wealth - invested);
      const safeTotal = wealth > 0 ? wealth : 1;

      return {
        totalInvestment: invested,
        estimatedReturns: returns,
        totalWealth: wealth,
        investmentRatio: Math.min(100, Math.max(0, (invested / safeTotal) * 100)),
        returnsRatio: Math.min(100, Math.max(0, (returns / safeTotal) * 100)),
        labelTotalInvested: "Total Investment",
        labelReturns: "Estimated Returns",
        labelTotalWealth: "Total Wealth",
      };
    } 
    
    if (calcMode === "lumpsum") {
      const P = Number(lumpsumAmount) || 0;
      const n = Number(lumpYears) || 1;
      const r = (Number(lumpReturn) || 0) / 100;
      const invested = P;
      const wealth = P * Math.pow(1 + r, n);
      const returns = Math.max(0, wealth - invested);
      const safeTotal = wealth > 0 ? wealth : 1;

      return {
        totalInvestment: invested,
        estimatedReturns: returns,
        totalWealth: wealth,
        investmentRatio: Math.min(100, Math.max(0, (invested / safeTotal) * 100)),
        returnsRatio: Math.min(100, Math.max(0, (returns / safeTotal) * 100)),
        labelTotalInvested: "Initial Investment",
        labelReturns: "Total Growth",
        labelTotalWealth: "Total Wealth",
      };
    }

    // SWP calculation
    const totalPrincipal = Number(swpTotalInvestment) || 0;
    const monthlyOut = Number(swpMonthlyWithdrawal) || 0;
    const months = (Number(swpYears) || 1) * 12;
    const monthlyRate = (Number(swpReturn) || 0) / 100 / 12;
    const totalWithdrawn = monthlyOut * months;

    let balance = totalPrincipal;
    for (let m = 0; m < months; m++) {
      balance = Math.max(0, (balance - monthlyOut) * (1 + monthlyRate));
    }
    const finalValue = balance;
    const overallValue = totalWithdrawn + finalValue;
    const safeTotal = overallValue > 0 ? overallValue : 1;

    return {
      totalInvestment: totalPrincipal,
      estimatedReturns: totalWithdrawn,
      totalWealth: finalValue,
      investmentRatio: Math.min(100, Math.max(0, (totalWithdrawn / safeTotal) * 100)),
      returnsRatio: Math.min(100, Math.max(0, (finalValue / safeTotal) * 100)),
      labelTotalInvested: "Initial Principal",
      labelReturns: "Total Withdrawn",
      labelTotalWealth: "Final Balance Remaining",
    };
  }, [
    calcMode, 
    monthlyInvestment, sipYears, sipReturn,
    lumpsumAmount, lumpYears, lumpReturn,
    swpTotalInvestment, swpMonthlyWithdrawal, swpYears, swpReturn
  ]);

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (returnsRatio / 100) * circumference;

  const formatCurrency = (val) => {
    return "₹" + Math.round(val).toLocaleString("en-IN");
  };

  const handleReset = () => {
    if (calcMode === "sip") {
      setMonthlyInvestment(25000);
      setSipYears(10);
      setSipReturn(12);
    } else if (calcMode === "lumpsum") {
      setLumpsumAmount(500000);
      setLumpYears(10);
      setLumpReturn(12);
    } else {
      setSwpTotalInvestment(5000000);
      setSwpMonthlyWithdrawal(35000);
      setSwpYears(10);
      setSwpReturn(10);
    }
  };

  return (
    <section id="calculator" className="py-16 sm:py-24 bg-[#fafcfb] border-t border-gray-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Mutual Fund Centre */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="text-xs font-black uppercase tracking-widest text-emerald-800">
              MUTUAL FUND CENTRE
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Build Wealth<br />
              <span className="text-[#c28414] font-serif-accent italic font-normal text-4xl sm:text-5xl lg:text-6xl">
                Systematically
              </span><br />
              With Mutual Funds
            </h2>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Whether saving for retirement, your child's education, or creating regular monthly income — our interactive wealth calculators help you plan with precision and discipline.
            </p>

            {/* 4 Feature Badges in 2x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-gray-200/80 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">SIP Investments</div>
                  <div className="text-xs text-gray-500">Start with ₹500/month</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-gray-200/80 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">Goal-Based Planning</div>
                  <div className="text-xs text-gray-500">Achieve life milestones</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-gray-200/80 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">2,500+ Fund Schemes</div>
                  <div className="text-xs text-gray-500">All AMCs on one platform</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-gray-200/80 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                  <PiggyBank className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">Wealth Creation</div>
                  <div className="text-xs text-gray-500">Long-term compounding</div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <button 
                onClick={onStartInvesting}
                className="flex items-center gap-2.5 px-8 py-3.5 rounded-full text-base font-semibold bg-[#0f4b32] hover:bg-[#093523] text-white shadow-lg shadow-emerald-950/20 transition-all duration-200 cursor-pointer"
              >
                <span>Start Investing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Right Column: Calculator Card */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
              
              {/* Solid Green Card Header with Tabs */}
              <div className="bg-[#0f4b32] px-6 sm:px-8 py-5 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/15 text-amber-400 flex items-center justify-center">
                      <Calculator className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg sm:text-xl tracking-tight">
                      Wealth Calculator
                    </span>
                  </div>

                  <button 
                    onClick={handleReset}
                    className="text-xs font-semibold text-emerald-100 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
                    title="Reset to default"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>

                {/* Calculator Mode Tabs: [SIP] [Lumpsum] [SWP] */}
                <div className="grid grid-cols-3 gap-2 bg-emerald-950/50 p-1.5 rounded-2xl border border-emerald-800/40">
                  <button
                    onClick={() => setCalcMode("sip")}
                    className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                      calcMode === "sip"
                        ? "bg-white text-[#0f4b32] shadow-sm"
                        : "text-emerald-100 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    SIP
                  </button>
                  <button
                    onClick={() => setCalcMode("lumpsum")}
                    className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                      calcMode === "lumpsum"
                        ? "bg-white text-[#0f4b32] shadow-sm"
                        : "text-emerald-100 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    Lumpsum
                  </button>
                  <button
                    onClick={() => setCalcMode("swp")}
                    className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                      calcMode === "swp"
                        ? "bg-white text-[#0f4b32] shadow-sm"
                        : "text-emerald-100 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    SWP
                  </button>
                </div>
              </div>

              {/* Sliders & Inputs Body */}
              <div className="p-6 sm:p-8 space-y-6">
                
                {/* 1. SIP Mode Inputs */}
                {calcMode === "sip" && (
                  <>
                    <CalculatorSlider
                      label="Monthly Investment"
                      value={monthlyInvestment}
                      onChange={setMonthlyInvestment}
                      min={500}
                      max={200000}
                      step={500}
                      prefix="₹"
                      marks={["₹500", "₹1,00,000", "₹2,00,000"]}
                      accentColor="accent-[#0f4b32]"
                    />

                    <CalculatorSlider
                      label="Investment Period"
                      value={sipYears}
                      onChange={setSipYears}
                      min={1}
                      max={30}
                      step={1}
                      suffix="Years"
                      marks={["1 Yr", "15 Yrs", "30 Yrs"]}
                      accentColor="accent-[#0f4b32]"
                    />

                    <CalculatorSlider
                      label="Expected Return (p.a.)"
                      value={sipReturn}
                      onChange={setSipReturn}
                      min={5}
                      max={25}
                      step={0.5}
                      suffix="%"
                      marks={["5%", "15%", "25%"]}
                      accentColor="accent-[#e8a317]"
                    />
                  </>
                )}

                {/* 2. Lumpsum Mode Inputs */}
                {calcMode === "lumpsum" && (
                  <>
                    <CalculatorSlider
                      label="Total Investment (One-Time)"
                      value={lumpsumAmount}
                      onChange={setLumpsumAmount}
                      min={10000}
                      max={5000000}
                      step={10000}
                      prefix="₹"
                      marks={["₹10,000", "₹25,00,000", "₹50,00,000"]}
                      accentColor="accent-[#0f4b32]"
                    />

                    <CalculatorSlider
                      label="Investment Period"
                      value={lumpYears}
                      onChange={setLumpYears}
                      min={1}
                      max={30}
                      step={1}
                      suffix="Years"
                      marks={["1 Yr", "15 Yrs", "30 Yrs"]}
                      accentColor="accent-[#0f4b32]"
                    />

                    <CalculatorSlider
                      label="Expected Return (p.a.)"
                      value={lumpReturn}
                      onChange={setLumpReturn}
                      min={5}
                      max={25}
                      step={0.5}
                      suffix="%"
                      marks={["5%", "15%", "25%"]}
                      accentColor="accent-[#e8a317]"
                    />
                  </>
                )}

                {/* 3. SWP Mode Inputs */}
                {calcMode === "swp" && (
                  <>
                    <CalculatorSlider
                      label="Total Investment"
                      value={swpTotalInvestment}
                      onChange={setSwpTotalInvestment}
                      min={100000}
                      max={20000000}
                      step={50000}
                      prefix="₹"
                      marks={["₹1,00,000", "₹1,00,00,000", "₹2,00,00,000"]}
                      accentColor="accent-[#0f4b32]"
                    />

                    <CalculatorSlider
                      label="Monthly Withdrawal"
                      value={swpMonthlyWithdrawal}
                      onChange={setSwpMonthlyWithdrawal}
                      min={1000}
                      max={200000}
                      step={1000}
                      prefix="₹"
                      suffix="/mo"
                      marks={["₹1,000", "₹1,00,000", "₹2,00,000"]}
                      accentColor="accent-[#e8a317]"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <CalculatorSlider
                        label="Time Period"
                        value={swpYears}
                        onChange={setSwpYears}
                        min={1}
                        max={30}
                        step={1}
                        suffix="Years"
                        marks={["1 Yr", "30 Yrs"]}
                        accentColor="accent-[#0f4b32]"
                      />

                      <CalculatorSlider
                        label="Expected Return (p.a.)"
                        value={swpReturn}
                        onChange={setSwpReturn}
                        min={5}
                        max={20}
                        step={0.5}
                        suffix="%"
                        marks={["5%", "20%"]}
                        accentColor="accent-[#e8a317]"
                      />
                    </div>
                  </>
                )}

                {/* Calculation Breakdown & Donut Chart */}
                <div className="pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  
                  {/* Left Column: Figures */}
                  <div className="sm:col-span-7 space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <span className="text-xs sm:text-sm text-gray-600 font-medium">
                        {labelTotalInvested}
                      </span>
                      <span className="text-base sm:text-lg font-black text-gray-900 tabular-nums">
                        {formatCurrency(totalInvestment)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/60 border border-amber-100">
                      <span className="text-xs sm:text-sm text-amber-900 font-medium">
                        {labelReturns}
                      </span>
                      <span className="text-base sm:text-lg font-black text-[#c28414] tabular-nums">
                        {formatCurrency(estimatedReturns)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0f4b32] text-white shadow-md">
                      <div>
                        <div className="text-[11px] text-emerald-200 font-semibold uppercase tracking-wider">
                          {labelTotalWealth}
                        </div>
                        <div className="text-xl sm:text-2xl font-black tabular-nums">
                          {formatCurrency(totalWealth)}
                        </div>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 text-emerald-100">
                        {calcMode === "swp" 
                          ? `${Math.round(returnsRatio)}% Remaining`
                          : `${Math.round((totalWealth / Math.max(1, totalInvestment) - 1) * 100)}% Gain`
                        }
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Dynamic Animated Donut Chart */}
                  <div className="sm:col-span-5 flex flex-col items-center justify-center">
                    <div className="relative w-40 h-40 flex items-center justify-center">
                      <svg viewBox="0 0 160 160" className="w-36 h-36 transform -rotate-90">
                        {/* Base Circle (Primary/Investment) */}
                        <circle
                          cx="80"
                          cy="80"
                          r={radius}
                          stroke="#0f4b32"
                          strokeWidth="18"
                          fill="transparent"
                        />
                        {/* Animated Arc Circle (Growth/Returns) */}
                        <circle
                          cx="80"
                          cy="80"
                          r={radius}
                          stroke="#e8a317"
                          strokeWidth="18"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          fill="transparent"
                          className="transition-all duration-500 ease-out"
                        />
                      </svg>

                      {/* Donut Center Label */}
                      <div className="absolute text-center p-2">
                        <div className="text-xs sm:text-sm font-extrabold text-gray-900 leading-tight tabular-nums">
                          {formatCurrency(totalWealth)}
                        </div>
                        <div className="text-[10px] text-gray-500 font-medium mt-0.5">
                          {calcMode === "swp" ? "Balance" : "Total Wealth"}
                        </div>
                      </div>
                    </div>

                    {/* Donut Legend */}
                    <div className="flex items-center gap-4 text-xs font-semibold mt-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-[#0f4b32]"></span>
                        <span className="text-gray-700">
                          {calcMode === "swp" ? "Withdrawn" : "Investment"} ({Math.round(investmentRatio)}%)
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-[#e8a317]"></span>
                        <span className="text-gray-700">
                          {calcMode === "swp" ? "Balance" : "Returns"} ({Math.round(returnsRatio)}%)
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>

        {/* Dedicated Bottom 3 Benefit Checkpoints */}
        <div className="mt-14 pt-10 border-t border-gray-200/80 grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100 shadow-2xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <strong className="block text-gray-900 text-sm font-bold">Disciplined Investing</strong>
              <span className="text-xs text-gray-500 font-normal">Create wealth systematically</span>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100 font-black text-lg shadow-2xs">
              ₹
            </div>
            <div>
              <strong className="block text-gray-900 text-sm font-bold">Power of Compounding</strong>
              <span className="text-xs text-gray-500 font-normal">Let your money grow exponentially</span>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100 shadow-2xs">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <strong className="block text-gray-900 text-sm font-bold">Secure Your Future</strong>
              <span className="text-xs text-gray-500 font-normal">Plan today for tomorrow</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
