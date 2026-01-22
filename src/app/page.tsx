import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const metadata = {
  title: "Brent Bartosch | Enterprise Pipeline Manager for Supabase",
  description: "A lead scoring tool for PLG expansion - built by Brent Bartosch to demonstrate how I'd work Supabase's enterprise pipeline.",
};

export const revalidate = 60; // Revalidate every minute

// Types for our data
type Lead = {
  id: string;
  email: string;
  champion_name: string;
  company_name: string;
  company_domain: string;
  industry: string;
  employee_count: number;
  employee_range: string;
  funding_stage: string;
  total_funding_usd: number;
  billing_tier: string;
  team_member_count: number;
  project_count: number;
  api_calls_30d: number;
  api_call_growth_pct: number;
  features_used: string[];
  total_score: number;
  tier: string;
  company_score: number;
  usage_score: number;
  expansion_score: number;
  champion_score: number;
  timing_score: number;
  stakeholders: { name: string; title: string }[];
  signals: { type: string; title: string }[];
  suggested_action: string;
  last_active: string;
};

// Fallback mock data
const mockLeads: Lead[] = [
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

// Helper to format relative time
function formatLastActive(date: string | null): string {
  if (!date) return "Unknown";
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  return `${Math.floor(diffDays / 7)} week(s) ago`;
}

// Fetch leads from Supabase
async function getLeads(): Promise<{ leads: Lead[]; isLive: boolean }> {
  if (!supabase) {
    return { leads: mockLeads, isLive: false };
  }

  try {
    // Fetch from lead_dashboard view
    const { data: dashboardData, error: dashboardError } = await supabase
      .from("lead_dashboard")
      .select("*")
      .order("total_score", { ascending: false });

    if (dashboardError || !dashboardData || dashboardData.length === 0) {
      console.log("Using mock data - dashboard error or empty:", dashboardError);
      return { leads: mockLeads, isLive: false };
    }

    // Fetch stakeholders
    const { data: stakeholdersData } = await supabase
      .from("stakeholders")
      .select("*");

    // Fetch expansion signals
    const { data: signalsData } = await supabase
      .from("expansion_signals")
      .select("*");

    // Group stakeholders and signals by company domain
    const stakeholdersByDomain = new Map<string, { name: string; title: string }[]>();
    (stakeholdersData || []).forEach((s: { company_domain: string; full_name: string; title: string }) => {
      const existing = stakeholdersByDomain.get(s.company_domain) || [];
      existing.push({ name: s.full_name, title: s.title || "" });
      stakeholdersByDomain.set(s.company_domain, existing);
    });

    const signalsByDomain = new Map<string, { type: string; title: string }[]>();
    (signalsData || []).forEach((s: { company_domain: string; signal_type: string; signal_title: string }) => {
      const existing = signalsByDomain.get(s.company_domain) || [];
      existing.push({ type: s.signal_type, title: s.signal_title });
      signalsByDomain.set(s.company_domain, existing);
    });

    // Transform to Lead type
    const leads: Lead[] = dashboardData.map((row: Record<string, unknown>) => ({
      id: row.developer_id as string,
      email: row.email as string,
      champion_name: (row.champion_name as string) || (row.email as string)?.split("@")[0] || "Unknown",
      company_name: (row.company_name as string) || (row.company_domain as string) || "Unknown",
      company_domain: (row.company_domain as string) || "",
      industry: (row.industry as string) || "Technology",
      employee_count: (row.employee_count as number) || 0,
      employee_range: (row.employee_range as string) || "Unknown",
      funding_stage: (row.funding_stage as string) || "unknown",
      total_funding_usd: (row.total_funding_usd as number) || 0,
      billing_tier: (row.billing_tier as string) || "free",
      team_member_count: (row.team_member_count as number) || 1,
      project_count: (row.project_count as number) || 0,
      api_calls_30d: (row.api_calls_30d as number) || 0,
      api_call_growth_pct: Number(row.api_call_growth_pct) || 0,
      features_used: (row.features_used as string[]) || [],
      total_score: (row.total_score as number) || 0,
      tier: (row.tier as string) || "monitor",
      company_score: (row.company_score as number) || 0,
      usage_score: (row.usage_score as number) || 0,
      expansion_score: (row.expansion_score as number) || 0,
      champion_score: (row.champion_score as number) || 0,
      timing_score: (row.timing_score as number) || 0,
      stakeholders: stakeholdersByDomain.get(row.company_domain as string) || [],
      signals: signalsByDomain.get(row.company_domain as string) || [],
      suggested_action: (row.suggested_action as string) || "Review account for expansion potential.",
      last_active: formatLastActive(row.last_active_at as string),
    }));

    return { leads, isLive: true };
  } catch (error) {
    console.error("Error fetching leads:", error);
    return { leads: mockLeads, isLive: false };
  }
}

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

export default async function Home() {
  const { leads, isLive } = await getLeads();

  const hotLeads = leads.filter((l) => l.tier === "hot");
  const warmLeads = leads.filter((l) => l.tier === "warm");
  const nurtureLeads = leads.filter((l) => l.tier === "nurture");

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section - Candidate Pitch */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          {/* Top bar with links */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              {isLive ? (
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full text-sm">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Live from Supabase
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-sm text-emerald-200">
                  Sample Data
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Link href="/scenarios/ai-startup" className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white no-underline transition-colors">
                Scenario Demo
              </Link>
              <Link href="/database" className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white no-underline transition-colors">
                Database
              </Link>
              <Link href="/resume" className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white no-underline transition-colors">
                My Resume
              </Link>
              <Link href="/sql" className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white no-underline transition-colors">
                View SQL
              </Link>
            </div>
          </div>

          {/* Main headline */}
          <div className="mb-2 text-emerald-200 text-sm font-medium tracking-wide uppercase">
            Enterprise AE Candidate
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Brent Bartosch&apos;s<br />
            Enterprise Pipeline Manager for Supabase
          </h1>

          <p className="text-xl text-emerald-100 mb-6 max-w-3xl">
            You have thousands of developer signups weekly, many from enterprises.
            This is how I&apos;d identify which ones are ready for expansion—on day 1.
          </p>

          {/* CTA for sharing */}
          <div className="bg-white/10 border border-white/20 rounded-lg p-4 mb-8 max-w-2xl">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <div className="font-semibold mb-1">Feel free to share this</div>
                <p className="text-emerald-200 text-sm">
                  Forward to your GTM team, Engineering, or anyone who&apos;d appreciate
                  a candidate who builds instead of just talks. I want to show I&apos;m
                  collaborative, creative, and a <strong className="text-white">builder</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* What this demonstrates */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="font-semibold mb-1">I Understand the Business</div>
              <p className="text-emerald-200 text-sm">
                PLG expansion: developer signup → usage signals → enterprise upsell
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="font-semibold mb-1">I Can Tackle the Role</div>
              <p className="text-emerald-200 text-sm">
                Prioritized pipeline, stakeholder mapping, actionable next steps
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="font-semibold mb-1">I Build on Supabase</div>
              <p className="text-emerald-200 text-sm">
                Real schema, RLS policies, computed columns—not a mockup
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick context bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="text-sm text-gray-600">
              <strong className="text-gray-900">How it works:</strong> Combine internal signals
              (usage, billing tier, feature adoption) with external enrichment (company size,
              funding, hiring) to score and prioritize leads.
            </div>
            <a
              href="https://jobs.ashbyhq.com/supabase/69d1b2ec-9d9b-45b0-937a-a8454f66487e"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium whitespace-nowrap no-underline"
            >
              View the Job Posting →
            </a>
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
            <div className="text-2xl font-bold text-gray-600">{leads.length}</div>
            <div className="text-sm text-gray-500">Total Leads</div>
            <div className="text-xs text-gray-400 mt-1">{isLive ? "From Supabase" : "Sample dataset"}</div>
          </div>
        </div>

        {/* Lead Cards */}
        <div className="space-y-6">
          {leads.map((lead) => (
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
                          tierColors[lead.tier as keyof typeof tierColors] || tierColors.monitor
                        }`}
                      >
                        {tierLabels[lead.tier as keyof typeof tierLabels] || "Monitor"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {lead.industry} • {lead.employee_range} employees •{" "}
                      {lead.funding_stage?.replace("_", " ").toUpperCase()}
                      {lead.total_funding_usd > 0 && ` (${formatFunding(lead.total_funding_usd)})`}
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
                      <span className={lead.api_call_growth_pct > 0 ? "text-emerald-600 font-medium" : "text-gray-600"}>
                        {lead.api_call_growth_pct > 0 ? "+" : ""}{lead.api_call_growth_pct}%
                      </span>
                    </div>
                  </div>

                  {lead.features_used && lead.features_used.length > 0 && (
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
                  )}
                </div>

                {/* Stakeholders & Signals */}
                <div>
                  {lead.stakeholders && lead.stakeholders.length > 0 && (
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

                  {lead.signals && lead.signals.length > 0 && (
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
        <footer className="mt-12 pt-6 border-t border-gray-200">
          <div className="text-center mb-6">
            <div className="text-sm text-gray-600 mb-2">
              Built by <strong>Brent Bartosch</strong> for the Supabase Enterprise AE role
            </div>
            <div className="flex items-center justify-center gap-4 text-sm">
              <Link href="/resume" className="text-emerald-600 hover:text-emerald-700">
                View My Resume
              </Link>
              <span className="text-gray-300">|</span>
              <a
                href="https://www.linkedin.com/in/brent-bartosch/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:text-emerald-700"
              >
                LinkedIn
              </a>
              <span className="text-gray-300">|</span>
              <a
                href="mailto:brent.bartosch@gmail.com"
                className="text-emerald-600 hover:text-emerald-700"
              >
                brent.bartosch@gmail.com
              </a>
            </div>
          </div>
          <p className="text-center text-xs text-gray-400">
            Real Supabase schema • Postgres + RLS • Production patterns
          </p>
        </footer>
      </div>
    </main>
  );
}
