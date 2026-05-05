# UI Context & Design System

The ExpenseAutopsy UI is strictly governed by a **Binance.US-inspired** design aesthetic. It must feel premium, financial, authoritative, and slightly intimidating (aligning with the "brutal accountability" theme).

## 1. Color Palette
- **Backgrounds:** Deep near-black (`#1E2026` or `#222126`) for dark mode. Clean white (`#FFFFFF`) for light mode.
- **Primary Accent:** Binance Yellow (`#F0B90B`). Use sparingly for primary CTAs and critical data highlights.
- **Semantic Colors:**
  - Positive/Success: Green (`#0ECB81`)
  - Negative/Failure/Waste: Red (`#F6465D`)
- **Text:** High contrast white/black for primary text. Dimmed grays (`#848E9C`) for secondary info.

## 2. Typography
- **Fonts:** `Inter` (Sans-serif) and `Geist/Geist Mono`.
- **Styling:** Use crisp, highly legible weights. Display metrics should be large and bold (60px, 700 weight). Secondary labels should be small and uppercase (12px, tracking-wide).

## 3. Shapes & Components
- **Buttons:** Fully rounded "pill" shapes (`rounded-full` or 50px radius) for primary actions.
- **Cards/Containers:** Subtle rounding (`rounded-xl` or 12px radius).
- **Shadows/Borders:** Ultra-light borders (`border-white/10` in dark mode) and subtle drop shadows (`rgba(32,32,37,0.05)`). Avoid heavy brutalist borders; lean towards clean, sharp glassmorphism.

## 4. State Management Conventions
UI components must pull state exclusively from the Zustand stores in `lib/store/`:
- **`useDashboardStore`**: For rendering charts, metrics, and insights.
- **`useAnalysisStore`**: For rendering loading states, spinners, and pipeline status.
- Do not use local `useState` for global data.

## 5. Layout
- All authenticated pages must reside within the `(dashboard)` route group.
- The layout is constrained to `h-screen` with a fixed Sidebar and a scrollable `<main>` content area.
