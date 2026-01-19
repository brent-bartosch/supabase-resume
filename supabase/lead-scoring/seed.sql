-- Seed Data for Lead Scoring Demo
-- Realistic examples showing the PLG expansion motion

-- Clear existing data
TRUNCATE developer_signups, internal_signals, company_enrichment, stakeholders, expansion_signals, lead_scores, ae_activities CASCADE;

-- ============================================================
-- HOT LEADS (Score 80+) - Ready for outreach
-- ============================================================

-- Lead 1: Fintech scaling fast (like Rally case study)
INSERT INTO developer_signups (id, email, full_name, company_domain, signup_date, signup_source)
VALUES ('11111111-1111-1111-1111-111111111111', 'marcus.chen@velocitypay.io', 'Marcus Chen', 'velocitypay.io', NOW() - INTERVAL '4 months', 'github');

INSERT INTO company_enrichment (domain, company_name, industry, sub_industry, employee_count, employee_range, company_type, funding_stage, total_funding_usd, last_funding_date, last_funding_amount_usd, headquarters_city, headquarters_country, tech_stack, linkedin_url)
VALUES ('velocitypay.io', 'VelocityPay', 'Financial Services', 'Payments Infrastructure', 180, '51-200', 'scaleup', 'series_b', 45000000, '2024-08-15', 30000000, 'San Francisco', 'USA', '["AWS", "PostgreSQL", "Auth0", "Stripe", "React"]', 'https://linkedin.com/company/velocitypay');

INSERT INTO internal_signals (developer_id, project_count, active_projects, uses_auth, uses_storage, uses_edge_functions, uses_realtime, billing_tier, tier_upgraded_at, team_member_count, team_members_added_last_30d, api_calls_30d, api_calls_prev_30d, db_size_mb, last_active_at, dashboard_logins_30d)
VALUES ('11111111-1111-1111-1111-111111111111', 4, 3, true, true, true, true, 'pro', NOW() - INTERVAL '6 weeks', 5, 3, 2800000, 800000, 4500, NOW() - INTERVAL '2 hours', 45);

INSERT INTO stakeholders (company_domain, full_name, title, department, seniority, linkedin_url, is_decision_maker, is_technical, is_budget_holder)
VALUES
  ('velocitypay.io', 'Sarah Kim', 'VP of Engineering', 'engineering', 'vp', 'https://linkedin.com/in/sarahkim-eng', true, true, true),
  ('velocitypay.io', 'David Park', 'CTO', 'engineering', 'c-level', 'https://linkedin.com/in/davidpark-cto', true, true, true),
  ('velocitypay.io', 'Jennifer Walsh', 'Head of Platform', 'engineering', 'director', 'https://linkedin.com/in/jenniferwalsh', true, true, false),
  ('velocitypay.io', 'Marcus Chen', 'Senior Backend Engineer', 'engineering', 'ic', 'https://linkedin.com/in/marcuschen', false, true, false);

INSERT INTO expansion_signals (company_domain, signal_type, signal_title, signal_detail, signal_date, signal_strength)
VALUES
  ('velocitypay.io', 'hiring', 'Hiring 4 Backend Engineers', 'Job posts mention PostgreSQL, real-time systems, and payment processing', '2024-12-01', 'high'),
  ('velocitypay.io', 'tech_migration', 'Auth0 contract renewal coming up', 'LinkedIn post from VP Eng mentions evaluating auth solutions', '2024-11-15', 'high'),
  ('velocitypay.io', 'funding', 'Series B closed $30M', 'Led by Andreessen Horowitz, expanding platform team', '2024-08-15', 'high');

INSERT INTO lead_scores (developer_id, company_score, usage_score, expansion_score, champion_score, timing_score, suggested_action)
VALUES ('11111111-1111-1111-1111-111111111111', 85, 95, 90, 80, 85,
  'Champion is highly active (5 team members, 250% API growth). Auth0 contract renewal creates migration window. Reach out to Marcus, offer to connect with VP Eng Sarah Kim for compliance/security conversation.');


-- Lead 2: Enterprise real estate (like eXp case study)
INSERT INTO developer_signups (id, email, full_name, company_domain, signup_date, signup_source)
VALUES ('22222222-2222-2222-2222-222222222222', 'alex.rivera@homefront.com', 'Alex Rivera', 'homefront.com', NOW() - INTERVAL '3 months', 'organic');

