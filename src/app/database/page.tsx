'use client';

import Link from 'next/link';

const tables = [
  {
    name: 'developer_signups',
    description: 'Core user data - developer accounts signing up for Supabase',
    purpose: 'Entry point for PLG funnel. Tracks who signed up and from where.',
    columns: [
      { name: 'id', type: 'UUID', note: 'Primary key' },
      { name: 'email', type: 'TEXT', note: 'Unique user email' },
      { name: 'full_name', type: 'TEXT', note: 'Developer name' },
      { name: 'company_domain', type: 'TEXT', note: 'Extracted from email or provided' },
      { name: 'signup_date', type: 'TIMESTAMPTZ', note: 'When they signed up' },
      { name: 'signup_source', type: 'TEXT', note: 'organic, github, google, referral' },
      { name: 'is_company_email', type: 'BOOLEAN', note: '⚡ GENERATED - filters out personal emails', highlight: true },
    ],
    rowCount: 8,
  },
  {
    name: 'internal_signals',
    description: 'Usage metrics from the Supabase platform',
    purpose: 'The heart of PLG scoring - shows actual product adoption and growth.',
    columns: [
      { name: 'developer_id', type: 'UUID', note: 'FK → developer_signups' },
      { name: 'project_count', type: 'INT', note: 'Total projects created' },
      { name: 'uses_auth / uses_storage / uses_edge_functions / uses_realtime / uses_vector / uses_cron', type: 'BOOLEAN', note: 'Feature adoption flags' },
      { name: 'billing_tier', type: 'TEXT', note: 'free, pro, team, enterprise' },
      { name: 'team_member_count', type: 'INT', note: 'Team size indicator' },
      { name: 'api_calls_30d', type: 'BIGINT', note: 'Current period usage' },
      { name: 'api_calls_prev_30d', type: 'BIGINT', note: 'Previous period for comparison' },
      { name: 'api_call_growth_pct', type: 'NUMERIC', note: '⚡ GENERATED - auto-calculates MoM growth', highlight: true },
    ],
    rowCount: 8,
  },
  {
    name: 'company_enrichment',
    description: 'External data from Apollo, Clearbit, LinkedIn',
    purpose: 'Enriches developer signups with company context for enterprise qualification.',
    columns: [
      { name: 'domain', type: 'TEXT', note: 'Primary key - company domain' },
      { name: 'company_name', type: 'TEXT', note: 'Display name' },
      { name: 'industry / sub_industry', type: 'TEXT', note: 'Vertical classification' },
      { name: 'employee_count / employee_range', type: 'INT / TEXT', note: 'Company size' },
      { name: 'funding_stage', type: 'TEXT', note: 'seed through series_d+' },
      { name: 'total_funding_usd', type: 'BIGINT', note: 'Total raised' },
      { name: 'tech_stack', type: 'JSONB', note: '⚡ JSONB array of technologies', highlight: true },
      { name: 'headquarters_city / headquarters_country', type: 'TEXT', note: 'Location' },
    ],
    rowCount: 6,
  },
  {
    name: 'stakeholders',
    description: 'Key people at each company',
    purpose: 'Maps the buying committee - who to contact beyond the developer champion.',
    columns: [
      { name: 'company_domain', type: 'TEXT', note: 'FK → company_enrichment' },
      { name: 'full_name / title', type: 'TEXT', note: 'Person details' },
      { name: 'department', type: 'TEXT', note: 'engineering, product, security, finance, executive' },
      { name: 'seniority', type: 'TEXT', note: 'ic, manager, director, vp, c-level' },
      { name: 'is_decision_maker / is_technical / is_budget_holder', type: 'BOOLEAN', note: 'Role flags for outreach strategy' },
      { name: 'linkedin_url / email', type: 'TEXT', note: 'Contact info' },
    ],
    rowCount: 16,
  },
  {
    name: 'expansion_signals',
    description: 'External triggers indicating expansion opportunity',
    purpose: 'Captures hiring, funding, and tech migration signals that indicate buying intent.',
    columns: [
      { name: 'company_domain', type: 'TEXT', note: 'FK → company_enrichment' },
      { name: 'signal_type', type: 'TEXT', note: 'hiring, funding, tech_migration, news, competitor_churn' },
      { name: 'signal_title / signal_detail', type: 'TEXT', note: 'What happened' },
      { name: 'signal_url', type: 'TEXT', note: 'Source link' },
      { name: 'signal_strength', type: 'TEXT', note: 'low, medium, high - affects scoring weight' },
    ],
    rowCount: 14,
  },
  {
    name: 'lead_scores',
    description: 'Computed scores for prioritization',
    purpose: 'The scoring engine - weights internal + external signals into actionable tiers.',
    columns: [
      { name: 'developer_id', type: 'UUID', note: 'FK → developer_signups' },
      { name: 'company_score', type: 'INT', note: '25% weight - enterprise fit' },
      { name: 'usage_score', type: 'INT', note: '30% weight - product adoption (highest!)' },
      { name: 'expansion_score', type: 'INT', note: '20% weight - buying signals' },
      { name: 'champion_score', type: 'INT', note: '15% weight - developer engagement' },
      { name: 'timing_score', type: 'INT', note: '10% weight - recent activity' },
      { name: 'total_score', type: 'INT', note: '⚡ GENERATED - weighted sum of components', highlight: true },
      { name: 'tier', type: 'TEXT', note: '⚡ GENERATED - hot (80+), warm (60+), nurture (40+), monitor', highlight: true },
      { name: 'suggested_action', type: 'TEXT', note: 'Next best action for AE' },
    ],
    rowCount: 8,
  },
  {
    name: 'ae_activities',
    description: 'AE engagement tracking',
    purpose: 'Tracks outreach history to prevent duplicate contacts and measure conversion.',
    columns: [
      { name: 'developer_id', type: 'UUID', note: 'FK → developer_signups' },
      { name: 'activity_type', type: 'TEXT', note: 'viewed, contacted, meeting_scheduled, demo_completed, opportunity_created' },
      { name: 'activity_notes', type: 'TEXT', note: 'Context for handoffs' },
      { name: 'created_by', type: 'TEXT', note: 'Which AE took action' },
    ],
    rowCount: 0,
  },
];

