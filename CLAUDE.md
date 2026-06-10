# CLAUDE.md — homo-digital-app

## Read first

Before any work, read these files in order:

1. SPEC.md
2. memory.md
3. current-task.md
4. lessons.md

## Project

React Native + Expo mobile app for Homo Digital.
Two roles: agent and client. Role determined by JWT returned from POST /v1/auth/login.

## Repo

github.com/kolbinski/homo-digital-app

## API

Production: https://job-matcher-api-production.up.railway.app
Auth: JWT Bearer token
Login endpoint: POST /v1/auth/login → { email, password } → { token, role: 'agent' | 'client' }

## Stack

- React Native + Expo SDK (latest)
- TypeScript (strict)
- Expo Router (file-based routing)
- Expo Notifications (push)
- NativeWind (Tailwind for React Native)
- Zustand (state management)
- React Query (data fetching)

## Commands

- Start: npx expo start
- Build: eas build
- Type check: npx tsc --noEmit
- Lint: npx eslint .

## Code style

- Functional components only
- Custom hooks for API calls (useApplications, useSyncReport etc.)
- No inline styles — NativeWind classes only
- Always handle loading and error states
- formatNum() for number formatting (never toLocaleString())

## File structure

src/
app/ — Expo Router screens
components/ — reusable UI components
hooks/ — custom hooks
services/ — API calls
store/ — Zustand stores
types/ — TypeScript types
utils/ — helpers

## Environment

.env:
EXPO_PUBLIC_API_URL=https://job-matcher-api-production.up.railway.app

## Before finishing session

Always update memory.md, current-task.md, lessons.md.

## Git Workflow

When the user says **"commit"**:

1. Run `git status` to see ALL modified and untracked files
2. Stage everything: `git add -A` — never cherry-pick specific files; the user expects all changes committed
3. Commit and push: `git commit -m "..." && git push origin main`

Always push to `main` — never to `master` or any other branch.

**Never commit or push automatically after making code changes.** Wait for the user to explicitly say "commit". Code changes and commits are two separate steps — do not combine them.

**When the user says "commit", always include ALL modified files** — `git add -A` ensures manual changes the user made directly (shown in system-reminder notifications) are staged alongside Claude's changes. Never let a system-reminder about user edits go uncommitted. Write the commit message to reflect ALL changes in the diff, not just Claude's — if the user made manual edits, acknowledge them in the message.

## Multi-repo awareness

The user has multiple repos open simultaneously (homo-digital-app, job-matcher-api, homo-digital-extension). If a task references files that do not exist in this repo (e.g. syncService.ts, API-side code), **stop and tell the user they appear to be in the wrong project** before making any changes. Do not proceed with edits until the user confirms the correct repo.
