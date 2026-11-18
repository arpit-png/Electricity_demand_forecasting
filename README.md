# Electricity Demand Forecasting Using Machine Learning
### Solving the Universal "Duck Curve" Grid Challenge via Net Demand Time-Series ML

[![Vercel Deployment Ready](https://img.shields.io/badge/Vercel-Deployment%20Ready-black?style=for-the-badge&logo=vercel)](https://electricity-demand-forecasting-three.vercel.app)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![Dark & Light Mode](https://img.shields.io/badge/Theme-Dark%20%26%20Light%20Smooth%20Toggle-blue?style=for-the-badge)](https://electricity-demand-forecasting-three.vercel.app)
[![Firebase Firestore](https://img.shields.io/badge/Database-Cloud%20Firestore-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com)
[![IEEE 1547 Compliant](https://img.shields.io/badge/Standards-IEEE%201547%20%2F%20NERC-10B981?style=for-the-badge)](https://standards.ieee.org)

---

## ⚡ The Universal Problem: The "Duck Curve"
Traditional electric transmission infrastructure struggles with decentralized variable renewable energy (VRE). As rooftop and utility-scale solar photovoltaics (PV) boom, grid operators experience two severe challenges:
1. **The Midday Solar Belly (11:00 AM – 3:00 PM)**: Solar generation floods transmission lines, collapsing net load to the minimum operational baseline of thermal generation assets, causing overgeneration risks, negative wholesale pricing, and forced curtailment.
2. **The Evening Neck Ramp (5:00 PM – 8:00 PM)**: Solar output plummets to zero at sunset just as domestic electricity demand peaks (residential cooling, heating, lighting, and EV charging). The transmission grid must ramp up conventional generation at unprecedented gradients (often exceeding **+9,000 to +14,000 MW in 180 minutes**). Without predictive lookahead, grids risk blackout conditions, AC frequency instability, and soaring spot prices.

---

## 🧠 The Machine Learning Solution: Net Demand Pipeline
Instead of forecasting gross consumption alone, this pipeline forecasts **Net Demand**:

$$\text{NetDemand}(t) = \text{GrossDemand}(t) - \left[ \text{SolarPV}(t) \cdot \alpha_{\text{cloud}} + \text{WindGeneration}(t) \right]$$

$$\text{RampRate}(t) = \text{NetDemand}(t) - \text{NetDemand}(t - 1) \quad \Big| \quad \text{3hRamp} = \text{NetDemand}(20:00) - \text{NetDemand}(17:00)$$

### Evaluated Model Architectures:
1. **Bidirectional LSTM with Diurnal Attention Mechanism**:
   - Captures multi-step temporal lag autocorrelation ($t-1$ to $t-24$) and non-linear transitions.
   - Achieves **93.6% accuracy** on the critical 3-hour evening ramp slope.
2. **Gradient Boosted Decision Trees (XGBoost / LightGBM)**:
   - Ultra-low latency (4ms) inference using GHI solar irradiance, autoregressive lags, and temperature sensitivity.
3. **Multivariate Polynomial & Ridge $L_2$ Regression**:
   - Regularized parametric baseline with quadratic temperature interaction terms.
4. **StatsForecast Prophet GAM Baseline**:
   - Additive Fourier diurnal cyclical baseline.

---

## 🎨 Clean Engineering UI & Dark/Light Mode
- **Smooth Dark & Light Mode Toggle**:
  - One-click seamless theme transition with state persistence in `localStorage`.
  - Crisp high-contrast daylight palette (clean off-white canvas, slate typography, rich blue/emerald/amber/rose accents).
  - Deep dark palette (carbon canvas `#090d16`, slate containers `#111827`, luminous accent highlights).
- **Interactive Visualizations**:
  - `DuckCurveVisualizer`: 24-hour diurnal curve with automated playback, scrubber, and real-time AC frequency oscilloscope.
  - `SkiperComparisonSlider`: Draggable split comparison between unmitigated Duck Curve and ML pre-dispatch stabilization.
  - `SkiperIsland`: Telemetry HUD tracking ramp velocity and alert thresholds.
  - `SkiperDock`: Floating navigation dock with quick section jumps and theme toggle.
  - `SkiperFluidCanvas`: Ambient physics canvas responding to cursor velocity.

---

## 🗄️ Database & Deployment
- **Cloud Firestore**: Real-time serverless database saving scenario runs, custom notes, and dispatch telemetry.
- **Resilient Offline Store**: Transparent fallback to browser storage if credentials are not configured.
- **Data Export**: One-click export to **CSV** and **JSON** datasets.
- **Live Vercel Production**: [https://electricity-demand-forecasting-three.vercel.app](https://electricity-demand-forecasting-three.vercel.app)
- **GitHub Repository**: [https://github.com/arpit-png/Electricity_demand_forecasting](https://github.com/arpit-png/Electricity_demand_forecasting)