const views = [
  {
    name: 'lead_dashboard',
    description: 'Main view joining all tables for the dashboard UI',
    sql: `SELECT
  d.id, d.email, d.full_name AS champion_name,
  c.company_name, c.industry, c.employee_count,
  i.billing_tier, i.api_calls_30d, i.api_call_growth_pct,
  s.total_score, s.tier, s.suggested_action,
  -- Feature array for easy display
  ARRAY_REMOVE(ARRAY[
    CASE WHEN i.uses_auth THEN 'Auth' END,
    CASE WHEN i.uses_edge_functions THEN 'Edge Functions' END,
    ...
  ], NULL) AS features_used
FROM developer_signups d
LEFT JOIN company_enrichment c ON c.domain = d.company_domain
LEFT JOIN internal_signals i ON i.developer_id = d.id
LEFT JOIN lead_scores s ON s.developer_id = d.id
WHERE d.is_company_email = true
ORDER BY s.total_score DESC;`,
  },
  {
    name: 'hot_leads',
    description: 'Filtered view of tier = "hot" leads for urgent follow-up',
    sql: `SELECT * FROM lead_dashboard WHERE tier = 'hot' ORDER BY total_score DESC;`,
  },
];

const patterns = [
  {
    name: 'GENERATED ALWAYS AS',
    description: 'Computed columns that auto-calculate on write',
    example: `is_company_email BOOLEAN GENERATED ALWAYS AS (
  email NOT LIKE '%@gmail.com'
  AND email NOT LIKE '%@yahoo.com'
  -- etc.
) STORED`,
    benefit: 'No application code needed - database handles the logic. Always consistent.',
  },
  {
    name: 'Weighted Scoring Formula',
    description: 'Total score calculated from component scores with business-defined weights',
    example: `total_score INT GENERATED ALWAYS AS (
  (company_score * 0.25) +   -- 25% weight
  (usage_score * 0.30) +     -- 30% weight (PLG priority!)
  (expansion_score * 0.20) + -- 20% weight
  (champion_score * 0.15) +  -- 15% weight
  (timing_score * 0.10)      -- 10% weight
) STORED`,
    benefit: 'Scoring logic lives in the database, not scattered across application code.',
  },
  {
    name: 'Tier Assignment',
    description: 'Automatic lead qualification based on score thresholds',
    example: `tier TEXT GENERATED ALWAYS AS (
  CASE
    WHEN total_score >= 80 THEN 'hot'
    WHEN total_score >= 60 THEN 'warm'
    WHEN total_score >= 40 THEN 'nurture'
    ELSE 'monitor'
  END
) STORED`,
    benefit: 'Consistent tier assignment. Change thresholds in one place.',
  },
  {
    name: 'Row Level Security (RLS)',
    description: 'Access control at the database level',
    example: `ALTER TABLE developer_signups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read" ON developer_signups
  FOR SELECT USING (true);`,
    benefit: 'Security enforced in Postgres, not application. Works with any client.',
  },
];

