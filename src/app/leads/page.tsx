import Link from "next/link";

export const metadata = {
  title: "Lead Scoring Dashboard | Supabase PLG",
  description: "Developer signup prioritization for enterprise expansion",
};

// Mock data matching our seed.sql - in production this would come from Supabase
const mockLeads = [
  {
    id: "1",
    email: "marcus.chen@velocitypay.io",
    champion_name: "Marcus Chen",
    company_name: "VelocityPay",
    company_domain: "velocitypay.io",
    industry: "Financial Services",
    employee_count: 180,
    employee_range: "51-200",
    funding_stage: "series_b",
    total_funding_usd: 45000000,
    billing_tier: "pro",
    team_member_count: 5,
    project_count: 4,
    api_calls_30d: 2800000,
    api_call_growth_pct: 250,
    features_used: ["Auth", "Storage", "Edge Functions", "Realtime"],
    total_score: 87,
    tier: "hot",
    company_score: 85,
    usage_score: 95,
    expansion_score: 90,
    champion_score: 80,
    timing_score: 85,
    stakeholders: [
      { name: "Sarah Kim", title: "VP of Engineering" },
      { name: "David Park", title: "CTO" },
    ],
    signals: [
      { type: "hiring", title: "Hiring 4 Backend Engineers" },
      { type: "tech_migration", title: "Auth0 contract renewal coming up" },
      { type: "funding", title: "Series B closed $30M" },
    ],
    suggested_action: "Champion is highly active (5 team members, 250% API growth). Auth0 contract renewal creates migration window. Reach out to Marcus, offer to connect with VP Eng Sarah Kim for compliance/security conversation.",
    last_active: "2 hours ago",
  },
  {
    id: "2",
    email: "alex.rivera@homefront.com",
    champion_name: "Alex Rivera",
    company_name: "HomeFront Technologies",
    company_domain: "homefront.com",
    industry: "Real Estate",
    employee_count: 850,
    employee_range: "501-1000",
    funding_stage: "series_c",
    total_funding_usd: 120000000,
    billing_tier: "team",
    team_member_count: 8,
    project_count: 2,
    api_calls_30d: 1500000,
    api_call_growth_pct: 150,
    features_used: ["Auth", "Storage", "Realtime", "Vector"],
    total_score: 85,
    tier: "hot",
    company_score: 95,
    usage_score: 88,
    expansion_score: 92,
    champion_score: 75,
    timing_score: 80,
    stakeholders: [
      { name: "Michael Torres", title: "CTO" },
      { name: "Lisa Chang", title: "VP Platform Engineering" },
    ],
    signals: [
      { type: "hiring", title: "Building AI/ML team (6 roles)" },
      { type: "tech_migration", title: "Firebase scaling issues" },
      { type: "news", title: "Expanding to 15 new markets" },
    ],
    suggested_action: "Enterprise account with Team tier already adopted. Using Vector (AI features) - positions well against Firebase limitations. 8 team members indicates organizational buy-in. Connect with Lisa Chang (VP Platform) to discuss enterprise SSO and compliance needs.",
    last_active: "1 day ago",
  },
  {
    id: "3",
    email: "nina.patel@cloudmetrics.io",
    champion_name: "Nina Patel",
    company_name: "CloudMetrics",
    company_domain: "cloudmetrics.io",
    industry: "Software",
    employee_count: 75,
    employee_range: "51-200",
    funding_stage: "series_a",
    total_funding_usd: 12000000,
    billing_tier: "pro",
    team_member_count: 3,
    project_count: 2,
    api_calls_30d: 450000,
    api_call_growth_pct: 125,
    features_used: ["Auth", "Edge Functions", "Realtime"],
    total_score: 69,
    tier: "warm",
    company_score: 65,
    usage_score: 72,
    expansion_score: 70,
    champion_score: 78,
    timing_score: 60,
    stakeholders: [
      { name: "James Wilson", title: "Co-founder & CTO" },
    ],
    signals: [
      { type: "hiring", title: "Hiring mentions Supabase as a plus" },
    ],
    suggested_action: "Champion is active and expanding usage (125% growth). Company at Series A with hiring momentum. Job posts mention Supabase - internal advocacy happening. Light touch - check in about their use case and offer resources.",
    last_active: "6 hours ago",
  },
  {
    id: "4",
    email: "tom.jackson@medisync.health",
    champion_name: "Tom Jackson",
    company_name: "MediSync",
    company_domain: "medisync.health",
    industry: "Healthcare",
    employee_count: 120,
    employee_range: "51-200",
    funding_stage: "series_a",
    total_funding_usd: 18000000,
    billing_tier: "pro",
    team_member_count: 2,
    project_count: 1,
    api_calls_30d: 180000,
    api_call_growth_pct: 125,
    features_used: ["Auth", "Storage"],
    total_score: 65,
    tier: "warm",
    company_score: 75,
    usage_score: 58,
    expansion_score: 65,
    champion_score: 55,
    timing_score: 70,
    stakeholders: [
      { name: "Amanda Foster", title: "VP Engineering" },
      { name: "Brian Lee", title: "Head of Security & Compliance" },
    ],
    signals: [
      { type: "hiring", title: "Hiring Security Engineer (HIPAA focus)" },
      { type: "news", title: "Partnership with major hospital network" },
    ],
    suggested_action: "Healthcare = high compliance needs (HIPAA). Currently light usage but growing. Hospital partnership signals scaling. Need to address compliance early - share SOC 2 and HIPAA documentation.",
    last_active: "3 days ago",
  },
  {
    id: "5",
    email: "jason.wright@taskflow.app",
    champion_name: "Jason Wright",
    company_name: "TaskFlow",
    company_domain: "taskflow.app",
    industry: "Software",
    employee_count: 12,
    employee_range: "11-50",
    funding_stage: "seed",
    total_funding_usd: 2500000,
    billing_tier: "free",
    team_member_count: 1,
    project_count: 1,
    api_calls_30d: 25000,
    api_call_growth_pct: 150,
    features_used: ["Auth"],
    total_score: 45,
    tier: "nurture",
    company_score: 35,
    usage_score: 45,
    expansion_score: 40,
    champion_score: 50,
    timing_score: 55,
    stakeholders: [],
    signals: [],
    suggested_action: "Early-stage seed startup on free tier. Founder is technical and exploring. Good for long-term nurture. Check back in 3-6 months for growth signals.",
    last_active: "1 week ago",
  },
];

