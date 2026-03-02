# Pomodoro Guard

Pomodoro Guard is a Vite + React app with Firebase Auth + Firestore backend, streak-first dashboard, social friends, and cloud-synced timer progress.

## Core Features

- Auth gate at startup:
  - Continue as Guest (anonymous auth)
  - Login (email/password + Google)
  - Sign up (email/password + Google)
  - Apple button included and guarded on localhost/dev
- Required global unique username claim after first sign-in
- Streak-first dashboard at `/`
- Timer page at `/timer`
- Existing timer/economy/shop/milestones/settings/admin flows retained
- Friends search + requests + friends leaderboard
- Realtime listeners for profile, daily stats, requests, and friendships
- Firestore canonical state after auth; localStorage used as cache/fallback

## Routes

- `/` dashboard (streak central)
- `/timer` timer
- `/friends` social
- `/shop`
- `/milestones`
- `/stats`
- `/settings`
- `/admin`

## Setup

1. Install packages:

```bash
npm install
```

2. Create `.env` from `.env.example` and set values:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

3. In Firebase console:
- Enable Authentication providers:
  - Email/Password
  - Google
  - Anonymous
  - Apple (optional)
- Create Firestore database
- Add authorized domains for Auth:
  - `localhost`
  - your Vercel domain(s)

4. Deploy Firestore rules from `firestore.rules`.

5. Run locally:

```bash
npm run dev
```

6. Verify production build:

```bash
npm run build
```

## Apple Auth Limitation on Localhost

Apple sign-in is typically not available on localhost unless configured with valid domain/redirect settings. In localhost/dev, Apple login is shown disabled with an explanatory message.

## Security Rules

Rules are in `firestore.rules` and include:
- owner-only write access for user docs
- owner-only sessions
- daily stats read by owner or friends
- username uniqueness registry
- friend request access control

## Admin

Default admin passcode: `3210`
