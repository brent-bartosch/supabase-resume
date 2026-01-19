import Link from "next/link";

export const metadata = {
  title: "Resume in SQL | Brent Bartosch",
  description: "For people who enjoy Postgres. Resume schema, queries, and Supabase patterns.",
};

export default function SQLPage() {
  const schema = `-- This resume is stored in Supabase (Postgres)
-- Public read-only via Row Level Security

CREATE TABLE resume_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  headline TEXT NOT NULL,
  location TEXT,
  email TEXT,
  phone TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE resume_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE resume_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID REFERENCES resume_sections(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  item_type TEXT DEFAULT 'bullet',  -- 'bullet' | 'role' | 'line'
  org TEXT,
  role TEXT,
  dates TEXT,
  body TEXT NOT NULL
);

-- RLS: Public can read, nobody can write
ALTER TABLE resume_profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read" ON resume_profile FOR SELECT USING (true);`;

  const queries = [
    {
      title: "Get my Supabase skills",
      description: "Filter technical work for Supabase-specific items",
      sql: `SELECT body
FROM resume_items ri
JOIN resume_sections rs ON rs.id = ri.section_id
WHERE rs.slug = 'technical'
  AND body ILIKE '%supabase%'
ORDER BY ri.sort_order;`,
    },
    {
      title: "Experience timeline",
      description: "Show career progression with dates",
      sql: `SELECT org, role, dates
FROM resume_items ri
JOIN resume_sections rs ON rs.id = ri.section_id
WHERE rs.slug = 'experience'
ORDER BY ri.sort_order;`,
    },
    {
      title: "Enterprise keywords",
      description: "Find where I mention enterprise sales patterns",
      sql: `SELECT
  rs.title as section,
  LEFT(body, 80) || '...' as excerpt
FROM resume_items ri
JOIN resume_sections rs ON rs.id = ri.section_id
WHERE body ILIKE '%enterprise%'
   OR body ILIKE '%MEDDPICC%'
   OR body ILIKE '%procurement%';`,
    },
  ];

  const realPatterns = `-- Patterns I use in production (from my actual systems)

-- 1. Queue-based state machine
CREATE TABLE processing_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status TEXT DEFAULT 'pending',  -- pending → processing → completed/failed
  attempts INT DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  processed_at TIMESTAMPTZ
);

-- Concurrent worker pattern (skip locked rows)
UPDATE processing_queue
SET status = 'processing', attempts = attempts + 1
WHERE id = (
  SELECT id FROM processing_queue
  WHERE status = 'pending'
  ORDER BY created_at
  FOR UPDATE SKIP LOCKED
  LIMIT 1
)
RETURNING *;

-- 2. Database trigger → Edge Function (event-driven)
CREATE OR REPLACE FUNCTION notify_new_lead()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM net.http_post(
    'https://project.supabase.co/functions/v1/process-lead',
    jsonb_build_object('id', NEW.id, 'email', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_lead_insert
  AFTER INSERT ON leads
  FOR EACH ROW EXECUTE FUNCTION notify_new_lead();

-- 3. Upsert with conflict handling
INSERT INTO business_profiles (place_id, name, email, updated_at)
VALUES ($1, $2, $3, now())
ON CONFLICT (place_id)
DO UPDATE SET
  name = EXCLUDED.name,
  email = COALESCE(EXCLUDED.email, business_profiles.email),
  updated_at = now()
WHERE business_profiles.updated_at < EXCLUDED.updated_at;

-- 4. JSONB aggregation for multi-source data
SELECT
  place_id,
  jsonb_agg(DISTINCT source) as sources,
  jsonb_object_agg(source, email) FILTER (WHERE email IS NOT NULL) as emails_by_source
FROM lead_sources
GROUP BY place_id;`;

  const stats = `-- My actual Supabase usage (queried from production)

SELECT 'Records Processed' as metric, '388,929' as value
UNION ALL SELECT 'SERP Searches', '173,061'
UNION ALL SELECT 'Websites Scraped', '110,570'
UNION ALL SELECT 'Leads Generated', '46,226'
UNION ALL SELECT 'Cached Name Transforms', '278,669'
UNION ALL SELECT 'Edge Functions', '6'
UNION ALL SELECT 'Database Tables', '25+'
UNION ALL SELECT 'Supabase Projects', '3';`;

  return (
    <main className="max-w-[900px] mx-auto px-6 py-12 md:py-16">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <Link
            href="/"
            className="text-gray-400 hover:text-gray-600 no-underline"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">Resume, in SQL</h1>
        </div>
        <p className="text-gray-600">
          This page is for people who enjoy Postgres. The main resume page reads from these tables via Supabase.
        </p>
      </header>

      {/* Schema */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
          Schema
        </h2>
        <pre className="text-sm">{schema}</pre>
      </section>

      {/* Sample Queries */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
          Sample Queries
        </h2>
        <div className="space-y-6">
          {queries.map((q, i) => (
            <div key={i}>
              <h3 className="font-medium mb-1">{q.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{q.description}</p>
              <pre className="text-sm">{q.sql}</pre>
            </div>
          ))}
        </div>
      </section>

      {/* Real Patterns */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
          Production Patterns I Use
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          These are actual patterns from my GTM automation systems - queue processing,
          event-driven triggers, upserts, and JSONB aggregation.
        </p>
        <pre className="text-sm">{realPatterns}</pre>
      </section>

      {/* Stats */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
          Production Numbers
        </h2>
        <pre className="text-sm">{stats}</pre>
      </section>

      {/* Footer */}
      <footer className="pt-6 border-t border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-sm text-gray-500">
            Not just a tutorial project. This is how I build.
          </p>
          <Link
            href="/"
            className="text-sm text-emerald-600 hover:text-emerald-700 no-underline"
          >
            ← Back to normal resume
          </Link>
        </div>
      </footer>
    </main>
  );
}