const tierColors = {
  hot: "bg-red-100 text-red-800 border-red-200",
  warm: "bg-orange-100 text-orange-800 border-orange-200",
  nurture: "bg-blue-100 text-blue-800 border-blue-200",
  monitor: "bg-gray-100 text-gray-800 border-gray-200",
};

const tierLabels = {
  hot: "Hot",
  warm: "Warm",
  nurture: "Nurture",
  monitor: "Monitor",
};

const signalIcons: Record<string, string> = {
  hiring: "👥",
  funding: "💰",
  tech_migration: "🔄",
  news: "📰",
};

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return num.toString();
}

function formatFunding(num: number): string {
  if (num >= 1000000) return `$${(num / 1000000).toFixed(0)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
  return `$${num}`;
}

function ScoreBar({ score, label }: { score: number; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-16 text-gray-500">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full"
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="w-8 text-right text-gray-600">{score}</span>
    </div>
  );
}

export default function LeadsPage() {
  const hotLeads = mockLeads.filter((l) => l.tier === "hot");
  const warmLeads = mockLeads.filter((l) => l.tier === "warm");
  const nurtureLeads = mockLeads.filter((l) => l.tier === "nurture");

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-emerald-200 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              </svg>
              Powered by Supabase
            </div>
            <Link href="/" className="text-emerald-200 hover:text-white text-sm no-underline">
              View Resume →
            </Link>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Which Developer Signups Are Ready for Enterprise?
          </h1>

          <p className="text-xl text-emerald-100 mb-6 max-w-3xl">
            Supabase gets thousands of developer signups weekly. This tool identifies which ones
            have enterprise expansion potential—so you know exactly who to call and why.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">Internal Signals</div>
              <p className="text-emerald-200 text-sm mt-1">
                Usage patterns, feature adoption, billing tier, team growth, API volume
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">External Enrichment</div>
              <p className="text-emerald-200 text-sm mt-1">
                Company size, funding, stakeholders, hiring signals, tech stack
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">Prioritized Output</div>
              <p className="text-emerald-200 text-sm mt-1">
                Scored leads with tier assignment and suggested next action
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Why This Exists */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="font-semibold text-gray-900">Why I Built This</h2>
              <p className="text-gray-600 text-sm">
                The Enterprise AE job description mentions &quot;thousands of developers signing up every week from large enterprises.&quot;
                This is the tool I&apos;d want on day 1 to prioritize that pipeline.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/sql"
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 no-underline whitespace-nowrap"
              >
                View Schema
              </Link>
              <a
                href="https://github.com/brent-bartosch/supabase-resume"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-900 hover:bg-gray-800 rounded-lg text-sm font-medium text-white no-underline whitespace-nowrap"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-red-600">{hotLeads.length}</div>
            <div className="text-sm text-gray-500">Hot Leads</div>
            <div className="text-xs text-gray-400 mt-1">Ready for outreach</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-orange-600">{warmLeads.length}</div>
            <div className="text-sm text-gray-500">Warm Leads</div>
            <div className="text-xs text-gray-400 mt-1">Developing potential</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-blue-600">{nurtureLeads.length}</div>
            <div className="text-sm text-gray-500">Nurture</div>
            <div className="text-xs text-gray-400 mt-1">Check back later</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-gray-600">{mockLeads.length}</div>
            <div className="text-sm text-gray-500">Total Leads</div>
            <div className="text-xs text-gray-400 mt-1">Sample dataset</div>
          </div>
        </div>

        {/* Lead Cards */}
        <div className="space-y-6">
          {mockLeads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{lead.company_name}</h3>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full border ${
                          tierColors[lead.tier as keyof typeof tierColors]
                        }`}
                      >
                        {tierLabels[lead.tier as keyof typeof tierLabels]}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {lead.industry} • {lead.employee_range} employees •{" "}
                      {lead.funding_stage?.replace("_", " ").toUpperCase()}
                      {lead.total_funding_usd && ` (${formatFunding(lead.total_funding_usd)})`}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-emerald-600">{lead.total_score}</div>
                  <div className="text-xs text-gray-500">SCORE</div>
                </div>
              </div>

              <div className="p-4 grid md:grid-cols-3 gap-6">
                {/* Champion & Internal Signals */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                    Champion
                  </h4>
                  <div className="mb-4">
                    <div className="font-medium">{lead.champion_name}</div>
                    <div className="text-sm text-gray-500">{lead.email}</div>
                    <div className="text-xs text-gray-400">Active {lead.last_active}</div>
                  </div>

                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                    Internal Signals
                  </h4>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Billing</span>
                      <span
                        className={`font-medium ${
                          lead.billing_tier === "team"
                            ? "text-emerald-600"
                            : lead.billing_tier === "pro"
                            ? "text-blue-600"
                            : "text-gray-600"
                        }`}
                      >
                        {lead.billing_tier.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Projects</span>
                      <span>{lead.project_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Team Members</span>
                      <span>{lead.team_member_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">API Calls (30d)</span>
                      <span>{formatNumber(lead.api_calls_30d)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Growth</span>
                      <span className="text-emerald-600 font-medium">
                        +{lead.api_call_growth_pct}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {lead.features_used.map((feature) => (
                      <span
                        key={feature}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stakeholders & Signals */}
                <div>
                  {lead.stakeholders.length > 0 && (
                    <>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                        Key Stakeholders
                      </h4>
                      <div className="space-y-2 mb-4">
                        {lead.stakeholders.map((s, i) => (
                          <div key={i} className="text-sm">
                            <div className="font-medium">{s.name}</div>
                            <div className="text-gray-500">{s.title}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {lead.signals.length > 0 && (
                    <>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                        Expansion Signals
                      </h4>
                      <div className="space-y-2">
                        {lead.signals.map((s, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <span>{signalIcons[s.type] || "📌"}</span>
                            <span>{s.title}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Scores & Action */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                    Score Breakdown
                  </h4>
                  <div className="space-y-2 mb-4">
                    <ScoreBar score={lead.company_score} label="Company" />
                    <ScoreBar score={lead.usage_score} label="Usage" />
                    <ScoreBar score={lead.expansion_score} label="Expansion" />
                    <ScoreBar score={lead.champion_score} label="Champion" />
                    <ScoreBar score={lead.timing_score} label="Timing" />
                  </div>

                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                    Suggested Action
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {lead.suggested_action}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            This is a concept demo for Supabase enterprise sales.{" "}
            <Link href="/sql" className="text-emerald-600">
              View the schema →
            </Link>
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Built on Supabase • Postgres + RLS • Real production patterns
          </p>
        </footer>
      </div>
    </main>
  );
}
