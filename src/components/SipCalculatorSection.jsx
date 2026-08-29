import React, { useState, useMemo } from "react";
import { 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  PieChart, 
  Calculator, 
  RotateCcw,
  Sparkles,
  Layers,
  Award,
  Landmark,
  Receipt,
  PiggyBank
} from "lucide-react";

export default function SipCalculatorSection({ onStartInvesting }) {
  const [monthlyInvestment, setMonthlyInvestment] = useState(25000);
  const [years, setYears] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(12);

  // Exact SIP formula matching Page 6
  const { totalInvestment, estimatedReturns, totalWealth, investmentRatio, returnsRatio } = useMemo(() => {
    const P = Number(monthlyInvestment) || 0;
    const n = (Number(years) || 1) * 12;
    const r = (Number(expectedReturn) || 0) / 100 / 12;

    const invested = P * n;

    let wealth = 0;
    if (r > 0) {
      wealth = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    } else {
      wealth = invested;
    }

    const returns = Math.max(0, wealth - invested);

    const safeTotal = wealth > 0 ? wealth : 1;
    const invRatio = Math.min(100, Math.max(0, (invested / safeTotal) * 100));
    const retRatio = Math.min(100, Math.max(0, (returns / safeTotal) * 100));

    return {
      totalInvestment: invested,
      estimatedReturns: returns,
      totalWealth: wealth,
      investmentRatio: invRatio,
      returnsRatio: retRatio,
    };
  }, [monthlyInvestment, years, expectedReturn]);

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (returnsRatio / 100) * circumference;

  const formatCurrency = (val) => {
    return "₹" + Math.round(val).toLocaleString("en-IN");
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
              Whether saving for retirement, your child's education, or a dream home — our goal-based mutual fund platform helps you invest with purpose and discipline.
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
                  <div className="text-sm font-bold text-gray-900">Goal-Based Investing</div>
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

          {/* Right Column: SIP Calculator Card */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
              
              {/* Solid Green Card Header */}
              <div className="bg-[#0f4b32] px-6 sm:px-8 py-4.5 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/15 text-amber-400 flex items-center justify-center">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-lg sm:text-xl tracking-tight">SIP Calculator</span>
                </div>

                <button 
                  onClick={() => {
                    setMonthlyInvestment(25000);
                    setYears(10);
                    setExpectedReturn(12);
                  }}
                  className="text-xs font-semibold text-emerald-100 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
                  title="Reset to default"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Sliders & Inputs Body */}
              <div className="p-6 sm:p-8 space-y-6">
                
                {/* 1. Monthly Investment */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-sm sm:text-base font-bold text-gray-800">
                      Monthly Investment
                    </label>
                    <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 px-3.5 py-1.5 rounded-xl text-base font-extrabold text-gray-900">
                      <span className="text-gray-400 text-xs">₹</span>
                      <input 
                        type="number" 
                        value={monthlyInvestment} 
                        onChange={(e) => setMonthlyInvestment(Math.max(500, Number(e.target.value)))}
                        className="w-24 bg-transparent outline-none text-right font-black"
                        step={500}
                        min={500}
                        max={500000}
                      />
                    </div>
                  </div>
                  <input 
                    type="range" 
                    min={500} 
                    max={200000} 
                    step={500} 
                    value={monthlyInvestment}
                    onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                    className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0f4b32]"
                  />
                  <div className="flex justify-between text-xs text-gray-400 font-medium mt-1">
                    <span>₹500</span>
                    <span>₹1,00,000</span>
                    <span>₹2,00,000</span>
                  </div>
                </div>

                {/* 2. Investment Period */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-sm sm:text-base font-bold text-gray-800">
                      Investment Period
                    </label>
                    <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 px-3.5 py-1.5 rounded-xl text-base font-extrabold text-gray-900">
                      <input 
                        type="number" 
                        value={years} 
                        onChange={(e) => setYears(Math.max(1, Math.min(40, Number(e.target.value))))}
                        className="w-12 bg-transparent outline-none text-right font-black"
                        min={1}
                        max={40}
                      />
                      <span className="text-gray-500 text-xs font-medium">Years</span>
                    </div>
                  </div>
                  <input 
                    type="range" 
                    min={1} 
                    max={30} 
                    step={1} 
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                    className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0f4b32]"
                  />
                  <div className="flex justify-between text-xs text-gray-400 font-medium mt-1">
                    <span>1 Yr</span>
                    <span>15 Yrs</span>
                    <span>30 Yrs</span>
                  </div>
                </div>

                {/* 3. Expected Return */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-sm sm:text-base font-bold text-gray-800">
                      Expected Return (p.a.)
                    </label>
                    <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 px-3.5 py-1.5 rounded-xl text-base font-extrabold text-gray-900">
                      <input 
                        type="number" 
                        value={expectedReturn} 
                        onChange={(e) => setExpectedReturn(Math.max(1, Math.min(30, Number(e.target.value))))}
                        className="w-12 bg-transparent outline-none text-right font-black"
                        min={1}
                        max={30}
                      />
                      <span className="text-gray-500 text-xs font-medium">%</span>
                    </div>
                  </div>
                  <input 
                    type="range" 
                    min={5} 
                    max={25} 
                    step={0.5} 
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                    className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#e8a317]"
                  />
                  <div className="flex justify-between text-xs text-gray-400 font-medium mt-1">
                    <span>5%</span>
                    <span>15%</span>
                    <span>25%</span>
                  </div>
                </div>

                {/* Calculation Breakdown & Donut Chart */}
                <div className="pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  
                  {/* Left Column: Figures */}
                  <div className="sm:col-span-7 space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <span className="text-xs sm:text-sm text-gray-600 font-medium">Total Investment</span>
                      <span className="text-base sm:text-lg font-black text-gray-900">{formatCurrency(totalInvestment)}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/60 border border-amber-100">
                      <span className="text-xs sm:text-sm text-amber-900 font-medium">Estimated Returns</span>
                      <span className="text-base sm:text-lg font-black text-[#c28414]">{formatCurrency(estimatedReturns)}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0f4b32] text-white shadow-md">
                      <div>
                        <div className="text-[11px] text-emerald-200 font-semibold uppercase tracking-wider">Total Wealth</div>
                        <div className="text-xl sm:text-2xl font-black">{formatCurrency(totalWealth)}</div>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 text-emerald-100">
                        {Math.round((totalWealth / Math.max(1, totalInvestment) - 1) * 100)}% Gain
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Donut Chart */}
                  <div className="sm:col-span-5 flex flex-col items-center justify-center">
                    <div className="relative w-40 h-40 flex items-center justify-center">
                      <svg viewBox="0 0 160 160" className="w-36 h-36 transform -rotate-90">
                        {/* Background circle (Investment) */}
                        <circle
                          cx="80"
                          cy="80"
                          r={radius}
                          stroke="#0f4b32"
                          strokeWidth="18"
                          fill="transparent"
                        />
                        {/* Returns circle (Warm Amber/Gold) */}
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
                        <div className="text-xs sm:text-sm font-extrabold text-gray-900 leading-tight">
                          {formatCurrency(totalWealth)}
                        </div>
                        <div className="text-[10px] text-gray-500 font-medium mt-0.5">
                          Total Wealth
                        </div>
                      </div>
                    </div>

                    {/* Donut Legend */}
                    <div className="flex items-center gap-4 text-xs font-semibold mt-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-[#0f4b32]"></span>
                        <span className="text-gray-700">Investment</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-[#e8a317]"></span>
                        <span className="text-gray-700">Returns</span>
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