export default function DatabasePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/"
              className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
            >
              ← Back to Dashboard
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Database Schema
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mb-6">
            The lead scoring system is built on <strong>7 tables</strong> and <strong>2 views</strong> in Postgres,
            demonstrating how to prioritize PLG signups for enterprise expansion.
          </p>

          {/* Supabase Dashboard Access */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-emerald-900 mb-1">
                  View the actual Supabase project
                </h2>
                <p className="text-sm text-emerald-700">
                  Supabase team: You can access the live database, table editor, and SQL editor directly.
                </p>
              </div>
              <a
                href="https://supabase.com/dashboard/project/jhjaxdnhfhylnsyuszav"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors whitespace-nowrap"
              >
                <svg className="w-5 h-5" viewBox="0 0 109 113" fill="currentColor">
                  <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" />
                  <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" fillOpacity="0.2" />
                  <path d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z" />
                </svg>
                Open Supabase Dashboard
              </a>
            </div>
          </div>
        </div>

        {/* Schema Diagram Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Flow</h2>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-center">
              <div className="font-semibold text-blue-900">developer_signups</div>
              <div className="text-blue-600 text-xs">Entry point</div>
            </div>
            <div className="text-gray-400">→</div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-3 text-center">
              <div className="font-semibold text-purple-900">internal_signals</div>
              <div className="text-purple-600 text-xs">Usage data</div>
            </div>
            <div className="text-gray-400">+</div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-center">
              <div className="font-semibold text-amber-900">company_enrichment</div>
              <div className="text-amber-600 text-xs">External data</div>
            </div>
            <div className="text-gray-400">→</div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-center">
              <div className="font-semibold text-emerald-900">lead_scores</div>
              <div className="text-emerald-600 text-xs">Prioritization</div>
            </div>
            <div className="text-gray-400">→</div>
            <div className="bg-rose-50 border border-rose-200 rounded-lg px-4 py-3 text-center">
              <div className="font-semibold text-rose-900">lead_dashboard</div>
              <div className="text-rose-600 text-xs">View for UI</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm mt-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-center">
              <div className="font-semibold text-gray-900">stakeholders</div>
              <div className="text-gray-600 text-xs">Buying committee</div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-center">
              <div className="font-semibold text-gray-900">expansion_signals</div>
              <div className="text-gray-600 text-xs">Intent triggers</div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-center">
              <div className="font-semibold text-gray-900">ae_activities</div>
              <div className="text-gray-600 text-xs">Outreach tracking</div>
            </div>
          </div>
        </div>

        {/* Tables */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tables</h2>
          <div className="space-y-6">
            {tables.map((table) => (
              <div
                key={table.name}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-mono font-semibold text-gray-900">
                        {table.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{table.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{table.rowCount} rows</div>
                      <div className="text-xs text-gray-500">sample data</div>
                    </div>
                  </div>
                  <p className="text-sm text-emerald-700 mt-2 bg-emerald-50 px-3 py-1.5 rounded inline-block">
                    <strong>Purpose:</strong> {table.purpose}
                  </p>
                </div>
                <div className="px-6 py-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500">
                        <th className="pb-2 font-medium">Column</th>
                        <th className="pb-2 font-medium">Type</th>
                        <th className="pb-2 font-medium">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {table.columns.map((col, i) => (
                        <tr key={i} className={col.highlight ? 'bg-amber-50' : ''}>
                          <td className="py-2 font-mono text-gray-900">{col.name}</td>
                          <td className="py-2 text-gray-600">{col.type}</td>
                          <td className="py-2 text-gray-600">{col.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Views */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Views</h2>
          <div className="space-y-6">
            {views.map((view) => (
              <div
                key={view.name}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
                  <h3 className="text-lg font-mono font-semibold text-indigo-900">
                    {view.name}
                  </h3>
                  <p className="text-sm text-indigo-700 mt-1">{view.description}</p>
                </div>
                <div className="px-6 py-4">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
                    {view.sql}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Postgres Patterns */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Key Postgres Patterns Used
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {patterns.map((pattern) => (
              <div
                key={pattern.name}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {pattern.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{pattern.description}</p>
                <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-xs overflow-x-auto mb-4">
                  {pattern.example}
                </pre>
                <p className="text-sm text-emerald-700 bg-emerald-50 px-3 py-2 rounded">
                  <strong>Why it matters:</strong> {pattern.benefit}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">This is a working Supabase project</h2>
          <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
            Not just mockups - this dashboard queries real Postgres tables with RLS policies.
            The scoring logic runs in the database, not the application.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://supabase.com/dashboard/project/jhjaxdnhfhylnsyuszav"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-700 font-semibold rounded-lg hover:bg-emerald-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 109 113" fill="currentColor">
                <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" />
                <path d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z" />
              </svg>
              Open Supabase Dashboard
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-800 text-white font-semibold rounded-lg hover:bg-emerald-900 transition-colors"
            >
              View Live Dashboard
            </Link>
            <Link
              href="/sql"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-800 text-white font-semibold rounded-lg hover:bg-emerald-900 transition-colors"
            >
              View Full SQL Schema
            </Link>
            <a
              href="https://github.com/brent-bartosch/supabase-resume"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-800 text-white font-semibold rounded-lg hover:bg-emerald-900 transition-colors"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
