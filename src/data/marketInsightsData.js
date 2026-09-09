// Dynamic Market Insights & In-Depth Research Data

export const INITIAL_INDICES = [
  {
    id: "nifty50",
    name: "NIFTY 50",
    baseValue: 24852.15,
    value: 24852.15,
    change: "+164.20 (+0.67%)",
    changeVal: 164.20,
    changePercent: 0.67,
    positive: true,
    dayHigh: "24,910.40",
    dayLow: "24,780.10",
    volume: "24.8 Cr",
    pe: "22.45"
  },
  {
    id: "sensex",
    name: "SENSEX",
    baseValue: 81332.72,
    value: 81332.72,
    change: "+512.40 (+0.63%)",
    changeVal: 512.40,
    changePercent: 0.63,
    positive: true,
    dayHigh: "81,520.15",
    dayLow: "81,105.00",
    volume: "18.2 Cr",
    pe: "24.10"
  },
  {
    id: "banknifty",
    name: "BANK NIFTY",
    baseValue: 51240.60,
    value: 51240.60,
    change: "+280.90 (+0.55%)",
    changeVal: 280.90,
    changePercent: 0.55,
    positive: true,
    dayHigh: "51,450.80",
    dayLow: "51,020.30",
    volume: "12.5 Cr",
    pe: "16.80"
  },
  {
    id: "indiavix",
    name: "INDIA VIX",
    baseValue: 13.42,
    value: 13.42,
    change: "-0.45 (-3.24%)",
    changeVal: -0.45,
    changePercent: -3.24,
    positive: false,
    dayHigh: "14.10",
    dayLow: "13.20",
    volume: "Volatility",
    pe: "Low Vol"
  },
  {
    id: "niftymidcap",
    name: "NIFTY MIDCAP 100",
    baseValue: 58920.45,
    value: 58920.45,
    change: "+442.10 (+0.76%)",
    changeVal: 442.10,
    changePercent: 0.76,
    positive: true,
    dayHigh: "59,100.00",
    dayLow: "58,650.00",
    volume: "35.1 Cr",
    pe: "31.20"
  },
  {
    id: "giftnifty",
    name: "GIFT NIFTY",
    baseValue: 24915.00,
    value: 24915.00,
    change: "+195.00 (+0.79%)",
    changeVal: 195.00,
    changePercent: 0.79,
    positive: true,
    dayHigh: "24,960.00",
    dayLow: "24,810.00",
    volume: "International",
    pe: "Premium"
  }
];

