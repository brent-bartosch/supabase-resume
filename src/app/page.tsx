import { supabase, Profile, Section, Item, Stat } from "@/lib/supabase";
import Link from "next/link";

export const revalidate = 3600; // Revalidate every hour

// Fallback data for when Supabase isn't configured
const fallbackProfile: Profile = {
  id: "fallback",
  full_name: "Brent Bartosch",
  headline: "Enterprise Account Executive (DevTools) | Postgres & Supabase Builder",
  location: "Los Angeles, CA",
  email: "brent.bartosch@gmail.com",
  phone: "310-743-3616",
  linkedin_url: "https://www.linkedin.com/in/brent-bartosch/",
  github_url: "https://github.com/brent-bartosch",
  updated_at: new Date().toISOString(),
};

const fallbackSections: Section[] = [
  { id: "1", slug: "summary", title: "Executive Summary", sort_order: 10 },
  { id: "2", slug: "core-skills", title: "What I Do Best", sort_order: 20 },
  { id: "3", slug: "experience", title: "Selected Professional Experience", sort_order: 30 },
  { id: "4", slug: "technical", title: "Selected Technical Work", sort_order: 40 },
  { id: "5", slug: "education", title: "Education & Certifications", sort_order: 50 },
];

const fallbackItems: Item[] = [
  { id: "s1", section_id: "1", sort_order: 10, item_type: "line", org: null, role: null, dates: null, location: null, body: "Enterprise AE and builder-operator with 15+ years selling technical products and leading complex enterprise cycles end-to-end (prospecting → close → expansion/renewal). Daily Supabase/Postgres user who has spent the last 3 years shipping production-grade automation, API integrations, and data workflows that connect product usage to revenue outcomes." },
  { id: "c1", section_id: "2", sort_order: 10, item_type: "bullet", org: null, role: null, dates: null, location: null, body: "Enterprise Sales (Full Cycle): Prospecting, discovery, MEDDPICC, mutual action plans, forecasting, procurement, renewal/expansion" },
  { id: "c2", section_id: "2", sort_order: 20, item_type: "bullet", org: null, role: null, dates: null, location: null, body: "Dev-Led Expansion: Developer champions → platform/security/finance stakeholders → standardization across teams" },
  { id: "c3", section_id: "2", sort_order: 30, item_type: "bullet", org: null, role: null, dates: null, location: null, body: "Technical Deal Leadership: Technical discovery, architecture conversations, proof/POC motion, integration planning" },
  { id: "c4", section_id: "2", sort_order: 40, item_type: "bullet", org: null, role: null, dates: null, location: null, body: "Postgres + Supabase: Relational modeling, schema strategy, triggers, RLS concepts, data integrity, performance patterns" },
  { id: "c5", section_id: "2", sort_order: 50, item_type: "bullet", org: null, role: null, dates: null, location: null, body: "Integrations & Automation: REST APIs, webhooks, OAuth, event-driven workflows, attribution and reporting loops" },
  { id: "e1", section_id: "3", sort_order: 10, item_type: "role", org: "Smoothed.io", role: "Founder & Principal Consultant", dates: "Dec 2022 – Present", location: null, body: "• Built and operated a production GTM + integration platform centered on PostgreSQL/Supabase\n• Reduced client acquisition costs by ~90% through multi-source data pipelines\n• Automated outbound campaign operations, cutting launch time from ~8 hours to ~3 minutes" },
  { id: "e2", section_id: "3", sort_order: 20, item_type: "role", org: "Skai (fka Kenshoo)", role: "Sales Director", dates: "June 2020 – July 2022", location: null, body: "• Partnered with technical teams on custom API integrations for marquee accounts, including HBO Max ($800k ACV)" },
  { id: "e3", section_id: "3", sort_order: 30, item_type: "role", org: "Conversion Logic", role: "Enterprise Account Executive", dates: "Sept 2017 – June 2020", location: null, body: "• Led application integration projects for enterprise clients, collaborating with Data Science and Engineering" },
  { id: "t1", section_id: "4", sort_order: 10, item_type: "bullet", org: null, role: null, dates: null, location: null, body: "Production-grade lead gen + sales automation platform: multi-source collection → enrichment → qualification → CRM graduation → multi-touch attribution" },
  { id: "t2", section_id: "4", sort_order: 20, item_type: "bullet", org: null, role: null, dates: null, location: null, body: "Queue-based state machine: pending → processing → completed/failed with checkpoint/resume recovery and auto-retry" },
  { id: "t3", section_id: "4", sort_order: 30, item_type: "bullet", org: null, role: null, dates: null, location: null, body: "Event-driven architecture: webhooks + database triggers for automated signal → lead → CRM routing" },
  { id: "d1", section_id: "5", sort_order: 10, item_type: "bullet", org: null, role: null, dates: null, location: null, body: "Bachelor of Arts in Business Administration, Loyola Marymount University" },
  { id: "d2", section_id: "5", sort_order: 20, item_type: "bullet", org: null, role: null, dates: null, location: null, body: "AWS Certified Cloud Practitioner (2023)" },
  { id: "d3", section_id: "5", sort_order: 30, item_type: "bullet", org: null, role: null, dates: null, location: null, body: "MEDDPICC Masterclass Certification (2023)" },
];