INSERT INTO company_enrichment (domain, company_name, industry, sub_industry, employee_count, employee_range, company_type, funding_stage, total_funding_usd, last_funding_date, last_funding_amount_usd, headquarters_city, headquarters_country, tech_stack, linkedin_url)
VALUES ('homefront.com', 'HomeFront Technologies', 'Real Estate', 'PropTech Platform', 850, '501-1000', 'enterprise', 'series_c', 120000000, '2024-03-20', 60000000, 'Austin', 'USA', '["AWS RDS", "Firebase", "Heroku", "MongoDB", "React Native"]', 'https://linkedin.com/company/homefront');

INSERT INTO internal_signals (developer_id, project_count, active_projects, uses_auth, uses_storage, uses_edge_functions, uses_realtime, uses_vector, billing_tier, tier_upgraded_at, team_member_count, team_members_added_last_30d, api_calls_30d, api_calls_prev_30d, db_size_mb, last_active_at, dashboard_logins_30d)
VALUES ('22222222-2222-2222-2222-222222222222', 2, 2, true, true, false, true, true, 'team', NOW() - INTERVAL '3 weeks', 8, 4, 1500000, 600000, 8200, NOW() - INTERVAL '1 day', 38);

INSERT INTO stakeholders (company_domain, full_name, title, department, seniority, linkedin_url, is_decision_maker, is_technical, is_budget_holder)
VALUES
  ('homefront.com', 'Michael Torres', 'Chief Technology Officer', 'engineering', 'c-level', 'https://linkedin.com/in/michaeltorres', true, true, true),
  ('homefront.com', 'Lisa Chang', 'VP Platform Engineering', 'engineering', 'vp', 'https://linkedin.com/in/lisachang', true, true, true),
  ('homefront.com', 'Robert Kim', 'Director of Security', 'security', 'director', 'https://linkedin.com/in/robertkim-sec', true, false, false),
  ('homefront.com', 'Alex Rivera', 'Staff Engineer', 'engineering', 'ic', 'https://linkedin.com/in/alexrivera', false, true, false);

INSERT INTO expansion_signals (company_domain, signal_type, signal_title, signal_detail, signal_date, signal_strength)
VALUES
  ('homefront.com', 'hiring', 'Building AI/ML team', '6 open roles for ML engineers, mentions vector search and embeddings', '2024-12-10', 'high'),
  ('homefront.com', 'tech_migration', 'Firebase scaling issues', 'Engineer tweeted about Firebase cold start problems at scale', '2024-11-28', 'high'),
  ('homefront.com', 'news', 'Expanding to 15 new markets', 'Press release about aggressive 2025 expansion plans', '2024-12-01', 'medium');

INSERT INTO lead_scores (developer_id, company_score, usage_score, expansion_score, champion_score, timing_score, suggested_action)
VALUES ('22222222-2222-2222-2222-222222222222', 95, 88, 92, 75, 80,
  'Enterprise account with Team tier already adopted. Using Vector (AI features) - positions well against Firebase limitations. 8 team members indicates organizational buy-in. Connect with Lisa Chang (VP Platform) to discuss enterprise SSO and compliance needs.');


-- ============================================================
-- WARM LEADS (Score 60-79) - Nurture and develop
-- ============================================================

-- Lead 3: Growing SaaS, active champion
INSERT INTO developer_signups (id, email, full_name, company_domain, signup_date, signup_source)
VALUES ('33333333-3333-3333-3333-333333333333', 'nina.patel@cloudmetrics.io', 'Nina Patel', 'cloudmetrics.io', NOW() - INTERVAL '2 months', 'referral');

INSERT INTO company_enrichment (domain, company_name, industry, sub_industry, employee_count, employee_range, company_type, funding_stage, total_funding_usd, last_funding_date, last_funding_amount_usd, headquarters_city, headquarters_country, tech_stack, linkedin_url)
VALUES ('cloudmetrics.io', 'CloudMetrics', 'Software', 'Observability & Monitoring', 75, '51-200', 'scaleup', 'series_a', 12000000, '2024-01-10', 12000000, 'Denver', 'USA', '["DigitalOcean", "PostgreSQL", "Grafana", "ClickHouse"]', 'https://linkedin.com/company/cloudmetrics');

