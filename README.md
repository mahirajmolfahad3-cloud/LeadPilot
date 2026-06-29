# LeadPilot

> Never lose a potential customer again.

LeadPilot is a clean, focused lead management dashboard for small businesses and freelancers. Track leads, manage your sales pipeline, and never miss a follow-up.

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Backend / Auth / DB:** Supabase (PostgreSQL + Auth)
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod
- **Animations:** Framer Motion

---

## Features

- ✅ Email/password authentication (Supabase Auth)
- ✅ Protected dashboard — each user sees only their own leads
- ✅ Lead management — create, view, edit, delete
- ✅ Kanban pipeline board — drag & drop between stages
- ✅ Follow-up tracking — overdue / today / upcoming
- ✅ Lead detail page with notes and activity timeline
- ✅ Analytics — leads over time, sources, won vs lost, pipeline breakdown
- ✅ Marketing landing page
- ✅ Fully responsive

---

## Getting Started

### 1. Clone / unzip the project

```bash
cd leadpilot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **New project** and fill in the details
3. Once created, go to **Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Set up the database

1. In your Supabase project, go to **SQL Editor**
2. Click **New query**
3. Paste the entire contents of `supabase-schema.sql`
4. Click **Run**

This creates all tables, indexes, and Row Level Security policies.

### 5. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 6. Configure Supabase Auth (important)

In your Supabase project:

1. Go to **Authentication → URL Configuration**
2. Set **Site URL** to `http://localhost:3000` (for local dev)
3. Add `http://localhost:3000/**` to **Redirect URLs**

For production (Vercel), also add your production URL:
- Site URL: `https://your-app.vercel.app`
- Redirect URLs: `https://your-app.vercel.app/**`

### 7. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment on Vercel

1. Push to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

---

## Project Structure

```
src/
├── app/
│   ├── (marketing)/          # Landing page
│   │   └── page.tsx
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx        # Auth guard + sidebar
│   │   ├── page.tsx          # Overview / home
│   │   ├── leads/
│   │   │   ├── page.tsx      # Leads list
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx  # Lead detail
│   │   │       └── edit/page.tsx
│   │   ├── pipeline/page.tsx # Kanban board
│   │   ├── followups/page.tsx
│   │   └── analytics/page.tsx
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                   # shadcn/ui primitives
│   ├── layout/               # Sidebar, Header
│   ├── leads/                # LeadCard, LeadForm, PipelineBoard, etc.
│   └── dashboard/            # StatsCard, AnalyticsCharts
├── lib/
│   ├── supabase/             # client, server, middleware helpers
│   └── utils.ts              # cn(), status labels/colors, date helpers
├── types/
│   └── index.ts              # Lead, LeadNote, LeadActivity types
└── middleware.ts             # Route protection
```

---

## Database Schema

### `leads`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK → auth.users |
| name | text | Required |
| email | text | |
| phone | text | |
| company | text | |
| source | text | website, facebook, referral, instagram, linkedin, other |
| service | text | Service interested in |
| status | text | new, contacted, qualified, proposal_sent, won, lost |
| priority | text | low, medium, high |
| notes | text | Initial notes |
| follow_up_date | timestamptz | |
| created_at | timestamptz | |
| updated_at | timestamptz | Auto-updated via trigger |

### `lead_notes`
| Column | Type |
|--------|------|
| id | uuid |
| lead_id | uuid → leads |
| user_id | uuid → auth.users |
| content | text |
| created_at | timestamptz |

### `lead_activity`
| Column | Type |
|--------|------|
| id | uuid |
| lead_id | uuid → leads |
| user_id | uuid → auth.users |
| type | text |
| description | text |
| created_at | timestamptz |

---

## Customization

- **Colors / theme:** Edit CSS variables in `src/app/globals.css`
- **Add a lead source:** Update the `LeadSource` type in `src/types/index.ts` and the `SOURCE_LABELS` map in `src/lib/utils.ts`
- **Add a pipeline stage:** Update `LeadStatus` type and relevant constants
