# BUMMPS Admin Panel

An ultra-premium admin dashboard for the BUMMPS dating platform. Built with React + Vite + Tailwind CSS + Framer Motion, in a luxury warm-charcoal & gold design language.

## Tech Stack
- **React 19** + **Vite** — app shell & build tooling
- **Tailwind CSS 3** — utility styling with a custom BUMMPS theme (see `tailwind.config.js`)
- **Framer Motion** — page transitions, hover states, counters, floating background blobs
- **React Router 7** — client-side routing across every sidebar section
- **Recharts** — line/area/bar/pie charts on Dashboard & Analytics
- **React Icons** — icon set (Heroicons via `react-icons/hi`)

## Getting Started
```bash
npm install
npm run dev       # start local dev server
npm run build     # production build to /dist
npm run preview   # preview the production build
```

## Login
This is a fully working demo with dummy data (no backend). To sign in, use:
- **Email:** any valid email address
- **Password:** any password with 6+ characters

## Folder Structure
```
src/
├── assets/          # static assets
├── components/       # reusable UI building blocks
│   ├── ui/            # Button, GlassCard, Badge, DataTable, Modal, Counter, Skeleton, Controls...
│   └── charts/         # chart wrapper components
├── context/          # AuthContext (session), UIContext (sidebar/theme)
├── data/              # dummy JSON-like datasets (users, matches, chats, payments, analytics...)
├── hooks/             # (reserved for custom hooks)
├── layouts/            # DashboardLayout, ProtectedRoute
├── pages/              # one file per route (Dashboard, Users, Verification, Matches, Chats,
│                        #  Reports, Payments, Subscriptions, Analytics, Notifications, Content, Settings, Login)
├── services/           # (reserved for API layer if a real backend is added)
├── utils/              # (reserved for helpers)
├── App.jsx             # route definitions
└── main.jsx            # app entry point
```

## Design Tokens
| Token | Value |
|---|---|
| Background base | `#17181C` |
| Background soft | `#1D1F24` |
| Card | `#262931` / `#2D313A` |
| Gold accent | `#DAB25A` |
| Gold secondary | `#F2D89A` |
| Border | `rgba(218,178,90,.18)` |
| Text primary | `#FFFFFF` |
| Text muted | `#B9BDC7` |
| Success / Warning / Danger | `#4ADE80` / `#FBBF24` / `#F87171` |
| Card radius | `22px` |

## Notes
- All data is dummy/mock data generated in `src/data/*` — no real backend or API calls are made.
- The logo is a custom gold monogram SVG (`src/components/Logo.jsx`). Swap in your real BUMMPS logo file whenever you have it — just replace the `<svg>` markup or point it at an image import.
- Every sidebar item routes to a fully designed, functional page (search, filters, tabs, pagination, modals all work against the mock data).