const fallbackStats: Stat[] = [
  { id: "s1", stat_key: "records", stat_value: "388K+", stat_label: "Records Processed", sort_order: 10 },
  { id: "s2", stat_key: "leads", stat_value: "46K+", stat_label: "Leads Generated", sort_order: 20 },
  { id: "s3", stat_key: "edge_functions", stat_value: "6", stat_label: "Edge Functions", sort_order: 30 },
  { id: "s4", stat_key: "tables", stat_value: "25+", stat_label: "Database Tables", sort_order: 40 },
  { id: "s5", stat_key: "projects", stat_value: "3", stat_label: "Supabase Projects", sort_order: 50 },
];

async function getResumeData() {
  // If Supabase isn't configured, use fallback data
  if (!supabase) {
    return {
      profile: fallbackProfile,
      sections: fallbackSections,
      items: fallbackItems,
      stats: fallbackStats,
    };
  }

  const [profileRes, sectionsRes, itemsRes, statsRes] = await Promise.all([
    supabase.from("resume_profile").select("*").limit(1).single(),
    supabase.from("resume_sections").select("*").order("sort_order", { ascending: true }),
    supabase.from("resume_items").select("*").order("sort_order", { ascending: true }),
    supabase.from("resume_stats").select("*").order("sort_order", { ascending: true }),
  ]);

  return {
    profile: (profileRes.data as Profile | null) || fallbackProfile,
    sections: (sectionsRes.data as Section[] | null) || fallbackSections,
    items: (itemsRes.data as Item[] | null) || fallbackItems,
    stats: (statsRes.data as Stat[] | null) || fallbackStats,
  };
}

export default async function Home() {
  const { profile, sections, items, stats } = await getResumeData();

  // Group items by section
  const itemsBySection = new Map<string, Item[]>();
  items.forEach((item) => {
    const existing = itemsBySection.get(item.section_id) || [];
    itemsBySection.set(item.section_id, [...existing, item]);
  });

  return (
    <main className="max-w-[850px] mx-auto px-6 py-12 md:py-16">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              {profile?.full_name}
            </h1>
            <p className="text-gray-600 text-lg">
              {profile?.headline}
            </p>
          </div>
          <div className="text-sm text-gray-600 md:text-right space-y-1">
            <div>{profile?.location}</div>
            <div>
              <a href={`mailto:${profile?.email}`}>{profile?.email}</a>
            </div>
            <div>{profile?.phone}</div>
            <div className="flex gap-3 md:justify-end">
              {profile?.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              )}
              {profile?.github_url && (
                <a href={profile.github_url} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              )}
            </div>
            <div className="pt-2 no-print flex flex-col gap-1.5 md:items-end">
              <Link
                href="/leads"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 no-underline"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Lead Scoring Demo
              </Link>
              <Link
                href="/sql"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 no-underline"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
                SQL version
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Sections */}
      {sections.map((section) => {
        const sectionItems = itemsBySection.get(section.id) || [];

        return (
          <section key={section.id} className="mb-8">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-200 pb-2 mb-4">
              {section.title}
            </h2>

            {section.slug === "experience" ? (
              <div className="space-y-6">
                {sectionItems.map((item) => (
                  <div key={item.id}>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-1 mb-2">
                      <div>
                        <span className="font-semibold">{item.org}</span>
                        <span className="text-gray-600"> | {item.role}</span>
                      </div>
                      <div className="text-sm text-gray-500">{item.dates}</div>
                    </div>
                    <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                      {item.body}
                    </div>
                  </div>
                ))}
              </div>
            ) : section.slug === "summary" ? (
              <div className="text-gray-700 leading-relaxed">
                {sectionItems.map((item) => (
                  <p key={item.id}>{item.body}</p>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {sectionItems.map((item) => (
                  <div key={item.id} className="flex gap-3 text-sm text-gray-700">
                    <span className="text-gray-400 select-none">•</span>
                    <span className="leading-relaxed">{item.body}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })}

      {/* Footer with Stats */}
      <footer className="mt-12 pt-6 border-t border-gray-200 no-print">
        <div className="flex flex-wrap gap-6 justify-center mb-6">
          {stats.map((stat) => (
            <div key={stat.id} className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{stat.stat_value}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">{stat.stat_label}</div>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-400">
          Built on{" "}
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 hover:text-emerald-700"
          >
            Supabase
          </a>
          {" "}(Postgres + RLS). Normal resume first; nerd tab optional.
        </p>
      </footer>
    </main>
  );
}
