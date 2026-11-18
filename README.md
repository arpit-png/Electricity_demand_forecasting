# Antigravity Quantum Vault & Motion UI Suite

A high-performance full-stack web application combining fluid, Awwwards-grade motion UI physics with an enterprise-grade cryptographic backend. Engineered to boot concurrently with a single command.

## 🚀 Key Features

- **Creative Frontend Motion:**
  - **Framer Motion Page Transitions:** Seamless page entry/exit with custom cubic-bezier spring curves.
  - **GSAP Staggered Hero Reveal:** Character-by-character 3D perspective timeline transforms.
  - **GSAP ScrollTrigger:** Dynamic viewport-triggered feature highlights.
  - **3D Parallax Tilt Card:** Real-time spring-physics mouse tracking with dynamic specular glare.
- **Defense-in-Depth Security:**
  - **Data-at-Rest Encryption:** AES-256-GCM authenticated cipher with 96-bit random IVs and integrity auth tags.
  - **Authentication:** Edge-compatible JOSE JWT signed with HS256, sealed in `HttpOnly`, `SameSite=Strict`, `Secure` cookies.
  - **Password Protection:** Bcrypt with 12 salt rounds.
  - **API Defense:** In-memory sliding-window rate limiting and Zod schema validation.
- **Zero-Config Database:**
  - SQLite managed via Prisma (`dev.db`). No external database servers needed.

## 🛠️ Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/arpit-png/Electricity_demand_forecasting.git
cd Electricity_demand_forecasting

# 2. Install dependencies
npm install

# 3. Synchronize database and launch
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access the application.
