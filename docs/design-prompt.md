# Mini Wallet Design System: The "Neo-Fi" Aesthetic

## Executive Summary

The Mini Wallet application needs a distinctive, premium visual identity that communicates **security, precision, and modern finance**. The current implementation uses generic Bootstrap-like styling with emoji icons and clashing gradients. This design prompt defines a cohesive design system called **"Neo-Fi"** — a modern fintech aesthetic that balances sophistication with approachability.

---

## Core Design Philosophy

**Neo-Fi** embodies these principles:

1. **Trust Through Precision** — Clean lines, consistent spacing, and mathematical precision communicate reliability
2. **Luminous Hierarchy** — Information emerges from darkness through carefully layered light and shadow
3. **Micro-Interaction Feedback** — Every action has immediate, satisfying visual feedback
4. **Data as Design Element** — Numbers, charts, and transaction data are celebrated, not hidden

This is **not** generic dark mode. It's a thoughtfully crafted financial interface that feels premium, secure, and delightful to use.

---

## Color Palette

The foundation is a "Deep Obsidian" void with "Electric Indigo" accents — a modern, trustworthy pairing distinct from the Bitcoin-orange aesthetic in the reference.

| Token | Value | Usage |
|-------|-------|-------|
| `--color-void` | `#0A0B0E` | Deepest background — the canvas |
| `--color-surface` | `#12141A` | Elevated surfaces, cards, panels |
| `--color-surface-elevated` | `#1A1D26` | Modals, dropdowns, tooltips |
| `--color-border` | `#2A2D3A` | Subtle borders at rest |
| `--color-border-active` | `#4F46E5` | Focused/active borders (Indigo 600) |
| `--color-text-primary` | `#F9FAFB` | Primary text (Gray 50) |
| `--color-text-secondary` | `#9CA3AF` | Secondary text (Gray 400) |
| `--color-text-muted` | `#6B7280` | Labels, placeholders (Gray 500) |
| `--color-accent-primary` | `#6366F1` | Primary CTAs, links (Indigo 500) |
| `--color-accent-secondary` | `#818CF8` | Hover states (Indigo 400) |
| `--color-accent-glow` | `rgba(99, 102, 241, 0.4)` | Glow effects |
| `--color-success` | `#10B981` | Success states (Emerald 500) |
| `--color-error` | `#EF4444` | Error states (Red 500) |
| `--color-warning` | `#F59E0B` | Warnings (Amber 500) |

**Gradient Formula**: `linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)` for primary buttons and key accents.

---

## Typography

A dual-typeface system that balances **modern geometric** (displays) with **humanist readability** (body).

| Purpose | Font | Weights | Usage |
|---------|------|---------|-------|
| Headings | `Plus Jakarta Sans` | 500, 600, 700 | All headings, card titles, stats |
| Body | `Inter` | 400, 500 | Body copy, descriptions |
| Data/Mono | `JetBrains Mono` | 400, 500 | Amounts, IDs, codes, technical data |

**Import**:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap" rel="stylesheet">
```

**Scale**:
- Display (Balance): `text-5xl md:text-7xl`
- Page Title: `text-2xl md:text-3xl font-semibold`
- Card Title: `text-lg font-semibold`
- Body: `text-base`
- Small: `text-sm`

**Leading & Tracking**: Tight on headings (`leading-tight`), relaxed on body (`leading-normal`).

---

## Design Tokens (CSS Variables)

Define these in `:root` for consistency:

```css
:root {
  /* Colors */
  --color-void: #0A0B0E;
  --color-surface: #12141A;
  --color-surface-elevated: #1A1D26;
  --color-border: #2A2D3A;
  --color-border-active: #4F46E5;
  --color-text-primary: #F9FAFB;
  --color-text-secondary: #9CA3AF;
  --color-text-muted: #6B7280;
  --color-accent-primary: #6366F1;
  --color-accent-secondary: #818CF8;
  --color-accent-glow: rgba(99, 102, 241, 0.4);
  --color-success: #10B981;
  --color-error: #EF4444;
  --color-warning: #F59E0B;

  /* Spacing */
  --spacing-xs: 0.25rem;    /* 4px */
  --spacing-sm: 0.5rem;     /* 8px */
  --spacing-md: 1rem;       /* 16px */
  --spacing-lg: 1.5rem;     /* 24px */
  --spacing-xl: 2rem;       /* 32px */
  --spacing-2xl: 3rem;      /* 48px */
  --spacing-3xl: 4rem;      /* 64px */

  /* Radii */
  --radius-sm: 0.375rem;    /* 6px */
  --radius-md: 0.5rem;      /* 8px */
  --radius-lg: 0.75rem;     /* 12px */
  --radius-xl: 1rem;        /* 16px */
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
  --shadow-glow: 0 0 20px var(--color-accent-glow);
  --shadow-glow-strong: 0 0 30px rgba(99, 102, 241, 0.5);

  /* Transitions */
  --transition-fast: 150ms ease-out;
  --transition-base: 250ms ease-out;
  --transition-slow: 350ms ease-out;
}
```

---

## Component Specifications

### Buttons

All buttons use `font-heading` (Plus Jakarta Sans), minimum height `h-11`, and smooth transitions.

**Primary Button**
```jsx
className={`
  h-11 px-6 rounded-xl font-semibold
  bg-gradient-to-r from-indigo-500 to-purple-500
  text-white shadow-lg shadow-indigo-500/25
  hover:shadow-xl hover:shadow-indigo-500/35 hover:-translate-y-0.5
  active:translate-y-0
  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
  transition-all duration-250
`}
```

**Secondary Button**
```jsx
className={`
  h-11 px-6 rounded-xl font-semibold
  bg-surface-elevated border border-border
  text-text-primary
  hover:border-accent-primary hover:bg-surface
  transition-all duration-250
`}
```

**Ghost Button**
```jsx
className={`
  h-11 px-4 rounded-xl font-medium
  text-text-secondary
  hover:text-text-primary hover:bg-white/5
  transition-colors duration-250
`}
```

**Destructive Button**
```jsx
className={`
  h-11 px-6 rounded-xl font-semibold
  bg-error/10 text-error border border-error/20
  hover:bg-error/20 hover:border-error/40
  transition-all duration-250
`}
```

---

### Cards

The "floating panel" aesthetic — elevated surfaces with subtle borders and glow on hover.

```jsx
className={`
  bg-surface border border-border rounded-2xl
  hover:border-accent-primary/30 hover:shadow-glow
  transition-all duration-300
`}
```

**Card Hierarchy**:
- **Header**: `p-6 pb-4` with title `text-lg font-semibold font-heading`
- **Body**: `p-6 pt-0`
- **Footer**: `p-6 pt-0` with border-top if needed

---

### Inputs

Minimalist, precise input fields with bottom-border styling for a modern aesthetic.

```jsx
className={`
  w-full h-12 px-4
  bg-transparent border-b-2 border-border
  text-text-primary placeholder-text-muted
  focus:border-accent-primary focus:shadow-glow
  transition-all duration-200
  outline-none
`}
```

**Variants**:
- **Error state**: `border-error focus:border-error focus:shadow-[0_0_20px_rgba(239,68,68,0.3)]`
- **Select dropdown**: Same as input but with border all-around

---

### Status Badges

Pill-shaped badges with semantic colors:

```jsx
// Success
className="px-3 py-1 rounded-full text-xs font-semibold bg-success/10 text-success border border-success/20"

