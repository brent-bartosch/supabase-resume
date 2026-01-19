-- Lead Scoring System for Product-Led Growth
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

  -- Flags
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
  api_calls_prev_30d BIGINT DEFAULT 0,  -- For growth calculation
  db_size_mb INT DEFAULT 0,
  storage_size_mb INT DEFAULT 0,

  -- Engagement
  last_active_at TIMESTAMPTZ,
  dashboard_logins_30d INT DEFAULT 0,
  support_tickets_count INT DEFAULT 0,

  -- Computed growth
  api_call_growth_pct NUMERIC GENERATED ALWAYS AS (
    CASE
      WHEN api_calls_prev_30d > 0
      THEN ROUND(((api_calls_30d - api_calls_prev_30d)::NUMERIC / api_calls_prev_30d) * 100, 1)
      ELSE 0
    END
  ) STORED,

  captured_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ENRICHMENT TABLES
-- ============================================================

-- Company enrichment (from Apollo, LinkedIn, Clearbit, etc.)
CREATE TABLE company_enrichment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT NOT NULL UNIQUE,

  -- Basic info
  company_name TEXT,
  industry TEXT,
  sub_industry TEXT,
  description TEXT,

  -- Size & stage
  employee_count INT,
  employee_range TEXT,  -- '1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'
  company_type TEXT,    -- 'startup', 'scaleup', 'enterprise', 'agency', 'indie'

  -- Funding
  funding_stage TEXT,   -- 'seed', 'series_a', 'series_b', 'series_c', 'series_d+', 'public', 'bootstrapped'
  total_funding_usd BIGINT,
  last_funding_date DATE,
  last_funding_amount_usd BIGINT,

  -- Location
  headquarters_city TEXT,
  headquarters_country TEXT,

  -- Tech signals
  tech_stack JSONB DEFAULT '[]',  -- ['AWS', 'Firebase', 'Auth0', 'Postgres']

  -- URLs
  linkedin_url TEXT,
  website_url TEXT,
  crunchbase_url TEXT,

  -- Enrichment metadata
  enriched_at TIMESTAMPTZ DEFAULT now(),
  enrichment_source TEXT,  -- 'apollo', 'clearbit', 'manual'
  enrichment_confidence NUMERIC  -- 0-1
);

-- Key stakeholders at the company
CREATE TABLE stakeholders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_domain TEXT NOT NULL REFERENCES company_enrichment(domain) ON DELETE CASCADE,

  -- Person info
  full_name TEXT NOT NULL,
  title TEXT,
  department TEXT,  -- 'engineering', 'product', 'security', 'finance', 'executive'
  seniority TEXT,   -- 'ic', 'manager', 'director', 'vp', 'c-level'

  -- Contact
  email TEXT,
  linkedin_url TEXT,

  -- Relevance
  is_decision_maker BOOLEAN DEFAULT false,
  is_technical BOOLEAN DEFAULT false,
  is_budget_holder BOOLEAN DEFAULT false,

  -- Notes
  notes TEXT,

  enriched_at TIMESTAMPTZ DEFAULT now()
);

-- Expansion signals (hiring, news, tech changes)
CREATE TABLE expansion_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_domain TEXT NOT NULL REFERENCES company_enrichment(domain) ON DELETE CASCADE,

  signal_type TEXT NOT NULL,  -- 'hiring', 'funding', 'tech_migration', 'news', 'competitor_churn'
  signal_title TEXT NOT NULL,
  signal_detail TEXT,
  signal_url TEXT,
  signal_date DATE,

  -- Scoring weight
  signal_strength TEXT DEFAULT 'medium',  -- 'low', 'medium', 'high'

  captured_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- SCORING & PRIORITIZATION
-- ============================================================

