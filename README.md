# Supabase Resume

A resume website built on Supabase, demonstrating production PostgreSQL skills.

## Features

- Clean, professional resume page
- `/sql` "nerd tab" showing schema, queries, and production patterns
- Real-time stats from Supabase
- Fallback data for preview/development

## Quick Start

### 1. Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/supabase-resume)

### 2. Set up Supabase (Optional)

The site works with fallback data, but for the full experience:

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL Editor
3. Run `supabase/seed.sql` to populate your resume
4. Add environment variables to Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Stack

- **Next.js 16** - React framework
- **Supabase** - PostgreSQL database with RLS
- **Tailwind CSS** - Styling
- **Vercel** - Hosting

## Files

```
├── src/
│   ├── app/
│   │   ├── page.tsx      # Main resume page
│   │   └── sql/page.tsx  # SQL nerd tab
│   └── lib/
│       └── supabase.ts   # Supabase client + types
└── supabase/
    ├── schema.sql        # Table definitions
    └── seed.sql          # Resume content
```

## Customizing

1. Edit `supabase/seed.sql` with your info
2. Update fallback data in `src/app/page.tsx` (optional)
3. Modify stats in `resume_stats` table

---

Built to demonstrate Supabase fluency, not just claim it.