INSERT INTO internal_signals (developer_id, project_count, active_projects, uses_auth, uses_storage, uses_edge_functions, uses_realtime, billing_tier, tier_upgraded_at, team_member_count, team_members_added_last_30d, api_calls_30d, api_calls_prev_30d, db_size_mb, last_active_at, dashboard_logins_30d)
VALUES ('33333333-3333-3333-3333-333333333333', 2, 2, true, false, true, true, 'pro', NOW() - INTERVAL '4 weeks', 3, 1, 450000, 200000, 1200, NOW() - INTERVAL '6 hours', 28);

INSERT INTO stakeholders (company_domain, full_name, title, department, seniority, linkedin_url, is_decision_maker, is_technical, is_budget_holder)
VALUES
  ('cloudmetrics.io', 'James Wilson', 'Co-founder & CTO', 'engineering', 'c-level', 'https://linkedin.com/in/jameswilson', true, true, true),
  ('cloudmetrics.io', 'Nina Patel', 'Lead Backend Engineer', 'engineering', 'manager', 'https://linkedin.com/in/ninapatel', false, true, false);

INSERT INTO expansion_signals (company_domain, signal_type, signal_title, signal_detail, signal_date, signal_strength)
VALUES
  ('cloudmetrics.io', 'hiring', 'Hiring 2 Full-stack Engineers', 'Job posts mention Supabase experience as a plus', '2024-12-05', 'high'),
  ('cloudmetrics.io', 'funding', 'Series A 11 months ago', 'Should have runway, likely planning next growth phase', '2024-01-10', 'medium');

INSERT INTO lead_scores (developer_id, company_score, usage_score, expansion_score, champion_score, timing_score, suggested_action)
VALUES ('33333333-3333-3333-3333-333333333333', 65, 72, 70, 78, 60,
  'Champion is active and expanding usage (125% growth). Company at Series A with hiring momentum. Job posts mention Supabase - internal advocacy happening. Good candidate for customer story if they scale. Light touch - check in about their use case and offer resources.');


-- Lead 4: Healthcare tech, compliance focus
INSERT INTO developer_signups (id, email, full_name, company_domain, signup_date, signup_source)
VALUES ('44444444-4444-4444-4444-444444444444', 'tom.jackson@medisync.health', 'Tom Jackson', 'medisync.health', NOW() - INTERVAL '6 weeks', 'google');

INSERT INTO company_enrichment (domain, company_name, industry, sub_industry, employee_count, employee_range, company_type, funding_stage, total_funding_usd, last_funding_date, last_funding_amount_usd, headquarters_city, headquarters_country, tech_stack, linkedin_url)
VALUES ('medisync.health', 'MediSync', 'Healthcare', 'Health Tech SaaS', 120, '51-200', 'scaleup', 'series_a', 18000000, '2024-06-01', 18000000, 'Boston', 'USA', '["AWS", "PostgreSQL", "Okta", "React"]', 'https://linkedin.com/company/medisync');

INSERT INTO internal_signals (developer_id, project_count, active_projects, uses_auth, uses_storage, uses_edge_functions, uses_realtime, billing_tier, tier_upgraded_at, team_member_count, team_members_added_last_30d, api_calls_30d, api_calls_prev_30d, db_size_mb, last_active_at, dashboard_logins_30d)
VALUES ('44444444-4444-4444-4444-444444444444', 1, 1, true, true, false, false, 'pro', NOW() - INTERVAL '2 weeks', 2, 1, 180000, 80000, 600, NOW() - INTERVAL '3 days', 15);

INSERT INTO stakeholders (company_domain, full_name, title, department, seniority, linkedin_url, is_decision_maker, is_technical, is_budget_holder)
VALUES
  ('medisync.health', 'Amanda Foster', 'VP Engineering', 'engineering', 'vp', 'https://linkedin.com/in/amandafoster', true, true, true),
  ('medisync.health', 'Brian Lee', 'Head of Security & Compliance', 'security', 'director', 'https://linkedin.com/in/brianlee-sec', true, false, false),
  ('medisync.health', 'Tom Jackson', 'Senior Developer', 'engineering', 'ic', 'https://linkedin.com/in/tomjackson', false, true, false);

