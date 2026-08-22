---
name: Vivid Clarity
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#424656'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#727687'
  outline-variant: '#c2c6d8'
  surface-tint: '#0054d6'
  primary: '#0050cb'
  on-primary: '#ffffff'
  primary-container: '#0066ff'
  on-primary-container: '#f8f7ff'
  inverse-primary: '#b3c5ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#4345d1'
  on-tertiary: '#ffffff'
  tertiary-container: '#5d60eb'
  on-tertiary-container: '#faf6ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae1ff'
  primary-fixed-dim: '#b3c5ff'
  on-primary-fixed: '#001849'
  on-primary-fixed-variant: '#003fa4'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#e1e0ff'
  tertiary-fixed-dim: '#c0c1ff'
  on-tertiary-fixed: '#07006c'
  on-tertiary-fixed-variant: '#2f2ebe'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
  surface-white: '#FFFFFF'
  surface-soft: '#F8FAFC'
  surface-accent: '#F1F5F9'
  info-blue: '#EBF5FF'
  success-green: '#ECFDF5'
  warning-amber: '#FFFBEB'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
  container-max: 1440px
---

## Brand & Style
The design system transitions from a moody, deep-toned aesthetic to a **high-energy, professional, and airy** experience. The brand personality is **optimistic, efficient, and transparent**, designed to make financial and administrative management feel effortless rather than burdensome.

The design style is a refined **Modern Corporate Minimalism** with subtle **Glassmorphism** highlights:
- **Luminosity**: Emphasis on high-key lighting, using white and near-white surfaces to create a "fresh start" feeling.
- **Dynamic Energy**: Replacing heavy indigos with a vibrant, professional blue to evoke trust and modern tech-fluency.
- **Precision & Air**: Significant use of whitespace and "breathable" layouts to reduce cognitive load during data-heavy tasks.
- **Polished Professionalism**: A clean, "standard-setting" look that feels both reliable for enterprise and approachable for startups.

## Colors
The palette is anchored by a **Professional Bright Blue**, moving away from "gloomy" indigos toward a more high-contrast and energetic spectrum.

- **Primary (Corporate Blue)**: `#0066FF` is the hero color, used for primary actions, active states, and brand-building elements. It represents clarity and forward momentum.
- **Secondary (Vivid Emerald)**: A bright green used for positive growth, success states, and financial indicators.
- **Neutral Palette**: Utilizes a "Cool Slate" scale. The background is kept exceptionally clean using `#F8FAFC`, while containers use pure `#FFFFFF` to pop against the subtle background.
- **Surface Strategy**: The UI relies on "white-on-light-gray" layering to maintain a high-energy, airy atmosphere. Dark colors are reserved strictly for high-contrast typography and iconography.

## Typography
**Plus Jakarta Sans** is the exclusive typeface, chosen for its friendly yet geometric precision.

- **Weight as Hierarchy**: Use 'Bold' (700) for high-level headlines and 'SemiBold' (600) for component titles to create clear scannability without needing excessive font size variations.
- **Data Display**: For numerical data and currency, always use the 'Medium' or 'SemiBold' weights to ensure figures are the most prominent element on the page.
- **Labels**: Small metadata labels should use the `label-md` style with uppercase transformations to distinguish them from interactive body text.

## Layout & Spacing
The system follows a **Fluid 12-column grid** designed for maximum flexibility.

- **Spacing Rhythm**: All measurements are multiples of a `4px` base unit.
- **Verticality**: Use generous vertical padding (32px - 64px) between major sections to reinforce the "airy" design narrative.
- **Density**: While the brand is "airy," data tables should maintain a medium density with `12px` vertical cell padding to ensure large amounts of information remain manageable.
- **Breakpoints**:
    - **Desktop (1024px+)**: 12 columns, 32px margins. Sidebars are fixed at 260px.
    - **Tablet (768px - 1023px)**: 8 columns, 24px margins. Sidebars transition to a collapsed state.
    - **Mobile (0 - 767px)**: 4 columns, 16px margins.

## Elevation & Depth
Depth is achieved through **Soft Tonal Layering** and **High-Diffused Shadows**, avoiding heavy borders or dark fills.

- **Level 1 (Base)**: The app background uses `#F8FAFC`.
- **Level 2 (Cards)**: Main content areas use pure `#FFFFFF` with a very soft, light-blue tinted shadow: `0 8px 30px rgba(0, 102, 255, 0.04)`.
- **Level 3 (Overlays)**: Modals and floating menus use a `blur(16px)` backdrop with a semi-transparent white fill (`rgba(255, 255, 255, 0.9)`) and a subtle `1px` border in `#E2E8F0`.
- **Contrast**: Instead of shadows for everything, use light-gray borders (`#F1F5F9`) for secondary elements like input fields to maintain a "flat but layered" aesthetic.

## Shapes
The shape language is **Rounded and Welcoming**, maintaining the friendly nature of the brand.

- **Containers**: Primary cards and modules use `rounded-lg` (1rem/16px) or `rounded-xl` (1.5rem/24px) for a modern, soft silhouette.
- **Interactive Elements**: Buttons and form inputs use `rounded-lg` (1rem/16px) to provide a consistent touch-target feel.
- **Utility Elements**: Search bars and status tags utilize the `pill-shaped` (999px) radius to differentiate them from functional buttons.

## Components
- **Buttons**: Primary buttons are solid `#0066FF` with white text and a soft shadow that matches the button color. Secondary buttons use a light-blue tint background (`#EBF5FF`) with blue text—no border.
- **Input Fields**: Use a light-gray background (`#F1F5F9`) with no border in its default state. On focus, the background turns white and gains a `2px` solid `#0066FF` border.
- **Cards**: Pure white containers with `24px` padding. Avoid borders entirely; rely on the "Vivid Clarity" soft shadow for separation.
- **Chips & Badges**: Use extremely desaturated versions of the status color for the background (e.g., `#ECFDF5` for success) with the high-saturation version for the text.
- **Data Tables**: Use a clean, borderless look. Separate rows with a very thin `1px` line in `#F1F5F9`. The header row should have a subtle gray background (`#F8FAFC`).
- **Iconography**: Use 2px "Soft-Stroke" icons. Icons should predominantly be in the `neutral-color` unless they are active, in which case they take the `primary_color`.