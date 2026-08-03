# CLAUDE.md — AI Assistant Guide

This file is the single source of truth for how Claude Code (or any AI assistant) should work on this project. Read it fully before making any changes.

---

## 🧠 Project Context

**Project:** Personal developer portfolio — modern, aesthetic, fully responsive.
**Owner:** _[Amr Alshabasy]_ — Front-End Developer, FlyRank Intern.
**Goal:** Showcase projects, skills, experience, and certificates in a visually stunning glassmorphism interface.
**Design language:** Dark-first · Glassmorphism · Gradient-heavy · Smooth animations · Space Grotesk font.

---

## 🛠️ Tech Stack & Rules

### React.js
- **Functional components only** — no class components, ever.
- Use hooks: `useState`, `useEffect`, `useRef`, `useMemo`, `useCallback`, `useContext`.
- One component per file. Keep components focused — one job per component.
- All components go in `src/components/`, page-level in `src/pages/`.
- File names: **PascalCase** for components (`HeroSection.jsx`), **camelCase** for utils/hooks.
- Always use `.jsx` extension for React files.

### Tailwind CSS
- **Primary styling tool** — use Tailwind for all layout, spacing, typography, and color.
- Do not write raw CSS unless creating a glassmorphism effect, custom animation, or CSS variable.
- Use responsive prefixes on everything: `sm:` `md:` `lg:` `xl:`.
- **Glassmorphism pattern** (use this consistently for cards and panels):
  ```
  bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl
  ```
- **Gradient text pattern:**
  ```
  bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent
  ```
- Config file: `tailwind.config.js` — extend it for custom colors, fonts, animations.

### Material UI (MUI v5)
- Import from `@mui/material` only — never from `@material-ui/core`.
- Use MUI for: forms, text fields, buttons with ripple, tooltips, snackbars, chips, timeline.
- Style overrides via `sx` prop only — never `makeStyles` or `withStyles`.
- MUI theme is defined in `src/theme.js` — always use theme tokens, not hardcoded colors.

### Google Fonts — Space Grotesk
- Loaded via `<link>` in `public/index.html`.
- Applied globally in `tailwind.config.js` under `fontFamily.sans`.
- Also set in MUI theme `typography.fontFamily`.
- **Use Space Grotesk for all text** — no fallback fonts in components.
- Font weights used: 300 (light), 400 (regular), 500 (medium), 600 (semibold), 700 (bold).

### JavaScript (ES6+)
- Use `const` by default, `let` only when reassignment is needed. Never `var`.
- Arrow functions for all callbacks and component helpers.
- `async/await` for all async operations — no `.then()` chains.
- Optional chaining `?.` and nullish coalescing `??` preferred.
- Destructure props and state always.

### HTML5
- Semantic tags only: `<main>`, `<section>`, `<article>`, `<nav>`, `<header>`, `<footer>`, `<aside>`.
- Every section needs an `id` for smooth-scroll navigation (e.g. `id="projects"`).
- Images need descriptive `alt` text — no empty alts except decorative elements.

---

## 🎨 Design System

### Color Palette
```
Primary gradient:   from-purple-600 via-pink-500 to-cyan-400
Secondary gradient: from-indigo-500 to-purple-600
Accent:             cyan-400 / purple-400 / pink-400
Background:         #0a0a0f (near-black, defined in tailwind config)
Surface:            bg-white/5 to bg-white/10 (glassmorphism layers)
Text primary:       white / gray-100
Text secondary:     gray-400
Border:             border-white/10 to border-white/20
```

### Glassmorphism Rules
Every card, panel, and floating element must use this layered approach:
1. **Background:** `bg-white/5` or `bg-white/10` (subtle transparency)
2. **Blur:** `backdrop-blur-md` or `backdrop-blur-lg`
3. **Border:** `border border-white/10` or `border-white/20`
4. **Radius:** `rounded-2xl` (cards) or `rounded-3xl` (hero panels)
5. **Shadow:** `shadow-xl` with optional colored glow using `shadow-purple-500/20`

### Typography Scale
```
Hero heading:     text-5xl md:text-7xl font-bold
Section heading:  text-3xl md:text-4xl font-semibold
Card title:       text-xl font-semibold
Body:             text-base font-normal leading-relaxed
Caption/label:    text-sm text-gray-400
```

### Spacing & Layout
- Max content width: `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8`
- Section padding: `py-20 md:py-28`
- Card gap: `gap-6 md:gap-8`
- Always mobile-first.

### Animations
- Use CSS keyframes in `global.css` for: floating, gradient-shift, fade-in-up, glow-pulse.
- Use Framer Motion for: scroll-reveal, stagger children, hover lift on cards.
- Respect `prefers-reduced-motion` — wrap all animations in the media query.
- Hover effects on cards: `hover:-translate-y-2 hover:shadow-purple-500/30 transition-all duration-300`

