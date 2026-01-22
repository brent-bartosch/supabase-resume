import Link from "next/link";

export const metadata = {
  title: "Lead Scoring Schema | Brent Bartosch",
  description: "The Postgres schema powering the PLG lead scoring dashboard. Real RLS, computed columns, and production patterns.",
};

export default function SQLPage() {
  const schema = `-- Lead Scoring System for Product-Led Growth
-- Designed for Supabase Enterprise AE workflow
--
-- This schema demonstrates how to prioritize developer signups
-- for enterprise expansion based on internal usage signals
-- and external company enrichment.

-- ============================================================
-- CORE TABLES
-- ============================================================

-- Developer signups (simulates Supabase's internal user data)
CREATE TABLE developer_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  company_domain TEXT,  -- Extracted from email or provided
  signup_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  signup_source TEXT,   -- 'organic', 'github', 'google', 'referral'

  -- Computed column: auto-detect company vs personal email
  is_company_email BOOLEAN GENERATED ALWAYS AS (
    email NOT LIKE '%@gmail.com'
    AND email NOT LIKE '%@yahoo.com'
    AND email NOT LIKE '%@hotmail.com'
    AND email NOT LIKE '%@outlook.com'
    AND email NOT LIKE '%@icloud.com'
  ) STORED,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Internal usage signals (what we'd get from Supabase platform)
CREATE TABLE internal_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id UUID NOT NULL REFERENCES developer_signups(id) ON DELETE CASCADE,

  -- Project metrics
  project_count INT DEFAULT 0,
  active_projects INT DEFAULT 0,

  -- Feature adoption (boolean flags)
  uses_auth BOOLEAN DEFAULT false,
  uses_storage BOOLEAN DEFAULT false,
  uses_edge_functions BOOLEAN DEFAULT false,
  uses_realtime BOOLEAN DEFAULT false,
  uses_vector BOOLEAN DEFAULT false,
  uses_cron BOOLEAN DEFAULT false,

  -- Billing
  billing_tier TEXT DEFAULT 'free',  -- 'free', 'pro', 'team', 'enterprise'
  tier_upgraded_at TIMESTAMPTZ,

  -- Team
  team_member_count INT DEFAULT 1,
  team_members_added_last_30d INT DEFAULT 0,

  -- Usage volume
  api_calls_30d BIGINT DEFAULT 0,
  api_calls_prev_30d BIGINT DEFAULT 0,

  -- Computed growth percentage
  api_call_growth_pct NUMERIC GENERATED ALWAYS AS (
    CASE
      WHEN api_calls_prev_30d > 0
      THEN ROUND(((api_calls_30d - api_calls_prev_30d)::NUMERIC / api_calls_prev_30d) * 100, 1)
      ELSE 0
    END
  ) STORED,

  last_active_at TIMESTAMPTZ,
  dashboard_logins_30d INT DEFAULT 0,
  captured_at TIMESTAMPTZ DEFAULT now()
);

-- Company enrichment (from Apollo, LinkedIn, Clearbit, etc.)
CREATE TABLE company_enrichment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT NOT NULL UNIQUE,
  company_name TEXT,
  industry TEXT,
  employee_count INT,
  employee_range TEXT,  -- '1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'
  company_type TEXT,    -- 'startup', 'scaleup', 'enterprise', 'agency'
  funding_stage TEXT,   -- 'seed', 'series_a', 'series_b', etc.
  total_funding_usd BIGINT,
  tech_stack JSONB DEFAULT '[]',
  linkedin_url TEXT,
  enriched_at TIMESTAMPTZ DEFAULT now()
);

-- Key stakeholders at the company
CREATE TABLE stakeholders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_domain TEXT NOT NULL REFERENCES company_enrichment(domain) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  title TEXT,
  department TEXT,  -- 'engineering', 'product', 'security', 'finance'
  seniority TEXT,   -- 'ic', 'manager', 'director', 'vp', 'c-level'
  linkedin_url TEXT,
  is_decision_maker BOOLEAN DEFAULT false,
  is_technical BOOLEAN DEFAULT false,
  is_budget_holder BOOLEAN DEFAULT false,
  enriched_at TIMESTAMPTZ DEFAULT now()
);

-- Expansion signals (hiring, news, tech changes)
CREATE TABLE expansion_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_domain TEXT NOT NULL REFERENCES company_enrichment(domain) ON DELETE CASCADE,
  signal_type TEXT NOT NULL,  -- 'hiring', 'funding', 'tech_migration', 'news'
  signal_title TEXT NOT NULL,
  signal_detail TEXT,
  signal_date DATE,
  signal_strength TEXT DEFAULT 'medium',  -- 'low', 'medium', 'high'
  captured_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- SCORING TABLE (with computed total + tier)
-- ============================================================

CREATE TABLE lead_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id UUID NOT NULL REFERENCES developer_signups(id) ON DELETE CASCADE,

  -- Component scores (0-100)
  company_score INT DEFAULT 0,      -- Is this an enterprise target?
  usage_score INT DEFAULT 0,        -- How active are they?
  expansion_score INT DEFAULT 0,    -- Are there expansion signals?
  champion_score INT DEFAULT 0,     -- How engaged is the developer?
  timing_score INT DEFAULT 0,       -- Is now a good time?

  -- Computed total score with weighted formula
  total_score INT GENERATED ALWAYS AS (
    ROUND(
      (company_score * 0.25) +      -- 25% weight
      (usage_score * 0.30) +        -- 30% weight (most important for PLG)
      (expansion_score * 0.20) +    -- 20% weight
      (champion_score * 0.15) +     -- 15% weight
      (timing_score * 0.10)         -- 10% weight
    )
  ) STORED,

  -- Computed tier assignment
  tier TEXT GENERATED ALWAYS AS (
    CASE
      WHEN (company_score * 0.25 + usage_score * 0.30 + expansion_score * 0.20
            + champion_score * 0.15 + timing_score * 0.10) >= 80 THEN 'hot'
      WHEN (company_score * 0.25 + usage_score * 0.30 + expansion_score * 0.20
            + champion_score * 0.15 + timing_score * 0.10) >= 60 THEN 'warm'
      WHEN (company_score * 0.25 + usage_score * 0.30 + expansion_score * 0.20
            + champion_score * 0.15 + timing_score * 0.10) >= 40 THEN 'nurture'
      ELSE 'monitor'
    END
  ) STORED,

  suggested_action TEXT,
  scored_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- DASHBOARD VIEW (joins everything for the UI)
-- ============================================================

CREATE OR REPLACE VIEW lead_dashboard AS
SELECT
  d.id AS developer_id,
  d.email,
  d.full_name AS champion_name,
  d.company_domain,
  d.is_company_email,
  c.company_name,
  c.industry,
  c.employee_count,
  c.employee_range,
  c.funding_stage,
  c.total_funding_usd,
  c.tech_stack,
  i.project_count,
  i.billing_tier,
  i.team_member_count,
  i.api_calls_30d,
  i.api_call_growth_pct,
  i.uses_auth,
  i.uses_edge_functions,
  i.uses_realtime,
  i.uses_vector,
  i.last_active_at,

  -- Features as array for easy display
  ARRAY_REMOVE(ARRAY[
    CASE WHEN i.uses_auth THEN 'Auth' END,
    CASE WHEN i.uses_storage THEN 'Storage' END,
    CASE WHEN i.uses_edge_functions THEN 'Edge Functions' END,
    CASE WHEN i.uses_realtime THEN 'Realtime' END,
    CASE WHEN i.uses_vector THEN 'Vector' END,
    CASE WHEN i.uses_cron THEN 'Cron' END
  ], NULL) AS features_used,

  s.total_score,
  s.tier,
  s.suggested_action,

  (SELECT COUNT(*) FROM stakeholders WHERE company_domain = d.company_domain) AS stakeholder_count,
  (SELECT COUNT(*) FROM expansion_signals WHERE company_domain = d.company_domain) AS signal_count

FROM developer_signups d
LEFT JOIN company_enrichment c ON c.domain = d.company_domain
LEFT JOIN internal_signals i ON i.developer_id = d.id
LEFT JOIN lead_scores s ON s.developer_id = d.id
WHERE d.is_company_email = true  -- Only show company emails
ORDER BY s.total_score DESC NULLS LAST;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE developer_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_enrichment ENABLE ROW LEVEL SECURITY;
ALTER TABLE stakeholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE expansion_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_scores ENABLE ROW LEVEL SECURITY;

-- Public read for demo purposes
CREATE POLICY "public read" ON developer_signups FOR SELECT USING (true);
CREATE POLICY "public read" ON internal_signals FOR SELECT USING (true);
CREATE POLICY "public read" ON company_enrichment FOR SELECT USING (true);
CREATE POLICY "public read" ON stakeholders FOR SELECT USING (true);
CREATE POLICY "public read" ON expansion_signals FOR SELECT USING (true);
CREATE POLICY "public read" ON lead_scores FOR SELECT USING (true);`;

  const seedData = `-- Sample Lead: VelocityPay (Hot - Score 87)
-- Fintech scaling fast, Auth0 contract renewal window

INSERT INTO developer_signups (id, email, full_name, company_domain, signup_source)
VALUES ('11111111-1111-1111-1111-111111111111',
        'marcus.chen@velocitypay.io', 'Marcus Chen', 'velocitypay.io', 'github');

INSERT INTO company_enrichment (domain, company_name, industry, employee_count,
                                employee_range, funding_stage, total_funding_usd, tech_stack)
VALUES ('velocitypay.io', 'VelocityPay', 'Financial Services', 180,
        '51-200', 'series_b', 45000000, '["AWS", "PostgreSQL", "Auth0", "React"]');

INSERT INTO internal_signals (developer_id, project_count, uses_auth, uses_storage,
                              uses_edge_functions, uses_realtime, billing_tier,
                              team_member_count, api_calls_30d, api_calls_prev_30d)
VALUES ('11111111-1111-1111-1111-111111111111', 4, true, true, true, true,
        'pro', 5, 2800000, 800000);  -- 250% API growth!

INSERT INTO stakeholders (company_domain, full_name, title, is_decision_maker, is_technical)
VALUES
  ('velocitypay.io', 'Sarah Kim', 'VP of Engineering', true, true),
  ('velocitypay.io', 'David Park', 'CTO', true, true);

INSERT INTO expansion_signals (company_domain, signal_type, signal_title, signal_strength)
VALUES
  ('velocitypay.io', 'hiring', 'Hiring 4 Backend Engineers', 'high'),
  ('velocitypay.io', 'tech_migration', 'Auth0 contract renewal coming up', 'high'),
  ('velocitypay.io', 'funding', 'Series B closed $30M', 'high');

INSERT INTO lead_scores (developer_id, company_score, usage_score, expansion_score,
                         champion_score, timing_score, suggested_action)
VALUES ('11111111-1111-1111-1111-111111111111', 85, 95, 90, 80, 85,
        'Champion is highly active (5 team members, 250% API growth). Auth0 contract
         renewal creates migration window. Reach out to Marcus, offer to connect
         with VP Eng Sarah Kim for compliance/security conversation.');

-- Additional leads follow same pattern:
-- HomeFront Technologies (Hot, 850 employees, Firebase scaling issues)
-- CloudMetrics (Warm, job posts mention Supabase)
-- MediSync (Warm, healthcare, HIPAA needs)
-- TaskFlow (Nurture, seed stage, free tier)`;

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
          <h1 className="text-2xl md:text-3xl font-bold">Lead Scoring Schema</h1>
        </div>
        <p className="text-gray-600 mb-6">
          The Postgres schema powering the lead scoring dashboard. Real computed columns,
          RLS policies, and production patterns—not a mockup.
        </p>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          <a
            href="https://github.com/brent-bartosch/supabase-resume"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 rounded-lg text-sm font-medium no-underline transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/>
            </svg>
            View on GitHub
          </a>
          <Link
            href="/resume"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium no-underline transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            View My Resume
          </Link>
          <a
            href="https://jobs.ashbyhq.com/supabase/69d1b2ec-9d9b-45b0-937a-a8454f66487e"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 rounded-lg text-sm font-medium no-underline transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            View Job Posting
          </a>
        </div>
      </header>

      {/* Key Concepts callout */}
      <section className="mb-10 bg-emerald-50 border border-emerald-200 rounded-lg p-6">
        <h2 className="text-sm font-semibold text-emerald-800 mb-3">Key Postgres Patterns Used</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-emerald-900">
          <div className="flex items-start gap-2">
            <span className="text-emerald-600 mt-0.5">•</span>
            <span><strong>GENERATED ALWAYS AS</strong> — Computed columns for growth %, tier assignment</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-emerald-600 mt-0.5">•</span>
            <span><strong>Row Level Security</strong> — Public read policies for demo</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-emerald-600 mt-0.5">•</span>
            <span><strong>Views</strong> — lead_dashboard joins 6 tables for the UI</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-emerald-600 mt-0.5">•</span>
            <span><strong>JSONB</strong> — Flexible tech_stack storage</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-emerald-600 mt-0.5">•</span>
            <span><strong>Foreign Keys + CASCADE</strong> — Referential integrity</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-emerald-600 mt-0.5">•</span>
            <span><strong>ARRAY_REMOVE</strong> — Dynamic feature list from booleans</span>
          </div>
        </div>
      </section>

      {/* Schema */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
          Schema (schema.sql)
        </h2>
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
            <span className="text-xs text-gray-400">lead-scoring/schema.sql</span>
            <span className="text-xs text-gray-500">7 tables + 1 view + RLS</span>
          </div>
          <pre className="text-sm text-gray-100 p-4 overflow-x-auto">{schema}</pre>
        </div>
      </section>

      {/* Seed Data */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
          Sample Data (seed.sql)
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          5 realistic leads demonstrating the scoring model: 2 Hot (VelocityPay, HomeFront),
          2 Warm (CloudMetrics, MediSync), 1 Nurture (TaskFlow).
        </p>
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
            <span className="text-xs text-gray-400">lead-scoring/seed.sql</span>
            <span className="text-xs text-gray-500">Example: VelocityPay</span>
          </div>
          <pre className="text-sm text-gray-100 p-4 overflow-x-auto">{seedData}</pre>
        </div>
      </section>

      {/* Why this matters */}
      <section className="mb-10 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-sm font-semibold text-gray-800 mb-3">Why This Schema Design?</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <strong>Computed columns for scoring</strong> — The tier assignment happens in Postgres,
            not application code. Change the weights once, every query reflects it instantly.
          </p>
          <p>
            <strong>Separate enrichment tables</strong> — Company data, stakeholders, and signals
            are normalized. Add a new signal type without touching the core schema.
          </p>
          <p>
            <strong>View for the dashboard</strong> — The UI doesn&apos;t need to know about joins.
            One query to lead_dashboard returns everything needed to render a lead card.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-6 border-t border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-sm text-gray-500">
            Built by Brent Bartosch for the Supabase Enterprise AE role
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 no-underline font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
