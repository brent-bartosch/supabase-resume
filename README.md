# Lead Scoring for PLG Expansion

A lead prioritization tool for Supabase's developer-led growth motion. Built to demonstrate what I'd create on day 1 as an Enterprise AE.

**Live Demo:** https://supabase-resume.vercel.app/leads

---

## The Problem

Supabase has thousands of developers signing up every week. Many are from large enterprises. The challenge:

- Which signups have enterprise expansion potential?
- Who is the champion (the developer who signed up)?
- Who are the decision makers to loop in?
- What's the priority?

## The Solution

A lead scoring system that combines **internal signals** (what we know from Supabase usage) with **external enrichment** (what we learn about the company).

### Internal Signals
- Email domain (company vs personal)
- Project count and activity
- Features adopted (Auth, Edge Functions, Realtime, Vector)
- Billing tier progression (Free → Pro → Team)
- Team member growth
- API call volume and growth rate

### External Enrichment
- Company size and stage
- Funding history
- Key stakeholders (VP Eng, CTO, Platform Lead)
- Expansion signals (hiring, tech migrations, news)

### Output
Prioritized leads with scores, tier assignments (Hot/Warm/Nurture), and suggested actions.

---

## Why I Built This

The [Enterprise AE job description](https://jobs.ashbyhq.com/supabase/69d1b2ec-9d9b-45b0-937a-a8454f66487e) says:

> "We have thousands of developers signing up to use Supabase every week & many of them are from large enterprises. In this role, you will focus on helping developers adopt more Supabase and expand usage into other areas of the company."

This is the tool I'd want to work that pipeline. Instead of manually reviewing signups, I'd have a prioritized list with context on each account.

---

## Technical Implementation

Built on Supabase (of course) using patterns from my production systems:

### Database Schema
- `developer_signups` - Core lead data with computed `is_company_email`
- `internal_signals` - Usage metrics with computed `api_call_growth_pct`
- `company_enrichment` - External data (size, funding, tech stack)
- `stakeholders` - Decision makers at each company
- `expansion_signals` - Hiring, funding, migration signals
- `lead_scores` - Weighted scoring with auto-computed tier
- `lead_dashboard` view - Joins everything for the UI

### Patterns Used
- Generated columns for computed fields
- Row Level Security for access control
- Proper indexing for query performance
- Views for dashboard queries
- Foreign key relationships with cascade deletes

See `/sql` page for full schema and sample queries.

---

## Sample Leads

| Company | Industry | Tier | Score | Key Signal |
|---------|----------|------|-------|------------|
| VelocityPay | Fintech | Hot | 87 | 250% API growth, Auth0 renewal window |
| HomeFront | Real Estate | Hot | 85 | 850 employees, Firebase scaling issues |
| CloudMetrics | Software | Warm | 69 | Job posts mention Supabase |
| MediSync | Healthcare | Warm | 65 | Hospital partnership, HIPAA needs |
| TaskFlow | Software | Nurture | 45 | Seed stage, early exploration |

---

## About Me

**Brent Bartosch** - Enterprise AE with 15+ years selling technical products. Daily Supabase user with 3+ production projects (388K+ records processed).

- Resume: https://supabase-resume.vercel.app
- LinkedIn: https://linkedin.com/in/brent-bartosch
- GitHub: https://github.com/brent-bartosch

---

## Stack

- **Next.js 16** - React framework
- **Supabase** - PostgreSQL with RLS
- **Tailwind CSS** - Styling
- **Vercel** - Hosting

---

*Built to demonstrate Supabase fluency and understanding of the PLG expansion motion.*