---

## 📁 Folder Structure

```
src/
├── components/
│   ├── Navbar.jsx           # Fixed top nav with smooth scroll links + mobile hamburger
│   ├── Hero.jsx             # Full-screen landing with animated gradient + CTA
│   ├── About.jsx            # Bio, photo, personality chips
│   ├── Skills.jsx           # Skill cards grouped by category with progress or icons
│   ├── Projects.jsx         # Filterable project grid with glassmorphism cards
│   ├── Experience.jsx       # MUI Timeline — vertical work/internship history
│   ├── Certificates.jsx     # Certificate cards with issuer, date, badge
│   ├── Contact.jsx          # MUI form (name, email, message) + social links
│   └── Footer.jsx           # Minimal footer with links
├── pages/
│   └── Home.jsx             # Assembles all sections in order
├── styles/
│   └── global.css           # CSS variables, keyframes, glassmorphism base classes
├── utils/
│   └── data.js              # All content: projects[], skills[], experience[], certs[]
├── hooks/
│   └── useScrollReveal.js   # Custom hook for intersection observer animations
├── context/
│   └── ThemeContext.jsx     # Optional: dark/light toggle state
├── theme.js                 # MUI custom theme (Space Grotesk + brand colors)
└── App.jsx                  # Root component
```

---

## 📦 Key Dependencies

```json
{
  "react": "^18",
  "react-dom": "^18",
  "@mui/material": "^5",
  "@mui/icons-material": "^5",
  "@emotion/react": "^11",
  "@emotion/styled": "^11",
  "framer-motion": "^11",
  "react-icons": "^5"
}
```

Ask before installing anything not listed here.

---

## 📝 Content Structure (data.js)

All portfolio content lives in `src/utils/data.js` as exported arrays — never hardcode content inside components.

```js
// Projects
export const projects = [
  {
    id: 1,
    title: '',
    description: '',
    tags: ['React', 'Tailwind'],
    liveUrl: '',
    githubUrl: '',
    image: '',
    featured: true,
  }
];

// Skills
export const skills = [
  { category: 'Frontend', items: ['HTML', 'CSS', 'JavaScript', 'React'] },
  { category: 'Styling',  items: ['Tailwind CSS', 'Material UI', 'CSS3'] },
  { category: 'Tools',    items: ['Git', 'Claude Code', 'Vite', 'Figma'] },
];

// Experience
export const experience = [
  {
    role: '',
    company: '',
    period: '',
    description: '',
    type: 'internship', // or 'job', 'freelance'
  }
];

// Certificates
export const certificates = [
  {
    title: '',
    issuer: '',
    date: '',
    credentialUrl: '',
    badge: '', // image path or icon
  }
];
```

---

## ✅ Claude Code — Specific Instructions

When working on this project, always:

1. **Read this file first** before writing a single line of code.
2. **Tailwind before CSS** — if Tailwind can do it, use Tailwind.
3. **Glassmorphism for all cards** — use the exact pattern defined above, consistently.
4. **Space Grotesk everywhere** — never introduce a different font.
5. **Data from `data.js`** — never hardcode names, project titles, or descriptions inside JSX.
6. **Mobile-first** — start with the smallest breakpoint, then scale up.
7. **Semantic HTML** — use correct tags; every section gets an `id`.
8. **Framer Motion for scroll animations** — wrap reveal elements in `<motion.div>`.
9. **MUI for forms and timeline** — Contact form and Experience section use MUI components.
10. **Ask before adding packages** — check if existing deps cover the need first.
11. **Keep components under ~150 lines** — split if they grow larger.
12. **Commit after each section** using Conventional Commits format.

---

## 🔀 Git Commit Convention

```
type(scope): short imperative description
```

**Examples for this project:**
```
feat(hero): add animated gradient background and CTA buttons
feat(projects): add filterable project gallery with glassmorphism cards
feat(experience): add MUI vertical timeline for work history
style(skills): refine glassmorphism card hover effects
fix(navbar): correct mobile menu close on link click
chore: install framer-motion and react-icons
docs(readme): add deployment instructions
```

---

## ❓ Still Needed — Fill Before Building

- [ ] Your full name and title (e.g. "Front-End Developer")
- [ ] Your GitHub and LinkedIn URLs
- [ ] Profile photo (add to `public/assets/`)
- [ ] List of your real projects (titles, descriptions, links)
- [ ] Your work / internship experience details
- [ ] Certificate names and issuers
- [ ] Contact email or preferred contact method
- [ ] Preferred primary accent color (purple, cyan, or custom)