export const RESEARCH_ARTICLES = [
  {
    id: "renewable-energy-unlisted",
    slug: "renewable-energy-power-exchanges-unlisted-demand",
    tag: "Pre-IPO Sector Watch",
    category: "Pre-IPO & Unlisted",
    title: "Renewable Energy & Power Exchanges witness surging demand in unlisted markets",
    subtitle: "How India's accelerating energy transition and peak merchant electricity demand are driving institutional accumulation in unlisted green power giants.",
    date: "Today, 11:30 AM",
    publishedAt: "September 09, 2026",
    readTime: "4 min read",
    author: "Advisory Research Desk",
    authorRole: "Senior Institutional Analyst",
    views: "2,480",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
    summary: "As India's peak power demand scales past historical highs, private power exchange platforms, renewable EPC contractors, and solar-wind hybrid developers in the unlisted market are commanding substantial valuation premiums ahead of anticipated DRHP filings.",
    keyTakeaways: [
      "Peak merchant power clearing rates have sustained above ₹8.50/kWh on spot exchanges.",
      "Unlisted green energy players boast healthy 3-year revenue CAGRs of 32% to 48%.",
      "Institutional HNI inflows into pre-IPO renewable assets rose by 64% year-on-year.",
      "Anchor valuations indicate strong potential for multi-fold upside upon eventual mainline listing."
    ],
    metrics: [
      { label: "Sector 3-Yr Revenue CAGR", value: "38.5%" },
      { label: "Target Capacity by 2030", value: "500 GW" },
      { label: "Average Pre-IPO P/E", value: "24.8x" },
      { label: "Institutional Inflow QoQ", value: "+42%" }
    ],
    contentSections: [
      {
        heading: "1. The Structural Energy Shift in India's Economy",
        text: "India's rapid industrial expansion and soaring residential electrification have created an unprecedented surge in peak electricity demand. Unlike traditional fossil-heavy utility models, the modern power landscape is dominated by renewable EPC leaders, energy storage solutions, and digital power exchanges that facilitate round-the-clock trading.",
        bullets: [
          "Merchant market volumes have grown at a 22% CAGR over the last four years.",
          "Government mandates for Renewable Purchase Obligations (RPO) are accelerating enterprise adoption.",
          "Private capital is aggressively seeking pure-play unlisted renewable innovators before mainline listing lock-ins."
        ]
      },
      {
        heading: "2. Valuation Analysis: Unlisted vs. Listed Peers",
        text: "When comparing unlisted renewable market leaders with listed peers like Adani Green, Tata Power, and IEX, unlisted shares currently trade at an attractive 30% to 45% discount on forward price-to-earnings (P/E) multiples. This valuation gap offers long-term HNIs and astute family offices an asymmetric risk-reward proposition.",
        bullets: [
          "Listed peers trade at 45x - 65x forward earnings, whereas unlisted contenders hover around 24x - 28x.",
          "Strong order books ensure high revenue visibility extending across 36 to 48 months.",
          "Substantial dividend yields and robust ROE figures exceeding 19% across benchmark players."
        ]
      },
      {
        heading: "3. Strategic Portfolio Allocation Advice",
        text: "For wealth preservation and multi-generational capital appreciation, analysts recommend allocating 5% to 10% of total equity portfolios into curated pre-IPO renewable and exchange leaders with verified depository holding records (CDSL/NSDL).",
        bullets: [
          "Stagger allocations across 2 to 3 market leaders rather than concentrating on a single name.",
          "Maintain an investment horizon of 18 to 36 months to capture the complete pre-IPO to listing lifecycle.",
          "Verify off-market transfer settlement through institutional escrow and CDSL depository transfers."
        ]
      }
    ],
    analystVerdict: "Bullish Accumulation. Unlisted power exchanges and renewable infrastructure pioneers present one of the most compelling risk-adjusted alpha opportunities in the Indian private equity ecosystem."
  },
  {
    id: "ipo-calendar-review",
    slug: "upcoming-mainboard-sme-ipos-issue-size-anchor-bids",
    tag: "IPO Calendar",
    category: "IPO & Primary Market",
    title: "Upcoming Mainboard & SME IPOs: Review of issue size, price band and anchor bids",
    subtitle: "Comprehensive review of the Q3 primary market pipeline, anchor investor demand, gray market premiums (GMP), and listing strategy.",
    date: "Yesterday",
    publishedAt: "September 08, 2026",
    readTime: "5 min read",
    author: "Equity Capital Markets Team",
    authorRole: "Primary Markets Lead",
    views: "3,890",
    badgeColor: "bg-blue-100 text-blue-900 border-blue-300",
    summary: "With over 18 mainline and SME issues scheduled over the coming quarter totaling over ₹42,000 Crores, we evaluate promoter track records, debt-to-equity ratios, OFS versus fresh issue proportions, and anchor book quality.",
    keyTakeaways: [
      "Fresh issue capital utilization is heavily skewed towards capex expansion and deleveraging.",
      "Anchor book allocations from marquee DIIs and sovereign wealth funds exceed 60% of QIB quotas.",
      "SME IPOs show high retail oversubscription; disciplined selectivity based on audited cash flows is crucial.",
      "ASBA and paperless UPI IPO applications allow zero loss of savings interest until allotment."
    ],
    metrics: [
      { label: "Total Pipeline Size", value: "₹42,500 Cr" },
      { label: "Avg. QIB Anchor Bids", value: "4.8x" },
      { label: "Expected Listing Premium", value: "18% - 35%" },
      { label: "Total Active Issues", value: "12 Mainline" }
    ],
    contentSections: [
      {
        heading: "1. Primary Market Liquidity & Anchor Sentiment",
        text: "Domestic mutual funds, insurance companies, and global institutional investors (FIIs) continue to show robust demand for IPOs priced at fair valuations. The latest anchor book participation reveals that over 70% of anchor allotments have been secured by top-tier mutual funds.",
        bullets: [
          "High quality anchor participation reduces post-listing volatility and stabilizes price discovery.",
          "Companies with less than 25% Offer for Sale (OFS) component are generating the highest subscription multiples.",
          "Niche manufacturing, electronics EMS, and specialty chemicals lead the subscription demand."
        ]
      },
      {
        heading: "2. Red Flags & Due Diligence Checklist",
        text: "Investors must exercise rigorous caution during heated IPO markets. Key parameters to examine include non-promoter dilution, related party transactions, and sudden spike in revenue figures during the pre-IPO financial year.",
        bullets: [
          "Check whether the fresh issue funds will be deployed in productive revenue-generating capex or debt reduction.",
          "Scrutinize promoter pledges and contingent liabilities in the Red Herring Prospectus (RHP).",
          "Avoid SME issues lacking audited track records of positive operating cash flows (OCF)."
        ]
      }
    ],
    analystVerdict: "Selective Participation. Focus on capital goods, defense electronics, and consumer tech IPOs with proven profitability and low OFS overhang."
  },
  {
    id: "mutual-fund-valuation-sip",
    slug: "large-midcap-vs-flexicap-funds-sip-valuation-levels",
    tag: "Mutual Fund Research",
    category: "Mutual Funds & SIP",
    title: "Large & Midcap vs Flexicap Funds: Which SIP category fits current valuation levels?",
    subtitle: "A data-backed guide on optimizing monthly SIP allocations across market capitalization tiers amidst elevated benchmark valuations.",
    date: "2 days ago",
    publishedAt: "September 07, 2026",
    readTime: "4 min read",
    author: "Portfolio Management Desk",
    authorRole: "Chief Investment Strategist",
    views: "4,120",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    summary: "With broad-market indices trading near historical averages, selecting the right fund category between Large & Midcap combinations and unconstrained Flexicap funds is pivotal for mitigating downside volatility.",
    keyTakeaways: [
      "Flexicap funds offer fund managers the freedom to tilt towards large-caps when mid/small valuations stretch.",
      "Large & Midcap funds guarantee minimum 35% exposure each in stable giants and high-growth mid-tier leaders.",
      "Systematic Investment Plans (SIP) over 7+ years have historically yielded double-digit CAGR across both categories.",
      "Rupee cost averaging automatically accumulates higher unit counts during intermittent market dips."
    ],
    metrics: [
      { label: "10-Yr Flexicap Category CAGR", value: "14.8%" },
      { label: "10-Yr Large & Midcap CAGR", value: "15.9%" },
      { label: "Current Large-Cap P/E", value: "21.8x" },
      { label: "Current Mid-Cap P/E", value: "29.4x" }
    ],
    contentSections: [
      {
        heading: "1. Flexibility vs. Mandatory Allocation",
        text: "Flexicap funds provide agile portfolio managers complete discretion to adjust large, mid, and small cap proportions based on real-time market cycles. In contrast, Large & Midcap funds enforce strict 35% minimum allocations in both categories.",
        bullets: [
          "In high-valuation phases, Flexicap funds typically increase large-cap ballast to 65%-75% to cushion drawdowns.",
          "Large & Midcap funds maintain aggressive growth potential, ideal for investors with 8+ year investment horizons."
        ]
      },
      {
        heading: "2. The Ideal SIP Asset Allocation Framework",
        text: "For retail investors and salaried professionals, an ideal core-and-satellite SIP portfolio blends 50% Flexicap, 30% Large & Midcap, and 20% hybrid/debt funds for balanced, tax-efficient wealth compounding.",
        bullets: [
          "Step-up SIPs by 10% annually to match salary increments and beat inflation comfortably.",
          "Review fund performance bi-annually against benchmark indices (NIFTY 500 TRI) rather than short-term 1-month noise."
        ]
      }
    ],
    analystVerdict: "Overweight Flexicap for conservative wealth accumulators; Blend 60:40 with Large & Midcap for aggressive investors with 10+ year retirement goals."
  },
  {
    id: "pre-ipo-wealth-creation-masterclass",
    slug: "pre-ipo-wealth-creation-investing-masterclass",
    tag: "Wealth Advisory",
    category: "Pre-IPO & Unlisted",
    title: "Pre-IPO Investing Masterclass: How early-stage unlisted equity compounds long-term wealth",
    subtitle: "Understanding off-market depository transfers, lock-in regulations, valuation models, and pre-IPO entry points.",
    date: "3 days ago",
    publishedAt: "September 06, 2026",
    readTime: "6 min read",
    author: "GSP Private Wealth Desk",
    authorRole: "Director - Unlisted Equities",
    views: "5,340",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
    summary: "A step-by-step masterclass explaining how institutional and family office investors access high-growth disruptors prior to their public exchange debut with CDSL/NSDL demat security.",
    keyTakeaways: [
      "Unlisted shares are held securely in your existing CDSL or NSDL Demat account with unique ISIN codes.",
      "Pre-IPO stage provides ground-floor pricing before retail oversubscription inflates valuation.",
      "Statutory post-IPO lock-in for pre-IPO non-promoter shareholders is now reduced to 6 months.",
      "Direct settlement via banking channels ensures transparent fund and security transfers."
    ],
    metrics: [
      { label: "Lock-in Period Post-IPO", value: "6 Months" },
      { label: "Historical Pre-IPO Alpha", value: "3x - 5x" },
      { label: "Transfer Mode", value: "DIS / CDSL Easiest" },
      { label: "Security Format", value: "Demat ISIN" }
    ],
    contentSections: [
      {
        heading: "1. The Anatomy of Pre-IPO Value Creation",
        text: "When promising companies transition from private equity funding to public exchange listing, significant wealth creation occurs in the 24 to 36 months leading up to the IPO. Entering at this stage allows investors to capture institutional re-rating.",
        bullets: [
          "Early entry avoids unpredictable lottery-based retail IPO allotment quotas.",
          "Investors participate in fundamental business expansion without daily secondary market panic selling."
        ]
      },
      {
        heading: "2. The Complete Settlement & Custody Process",
        text: "Pre-IPO shares purchased through GSP Investment are credited directly to your personal CDSL or NSDL demat account via official off-market inter-depository transfers, matching the highest institutional governance benchmarks.",
        bullets: [
          "Every unlisted security has a distinct 12-digit ISIN recognized by Indian depositories.",
          "Holding statements appear directly in your depository mobile app and consolidated account statement (CAS)."
        ]
      }
    ],
    analystVerdict: "High Alpha Opportunity. Recommend building a diversified basket of 4-6 fundamentally robust unlisted companies across financial infrastructure, green energy, and consumer tech."
  }
];
