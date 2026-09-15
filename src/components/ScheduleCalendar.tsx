import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Globe,
  Send,
  CheckCircle2,
  ExternalLink,
  Edit2,
  AlertCircle,
  FileText
} from 'lucide-react';
import { Article, WordPressSite } from '../types';

interface ScheduleCalendarProps {
  articles: Article[];
  sites: WordPressSite[];
  onViewArticle: (article: Article) => void;
  onPublishImmediately: (article: Article) => void;
}

export const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
  articles,
  sites,
  onViewArticle,
  onPublishImmediately
}) => {
  const [filterSiteId, setFilterSiteId] = useState<string>('all');

  const scheduledArticles = articles
    .filter(a => a.publishStatus === 'scheduled' || a.scheduledFor)
    .filter(a => filterSiteId === 'all' || a.siteId === filterSiteId)
    .sort((a, b) => new Date(a.scheduledFor || a.createdAt).getTime() - new Date(b.scheduledFor || b.createdAt).getTime());

  const publishedArticles = articles
    .filter(a => a.publishStatus === 'published')
    .filter(a => filterSiteId === 'all' || a.siteId === filterSiteId)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Cadence & Timeline
            </span>
            <span className="text-xs text-stone-500">
              Automated WordPress Content Scheduling
            </span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mt-1">
            Publishing Schedule & Content Queue
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage future posts scheduled through the WordPress REST API cron cadence.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="text-stone-500 font-medium">Filter Site:</span>
          <select
            value={filterSiteId}
            onChange={(e) => setFilterSiteId(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-stone-300 font-medium focus:outline-none focus:border-stone-900"
          >
            <option value="all">All Connected Sites</option>
            {sites.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Upcoming Scheduled Posts */}
      <div className="bg-white border border-stone-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-stone-900">
              Upcoming Scheduled Publications ({scheduledArticles.length})
            </h3>
          </div>
        </div>

        {scheduledArticles.length === 0 ? (
          <div className="p-12 text-center text-stone-400 text-xs space-y-2">
            <CalendarIcon className="w-8 h-8 text-stone-300 mx-auto" />
            <p>No articles currently in the schedule queue.</p>
            <p className="text-[11px] text-stone-400">Generate an article and choose &quot;Schedule for Later&quot; in Step 7 or batch schedule via Batch Campaign.</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {scheduledArticles.map((art) => {
              const site = sites.find(s => s.id === art.siteId);
              const schedDate = art.scheduledFor ? new Date(art.scheduledFor) : new Date();
              const isPast = schedDate.getTime() <= Date.now();

              return (
                <div key={art.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-stone-50/50 transition-colors">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="flex items-center gap-1 font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                        <Clock className="w-3 h-3" />
                        {schedDate.toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {site && (
                        <span className="flex items-center gap-1 text-stone-600 font-medium text-[11px]">
                          <Globe className="w-3 h-3 text-stone-400" />
                          {site.name}
                        </span>
                      )}
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                        SEO: {art.seoAudit.overallScore}/100
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-stone-900 leading-snug">
                      {art.title}
                    </h4>

                    <p className="text-xs text-stone-500 font-mono">
                      Target Keyword: &quot;{art.keyword}&quot; • {art.wordCount} words • Slug: /{art.slug}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => onViewArticle(art)}
                      className="px-3 py-1.5 border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-100"
                    >
                      Edit Article
                    </button>
                    <button
                      onClick={() => onPublishImmediately(art)}
                      className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>Publish Now</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recently Published Log */}
      <div className="bg-white border border-stone-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-stone-900">
              Verified Published Posts ({publishedArticles.length})
            </h3>
          </div>
        </div>

        {publishedArticles.length === 0 ? (
          <div className="p-8 text-center text-stone-400 text-xs">
            No articles published yet.
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {publishedArticles.map((art) => {
              const site = sites.find(s => s.id === art.siteId);

              return (
                <div key={art.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-stone-50/50">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-emerald-700 font-bold">
                        WP #{art.wpPostId || '101'}
                      </span>
                      {site && <span className="text-stone-400">• {site.name}</span>}
                      <span className="text-stone-400">• {new Date(art.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="font-bold text-stone-900 text-sm">{art.title}</div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    {art.wpPostUrl && (
                      <a
                        href={art.wpPostUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-stone-800 hover:text-stone-950 font-semibold underline flex items-center gap-1 text-xs"
                      >
                        <span>View Live</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <button
                      onClick={() => onViewArticle(art)}
                      className="px-3 py-1.5 border border-stone-300 rounded-lg font-medium text-stone-700 hover:bg-stone-50"
                    >
                      Inspect
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