-- Lead scores (computed from signals)
CREATE TABLE lead_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id UUID NOT NULL REFERENCES developer_signups(id) ON DELETE CASCADE,

  -- Component scores (0-100)
  company_score INT DEFAULT 0,      -- Is this an enterprise target?
  usage_score INT DEFAULT 0,        -- How active are they?
  expansion_score INT DEFAULT 0,    -- Are there expansion signals?
  champion_score INT DEFAULT 0,     -- How engaged is the developer?
  timing_score INT DEFAULT 0,       -- Is now a good time?

  -- Overall score
  total_score INT GENERATED ALWAYS AS (
    ROUND(
      (company_score * 0.25) +      -- 25% weight
      (usage_score * 0.30) +        -- 30% weight (most important for PLG)
      (expansion_score * 0.20) +    -- 20% weight
      (champion_score * 0.15) +     -- 15% weight
      (timing_score * 0.10)         -- 10% weight
    )
  ) STORED,

  -- Tier assignment
  tier TEXT GENERATED ALWAYS AS (
    CASE
      WHEN (company_score * 0.25 + usage_score * 0.30 + expansion_score * 0.20 + champion_score * 0.15 + timing_score * 0.10) >= 80 THEN 'hot'
      WHEN (company_score * 0.25 + usage_score * 0.30 + expansion_score * 0.20 + champion_score * 0.15 + timing_score * 0.10) >= 60 THEN 'warm'
      WHEN (company_score * 0.25 + usage_score * 0.30 + expansion_score * 0.20 + champion_score * 0.15 + timing_score * 0.10) >= 40 THEN 'nurture'
      ELSE 'monitor'
    END
  ) STORED,

  -- Suggested action
  suggested_action TEXT,

  -- Scoring metadata
  scored_at TIMESTAMPTZ DEFAULT now(),
  scoring_version TEXT DEFAULT 'v1'
);

-- AE activity tracking
CREATE TABLE ae_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id UUID NOT NULL REFERENCES developer_signups(id) ON DELETE CASCADE,

  activity_type TEXT NOT NULL,  -- 'viewed', 'contacted', 'meeting_scheduled', 'demo_completed', 'opportunity_created'
  activity_notes TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  created_by TEXT  -- AE name/id
);

-- ============================================================
-- VIEWS FOR DASHBOARD
-- ============================================================

-- Main lead view with all data joined
CREATE OR REPLACE VIEW lead_dashboard AS
SELECT
  d.id AS developer_id,
  d.email,
  d.full_name AS champion_name,
  d.company_domain,
  d.signup_date,
  d.is_company_email,

  -- Company info
  c.company_name,
  c.industry,
  c.employee_count,
  c.employee_range,
  c.funding_stage,
  c.total_funding_usd,
  c.last_funding_date,
  c.tech_stack,

  -- Internal signals
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

  -- Scores
  s.company_score,
  s.usage_score,
  s.expansion_score,
  s.champion_score,
  s.timing_score,
  s.total_score,
  s.tier,
  s.suggested_action,

  -- Stakeholder count
  (SELECT COUNT(*) FROM stakeholders WHERE company_domain = d.company_domain) AS stakeholder_count,

  -- Expansion signal count
  (SELECT COUNT(*) FROM expansion_signals WHERE company_domain = d.company_domain) AS signal_count,

  -- Last AE activity
  (SELECT MAX(created_at) FROM ae_activities WHERE developer_id = d.id) AS last_ae_activity

FROM developer_signups d
LEFT JOIN company_enrichment c ON c.domain = d.company_domain
LEFT JOIN internal_signals i ON i.developer_id = d.id
LEFT JOIN lead_scores s ON s.developer_id = d.id
WHERE d.is_company_email = true  -- Only show company emails by default
ORDER BY s.total_score DESC NULLS LAST;

-- Hot leads summary
CREATE OR REPLACE VIEW hot_leads AS
SELECT * FROM lead_dashboard
WHERE tier = 'hot'
ORDER BY total_score DESC;

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_developer_domain ON developer_signups(company_domain);
CREATE INDEX idx_developer_signup_date ON developer_signups(signup_date);
CREATE INDEX idx_internal_signals_developer ON internal_signals(developer_id);
CREATE INDEX idx_company_domain ON company_enrichment(domain);
CREATE INDEX idx_stakeholders_domain ON stakeholders(company_domain);
CREATE INDEX idx_expansion_signals_domain ON expansion_signals(company_domain);
CREATE INDEX idx_lead_scores_developer ON lead_scores(developer_id);
CREATE INDEX idx_lead_scores_tier ON lead_scores(tier);
CREATE INDEX idx_lead_scores_total ON lead_scores(total_score DESC);

-- ============================================================
-- RLS POLICIES (for production)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE developer_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_enrichment ENABLE ROW LEVEL SECURITY;
ALTER TABLE stakeholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE expansion_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE ae_activities ENABLE ROW LEVEL SECURITY;

-- For demo purposes, allow public read
CREATE POLICY "public read" ON developer_signups FOR SELECT USING (true);
CREATE POLICY "public read" ON internal_signals FOR SELECT USING (true);
CREATE POLICY "public read" ON company_enrichment FOR SELECT USING (true);
CREATE POLICY "public read" ON stakeholders FOR SELECT USING (true);
CREATE POLICY "public read" ON expansion_signals FOR SELECT USING (true);
CREATE POLICY "public read" ON lead_scores FOR SELECT USING (true);
CREATE POLICY "public read" ON ae_activities FOR SELECT USING (true);
