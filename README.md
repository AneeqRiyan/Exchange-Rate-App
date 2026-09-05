# 💱 Exchange Rate & Currency Converter Application

A full-stack currency exchange rate and conversion service built with **Spring Boot 3**, **React 18**, **Vite**, **Tailwind CSS**, and data sourced directly from the **European Central Bank (ECB)**.

---

## 📑 Table of Contents
- [Architecture Overview](#-architecture-overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
  - [1. Backend Setup](#1-backend-setup-spring-boot)
  - [2. Frontend Setup](#2-frontend-setup-react--vite)
  - [3. Docker / Containerized Setup](#3-docker--docker-compose-setup)
- [API Documentation](#-api-documentation)
- [Environment Variables](#-environment-variables)
- [Testing](#-testing)
- [Identified Issues & Roadmap](#-identified-issues--roadmap)

---

## 🏛 Architecture Overview

The system operates as a client-server architecture:
1. **Backend (Spring Boot)**:
   - Fetches official daily reference rates from the European Central Bank XML feed (`eurofxref-daily.xml`).
   - Computes real-time exchange rates (EUR base, cross-currency rates using triangular calculation `fromCurrency -> EUR -> toCurrency`).
   - Tracks currency query metrics in memory.
   - Exposes RESTful endpoints for conversion, rate lookup, and metrics.
2. **Frontend (React + Vite + Tailwind CSS)**:
   - Single Page Application (SPA) offering an interactive currency converter, exchange rate lookup, and a currency popularity dashboard.
   - Built with responsive design, glassmorphism aesthetics, and real-time state management.

```
+--------------------+        HTTP / REST        +------------------------+
| React SPA Frontend | <=======================> | Spring Boot 3 Backend  |
|  (Vite + Tailwind) |                           |       (Port 8080)      |
+--------------------+                           +-----------+------------+
                                                             |
                                                       HTTP / XML Feed
                                                             v
                                                 +------------------------+
                                                 | European Central Bank  |
                                                 | (Daily Reference Rates)|
                                                 +------------------------+
```

---

## 🛠 Tech Stack

### Backend
- **Java 17 / 21**
- **Spring Boot 3.5.5**
  - Spring Web (MVC / REST API)
  - Spring Boot Actuator
  - Spring Validation
  - Spring Cache
- **Jackson XML / DOM Parser** (for secure ECB XML processing)
- **Maven** (build & dependency management)

### Frontend
- **React 18** (functional components, custom hooks)
- **Vite 4.5+** (fast bundler & dev server)
- **Tailwind CSS 3.3** (utility-first styling & responsive layouts)
- **React Router DOM 6** (client-side routing)
- **Axios** (HTTP client with interceptors)
- **Lucide React** (modern iconography)

---

## 📁 Project Structure

```
.
├── Dockerfile                      # Multi-stage Docker build (Frontend + Backend)
├── docker-compose.yml              # Container orchestration configuration
├── pom.xml                         # Maven build configuration
├── HELP.md                         # Spring Boot reference guides
├── README.md                       # Project documentation
├── src/
│   ├── main/
│   │   ├── java/com/ExchangeApp/project/
│   │   │   ├── ProjectApplication.java       # Spring Boot main class
│   │   │   ├── config/
│   │   │   │   └── WebConfig.java            # CORS & RestTemplate configuration
│   │   │   ├── controller/
│   │   │   │   └── ExchangeRateController.java # REST API endpoints
│   │   │   ├── model/
│   │   │   │   ├── ConversionResult.java     # Conversion response DTO
│   │   │   │   ├── CurrencyRequest.java      # Currency metric DTO
│   │   │   │   └── ExchangeRate.java         # Exchange rate DTO
│   │   │   └── service/
│   │   │       ├── ECBRateFetcherService.java # ECB XML fetcher & DOM parser
│   │   │       └── ExchangeRateService.java   # Rate computation & business logic
│   │   └── resources/
│   │       └── application.properties        # Application configuration
│   └── test/
│       └── java/com/ExchangeApp/project/
│           ├── ProjectApplicationTests.java  # Integration & unit tests
│           ├── TestProjectApplication.java   # Test runner
│           └── TestcontainersConfiguration.java
└── frontend/
    ├── index.html                  # HTML entry point
    ├── package.json                # Node dependencies & scripts
    ├── vite.config.js              # Vite configuration & proxy
    ├── tailwind.config.js          # Tailwind CSS theme configuration
    ├── .env                        # Local frontend environment variables
    └── src/
        ├── App.jsx                 # Main layout & router setup
        ├── main.jsx                # React DOM render entry
        ├── components/
        │   ├── common/             # Reusable UI (Header, Footer, Spinner, ErrorMessage)
        │   ├── exchange/           # RateLookup, CurrencyConverter, CurrencyList
        │   └── layout/             # Navigation bar
        ├── hooks/
        │   ├── useExchangeRates.js # API communication hook
        │   └── useLocalStorage.js  # Local storage management hook
        ├── services/
        │   └── api.js              # Axios API service
        ├── styles/
        │   └── index.css           # Design tokens & custom CSS utilities
        └── utils/
            ├── formatters.js       # Number, date, currency formatting
            └── validators.js       # Input & currency validation rules
```

---

## ⚙️ Prerequisites

- **Java JDK**: Version 17 or higher
- **Node.js**: Version 18.x or higher & npm
- **Maven**: Version 3.8+ (or use the included `./mvnw` wrapper)
- **Docker & Docker Compose** *(optional, for containerization)*

---

## 🚀 Getting Started

### 1. Backend Setup (Spring Boot)

1. Open a terminal in the root directory:
   ```bash
   cd "path/to/project"
   ```
2. Build the project using the Maven wrapper:
   ```bash
   # Linux / macOS
   ./mvnw clean install

   # Windows (PowerShell or CMD)
   .\mvnw.cmd clean install
   ```
3. Run the Spring Boot application:
   ```bash
   # Linux / macOS
   ./mvnw spring-boot:run

   # Windows (PowerShell or CMD)
   .\mvnw.cmd spring-boot:run
   ```
4. The backend server will start at `http://localhost:8080`.
    - **Interactive Swagger / OpenAPI UI**: `http://localhost:8080/swagger-ui.html`
    - **OpenAPI JSON Docs**: `http://localhost:8080/api-docs`
    - **Actuator Health Check**: `http://localhost:8080/actuator/health` (includes ECB custom health status)

---

### 2. Frontend Setup (React + Vite)

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Ensure `.env` is configured (or copy from `.env.example`):
   ```env
   # In local Vite development, Vite proxies '/api' to 'http://localhost:8080'
   VITE_API_BASE_URL=/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser at `http://localhost:5173`.

---

### 3. Docker / Docker Compose Setup

Run both frontend and backend seamlessly in an isolated multi-stage container:

```bash
docker-compose up --build
```
- The multi-stage Docker build compiles the Vite frontend into static assets, copies them into Spring Boot's `src/main/resources/static`, packages the unified runnable JAR, and runs it with a Docker container health check.
- Access the full web application: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- Health check: `http://localhost:8080/actuator/health`

---

## 📡 API Documentation

Base URL: `http://localhost:8080/api/exchange-rates`
Interactive Docs: `http://localhost:8080/swagger-ui.html`

### 1. Get Exchange Rate
- **URL**: `/rate/{from}/{to}`
- **Method**: `GET`
- **Path Variables**:
  - `from` *(string, 3-letter currency code, e.g., `EUR`)*
  - `to` *(string, 3-letter currency code, e.g., `USD`)*
- **Response**: `200 OK`
  ```json
  {
    "baseCurrency": "EUR",
    "targetCurrency": "USD",
    "rate": 1.166900,
    "date": "2026-09-04"
  }
  ```

---

### 2. Convert Amount
- **URL**: `/convert`
- **Method**: `GET`
- **Query Parameters**:
  - `from` *(string, e.g., `EUR`)*
  - `to` *(string, e.g., `USD`)*
  - `amount` *(number/decimal > 0, e.g., `100.50`)*
- **Response**: `200 OK`
  ```json
  {
    "fromCurrency": "EUR",
    "toCurrency": "USD",
    "amount": 100.50,
    "convertedAmount": 117.2735
  }
  ```

---

### 3. Get Supported Currencies & Usage Statistics
- **URL**: `/currencies`
- **Method**: `GET`
- **Response**: `200 OK`
  ```json
  [
    {
      "currency": "EUR",
      "requestCount": 5
    },
    {
      "currency": "USD",
      "requestCount": 14
    },
    {
      "currency": "GBP",
      "requestCount": 8
    }
  ]
  ```

---

### 4. Get Last Updated Metadata
- **URL**: `/last-updated`
- **Method**: `GET`
- **Response**: `200 OK`
  ```json
  {
    "lastRefreshed": "2026-09-05T01:03:47.365",
    "ecbRateDate": "2026-09-04"
  }
  ```

---

### 5. Refresh Rates from ECB
- **URL**: `/refresh`
- **Method**: `POST`
- **Response**: `200 OK`
  ```json
  {
    "message": "Rates refreshed successfully"
  }
  ```

---

## 🧪 Testing

### Running Backend Unit & Integration Tests
```bash
# Windows
.\mvnw.cmd test

# Linux/macOS
./mvnw test
```

### Running Frontend Linter & Build Validation
```bash
cd frontend
npm run lint
npm run build
```

---

## ✅ Completed Improvements & Enhancements

- [x] **Missing Endpoint**: Implemented `GET /api/exchange-rates/last-updated` returning `LastUpdatedResponse`.
- [x] **Scheduled Auto-Refresh**: Added `@EnableScheduling` with cron `0 15 16 * * MON-FRI` aligned with ECB releases.
- [x] **Cache Integration**: Added Spring Cache (`@Cacheable`, `@CacheEvict`) for rate fetching with eviction.
- [x] **Offline Resilience & Fallback**: App initializes safely with fallback rates if ECB is unreachable during startup.
- [x] **Thread-Safe Atomic Swap**: Replaced unsafe map clear/put with volatile copy-on-write reference swap.
- [x] **Input Validation & Structured Errors**: Added `@Positive` amount validation, O(1) currency verification, and `GlobalExceptionHandler` with `ApiErrorResponse`.
- [x] **Lombok & Clean Code**: Refactored models with Lombok and private encapsulation; removed dead code in fetcher.
- [x] **Interactive OpenAPI/Swagger**: Integrated SpringDoc OpenAPI UI at `/swagger-ui.html`.
- [x] **Custom Actuator Health Check**: Added `ECBHealthIndicator` reporting ECB status, date, and currency count.
- [x] **Docker Multi-stage Architecture**: Fixed Vite static asset placement, healthcheck, and auto-restart policy.
- [x] **SPA Routing**: Added `SpaForwardController` to prevent 404s on browser refresh of client-side routes.
- [x] **Frontend Fixes**: Fixed hardcoded API URL, zero division NaN in popularity bar, and misleading time display.
