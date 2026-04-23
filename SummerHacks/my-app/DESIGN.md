# ExpenseAutopsy Design System

## 1. Aesthetic & Brand Identity
**Theme:** Organic Luxury, Editorial-Grade, High-Trust SaaS.
**Vibe:** "Algorithmic Accountability" but rooted in nature and wealth. Visually stripped-back to feel non-generative, serious, deeply analytical, and grounded.
**Core Visual Motifs:**
- Heavy application of negative space.
- High visual tension between traditional serif typography and technical monospaced accents.
- Subtle, systemic feedback loops (animated node indicators, progress bars, layout borders).
- Uses organic, luxury dark green tones.

## 2. Color Palette
The app uses targeted custom Hex values mapped through Shadcn variables, alongside carefully dialed utility tailwind colors. We avoid pure, generic colors to maintain the "luxury" feel. The palette shifts seamlessly between light (soft sage) and dark (deep forest) modes.

### Light Theme
- **Background:** `#f7faf7` (Extremely subtle sage tint)
- **Foreground:** `#0c1c13` (Deepest green-black)
- **Primary:** `#1b3b24` (Forest green)
- **Secondary / Muted:** `#e8f0eb` (Soft sage)
- **Accent:** `#2c5e3a` (Vibrant forest accent)
- **Destructive:** `#7f1d1d` (Subtle brick red for luxury contrast)

### Dark Theme
- **Background:** `#040d07` (Almost black green)
- **Foreground:** `#e6eee8` (Soft mint-white)
- **Card / Popover:** `#08160c` (Deep forest)
- **Primary / Accent:** `#4ade80` (Bright mint green for dark mode contrast)
- **Secondary / Muted:** `#122818` (Rich dark green)
- **Destructive:** `#991b1b`

## 3. Typography
A clear trichotomy of font families controls the reading hierarchy and sets the brand voice.

1. **Serif (`font-serif`): `Cormorant Garamond`**
   - Used for all major headings (`h1`, `h2`, `h3`, massive numbers).
   - *Example Use:* `text-6xl md:text-[7rem] font-serif leading-[0.95] tracking-tighter`
   - *Psychology:* Creates an editorial, institutional, luxury trust factor, giving the app gravitas.

2. **Sans-Serif (`font-sans`): `Manrope`**
   - Used for standard body copy, paragraphs, and UI links.
   - *Example Use:* `font-light text-muted-foreground leading-relaxed`
   - *Psychology:* Clean, modern, slightly organic readability that doesn't distract from the analytical tone.

3. **Monospace (`font-mono`): `JetBrains Mono`**
   - Used for system outputs, labels, IDs, tags, financial projections.
   - *Example Use:* `text-[10px] font-mono tracking-widest uppercase`
   - *Psychology:* Reinforces the "algorithm/protocol" aesthetic, reminding the user it is a robust computation system.

## 4. Components & Shapes
The UI language relies on precision engineering rather than playful, generative bubbles. We lean heavily on **Shadcn UI**.

- **Buttons:** Fully rounded capsules (`rounded-full`), typically high contrast (`bg-foreground text-background`) with wide tracking lowercase utility caps (`uppercase tracking-widest`). Characterized by smooth hover translations (`hover:-translate-y-0.5`).
- **Cards:** Semi-rounded bounds (`rounded-xl` to `rounded-3xl`), stark surfaces with extremely subtle borders (`border-border`) and micro-shadows (`shadow-2xl shadow-black/[0.04]`).
- **Badges/Tags:** Pill-shaped (`rounded-full`), highly tracked uppercase text, often paired with a pulsing "node" indicator (e.g., `<span className="w-2 h-2 bg-destructive rounded-full animate-pulse" />`).

## 5. Motion & Interaction
Animations run on **Framer Motion** and mimic data processing rather than "bouncy web" aesthetics.

- **Scroll Reveals:** Gradual fade-ins and subtle y-axis translations (`y: 30` to `y: 0` over `0.8s`, `easeOut`).
- **Data Plotting:** Slowly drawn background SVG traces (`motion.path` with `pathLength`) simulating market charts.
- **Simulated Processing:** Staggered height animations that mirror data computation loops (e.g., the "AI Calculates" vertical bars bouncing dynamically).
- **Cinematic Counting:** Number counting mechanisms used for financial impact figures to reinforce the weight and gravity of compound loss.

## 6. Iconography
- Handled exclusively via **Lucide React**.
- Icons are minimal, geometric, and scale down beautifully.
- Usually paired with strict border radii or glass backgrounds (`w-10 h-10 rounded-lg flex items-center justify-center bg-background border-border`).
- Used purposefully to anchor layout structure, rather than strictly to decorate.