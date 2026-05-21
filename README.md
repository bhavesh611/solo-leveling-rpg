# ⚔ Solo Leveling — Health RPG

> *"Arise."* — Transform your fitness journey into an epic RPG adventure.

A gamified personal health app inspired by the Korean manhwa **Solo Leveling**. Complete daily AI-generated quests, earn XP, level up your character, and climb from **E-Rank** to **S-Rank** by building real health habits.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🗡 **Daily Quest System** | 5 AI-generated personalized quests (2 workout, 2 nutrition, 1 hydration) |
| ⚡ **XP & Leveling** | Earn XP, level up, and watch your stats grow |
| 🏆 **Rank Progression** | E → D → C → B → A → S rank with dramatic level-up overlays |
| 🤖 **AI System Coach** | Chat with the System — report activities for bonus XP |
| 📊 **Status Screen** | Full character sheet with HP/MP bars and stat tracking |
| 🔔 **System Notifications** | Solo Leveling-style toast notifications |

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) and enter your [Anthropic API key](https://console.anthropic.com).

## 🛠 Tech Stack

- **React 18** + Vite
- **Anthropic Claude API** (`claude-sonnet-4-5`) for quest generation & AI coaching
- **Google Fonts** — Orbitron + Rajdhani
- Inline CSS with keyframe animations

## 🗝 API Key

You need an Anthropic API key. Get one at [console.anthropic.com](https://console.anthropic.com).  
Your key is never stored — it lives in memory only for the current session.

## 🏗 Build

```bash
npm run build    # production build → dist/
npm run preview  # preview production build
```

## 📋 PRD

Built to spec from `solo-leveling-health-rpg-prd.docx` v1.0 — May 2026.

---

*The System watches. The System judges. Will you answer the call?*