INSERT INTO expansion_signals (company_domain, signal_type, signal_title, signal_detail, signal_date, signal_strength)
VALUES
  ('medisync.health', 'hiring', 'Hiring Security Engineer', 'Focus on HIPAA compliance and SOC 2', '2024-11-20', 'medium'),
  ('medisync.health', 'news', 'Partnership with major hospital network', 'Expansion will require scaling infrastructure', '2024-12-08', 'medium');

INSERT INTO lead_scores (developer_id, company_score, usage_score, expansion_score, champion_score, timing_score, suggested_action)
VALUES ('44444444-4444-4444-4444-444444444444', 75, 58, 65, 55, 70,
  'Healthcare = high compliance needs (HIPAA). Currently light usage but growing (125% API growth). Hospital partnership signals scaling. Need to address compliance early - share SOC 2 and HIPAA documentation. Champion may need help building business case internally.');


-- ============================================================
-- NURTURE LEADS (Score 40-59) - Early stage, check back later
-- ============================================================

-- Lead 5: Early startup, exploring
INSERT INTO developer_signups (id, email, full_name, company_domain, signup_date, signup_source)
VALUES ('55555555-5555-5555-5555-555555555555', 'jason.wright@taskflow.app', 'Jason Wright', 'taskflow.app', NOW() - INTERVAL '3 weeks', 'organic');

INSERT INTO company_enrichment (domain, company_name, industry, sub_industry, employee_count, employee_range, company_type, funding_stage, total_funding_usd, last_funding_date, last_funding_amount_usd, headquarters_city, headquarters_country, tech_stack, linkedin_url)
VALUES ('taskflow.app', 'TaskFlow', 'Software', 'Productivity Tools', 12, '11-50', 'startup', 'seed', 2500000, '2024-09-01', 2500000, 'Seattle', 'USA', '["Vercel", "PlanetScale", "Clerk"]', 'https://linkedin.com/company/taskflow');

INSERT INTO internal_signals (developer_id, project_count, active_projects, uses_auth, uses_storage, uses_edge_functions, uses_realtime, billing_tier, team_member_count, api_calls_30d, api_calls_prev_30d, db_size_mb, last_active_at, dashboard_logins_30d)
VALUES ('55555555-5555-5555-5555-555555555555', 1, 1, true, false, false, false, 'free', 1, 25000, 10000, 50, NOW() - INTERVAL '1 week', 8);

INSERT INTO stakeholders (company_domain, full_name, title, department, seniority, linkedin_url, is_decision_maker, is_technical, is_budget_holder)
VALUES
  ('taskflow.app', 'Jason Wright', 'Co-founder & CTO', 'engineering', 'c-level', 'https://linkedin.com/in/jasonwright', true, true, true);

INSERT INTO lead_scores (developer_id, company_score, usage_score, expansion_score, champion_score, timing_score, suggested_action)
VALUES ('55555555-5555-5555-5555-555555555555', 35, 45, 40, 50, 55,
  'Early-stage seed startup on free tier. Founder is technical and exploring. Good for long-term nurture - they could grow significantly. Add to newsletter, share relevant content. Check back in 3-6 months for growth signals.');


-- Lead 6: Agency building for clients
INSERT INTO developer_signups (id, email, full_name, company_domain, signup_date, signup_source)
VALUES ('66666666-6666-6666-6666-666666666666', 'maria.santos@pixelcraft.dev', 'Maria Santos', 'pixelcraft.dev', NOW() - INTERVAL '5 weeks', 'referral');

INSERT INTO company_enrichment (domain, company_name, industry, sub_industry, employee_count, employee_range, company_type, funding_stage, headquarters_city, headquarters_country, tech_stack, linkedin_url)
VALUES ('pixelcraft.dev', 'PixelCraft Studios', 'Services', 'Development Agency', 25, '11-50', 'agency', 'bootstrapped', 'Portland', 'USA', '["Next.js", "Supabase", "Vercel", "Tailwind"]', 'https://linkedin.com/company/pixelcraft');

