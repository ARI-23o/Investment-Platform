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
  Award
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

    const totalInv = P * n;
    let maturityValue = 0;

    if (r > 0) {
      maturityValue = Math.round(P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    } else {
      maturityValue = totalInv;
    }

    const estRet = Math.max(0, maturityValue - totalInv);
    const total = maturityValue;

    const invRatio = total > 0 ? (totalInv / total) : 0.5;
    const retRatio = total > 0 ? (estRet / total) : 0.5;

    return {
      totalInvestment: totalInv,
      estimatedReturns: estRet,
      totalWealth: total,
      investmentRatio: invRatio,
      returnsRatio: retRatio,
    };
  }, [monthlyInvestment, years, expectedReturn]);

  // Donut SVG circumference calculation
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - investmentRatio);

  const formatCurrency = (val) => {
    return "₹" + Math.round(val).toLocaleString("en-IN");
  };

  return (
    <section id="calculator" className="py-20 bg-[#f8faf9] border-t border-gray-100 relative overflow-hidden">
      {/* Complete Unified Panoramic Section Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
        <img 
          src="/assets/investor_service_banner.jpg" 
          alt="SIP Mutual Funds Background" 
          className="w-full h-full object-cover object-center opacity-85 sm:opacity-90"
        />
        {/* Soft overlay to keep calculator card and text sharp and readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/70 to-white/30 pointer-events-none"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Mutual Fund Centre */}
          <div className="lg:col-span-6 space-y-6">
            
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

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl">
              Whether saving for retirement, your child's education, or a dream home — our goal-based mutual fund platform helps you invest with purpose and discipline.
            </p>

            {/* 4 Feature Badges in 2x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-gray-200/80 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">SIP Investments</div>
                  <div className="text-xs text-gray-500">Start with ₹500/month</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-gray-200/80 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">Goal-Based Investing</div>
                  <div className="text-xs text-gray-500">Achieve life milestones</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-gray-200/80 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <PieChart className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">2,500+ Fund Schemes</div>
                  <div className="text-xs text-gray-500">All AMCs on one platform</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-gray-200/80 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
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

            {/* Bottom 3 Benefit Checkpoints matching Page 6 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-gray-200/80 text-xs">
              <div className="flex items-start gap-2 text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-gray-900">Disciplined investing</strong>
                  <span className="text-gray-500">Create wealth systematically</span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-gray-700">
                <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  ₹
                </div>
                <div>
                  <strong className="block text-gray-900">Power of Compounding</strong>
                  <span className="text-gray-500">Let money grow exponentially</span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-gray-700">
                <TrendingUp className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-gray-900">Secure Your Future</strong>
                  <span className="text-gray-500">Plan today for tomorrow</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: SIP Calculator Card matching Page 6 */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl relative overflow-hidden">
              
              {/* Header Badge */}
              <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0f4b32] text-white text-sm font-bold shadow-sm">
                  <Calculator className="w-4 h-4 text-amber-400" />
                  <span>SIP Calculator</span>
                </div>

                <button 
                  onClick={() => {
                    setMonthlyInvestment(25000);
                    setYears(10);
                    setExpectedReturn(12);
                  }}
                  className="text-xs font-semibold text-gray-500 hover:text-emerald-800 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Reset to default"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Sliders & Inputs */}
              <div className="space-y-6 py-6">
                
                {/* Monthly Investment */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Monthly Investment
                    </label>
                    <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg text-sm font-bold text-gray-900">
                      <span className="text-gray-400 text-xs">₹</span>
                      <input 
                        type="number" 
                        value={monthlyInvestment} 
                        onChange={(e) => setMonthlyInvestment(Math.max(500, Number(e.target.value)))}
                        className="w-24 bg-transparent outline-none text-right font-bold"
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
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0f4b32]"
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                    <span>₹500</span>
                    <span>₹1,00,000</span>
                    <span>₹2,00,000</span>
                  </div>
                </div>

                {/* Investment Period */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Investment Period
                    </label>
                    <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg text-sm font-bold text-gray-900">
                      <input 
                        type="number" 
                        value={years} 
                        onChange={(e) => setYears(Math.max(1, Math.min(40, Number(e.target.value))))}
                        className="w-12 bg-transparent outline-none text-right font-bold"
                        min={1}
                        max={40}
                      />
                      <span className="text-gray-500 text-xs">Years</span>
                    </div>
                  </div>
                  <input 
                    type="range" 
                    min={1} 
                    max={30} 
                    step={1} 
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0f4b32]"
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                    <span>1 Yr</span>
                    <span>15 Yrs</span>
                    <span>30 Yrs</span>
                  </div>
                </div>

                {/* Expected Return */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Expected Return (p.a.)
                    </label>
                    <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg text-sm font-bold text-gray-900">
                      <input 
                        type="number" 
                        value={expectedReturn} 
                        onChange={(e) => setExpectedReturn(Math.max(1, Math.min(30, Number(e.target.value))))}
                        className="w-12 bg-transparent outline-none text-right font-bold"
                        min={1}
                        max={30}
                      />
                      <span className="text-gray-500 text-xs">%</span>
                    </div>
                  </div>
                  <input 
                    type="range" 
                    min={5} 
                    max={25} 
                    step={0.5} 
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#d97706]"
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                    <span>5%</span>
                    <span>15%</span>
                    <span>25%</span>
                  </div>
                </div>

              </div>

              {/* Dynamic Calculation Breakdown and Donut Chart */}
              <div className="pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                
                {/* Figures List */}
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Total Investment</div>
                    <div className="text-xl font-black text-gray-800">
                      {formatCurrency(totalInvestment)}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500 font-medium">Estimated Returns</div>
                    <div className="text-xl font-black text-emerald-800">
                      {formatCurrency(estimatedReturns)}
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200/80">
                    <div className="text-xs text-emerald-900 font-semibold">Total Wealth</div>
                    <div className="text-2xl font-black text-[#0f4b32]">
                      {formatCurrency(totalWealth)}
                    </div>
                  </div>
                </div>

                {/* SVG Donut Chart with Total Wealth centered */}
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-44 h-44 flex items-center justify-center">
                    <svg viewBox="0 0 160 160" className="w-40 h-40 transform -rotate-90">
                      {/* Background circle (Investment) */}
                      <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        stroke="#0f4b32"
                        strokeWidth="20"
                        fill="transparent"
                      />
                      {/* Returns circle (Warm Amber/Gold) */}
                      <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        stroke="#e8a317"
                        strokeWidth="20"
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
    </section>
  );
}
