# 📈 GSP Investment Pvt. Ltd. — Financial & Wealth Platform

A modern, responsive, and full-featured financial investment platform built with React 19, Tailwind CSS v4, and Vite, featuring centralized cross-browser inquiry management, real-time Google Sheets webhook sync, and instant Excel export.

---

## 🌟 Key Features

- **9 Full Design Sections Replicated from PDF Specification**:
  1. **Page 1: Home & Hero Section** — Live animated portfolio value card (Reliance, HDFC Bank, TCS holdings, SIP tracker, sparkline) with natural money plant foliage background.
  2. **Page 2: Popular Unlisted Shares** — Interactive price discovery for unlisted equities (MSEI, NSE India, HPX India, Onix Renewable).
  3. **Page 3: Investor Service Centre** — 6 service action tiles (Open Demat Account, IPO Application, Mutual Funds, KYC Update, Account Closure, Fund Transfer) with panoramic golden wealth backdrop.
  4. **Page 4: Trade Across Every Device** — Platform features for Web Trading, Mobile App, and Desktop Terminal.
  5. **Page 5: Investment Products & Loan Solutions** — 6 core investment categories and 7 specialized loan solutions.
  6. **Page 6: Mutual Fund Centre & Interactive SIP Calculator** — Live dual sliders with compounding return formulas, dynamic SVG Donut chart, and growth visuals.
  7. **Page 7: Verified Client Reviews** — 4.9-star rating badge and verified Google investor testimonials.
  8. **Page 8: Details for Shares (Stock Deep-Dive)** — Complete stock profile, key metrics, company overview, and Buy/Sell Enquiry form.
  9. **Page 9: Contact & Branch Network** — Registered office address, CDSL/NSDL e-voting quick links, helpline, and Request a Callback form.

- **🗄️ Real Central Server Database (`database/`)**:
  - Persistent JSON file database (`database/enquiries.json` & `database/users.json`).
  - Synced in real time across all browsers, incognito sessions, and mobile devices via REST API (`/api/enquiries`).

- **🔐 Central Admin Desk**:
  - Protected with PIN authorization (`admin123`).
  - Search, filter by inquiry type (Buy, Sell, Callback, Account), and instant record deletion.
  - **1-Click Excel Download (.CSV)** with UTF-8 BOM encoding for direct opening in Microsoft Excel.
  - **Real-Time Google Sheets Webhook Sync** with automated lead forwarding.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Tailwind CSS v4 (`@tailwindcss/vite`), Lucide Icons (`lucide-react`)
- **Backend & Middleware**: Express.js, Vite Dev Server API middleware (`apiMiddleware.js`)
- **Build Tool**: Vite v8
- **Data & Export**: Custom CSV generator (`exportUtils.js`), Google Apps Script Webhook integration

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/ARI-23o/Investment-Platform.git
cd Investment-Platform
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for production
```bash
npm run build
```

### 5. Run standalone production server (Optional)
```bash
npm start
# or node server.js
```

---

## 📁 Project Structure

```
├── database/               # Centralized persistent JSON database
│   ├── enquiries.json      # All customer inquiries & leads
│   ├── settings.json       # Webhook configuration
│   └── users.json          # Registered Demat accounts
├── public/
│   └── assets/             # High-resolution optimized background graphics
├── src/
│   ├── components/         # Modular React components for all 9 sections
│   ├── data/               # Stock and market data
│   ├── services/           # REST API client & real-time synchronization
│   ├── utils/              # Excel export & Google Sheets sync utilities
│   ├── App.jsx             # Main application controller
│   └── main.jsx            # Entry point
├── apiMiddleware.js        # Integrated Vite dev server API
├── server.js               # Standalone Express backend server
└── vite.config.js          # Vite & Tailwind configuration
```

---

## 🔒 Admin Desk Credentials

- **Default PIN**: `admin123`
- Access via **`Admin Desk & Excel 🔐`** in the website footer.
