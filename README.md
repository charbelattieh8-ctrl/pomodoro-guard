# Pomodoro Guard

A premium, animated Pomodoro web app built with Vite + React (JavaScript), Tailwind CSS, Framer Motion, React Router, Recharts, and LocalStorage.

## Features

- Pomodoro timer with `focus`, `break`, and `longBreak` modes
- Robust timestamp-based timer behavior for background tabs
- Milestones, badges, streak tracking, and coin rewards
- Theme shop with unlockable gradient themes
- Animated time-lapse background that evolves as session progress increases
- User settings for durations and preferences
- Admin page at `/admin` with passcode gate and in-session unlock
- Admin config editing for rewards, themes, and milestone definitions
- Charts in stats page (focus minutes + cumulative coins)
- Fully persistent app state in LocalStorage (`pomodoro_guard_state_v1`)
- Responsive layout: desktop sidebar + mobile bottom nav

## Default Admin Passcode

`3210`

Passcode is stored as SHA-256 hash in app state.

## Tech Stack

- React + Vite
- Tailwind CSS
- Framer Motion
- React Router DOM
- Recharts
- Lucide React icons

## Getting Started

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Project Structure

```text
src/
  main.jsx
  App.jsx
  routes.jsx
  styles.css
  lib/
    storage.js
    time.js
    economy.js
    milestones.js
    themes.js
    utils.js
  context/
    AppStateProvider.jsx
  components/
    Layout.jsx
    TopBar.jsx
    Sidebar.jsx
    GlassCard.jsx
    PrimaryButton.jsx
    Toggle.jsx
    Slider.jsx
    Modal.jsx
    Toast.jsx
    ProgressRing.jsx
    ThemePreview.jsx
    StatCard.jsx
  pages/
    Timer.jsx
    Shop.jsx
    Milestones.jsx
    Stats.jsx
    Settings.jsx
    Admin.jsx
```

## Notes

- All data is local-only; no backend/auth service is used.
- Admin unlock state is intentionally in-memory only and resets on refresh.
- `Reset App Data` in admin restores complete default state.
