# 🚀 PremiumCMS

A production-grade, premium headless CMS built with **Next.js 15**, **Prisma**, **PostgreSQL**, and **Tailwind CSS**.

Inspired by Notion, Linear, Vercel Dashboard, and Payload CMS.

---

## ✨ Features

- 🎨 **Premium UI** — Glassmorphism cards, smooth Framer Motion animations, micro-interactions
- 🔐 **Secure Auth** — NextAuth.js with bcrypt-hashed passwords, middleware-protected routes
- 📝 **Rich Text Editor** — Tiptap-powered WYSIWYG editor with full toolbar
- 📄 **Posts & Pages** — Full CRUD with slug generation, publish/draft toggle
- 🏷️ **Categories** — With post count display and slug validation
- ⚙️ **Site Settings** — Inject custom CSS/JS into every public page
- 🌐 **Public Blog** — Hero section, featured post, category filter, search, related posts
- 📊 **Dashboard** — Stats cards with real-time data from your database
- 📱 **Responsive** — Mobile-first design that works everywhere
- 🔍 **SEO Ready** — Metadata API, Open Graph, sitemap.xml, robots.txt

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| ORM | Prisma 5 |
| Database | PostgreSQL (Neon) |
| Auth | NextAuth.js v4 |
| Forms | React Hook Form + Zod |
| Editor | Tiptap |
| Toasts | react-hot-toast |
| Icons | Lucide React |

---

## 🚀 Quick Start

### 1. Clone & install

```bash
git clone <your-repo>
cd premium-cms
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://neondb_owner:password@host/neondb?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
ADMIN_NAME="Admin"
ADMIN_EMAIL="admin@gmail.com"
ADMIN_PASSWORD="Admin@123456"
```

### 3. Setup database

```bash
# Push schema to database
npm run db:push

# Seed with demo data (10 posts, 5 pages, 5 categories)
npm run db:seed
```

### 4. Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — public blog  
Open [http://localhost:3000/login](http://localhost:3000/login) — admin login  
Open [http://localhost:3000/admin](http://localhost:3000/admin) — dashboard

---

## 📁 Project Structure

```
premium-cms/
├── app/
│   ├── (public)/          # Public blog pages
│   │   ├── page.tsx       # Homepage
│   │   ├── post/[slug]/   # Single post
│   │   ├── category/[slug]/ # Category archive
│   │   └── [slug]/        # Static pages (about, contact, etc.)
│   ├── admin/             # Protected admin panel
│   │   ├── page.tsx       # Dashboard
│   │   ├── posts/         # Posts CRUD
│   │   ├── pages/         # Pages CRUD
│   │   ├── categories/    # Categories CRUD
│   │   └── settings/      # Site settings
│   ├── api/auth/          # NextAuth handler
│   ├── login/             # Login page
│   ├── layout.tsx         # Root layout
│   ├── sitemap.ts         # Dynamic sitemap
│   └── robots.ts          # Robots.txt
├── actions/               # Server Actions
│   ├── posts.ts
│   ├── pages.ts
│   ├── categories.ts
│   └── settings.ts
├── components/
│   ├── ui/                # Reusable components
│   └── admin/             # Admin-specific components
├── lib/
│   ├── prisma.ts          # Prisma singleton
│   ├── auth.ts            # NextAuth config
│   └── utils.ts           # Utility functions
├── schemas/               # Zod schemas
├── types/                 # TypeScript types
├── providers/             # React providers
├── middleware.ts           # Route protection
└── prisma/
    ├── schema.prisma
    └── seed.ts
```

---

## 📋 Admin Credentials (after seed)

| Field | Value |
|-------|-------|
| URL | http://localhost:3000/login |
| Email | admin@gmail.com |
| Password | Admin@123456 |

---

## 🗄 Database Commands

```bash
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to database
npm run db:migrate    # Create a migration
npm run db:seed       # Seed demo data
npm run db:studio     # Open Prisma Studio GUI
```

---

## 🌐 Public Routes

| Route | Description |
|-------|-------------|
| `/` | Blog homepage with featured post |
| `/post/[slug]` | Single post with related posts |
| `/category/[slug]` | Category archive |
| `/[slug]` | Static pages (about, contact, etc.) |

---

## 🔒 Admin Routes

| Route | Description |
|-------|-------------|
| `/admin` | Dashboard with stats |
| `/admin/posts` | Posts management |
| `/admin/posts/new` | Create new post |
| `/admin/posts/[slug]` | Edit post |
| `/admin/pages` | Pages management |
| `/admin/categories` | Categories management |
| `/admin/settings` | Custom CSS/JS injection |

---

## 🚢 Deployment

### Vercel (recommended)

```bash
npm install -g vercel
vercel
```

Add environment variables in Vercel dashboard.


---

## 📄 License

MIT — free for personal and commercial use.
