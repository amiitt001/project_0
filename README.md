# 🟢 PROMPTWAR - AI Red Teaming Challenge

**PromptWar** is a cutting-edge LLM security challenge platform designed for adversarial prompting, policy stress testing, and responsible disclosure. It features a high-fidelity, hacker-themed interface with 3D graphics and real-time terminal simulations.

---

## 🚀 Features

- **Immersive Loading Sequence**: A multi-phase boot sequence featuring real kernel logs, a dynamic circular progress gauge, and an "ACCESS GRANTED" glitch transition.
- **Hacker Aesthetic**: A deep neon-green theme with scanlines, matrix rain overlays, and procedural 3D particle systems.
- **Red Team Tracks**: 6 unique challenge modules ranging from Beginner to Expert, focusing on prompt injection, context manipulation, and agent exploitation.
- **Live Leaderboard**: Real-time tracking of participants and battle results.
- **3D Backdrop**: Interactive Three.js particle field that responds to mouse movement.

## 🛠️ Tech Stack

- **Core**: [React 18](https://reactjs.org/) + [Vite 5](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **3D Engine**: [Three.js](https://threejs.org/)
- **Animations**: [Anime.js](https://animejs.com/)
- **Icons/Fonts**: Google Fonts (Orbitron, Share Tech Mono, IBM Plex Mono)

---

## 📦 Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Steps
1. **Clone the repository**:
   ```bash
   git clone https://github.com/amiitt001/loop.event.git
   cd loop.event
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```text
├── public/              # Static assets (mascots, icons)
├── src/
│   ├── components/      # React components (Loading, 3D Backdrop, UI)
│   ├── App.jsx           # Main application logic & routing
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles & tailwind imports
├── tailwind.config.js   # Custom hacker-green theme configuration
└── vite.config.js       # Vite build configuration
```

---

## 🛡️ License

© 2026 **CLUB LOOP**. All Rights Reserved.  
Authorized for use in official PromptWar events and red-teaming research.
