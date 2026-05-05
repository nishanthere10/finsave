# Feature Spec 02: UI & UX Refinement

## Context & Objective
The current User Interface (UI) is functioning correctly but feels too "technically heavy" and lacks a polished, consumer-friendly feel. The goal of this phase is to refine the UI to make it more approachable, modern, and engaging without losing its authoritative financial tone.

The agent implementing this phase should heavily reference `../../context/ui-context.md` for styling guidelines.

## Requirements

### 1. Simplify Language & Terminology
- **Problem:** Every component feels like it's built for developers. The text uses overly technical jargon.
- **Action:** Review all copy across the application (especially in the Dashboard, Commit, and Analysis flows) and translate it into clear, approachable, and encouraging language. 
- **Goal:** Make the platform feel like a premium consumer financial product, not an internal debug tool.

### 2. Implement Shadcn UI
- **Action:** Replace generic HTML/Tailwind components with polished `shadcn/ui` components where applicable.
- **Focus Areas:**
  - Buttons (ensure they follow the pill-shaped `rounded-full` guideline from `ui-context.md`).
  - Cards (ensure subtle `rounded-xl` borders and glassmorphic touches).
  - Dialogs/Modals, Inputs, and Alerts.
- **Note:** Ensure any `shadcn` components installed align with the Binance.US color palette defined in `ui-context.md`.

### 3. Enhance with Framer Motion
- **Action:** Add smooth, micro-animations using `framer-motion` to make the UI feel alive and responsive.
- **Implementation Suggestions:**
  - Page transitions (fade-ins or slide-ups when navigating between routes).
  - Hover effects on cards, buttons, and interactive elements.
  - Staggered entrance animations for lists (e.g., leaderboard entries or expense insights).
  - Dynamic loading states during the analysis pipeline instead of static spinners.

### 4. Adhere strictly to `ui-context.md`
- Maintain the Binance.US aesthetic (Dark `#1E2026`, Primary Yellow `#F0B90B`).
- Use crisp typography (`Inter` or `Geist`).
- Avoid heavy brutalist borders; use light borders (`border-white/10`) and subtle drop shadows.

## Agent Instructions (e.g., for Google Jules)
1. Read `../../context/ui-context.md` first.
2. Review the current UI implementation in the `my-app` directory.
3. Install necessary `shadcn` components via CLI if they don't exist yet (`npx shadcn-ui@latest add [component]`).
4. Apply CSS/Tailwind refinements.
5. Integrate `framer-motion` for fluid interactions.
6. Verify that the tone of the text is approachable.