INSERT INTO internal_signals (developer_id, project_count, active_projects, uses_auth, uses_storage, uses_edge_functions, uses_realtime, billing_tier, team_member_count, api_calls_30d, api_calls_prev_30d, db_size_mb, last_active_at, dashboard_logins_30d)
VALUES ('66666666-6666-6666-6666-666666666666', 6, 4, true, true, true, false, 'pro', 2, 320000, 280000, 800, NOW() - INTERVAL '12 hours', 22);

INSERT INTO lead_scores (developer_id, company_score, usage_score, expansion_score, champion_score, timing_score, suggested_action)
VALUES ('66666666-6666-6666-6666-666666666666', 30, 65, 45, 70, 50,
  'Development agency with 6 projects (client work). Good usage but agency model means smaller individual deals. Could be a partner opportunity - they bring Supabase to their clients. Consider partner program outreach rather than enterprise sale.');


-- ============================================================
-- MONITOR LEADS (Score <40) - Not ready yet
-- ============================================================

-- Lead 7: Personal email, side project
INSERT INTO developer_signups (id, email, full_name, company_domain, signup_date, signup_source)
VALUES ('77777777-7777-7777-7777-777777777777', 'dev.chris.miller@gmail.com', 'Chris Miller', NULL, NOW() - INTERVAL '2 months', 'organic');

INSERT INTO internal_signals (developer_id, project_count, active_projects, uses_auth, uses_storage, billing_tier, team_member_count, api_calls_30d, api_calls_prev_30d, db_size_mb, last_active_at, dashboard_logins_30d)
VALUES ('77777777-7777-7777-7777-777777777777', 1, 0, true, false, 'free', 1, 500, 2000, 10, NOW() - INTERVAL '3 weeks', 2);

INSERT INTO lead_scores (developer_id, company_score, usage_score, expansion_score, champion_score, timing_score, suggested_action)
VALUES ('77777777-7777-7777-7777-777777777777', 0, 15, 10, 20, 20,
  'Personal email, minimal usage, declining activity. Likely side project or learning. No action needed - automated nurture only.');


-- Lead 8: Small business, limited growth potential
INSERT INTO developer_signups (id, email, full_name, company_domain, signup_date, signup_source)
VALUES ('88888888-8888-8888-8888-888888888888', 'owner@localflowers.shop', 'Emily Brown', 'localflowers.shop', NOW() - INTERVAL '6 weeks', 'google');

INSERT INTO company_enrichment (domain, company_name, industry, employee_count, employee_range, company_type, funding_stage, headquarters_city, headquarters_country)
VALUES ('localflowers.shop', 'Local Flowers', 'Retail', 3, '1-10', 'indie', 'bootstrapped', 'Portland', 'USA');

INSERT INTO internal_signals (developer_id, project_count, active_projects, uses_auth, uses_storage, billing_tier, team_member_count, api_calls_30d, api_calls_prev_30d, db_size_mb, last_active_at, dashboard_logins_30d)
VALUES ('88888888-8888-8888-8888-888888888888', 1, 1, true, true, 'free', 1, 8000, 7500, 25, NOW() - INTERVAL '2 days', 6);

INSERT INTO lead_scores (developer_id, company_score, usage_score, expansion_score, champion_score, timing_score, suggested_action)
VALUES ('88888888-8888-8888-8888-888888888888', 10, 30, 15, 40, 25,
  'Small local business, 3 employees. Great Supabase user but limited enterprise expansion potential. Perfect free/Pro tier customer. No AE action needed - product-led conversion.');


-- ============================================================
-- ADD AE ACTIVITY FOR DEMO
-- ============================================================

INSERT INTO ae_activities (developer_id, activity_type, activity_notes, created_at, created_by)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'viewed', 'Reviewed account, high potential', NOW() - INTERVAL '2 days', 'Demo AE'),
  ('11111111-1111-1111-1111-111111111111', 'contacted', 'Sent initial outreach email to Marcus', NOW() - INTERVAL '1 day', 'Demo AE'),
  ('22222222-2222-2222-2222-222222222222', 'viewed', 'Enterprise account, preparing outreach', NOW() - INTERVAL '3 days', 'Demo AE');
