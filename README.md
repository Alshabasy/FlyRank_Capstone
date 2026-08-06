# 🚀 Personal Portfolio — FlyRank Capstone

> A modern, aesthetic, and fully responsive personal portfolio built with React.js, Tailwind CSS, and Material UI — featuring glassmorphism design, gradient-heavy visuals, and smooth animations.

---

## ✨ Live Demo

🔗 _[soon]_

---

## 📸 Preview

_[soon]_

---

## 🎯 Project Overview

This is my personal developer portfolio, built as the capstone project for the **FlyRank internship program**. It showcases my projects, skills, experience, and certificates in a visually rich, glassmorphism-styled interface — developed using an AI-assisted workflow with Claude Code.

**Design philosophy:** dark-first, gradient-heavy, glassmorphism cards, smooth scroll animations, and full mobile responsiveness.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React.js (Vite) |
| Markup | HTML5 (semantic) |
| Styling | Tailwind CSS + CSS3 |
| UI Components | Material UI (MUI v5) |
| Typography | Google Fonts — Space Grotesk |
| Interactivity | JavaScript (ES6+) |
| Animations | CSS keyframes + Framer Motion |
| AI Assistant | Claude Code |
| Version Control | Git (Conventional Commits) |
| Deployment | Vercel / Netlify |

---

## 📄 Portfolio Sections

| # | Section | Description |
|---|---|---|
| 1 | **Hero / Landing** | Full-screen intro with name, title, animated gradient background, and CTA buttons |
| 2 | **About Me** | Personal bio, photo, personality traits, and what I'm currently learning |
| 3 | **Skills & Tech Stack** | Visual skill cards grouped by category (Frontend, Tools, etc.) |
| 4 | **Projects Gallery** | Filterable project cards with live demo and GitHub links |
| 5 | **Experience / Timeline** | Work and internship history in an interactive vertical timeline |
| 6 | **Certificates & Awards** | Glassmorphism certificate cards with issuer and date |
| 7 | **Contact Form** | Functional contact form with validation and social links |

---

## 📁 Project Structure

```
flyrank-capstone/
├── public/
│   ├── index.html
│   └── assets/              # Static images, icons, CV PDF
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Skills.jsx
│   │   ├── Projects.jsx
│   │   ├── Experience.jsx
│   │   ├── Certificates.jsx
│   │   ├── Contact.jsx
│   │   └── Footer.jsx
│   ├── pages/
│   │   └── Home.jsx
│   ├── styles/
│   │   └── global.css
│   ├── utils/
│   │   └── data.js          # All content data (projects, skills, etc.)
│   ├── hooks/
│   │   └── useScrollReveal.js
│   ├── context/
│   │   └── ThemeContext.jsx
│   └── App.jsx
├── CLAUDE.md
├── tailwind.config.js
├── package.json
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js (LTS) — [nodejs.org](https://nodejs.org)
- Git — [git-scm.com](https://git-scm.com)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/flyrank-capstone.git
cd flyrank-capstone

# Install dependencies
npm install

# Start the dev server
npm run dev
```

App runs at `http://localhost:5173`

### Build for production

```bash
npm run build
```

---

## 🤖 AI-Assisted Development

This project was built using **Claude Code** as the primary AI development assistant. Key AI-assisted workflows:

- Scaffolding all React components and page structure
- Writing and auditing Tailwind utility classes for glassmorphism effects
- Debugging JavaScript and React logic
- Critiquing and improving this README
- Generating reusable component patterns

See [`CLAUDE.md`](./CLAUDE.md) for the full instructions given to the AI assistant.

---

## 📝 Commit Convention

All commits follow [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/):

```
type(scope): short description
```

| Type | When to use |
|---|---|
| `feat` | New section or component |
| `fix` | Bug fix |
| `docs` | Documentation update |
| `style` | Visual / CSS / Tailwind change |
| `refactor` | Code restructure |
| `chore` | Config, deps, tooling |

---

## 🚀 Deployment

This project is deployed on **Vercel** (recommended for React/Vite):

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo directly on [vercel.com](https://vercel.com) for auto-deploy on every push.

---

## 📄 License

MIT License — see [LICENSE](./LICENSE) for details.

---

## 👤 Author

**Amr Alshabasy**
Front-End Developer · FlyRank Intern
[github.com/Alshabasy](https://github.com/Alshabasy) · [linkedin.com/in/amr-alshabasy](https://www.linkedin.com/in/amr-alshabasy-a7aa90314)
