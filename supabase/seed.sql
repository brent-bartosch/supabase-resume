-- Seed data for Brent Bartosch Resume
-- Run this AFTER schema.sql

-- Clear existing data (for re-runs)
truncate resume_profile, resume_sections, resume_items, resume_stats cascade;

-- Profile
insert into resume_profile (full_name, headline, location, email, phone, linkedin_url, github_url)
values (
  'Brent Bartosch',
  'Enterprise Account Executive (DevTools) | Postgres & Supabase Builder',
  'Los Angeles, CA',
  'brent.bartosch@gmail.com',
  '310-743-3616',
  'https://www.linkedin.com/in/brent-bartosch/',
  'https://github.com/brent-bartosch'
);

-- Sections
insert into resume_sections (slug, title, sort_order) values
  ('summary', 'Executive Summary', 10),
  ('core-skills', 'What I Do Best', 20),
  ('experience', 'Selected Professional Experience', 30),
  ('technical', 'Selected Technical Work', 40),
  ('education', 'Education & Certifications', 50);

-- Summary
insert into resume_items (section_id, sort_order, item_type, body)
select id, 10, 'line',
'Enterprise AE and builder-operator with 15+ years selling technical products and leading complex enterprise cycles end-to-end (prospecting → close → expansion/renewal). Daily Supabase/Postgres user who has spent the last 3 years shipping production-grade automation, API integrations, and data workflows that connect product usage to revenue outcomes. Comfortable working directly with founders and technical teams, earning credibility with developers, and expanding adoption across large organizations through a disciplined enterprise process.'
from resume_sections where slug='summary';

-- Core Skills
insert into resume_items (section_id, sort_order, item_type, body)
select id, x.sort_order, 'bullet', x.body
from resume_sections s
cross join (values
  (10, 'Enterprise Sales (Full Cycle): Prospecting, discovery, MEDDPICC, mutual action plans, forecasting, procurement, renewal/expansion'),
  (20, 'Dev-Led Expansion: Developer champions → platform/security/finance stakeholders → standardization across teams'),
  (30, 'Technical Deal Leadership: Technical discovery, architecture conversations, proof/POC motion, integration planning'),
  (40, 'Postgres + Supabase: Relational modeling, schema strategy, triggers, RLS concepts, data integrity, performance patterns'),
  (50, 'Integrations & Automation: REST APIs, webhooks, OAuth, event-driven workflows, attribution and reporting loops'),
  (60, 'Cross-Functional: Tight loops with engineering/product, customer success, solutions, and founders')
) as x(sort_order, body)
where s.slug='core-skills';

-- Experience
insert into resume_items (section_id, sort_order, item_type, org, role, dates, body)
select id, x.sort_order, 'role', x.org, x.role, x.dates, x.body
from resume_sections s
cross join (values
  (10, 'Smoothed.io', 'Founder & Principal Consultant', 'Dec 2022 – Present',
   '• Built and operated a production GTM + integration platform centered on PostgreSQL/Supabase, automating lead capture → enrichment → routing → outreach → CRM sync → attribution.
• Reduced client acquisition costs by ~90% by engineering multi-source data pipelines, enrichment workflows, and automated qualification.
• Automated outbound campaign operations (SmartLead), cutting launch time from ~8 hours to ~3 minutes and enabling 5× outbound volume.
• Comfortable moving from developer champions to enterprise stakeholders (security, procurement) to drive expansion and renewal.'),
  (20, 'Crealytics', 'Enterprise Account Executive', 'July 2022 – Dec 2022',
   '• Managed complex enterprise integrations for predictive marketing intelligence and facilitated SOC 2 compliance processes.'),
  (30, 'Skai (fka Kenshoo)', 'Sales Director', 'June 2020 – July 2022',
   '• Partnered with technical teams on custom API integrations for marquee accounts, including HBO Max ($800k ACV).
• Managed compliance workflows for enterprise contracts involving PII, ensuring adherence to CCPA and GDPR.'),
  (40, 'Conversion Logic', 'Enterprise Account Executive', 'Sept 2017 – June 2020',
   '• Led application integration projects for enterprise clients, collaborating with Data Science and Engineering to design solution architectures.
• Established integration standards for data ingestion workflows that supported attribution modeling and complex marketing data pipelines.')
) as x(sort_order, org, role, dates, body)
where s.slug='experience';

-- Technical Work
insert into resume_items (section_id, sort_order, item_type, body)
select id, x.sort_order, 'bullet', x.body
from resume_sections s
cross join (values
  (10, 'Production-grade lead gen + sales automation platform: multi-source collection → enrichment → qualification → CRM graduation → multi-touch attribution (built and operated end-to-end).'),
  (20, 'Queue-based state machine: pending → processing → completed/failed with concurrent processing, checkpoint/resume recovery, stall detection, and auto-retry with exponential backoff.'),
  (30, 'Event-driven architecture: connected systems via webhooks + database triggers to automate the full path from raw signals → enriched lead → routed outreach/CRM—designed to be idempotent and resilient.'),
  (40, 'API wrapper toolkit (34+ production methods): rate limiting, retry logic, and comprehensive error handling to support reliable automation at scale.'),
  (50, 'ThorData "signals pipeline generator" (Supabase-centered): built a monitoring + processing pipeline with Reddit/HN/Twitter/GitHub scrapers, Edge Function scheduled capture + pg_cron every 4 hours, ~1,100 daily signal capture with automated LLM tiering + company extraction → auto-lead creation.')
) as x(sort_order, body)
where s.slug='technical';

-- Education
insert into resume_items (section_id, sort_order, item_type, body)
select id, x.sort_order, 'bullet', x.body
from resume_sections s
cross join (values
  (10, 'Bachelor of Arts in Business Administration, Loyola Marymount University'),
  (20, 'AWS Certified Cloud Practitioner (2023)'),
  (30, 'MEDDPICC Masterclass Certification (2023)')
) as x(sort_order, body)
where s.slug='education';

-- Stats (real numbers from Supabase projects)
insert into resume_stats (stat_key, stat_value, stat_label, sort_order) values
  ('records', '388K+', 'Records Processed', 10),
  ('leads', '46K+', 'Leads Generated', 20),
  ('edge_functions', '6', 'Edge Functions', 30),
  ('tables', '25+', 'Database Tables', 40),
  ('projects', '3', 'Supabase Projects', 50);