// Failed
className="px-3 py-1 rounded-full text-xs font-semibold bg-error/10 text-error border border-error/20"

// Pending
className="px-3 py-1 rounded-full text-xs font-semibold bg-warning/10 text-warning border border-warning/20"
```

---

### Icons

Use `lucide-react` exclusively. No emojis.

**Icon Containers** (optional, for emphasis):
```jsx
className="bg-accent-primary/10 border border-accent-primary/20 rounded-lg p-2.5 text-accent-primary"
```

---

## Layout & Spacing

| Element | Spacing |
|---------|---------|
| Section vertical | `py-12` (48px) |
| Card internal | `p-6` (24px) |
| Form gaps | `space-y-5` |
| Grid gaps | `gap-6` (24px) |
| Content max-width | `max-w-6xl` (1152px) |

---

## Loading States

### Skeletons
```jsx
className="animate-pulse bg-surface-elevated rounded"
```

### Spinner
```jsx
<svg className="animate-spin h-5 w-5 text-accent-primary" />
```

---

## Toast Notifications

Fixed position, bottom-right with entrance animation:

```jsx
className={`
  fixed bottom-6 right-6
  px-5 py-3 rounded-xl shadow-xl
  animate-slideIn
  min-w-[320px]
`}

// Animation
@keyframes slideIn {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

---

## Animation Principles

- **Hover effects**: `duration-250` — responsive but smooth
- **Page transitions**: `duration-350` — deliberate
- **Loading indicators**: Smooth infinite loops
- **Entrance animations**: `slideUp` with stagger for lists

```css
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

---

## Accessibility Requirements

- **Focus rings**: `focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-void`
- **Color contrast**: All text must meet WCAG AA (4.5:1 for normal, 3:1 for large)
- **Touch targets**: Minimum 44×44px
- **Keyboard navigation**: All interactive elements accessible via Tab
- **Aria labels**: On icon-only buttons, inputs with labels hidden visually

---

## Responsive Behavior

- **Mobile**: Single column, simplified navigation (bottom bar or hamburger)
- **Tablet** (768px): 2-column grids
- **Desktop** (1024px): Full 3-column layouts

---

## Empty States

Centered, with icon + title + description + action:

```jsx
<div className="flex flex-col items-center justify-center py-16 text-center">
  <IconName className="w-16 h-16 text-text-muted mb-4" />
  <h3 className="text-xl font-semibold font-heading text-text-primary mb-2">
    Title
  </h3>
  <p className="text-text-secondary max-w-md mb-6">
    Description text here.
  </p>
  <Button>Primary Action</Button>
</div>
```

---

## Non-Generic "Bold" Choices

1. **Gradient Text on Balance**: Apply `bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent` to the displayed balance amount
2. **Subtle Grid Background**: Faint geometric grid pattern on the dashboard
3. **Glow Effects on Active Elements**: Cards glow with indigo when hovered
4. **Mono Font for All Amounts**: Every currency value uses `JetBrains Mono`
5. **Bottom Border Inputs**: Modern, minimalist input styling
6. **No Emojis**: Use lucide-react icons exclusively
7. **Glassmorphism on Modals**: `backdrop-blur-xl bg-surface/90` with subtle border
8. **Staggered List Animations**: Transaction items animate in with delay

---

## Implementation Notes

1. **CSS Variables First**: Use the design tokens defined above, not hard-coded values
2. **Component Library**: Build reusable Button, Card, Input, Badge components
3. **Tailwind Integration**: Extend theme with custom colors and spacing
4. **No External CSS Frameworks**: Pure Tailwind + custom CSS variables
5. **Consistent Naming**: BEM-ish for custom classes, utility-first for everything else

---

## Visual Reference Points

- **Linear.app** — Dark mode aesthetic, glowing accents
- **Raycast.com** — Precision UI, beautiful dark theme
- **Vercel.com** — Modern, minimal, premium feel
- **Notion.so** — Clean typography, subtle borders

This design system is **distinctive**, **premium**, and **tailored for fintech**. It rejects generic patterns in favor of a cohesive, opinionated visual language.
