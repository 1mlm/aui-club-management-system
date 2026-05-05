# AUI Club Management System — Project Reference

## Stack
- Next.js 16.2 (App Router, server components + server actions)
- React 19, TypeScript strict
- Tailwind CSS 4 (PostCSS plugin, no config file)
- shadcn/ui `radix-nova` style — components live in `shadcn/` NOT `components/`
- PostgreSQL via `pg` pool (no ORM) — `db/client.ts` singleton
- Auth: cookie-based sessions (`AUTH_COOKIE_NAME` from `db/auth-cookie.ts`)
- Icons: `@hugeicons/react` + `@hugeicons/core-free-icons` — always use `<Icon icon={X} />` wrapper, never `<X />` directly
- Toasts: `sonner` — `toast.success/error()`
- Font: Outfit from Google Fonts, variable `--font-sans`
- Linter: Biome (excludes `shadcn/`)
- Dev port: 3004

## Repo Layout
```
app/                  — Next.js App Router pages + API routes
  api/auth/           — login, logout, register, me endpoints
  admin/              — system-admin-only pages (users, clubs, joinrequests)
  clubs/[id]/         — club detail + member management
  dashboard/          — user dashboard (PLACEHOLDER as of May 2026)
  queries/            — SQL simulator
  layout.tsx          — root layout: SidebarProvider + AppSidebar + TourProvider + Toaster
  actions.ts          — all "use server" server actions
db/
  client.ts           — pg Pool singleton (port 5432, max 10, 30s idle)
  auth.ts             — registerUser, loginUser, getUserById
  auth-types.ts       — AuthUser type
  auth-cookie.ts      — AUTH_COOKIE_NAME constant
  admin.ts            — getAllUsers/Clubs/JoinRequests + mutations
  club-management.ts  — updateClubInfo, updateClubMemberStatus/Role
  queries.ts          — listClubs, getClubById, getClubMembers, getClubPosts
  types.ts            — ClubRecord, ClubQueryRow, ClubMember, PostRecord, PostQueryRow
  validators.ts       — validateClubColor, validateClubIcon
  catalog.ts          — ALLOWED_ICON_MAP (icon name string → HugeIcon)
  sql/create.sql      — full schema
  sql/populate.sql    — seed data (users pw: Password123!)
components/           — React client components
  AuthProvider.tsx    — useAuth() hook: { user, loading, refreshUser, signOut }
  ClubBrowser.tsx     — search + sort + club cards grid
  TourProvider.tsx    — Joyride onboarding
  Providers.tsx       — wraps AuthProvider + NuqsAdapter
  AdminTable.tsx      — reusable table for admin pages
shadcn/
  cpns/               — AppSidebar, Icon, IconBtn
  ui/                 — shadcn base components
  lib/utils.ts        — cn() helper
lib/
  icon-map.ts         — ICON_MAP: all string→HugeIcon mappings (nav, actions, status, user, misc)
util/
  authRules.ts        — isAuiEmail, isValidPassword, isValidDisplayName
  clubStyles.ts       — getClubColorStyles(color) → { bg, border, text, shadow }
  hugeicons.ts        — Hugeicon type, toHugeiconList()
  iconRotation.ts     — useDeterministicIconRotation hook
scripts/
  db-reset.ts         — drops + recreates DB + seeds
  db-seed.ts          — seeds only
  db-test.ts          — connection test
```

## Database Schema (key tables)
```sql
users           — user_id, email (@aui.ma only), fname, lname, display_name, password_hash, is_system_admin
club            — club_id, owner_id, name, description, main_color (enum), status (active/deleted/archived), email, icon_name
membership      — membership_id, user_id, club_id, membership_status (pending/active/rejected/left/banned), membership_role (board_member/member)
post            — post_id, club_id, user_id, title (200), content (1000), created_at, updated_at, is_deleted
joinrequest     — request_id, initiator_user_id, target_club_id, reviewer_user_id, status (pending/approved/rejected), message
```

## Auth Rules
- Email: must be `@aui.ma` or subdomain
- Password: min 8 chars
- Display name: 2–40 chars, alphanumeric + space/dot/dash/underscore

## Role System
- `is_system_admin` on users → global admin (sees admin nav)
- `membership_role`: `board_member` or `member` per club
- `owner_id` on club → owner (treated as highest role in UI)
- Role ladder in club page: `owner` > `board_member` > `member` > `none`

## Color/Icon System
- Club colors: BLUE/BLACK/RED/GREEN/AMBER/ORANGE/YELLOW/CYAN/PINK/PURPLE
- Club icons: 14 options (ADVENTURE, AI_SPARKLES, CAMERA, etc.) — see `db/catalog.ts`
- `getClubColorStyles(color)` returns `{ bg, border, text, shadow }` CSS values

## Design System (from DESIGN.md — file deleted from working tree, content in git)
- Color tokens: `:root` with `light-dark()` — auto light/dark, no `.dark` class needed
- Border radius base: `0.625rem` (10px)
- Sidebar: `variant="inset"`, `collapsible="offcanvas"`
- shadcn aliases: `@/shadcn/cpns`, `@/shadcn/ui`, `@/shadcn/lib`, `@/shadcn/hooks`
- Always `<Icon icon={ICON_MAP.x.y} />` — never import icons directly into feature files

## Key Patterns
- Server actions in `app/actions.ts` — all prefixed `server*`
- DB queries use raw SQL with typed `pool.query<RowType>()`
- `useAuth()` for client-side user — fetches `/api/auth/me` on mount
- `nuqs` for URL state (search/sort in ClubBrowser)
- `router.refresh()` after mutations to re-fetch server data

## Known Gaps (as of 2026-05-05)
- `app/dashboard/page.tsx` is a **placeholder** (muted boxes, no real data)
- No "Join Club" / "Leave Club" action from club detail page
- No "Create Post" UI for board members (posts readable but not creatable via UI)
- No pending join requests visible to board members on club page
- PR #1 (feature/add-club-posts by AdamMahres) is OPEN — adds post types + query + UI

## Scripts
```bash
npm run dev          # port 3004
npm run db:reset     # drop + recreate + seed
npm run db:seed      # seed only
npm run check        # tsc
npm run biome:fix    # lint + format
```
