import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ArticleGenerator } from './components/ArticleGenerator';
import { BatchProcessing } from './components/BatchProcessing';
import { ScheduleCalendar } from './components/ScheduleCalendar';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { WebsitesManager } from './components/WebsitesManager';
import { INITIAL_SITES, INITIAL_ARTICLES, INITIAL_AUDIT_LOGS } from './mockData';
import { WordPressSite, Article, AuditLogEntry, NavigationTab } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('workflow');
  const [sites, setSites] = useState<WordPressSite[]>(INITIAL_SITES);
  const [selectedSiteId, setSelectedSiteId] = useState<string>(INITIAL_SITES[0]?.id || '');
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  // Fetch initial audit logs from server if available
  const fetchAuditLogs = async () => {
    try {
      const res = await fetch('/api/wordpress/logs');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setAuditLogs(data);
        }
      }
    } catch (e) {
      console.warn('Could not fetch server audit logs, using local cache');
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const selectedSite = sites.find(s => s.id === selectedSiteId) || sites[0];

  const handleArticlePublished = (newOrUpdatedArticle: Article) => {
    setArticles(prev => {
      const exists = prev.some(a => a.id === newOrUpdatedArticle.id);
      if (exists) {
        return prev.map(a => a.id === newOrUpdatedArticle.id ? newOrUpdatedArticle : a);
      }
      return [newOrUpdatedArticle, ...prev];
    });
    fetchAuditLogs();
  };

  const handleViewArticleInWorkflow = (article: Article) => {
    setEditingArticle(article);
    setActiveTab('workflow');
  };

  const handlePublishImmediatelyFromCalendar = async (article: Article) => {
    const site = sites.find(s => s.id === article.siteId) || selectedSite;
    if (!site) return;

    try {
      const res = await fetch('/api/wordpress/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site,
          article,
          postStatus: 'publish'
        })
      });

      const data = await res.json();
      if (res.ok && data.verified) {
        const updated: Article = {
          ...article,
          publishStatus: 'published',
          wpPostId: data.wpPostId,
          wpPostUrl: data.wpPostUrl,
          wpVerificationProof: data.verificationProof,
          updatedAt: new Date().toISOString()
        };
        handleArticlePublished(updated);
      } else {
        alert(data.error || 'WordPress API rejected immediate publish.');
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to connect to WordPress REST API');
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/60 text-stone-900 font-sans flex flex-col selection:bg-stone-900 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab !== 'workflow') setEditingArticle(null);
          setActiveTab(tab);
        }}
        sites={sites}
        selectedSiteId={selectedSiteId}
        setSelectedSiteId={setSelectedSiteId}
        scheduledCount={articles.filter(a => a.publishStatus === 'scheduled').length}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'workflow' && (
          <ArticleGenerator
            sites={sites}
            selectedSiteId={selectedSiteId}
            onArticlePublished={handleArticlePublished}
            initialArticleData={editingArticle}
          />
        )}

        {activeTab === 'batch' && (
          <BatchProcessing
            sites={sites}
            selectedSiteId={selectedSiteId}
            onViewArticle={handleViewArticleInWorkflow}
            onArticlePublished={handleArticlePublished}
          />
        )}

        {activeTab === 'calendar' && (
          <ScheduleCalendar
            articles={articles}
            sites={sites}
            onViewArticle={handleViewArticleInWorkflow}
            onPublishImmediately={handlePublishImmediatelyFromCalendar}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            articles={articles}
            sites={sites}
            auditLogs={auditLogs}
            onRefreshLogs={fetchAuditLogs}
          />
        )}

        {activeTab === 'websites' && (
          <WebsitesManager
            sites={sites}
            setSites={setSites}
            selectedSiteId={selectedSiteId}
            setSelectedSiteId={setSelectedSiteId}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-4 mt-auto text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-stone-700">AI Article Publisher</span>
            <span>•</span>
            <span>WordPress REST API Integration</span>
            <span>•</span>
            <span className="text-emerald-700 font-medium">Zero Silent Failures Protocol</span>
          </div>
          <div className="text-[11px] text-stone-400">
            Automated SEO Research → Semantic H2/H3 Drafting → Programmatic Audit → Verified Direct Posting
          </div>
        </div>
      </footer>
    </div>
  );
}
