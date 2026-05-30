# Bekkelaget IL

Web application for Bekkelaget IL, a multi-sport club in Ottestad, Norway. The app provides a public-facing site and a protected editor panel where club staff manage news, information pages, events, and the membership register.

## 📌 Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Authentication and roles](#authentication-and-roles)
- [Database](#database)
- [Row Level Security](#row-level-security)
- [Deployment](#deployment)
- [Author](#author)

## 📄 Documentation

The completed test documentation (fagprøve) is available here:

[Fagprøve Dokumentasjon.pdf]()

## 🚀 Features

### Public site

- Landing page at `/`

### Editor panel (`/admin`)

Authenticated editors and admins can:

- **Dashboard** — overview with shortcuts to each module
- **News** — create, edit, and delete news posts (with category, excerpt, and content; `author_id` set from the logged-in user)
- **Articles** — create, edit, and delete information pages (title, content, optional contact person and email)
- **Events** — create, edit, and delete events (title, description, date/time, location, category)
  - On the event edit page, view registrations (`name`, `email`, `phone`, registration time)
- **Members** — create, edit, and delete members; mark membership fee as paid or unpaid; search the list
- **Admin settings** (`/admin/settings`, admin only) — view users in `profiles` and change roles between `editor` and `admin`

### Authentication

- Email/password login at `/login` (Supabase Auth)
- Middleware redirects unauthenticated users away from `/admin/*` to login
- Admin layout verifies session and restricts settings to `admin` role

## 🛠 Tech stack

### Frontend

- **Next.js 16** — App Router, Server Components, Server Actions
- **React 19** + **TypeScript 5**
- **Tailwind CSS 4** — styling and responsive layout
- **shadcn/ui** — UI components
- **Zod** — form validation 
- **date-fns** + **date-fns-tz** — Norwegian date/time formatting
- **Lucide React** — icons
- **Sonner** — toast notifications

### Backend

- **Supabase**
  - PostgreSQL for data storage
  - Supabase Auth for editor/admin sessions
  - Row Level Security (RLS) policies configured in the Supabase dashboard

### Tooling

- **pnpm** — package manager
- **Biome** — linting and formatting

## 🧩 Project structure

```text
app/
├── page.tsx                      # Public landing page
├── login/page.tsx                # Editor/admin login
├── layout.tsx, globals.css       # Root layout and theme
└── admin/
    ├── layout.tsx                # Protected shell and navigation
    ├── page.tsx                  # Dashboard
    ├── news/                     # News CRUD
    ├── articles/                 # Article CRUD
    ├── events/                   # Events CRUD + registrations list
    ├── members/                  # Membership register
    └── settings/                 # Admin role management

components/
├── admin/                        # Admin-specific UI
└── ui/                           # shadcn/ui primitives

lib/
├── supabase/                     # Server and browser Supabase clients
└── date.ts                       # Oslo timezone helpers

middleware.ts                     # Protects /admin routes
```

## 🚀 Getting started

### Prerequisites

- Node.js **≥ 20**
- **pnpm**
- A Supabase project with the tables and RLS policies described below (configured in the Supabase dashboard)

### Installation

1. Clone the repository:

   ```bash
   git clone github.com/Konge5678/Bekkelaget-IL
   cd Bekkelaget-IL
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Create `.env.local` (see [Environment variables](#environment-variables)).

4. Start the dev server:

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000). The editor panel is at [http://localhost:3000/admin](http://localhost:3000/admin) (requires login).

### Scripts

| Command        | Description              |
|----------------|--------------------------|
| `pnpm dev`     | Development server       |
| `pnpm build`   | Production build         |
| `pnpm start`   | Run production build     |
| `pnpm lint`    | Run Biome checks         |
| `pnpm format`  | Format code with Biome   |

## Environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your-publishable-key>
```

Get these from **Supabase → Project Settings → API**.

To sign in locally, create a user in Supabase Auth and ensure a matching row exists in `profiles` with role `editor` or `admin`.

## 🔐 Authentication and roles

- **Supabase Auth** — email/password sign-in on `/login`
- **Middleware** — blocks unauthenticated access to `/admin/*` and redirects to `/login?redirectTo=...`
- **Roles** (stored in `profiles.role`):
  - **`editor`** — full access to the editor panel (content + members)
  - **`admin`** — same as editor, plus `/admin/settings` to update user roles

Editors cannot access admin settings; non-admins are redirected to `/admin`.

## 📊 Database 

The database runs on **Supabase (PostgreSQL)**. Schema and security policies are managed in the **Supabase dashboard**.

### Tables

| Table | Purpose |
|-------|---------|
| `profiles` | App users linked to `auth.users` (`id`, `email`, `role`, `created_at`) |
| `news` | Club news (`title`, `excerpt`, `content`, `category`, `author_id`, `created_at`) |
| `articles` | Information pages (`title`, `content`, `contact_person`, `contact_email`, `updated_at`) |
| `events` | Events (`title`, `description`, `date`, `location`, `category`, `created_at`) |
| `event_registrations` | Event sign-ups (`event_id`, `name`, `email`, `phone`, `created_at`) |
| `members` | Membership register (`name`, `email`, `phone`, `has_paid_contingent`, `due_date`, `created_at`) |

### Relationships

- `profiles.id` → `auth.users.id`
- `news.author_id` → `profiles.id`
- `event_registrations.event_id` → `events.id`

## 🛡️ Row Level Security (RLS)

**RLS is enabled** on the application tables. Policies in the Supabase dashboard control who can read and write data—for example, restricting member data and editor operations to authenticated users with the correct role. The app relies on these policies together with route protection in Next.js.

## 🚀 Deployment

The application can be deployed to various platforms:

1. **Build the Application**

   ```bash
   pnpm build
   ```

2. **Deploy Options**
   - Vercel
   - Netlify
   - Self-hosted server
   - Docker container

## 🙏 Acknowledgments

- Supabase for authentication and database
- shadcn/ui for accessible UI components
- Nicklas Båkind-Øverjordet for asking questions that helped me reflect on my technical choices

## 📝 License

This project is private and proprietary. All rights reserved.

## 👤 Authors

Kristian Haugsrud
