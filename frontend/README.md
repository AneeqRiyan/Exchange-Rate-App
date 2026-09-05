# 🌐 Exchange Rate Frontend Application

Modern React Single Page Application (SPA) for real-time exchange rates lookup and currency conversions powered by the European Central Bank (ECB) API.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Ensure `.env` file exists:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 3. Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Build for Production
```bash
npm run build
```
Build artifacts are automatically output to `../src/main/resources/static` for integration with Spring Boot.

### 5. Linting
```bash
npm run lint
```

---

## 📁 Key Directories
- `src/components/exchange/` - CurrencyConverter, RateLookup, CurrencyList
- `src/components/common/` - Header, Footer, LoadingSpinner, ErrorMessage
- `src/services/api.js` - Axios API client
- `src/hooks/` - `useExchangeRates` state management hook
- `src/styles/` - Custom design system & Tailwind styling
