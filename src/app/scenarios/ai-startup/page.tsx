"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

export default function AIStartupScenario() {
  const [users, setUsers] = useState(1000);
  const [imagesPerDay, setImagesPerDay] = useState(500);
  const [teamSize, setTeamSize] = useState(2);
  const [currentTier, setCurrentTier] = useState("free");

  // Multivariate calculations - all sections respond to inputs
  const metrics = useMemo(() => {
    const tierMultiplier = currentTier === "team" ? 1.5 : currentTier === "pro" ? 1.2 : 1;
    const growthRate = Math.min(2.5, 1 + (teamSize * 0.1) + (tierMultiplier * 0.3));

    // Storage & volume calculations
    const storageGB = Math.round((imagesPerDay * 30 * 2) / 1000);
    const redundantStorageGB = Math.round(storageGB * 0.6);
    const monthlyImages = imagesPerDay * 30;

    // Growth projections (affected by team size and tier)
    const projectedUsers3Mo = Math.round(users * growthRate * 2);
    const projectedUsers6Mo = Math.round(users * growthRate * 8);
    const projectedUsers12Mo = Math.round(users * growthRate * 25);

    // Quick Wins calculations
    const storageSavings = Math.round(redundantStorageGB * 0.15); // $0.15/GB
    const vectorEngagementBoost = Math.min(25, 15 + Math.floor(users / 10000) * 2);
    const stripeRecoveryRate = currentTier === "free" ? 5 : currentTier === "pro" ? 8 : 12;
    const estimatedMRR = currentTier === "free" ? users * 0.5 : currentTier === "pro" ? users * 2 : users * 5;
    const stripeRecovery = Math.round(estimatedMRR * (stripeRecoveryRate / 100));

    // 90-Day calculations
    const apiAdoptionRate = Math.min(25, 10 + Math.floor(teamSize / 5) * 3);
    const apiRevenueMonthly = Math.round(monthlyImages * 0.05 * (apiAdoptionRate / 100));
    const batchSavingsPercent = Math.min(45, 30 + Math.floor(imagesPerDay / 5000) * 5);
    const computeCostEstimate = Math.round(imagesPerDay * 0.002 * 30);
    const batchSavings = Math.round(computeCostEstimate * (batchSavingsPercent / 100));
    const supportTicketsPerMonth = Math.round(users * 0.02);
    const realtimeTicketReduction = Math.min(50, 35 + Math.floor(imagesPerDay / 2000) * 5);
    const ticketsSaved = Math.round(supportTicketsPerMonth * (realtimeTicketReduction / 100));
    const conversionBoost = Math.min(20, 10 + Math.floor(users / 5000) * 2);
    const activeUsersNow = Math.round(users * (imagesPerDay / (users * 2)));

    // Enterprise calculations
    const ssoUnlockDealSize = teamSize >= 10 ? 100000 : teamSize >= 5 ? 50000 : 25000;
    const enterpriseClientsCapacity = Math.round(projectedUsers6Mo / 1000);
    const concurrentConnections = Math.round((users * 0.05) + (teamSize * 2));
    const readReplicaRecommended = projectedUsers6Mo > 50000;
    const connectionPoolingCritical = concurrentConnections > 100;

    // Platform play calculations
    const platformRevenuePerWorkspace = currentTier === "team" ? 200 : currentTier === "pro" ? 100 : 50;
    const potentialWorkspaces = Math.round(projectedUsers12Mo / 500);
    const platformRevenuePotential = potentialWorkspaces * platformRevenuePerWorkspace;
    const dataPointsForML = monthlyImages * 12;

    // Urgency indicators
    const daysUntilStorageLimit = currentTier === "free" ? Math.round(1000 / (storageGB || 1) * 30) :
                                   currentTier === "pro" ? Math.round(10000 / (storageGB || 1) * 30) : 999;
    const needsUpgrade = (currentTier === "free" && users > 5000) ||
                         (currentTier === "pro" && users > 25000);

    return {
      storageGB,
      redundantStorageGB,
      monthlyImages,
      growthRate,
      projectedUsers3Mo,
      projectedUsers6Mo,
      projectedUsers12Mo,
      storageSavings,
      vectorEngagementBoost,
      stripeRecoveryRate,
      stripeRecovery,
      estimatedMRR,
      apiAdoptionRate,
      apiRevenueMonthly,
      batchSavingsPercent,
      batchSavings,
      computeCostEstimate,
      supportTicketsPerMonth,
      realtimeTicketReduction,
      ticketsSaved,
      conversionBoost,
      activeUsersNow,
      ssoUnlockDealSize,
      enterpriseClientsCapacity,
      concurrentConnections,
      readReplicaRecommended,
      connectionPoolingCritical,
      platformRevenuePerWorkspace,
      potentialWorkspaces,
      platformRevenuePotential,
      dataPointsForML,
      daysUntilStorageLimit,
      needsUpgrade,
    };
  }, [users, imagesPerDay, teamSize, currentTier]);

  const formatNumber = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
    return n.toString();
  };

  const formatCurrency = (n: number) => {
    if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
    return `$${n}`;
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-violet-600 to-purple-800 text-white">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="text-violet-200 hover:text-white text-sm no-underline flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
            <span className="text-violet-200 text-sm">Scenario Demo</span>
          </div>

          <div className="mb-2 text-violet-200 text-sm font-medium tracking-wide uppercase">
            Growth Planning Tool
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Your AI Startup Growth Path
          </h1>
          <p className="text-xl text-violet-100 max-w-2xl">
            Based on what we&apos;ve seen with similar AI startups, here&apos;s how your infrastructure
            needs will evolve — and how to stay ahead of them.
          </p>
        </div>
      </div>

      {/* Context bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <p className="text-sm text-gray-600">
            <strong className="text-gray-900">How an AE would use this:</strong> Send to a new user in the AI startup segment who is seeing results and has Enterprise potential.
            &quot;I put together a growth map for you to help scale as your business grows.&quot;
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Current State Inputs */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Where You Are Now</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Monthly Active Users</label>
              <input
                type="range"
                min="100"
                max="100000"
                step="100"
                value={users}
                onChange={(e) => setUsers(Number(e.target.value))}
                className="w-full accent-violet-600"
              />
              <div className="text-2xl font-bold text-violet-600 mt-1">{formatNumber(users)}</div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Images Generated / Day</label>
              <input
                type="range"
                min="50"
                max="50000"
                step="50"
                value={imagesPerDay}
                onChange={(e) => setImagesPerDay(Number(e.target.value))}
                className="w-full accent-violet-600"
              />
              <div className="text-2xl font-bold text-violet-600 mt-1">{formatNumber(imagesPerDay)}</div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Team Size</label>
              <input
                type="range"
                min="1"
                max="50"
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full accent-violet-600"
              />
              <div className="text-2xl font-bold text-violet-600 mt-1">{teamSize}</div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Current Tier</label>
              <select
                value={currentTier}
                onChange={(e) => setCurrentTier(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="free">Free</option>
                <option value="pro">Pro ($25/mo)</option>
                <option value="team">Team ($599/mo)</option>
              </select>
              <div className="text-sm text-gray-500 mt-2">
                Est. storage: {metrics.storageGB}GB/mo
              </div>
              {metrics.daysUntilStorageLimit < 90 && (
                <div className="text-xs text-amber-600 mt-1">
                  ~{metrics.daysUntilStorageLimit} days until limit
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Quick Wins */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 font-bold">1</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Quick Wins (Next 30 Days)</h2>
              <p className="text-sm text-gray-500">Low-effort, high-impact moves you can make this week</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">COST SAVINGS</span>
                <span className="text-xs text-gray-400">Storage</span>
              </div>
              <h3 className="font-semibold mb-2">Enable Image Transformations</h3>
              <p className="text-sm text-gray-600 mb-3">
                Serve thumbnails on-the-fly instead of storing 5 sizes of every image.
                At {formatNumber(imagesPerDay)} images/day, you&apos;re storing ~{metrics.redundantStorageGB}GB of redundant thumbnails.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-600">
                  Save ~{formatCurrency(metrics.storageSavings)}/mo
                </span>
                <span className="text-xs text-gray-400">60% reduction</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-1 rounded">GROWTH</span>
                <span className="text-xs text-gray-400">Vector</span>
              </div>
              <h3 className="font-semibold mb-2">Add &quot;More Like This&quot; Search</h3>
              <p className="text-sm text-gray-600 mb-3">
                Vector similarity search lets users find images like ones they&apos;ve created.
                With {formatNumber(users)} users, this drives significant engagement.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-violet-600">
                  +{metrics.vectorEngagementBoost}% engagement
                </span>
                <span className="text-xs text-gray-400">+{formatNumber(Math.round(users * metrics.vectorEngagementBoost / 100))} active users</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">REVENUE</span>
                <span className="text-xs text-gray-400">Stripe Sync</span>
              </div>
              <h3 className="font-semibold mb-2">Sync Stripe to Your DB</h3>
              <p className="text-sm text-gray-600 mb-3">
                One-click sync gets payment data into Supabase. At {currentTier} tier with ~{formatCurrency(metrics.estimatedMRR)} MRR,
                you can recover churned revenue automatically.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-600">
                  Recover ~{formatCurrency(metrics.stripeRecovery)}/mo
                </span>
                <span className="text-xs text-gray-400">{metrics.stripeRecoveryRate}% recovery rate</span>
              </div>
            </div>
          </div>
        </section>

        {/* 90-Day Growth Plays */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="text-orange-600 font-bold">2</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold">90-Day Growth Plays</h2>
              <p className="text-sm text-gray-500">
                At {formatNumber(metrics.projectedUsers3Mo)} users ({metrics.growthRate.toFixed(1)}x growth rate), these become high-leverage
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-1 rounded">NEW REVENUE</span>
                <span className="text-xs text-gray-400">Edge Functions</span>
              </div>
              <h3 className="font-semibold mb-2">Launch Your API</h3>
              <p className="text-sm text-gray-600 mb-3">
                Expose image generation as an API for developers. Edge Functions handle auth,
                rate limiting, and billing integration. With a {teamSize}-person team, you can support {metrics.apiAdoptionRate}% API adoption.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-violet-600">
                  {formatCurrency(metrics.apiRevenueMonthly)}/mo potential
                </span>
                <span className="text-xs text-gray-400">{formatNumber(metrics.monthlyImages)} images × $0.05 × {metrics.apiAdoptionRate}%</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">COST SAVINGS</span>
                <span className="text-xs text-gray-400">Cron + Queues</span>
              </div>
              <h3 className="font-semibold mb-2">Batch Processing Off-Peak</h3>
              <p className="text-sm text-gray-600 mb-3">
                At {formatNumber(imagesPerDay)} images/day, your compute bill is ~{formatCurrency(metrics.computeCostEstimate)}/mo.
                Queue non-urgent generations for off-peak hours when compute is cheaper.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-600">
                  Save {formatCurrency(metrics.batchSavings)}/mo
                </span>
                <span className="text-xs text-gray-400">{metrics.batchSavingsPercent}% reduction</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-1 rounded">GROWTH</span>
                <span className="text-xs text-gray-400">Realtime</span>
              </div>
              <h3 className="font-semibold mb-2">Live Generation Progress</h3>
              <p className="text-sm text-gray-600 mb-3">
                With {formatNumber(users)} users generating {formatNumber(imagesPerDay)} images/day,
                you&apos;re getting ~{metrics.supportTicketsPerMonth} &quot;is it working?&quot; tickets/month. Real-time progress kills these.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-violet-600">
                  -{metrics.ticketsSaved} tickets/mo
                </span>
                <span className="text-xs text-gray-400">{metrics.realtimeTicketReduction}% reduction</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">REVENUE</span>
                <span className="text-xs text-gray-400">Realtime Presence</span>
              </div>
              <h3 className="font-semibold mb-2">&quot;{formatNumber(metrics.activeUsersNow)} Users Creating Now&quot;</h3>
              <p className="text-sm text-gray-600 mb-3">
                Show live user count creating images. At your traffic levels, this social proof
                could boost landing page conversion significantly.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-600">
                  +{metrics.conversionBoost}% conversion
                </span>
                <span className="text-xs text-gray-400">+{formatNumber(Math.round(users * 0.1 * metrics.conversionBoost / 100))} signups/mo</span>
              </div>
            </div>
          </div>
        </section>

        {/* Enterprise Readiness */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 font-bold">3</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Enterprise Readiness (6-12 Months)</h2>
              <p className="text-sm text-gray-500">
                At {formatNumber(metrics.projectedUsers6Mo)}+ users, enterprise clients come knocking
              </p>
            </div>
          </div>

          {metrics.needsUpgrade && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 text-amber-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="font-medium">With {formatNumber(users)} users on {currentTier} tier, you&apos;re likely hitting limits. Time to talk upgrade.</span>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4 text-gray-300 text-sm uppercase tracking-wide">
                  Unlock Enterprise Sales
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${teamSize >= 5 ? 'bg-green-500/20' : 'bg-white/10'}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        SSO / SAML Authentication
                        {teamSize >= 5 && <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded">HIGH PRIORITY</span>}
                      </div>
                      <div className="text-sm text-gray-400">
                        With {teamSize} team members, SSO becomes critical. Unlocks {formatCurrency(metrics.ssoUnlockDealSize)}+ enterprise deals.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${teamSize >= 10 ? 'bg-green-500/20' : 'bg-white/10'}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        Audit Logs
                        {teamSize >= 10 && <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded">REQUIRED</span>}
                      </div>
                      <div className="text-sm text-gray-400">
                        {teamSize >= 10 ? `At ${teamSize} team members, compliance teams will require this. ` : ''}
                        Required for SOC 2, HIPAA. Who did what, when.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Row Level Security</div>
                      <div className="text-sm text-gray-400">
                        One database, ~{metrics.enterpriseClientsCapacity} enterprise clients. Each sees only their data.
                        No separate infrastructure per client.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4 text-gray-300 text-sm uppercase tracking-wide">
                  Handle Scale
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${metrics.readReplicaRecommended ? 'bg-amber-500/20' : 'bg-white/10'}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        Read Replicas
                        {metrics.readReplicaRecommended && <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">RECOMMENDED</span>}
                      </div>
                      <div className="text-sm text-gray-400">
                        At {formatNumber(metrics.projectedUsers6Mo)} projected users, {metrics.readReplicaRecommended ? 'you will need this' : 'good to plan for'}.
                        Distribute read load across regions.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${metrics.connectionPoolingCritical ? 'bg-red-500/20' : 'bg-white/10'}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        Connection Pooling
                        {metrics.connectionPoolingCritical && <span className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded">CRITICAL</span>}
                      </div>
                      <div className="text-sm text-gray-400">
                        ~{metrics.concurrentConnections} concurrent connections estimated.
                        {metrics.connectionPoolingCritical ? ' You need pooling now.' : ' Plan for 10x during viral moments.'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Metrics API</div>
                      <div className="text-sm text-gray-400">
                        SLA reporting for your {metrics.enterpriseClientsCapacity} potential enterprise clients.
                        Stream to Datadog/Grafana.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-400">Projected 12-month users</div>
                  <div className="text-2xl font-bold">{formatNumber(metrics.projectedUsers12Mo)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Enterprise client capacity</div>
                  <div className="text-2xl font-bold">{metrics.enterpriseClientsCapacity}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Min deal size unlocked</div>
                  <div className="text-2xl font-bold">{formatCurrency(metrics.ssoUnlockDealSize)}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Play */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-purple-600 font-bold">4</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold">The Platform Play (If You Want to Go Big)</h2>
              <p className="text-sm text-gray-500">Become the &quot;Canva for X&quot; — let others build on you</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-xl p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Supabase for Platforms</h3>
                <p className="text-sm text-gray-600 mb-4">
                  White-label Supabase for your customers. At {formatNumber(metrics.projectedUsers12Mo)} users,
                  you could support ~{metrics.potentialWorkspaces} workspaces.
                </p>
                <div className="bg-white rounded-lg p-3 mb-3">
                  <div className="text-sm text-gray-500">Platform revenue potential</div>
                  <div className="text-2xl font-bold text-purple-600">{formatCurrency(metrics.platformRevenuePotential)}/mo</div>
                  <div className="text-xs text-gray-400">{metrics.potentialWorkspaces} workspaces × {formatCurrency(metrics.platformRevenuePerWorkspace)}/workspace</div>
                </div>
                <div className="text-sm text-gray-600">
                  Your margins on top of Supabase infrastructure.
                  {currentTier === "team" && " At Team tier, you're already positioned for this."}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Analytics Buckets + ETL</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Store all generation data in Analytics Buckets (Apache Iceberg).
                  At {formatNumber(imagesPerDay)} images/day, that&apos;s {formatNumber(metrics.dataPointsForML)} data points/year for ML.
                </p>
                <div className="bg-white rounded-lg p-3 mb-3">
                  <div className="text-sm text-gray-500">Annual training data</div>
                  <div className="text-2xl font-bold text-purple-600">{formatNumber(metrics.dataPointsForML)}</div>
                  <div className="text-xs text-gray-400">images with metadata for model improvement</div>
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Competitive moat:</strong> Better data = better AI = better product.
                  {metrics.dataPointsForML > 10000000 && " You're building a serious data advantage."}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="font-semibold mb-1">This is how I sell.</h3>
              <p className="text-sm text-gray-600">
                Not slides. Not generic demos. A growth map built for YOUR business.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium no-underline transition-colors"
              >
                See Lead Scoring Tool
              </Link>
              <Link
                href="/resume"
                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium no-underline transition-colors"
              >
                View My Resume
              </Link>
            </div>
          </div>
        </section>

        {/* Meta note */}
        <footer className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Built by <strong>Brent Bartosch</strong> to demonstrate consultative, builder-led enterprise sales.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            This scenario is templatizable — swap &quot;images&quot; for &quot;events&quot; (Shotgun), &quot;documents&quot; (Humata),
            or any vertical. The framework scales.
          </p>
        </footer>
      </div>
    </main>
  );
}
