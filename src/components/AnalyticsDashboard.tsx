import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Clock,
  TrendingUp,
  FileText,
  ShieldCheck,
  Globe,
  Terminal,
  RefreshCw,
  Search,
  Eye,
  Activity
} from 'lucide-react';
import { Article, WordPressSite, AuditLogEntry } from '../types';

interface AnalyticsDashboardProps {
  articles: Article[];
  sites: WordPressSite[];
  auditLogs: AuditLogEntry[];
  onRefreshLogs: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  articles,
  sites,
  auditLogs,
  onRefreshLogs
}) => {
  const [selectedAuditLog, setSelectedAuditLog] = useState<AuditLogEntry | null>(null);

  // Compute key analytics
  const totalArticles = articles.length;
  const publishedCount = articles.filter(a => a.publishStatus === 'published').length;
  const scheduledCount = articles.filter(a => a.publishStatus === 'scheduled').length;
  const draftCount = articles.filter(a => a.publishStatus === 'draft').length;

  const avgSeoScore = totalArticles > 0
    ? Math.round(articles.reduce((acc, a) => acc + (a.seoAudit?.overallScore || 0), 0) / totalArticles)
    : 0;

  const avgWordCount = totalArticles > 0
    ? Math.round(articles.reduce((acc, a) => acc + (a.wordCount || 0), 0) / totalArticles)
    : 0;

  // Search intent breakdown
  const intentCounts: Record<string, number> = {
    Informational: 0,
    Commercial: 0,
    Transactional: 0,
    Navigational: 0
  };
  articles.forEach(a => {
    if (a.searchIntent && intentCounts[a.searchIntent] !== undefined) {
      intentCounts[a.searchIntent]++;
    } else {
      intentCounts.Informational++;
    }
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Intelligence
            </span>
            <span className="text-xs text-stone-500">
              Content Performance & System Integrity
            </span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mt-1">
            Analytics & WordPress Audit Logs
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time tracking of published SEO articles, intent distribution, and transparent WordPress REST API transaction logs.
          </p>
        </div>

        <button
          onClick={onRefreshLogs}
          className="flex items-center space-x-1.5 px-3 py-1.5 border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-50"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Audit Logs</span>
        </button>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              VERIFIED PUBLISHED
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-stone-900">
            {publishedCount}
          </div>
          <p className="text-[11px] text-stone-500">
            100% verified with WP REST signatures
          </p>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              SCHEDULED QUEUE
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-stone-900">
            {scheduledCount}
          </div>
          <p className="text-[11px] text-stone-500">
            Future cadence queued on WordPress
          </p>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              AVG SEO HEALTH
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-stone-900">
            {avgSeoScore}/100
          </div>
          <p className="text-[11px] text-stone-500">
            8-point SEO quality checklist avg
          </p>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              AVG ARTICLE DEPTH
            </span>
            <FileText className="w-4 h-4 text-stone-700" />
          </div>
          <div className="text-3xl font-extrabold text-stone-900">
            {avgWordCount} <span className="text-sm font-normal text-stone-500">words</span>
          </div>
          <p className="text-[11px] text-stone-500">
            Comprehensive topical authority
          </p>
        </div>
      </div>

      {/* Charts & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Search Intent Distribution */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="text-sm font-bold text-stone-900">
              Search Intent Distribution
            </h3>
            <span className="text-[11px] text-stone-500">Campaign Balance</span>
          </div>

          <p className="text-xs text-stone-600">
            A balanced search funnel captures both broad research intent and high-intent commercial buyers.
          </p>

          <div className="space-y-3 pt-2 text-xs">
            {Object.entries(intentCounts).map(([intent, count]) => {
              const pct = totalArticles > 0 ? Math.round((count / totalArticles) * 100) : 0;
              return (
                <div key={intent} className="space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-stone-800">{intent}</span>
                    <span className="text-stone-500">{count} posts ({pct}%)</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        intent === 'Informational' ? 'bg-blue-600' :
                        intent === 'Commercial' ? 'bg-amber-600' :
                        intent === 'Transactional' ? 'bg-emerald-600' : 'bg-purple-600'
                      }`}
                      style={{ width: `${Math.max(pct, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Quality Verification Indicators */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="text-sm font-bold text-stone-900">
              Content Quality & EEAT Safeguards
            </h3>
            <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
              Active
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-start space-x-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-stone-900">Zero AI Filler Guarantee</div>
                <p className="text-stone-600 mt-0.5">Strictly excludes generic intros (&apos;in today&apos;s digital era&apos;) and repetitive summaries.</p>
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-start space-x-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-stone-900">Keyword Density Sentinel</div>
                <p className="text-stone-600 mt-0.5">Monitors saturation to enforce 0.8% - 2.2% threshold and prevent algorithmic penalties.</p>
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-start space-x-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-stone-900">Strict HTTP Validation</div>
                <p className="text-stone-600 mt-0.5">Never flags an article as published unless the WordPress API confirms with 201 Created and valid post ID.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Target Site Publishing Breakdown */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="text-sm font-bold text-stone-900">
              Connected Sites Volume
            </h3>
            <span className="text-[11px] text-stone-500">{sites.length} total</span>
          </div>

          <div className="space-y-3 text-xs">
            {sites.map((site) => {
              const siteArticles = articles.filter(a => a.siteId === site.id);
              const pubCount = siteArticles.filter(a => a.publishStatus === 'published').length;

              return (
                <div key={site.id} className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">{site.name}</span>
                    <span className="text-stone-500 font-mono text-[11px]">{pubCount} live</span>
                  </div>
                  <div className="text-stone-500 font-mono text-[10px] truncate">{site.url}</div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Strict WordPress REST API Audit Log */}
      <div className="bg-white border border-stone-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-stone-900" />
            <h3 className="text-sm font-bold text-stone-900">
              WordPress REST API Audit Log (Zero Silent Failures)
            </h3>
          </div>
          <span className="text-xs text-stone-500">
            {auditLogs.length} transactions logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-[11px] uppercase tracking-wider text-stone-500">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Site / Target</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">HTTP Status</th>
                <th className="px-4 py-3">Latency</th>
                <th className="px-4 py-3">Article / Details</th>
                <th className="px-4 py-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
              {auditLogs.map((log) => {
                const isSuccess = log.httpStatus === 200 || log.httpStatus === 201;

                return (
                  <tr key={log.id} className="hover:bg-stone-50/70">
                    <td className="px-4 py-3 text-stone-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>

                    <td className="px-4 py-3 font-sans font-medium text-stone-900 max-w-[140px] truncate">
                      {log.siteName}
                    </td>

                    <td className="px-4 py-3 text-stone-700">
                      <span className="px-2 py-0.5 rounded bg-stone-100 uppercase text-[10px] font-bold">
                        {log.action.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        isSuccess ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {log.httpStatus} {log.statusText}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-stone-500">
                      {log.latencyMs}ms
                    </td>

                    <td className="px-4 py-3 font-sans text-stone-800 max-w-xs truncate">
                      {log.articleTitle}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedAuditLog(log)}
                        className="px-2 py-1 rounded border border-stone-300 text-stone-700 hover:bg-stone-100 font-sans text-xs"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Log Modal */}
      {selectedAuditLog && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-stone-900" />
                <h3 className="font-bold text-stone-900 text-sm">
                  REST API Transaction Inspector
                </h3>
              </div>
              <button
                onClick={() => setSelectedAuditLog(null)}
                className="text-stone-400 hover:text-stone-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-stone-600">
                <div><span className="font-bold">Transaction ID:</span> {selectedAuditLog.id}</div>
                <div><span className="font-bold">Timestamp:</span> {selectedAuditLog.timestamp}</div>
                <div><span className="font-bold">Target URL:</span> <code className="text-stone-800">{selectedAuditLog.requestUrl}</code></div>
                <div><span className="font-bold">Roundtrip Latency:</span> {selectedAuditLog.latencyMs}ms</div>
                <div><span className="font-bold">HTTP Code:</span> {selectedAuditLog.httpStatus} {selectedAuditLog.statusText}</div>
                <div><span className="font-bold">Verification:</span> {selectedAuditLog.success ? 'Verified Authentic' : 'Failed'}</div>
              </div>

              <div>
                <span className="font-bold text-stone-800 block mb-1">Server Response Payload Excerpt:</span>
                <pre className="p-3 bg-stone-900 text-emerald-400 rounded-lg font-mono text-[11px] overflow-x-auto max-h-56 leading-relaxed">
                  {selectedAuditLog.responsePayloadExcerpt}
                </pre>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedAuditLog(null)}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg font-semibold hover:bg-stone-800"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
