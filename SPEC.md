# SPEC.md — homo-digital-app

## What is this
Mobile app for Homo Digital career agent platform.
One app, two roles determined by JWT:
- **agent** — Krzysztof (and future agents)
- **client** — candidates like Teodor, Marek

## API base
https://job-matcher-api-production.up.railway.app

## Auth
POST /v1/auth/login
Body: { email, password }
Response: { token, role: 'agent' | 'client', user_id?, agent_id? }

Token stored in SecureStore (expo-secure-store).
Passed as Bearer token in all subsequent requests.

---

## Client view (role: 'client')

### Screen: My Applications
GET /v1/user-offers?status=applied (JWT auth)

Shows offer cards with:
- Job title @ Company
- Work model + location
- Salary (formatted with delta)
- Status badge
- Date applied (created_at of status change)

Filters:
- Status select (applied, agent_withdrawn, recruiter_rejected, offer_received, accepted, client_withdrawn)
- Source select (all, justjoin, nofluffjobs)

### Screen: Sync Report
Opens from push notification or from list.
Loads from GET /v1/user-syncs/:id or latest sync.

Shows three sections:
- Worth applying (offers with score, salary, role_fit, url)
- Level up & earn more
- Worth considering (top 3)

Offer card tap → opens offer URL in browser (Linking.openURL)

### Push notifications
Sent when agent marks offer as applied.
Notification payload: { type: 'applied', offer_title, company, user_sync_id? }
Tap → opens My Applications screen

---

## Agent view (role: 'agent')

### Screen: Dashboard
- List of clients with badge counts (worth_applying count)
- Tap client → Client detail

### Screen: Client detail
- Same as client My Applications but for selected client
- Can change offer status

### Push notifications
- New high-score offer: "🔥 Score 95% — {title} @ {company} for {client_name}"
- Sync completed: "Sync done — {count} new matches"

---

## Screens map

### Auth
- /login — email + password form

### Client
- /(client)/applications — My Applications list
- /(client)/sync-report/[id] — Sync report detail

### Agent
- /(agent)/dashboard — client list
- /(agent)/client/[id] — client applications

### Shared
- /offer/[url] — opens offer in WebView or browser

---

## Design
- Colors: black (#1a1a1a), dark gray (#4a4a4a), light gray (#f0f0f0)
- No blue accents — consistent with CV and extension palette
- Score badges: green (80+), orange (60-79), gray (<60)
- Status badges: color per status
- Salary delta: orange text for positive, red for negative

## Push notification setup
Use Expo Notifications + Expo Push Tokens.
On login: register device token → POST /v1/push-tokens { token, platform }
API sends via Expo Push API (free tier).
