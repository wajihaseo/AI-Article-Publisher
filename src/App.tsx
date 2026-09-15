import React, { useState, useEffect } from 'react';
import { Navbar, AppNavTab } from './components/Navbar';
import { DirectArticleWriter } from './components/DirectArticleWriter';
import { ArticleGenerator } from './components/ArticleGenerator';
import { BatchProcessing } from './components/BatchProcessing';
import { ScheduleCalendar } from './components/ScheduleCalendar';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { WebsitesManager } from './components/WebsitesManager';
import { AdminApiControl } from './components/AdminApiControl';
import { INITIAL_SITES, INITIAL_ARTICLES, INITIAL_AUDIT_LOGS } from './mockData';
import { WordPressSite, Article, AuditLogEntry, NavigationTab, ApiKeysConfig, AiProvider } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppNavTab>('writer');
  const [sites, setSites] = useState<WordPressSite[]>(INITIAL_SITES);
  const [selectedSiteId, setSelectedSiteId] = useState<string>(INITIAL_SITES[0]?.id || '');
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  // Admin API Keys State & LocalStorage persistence
  const [apiKeys, setApiKeys] = useState<ApiKeysConfig>(() => {
    try {
      const saved = localStorage.getItem('ai_publisher_api_keys');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [defaultProvider, setDefaultProvider] = useState<AiProvider>(() => {
    try {
      const saved = localStorage.getItem('ai_publisher_default_provider');
      return (saved as AiProvider) || 'gemini';
    } catch {
      return 'gemini';
    }
  });

  const [isAdminApiOpen, setIsAdminApiOpen] = useState(false);

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
        currentTab={activeTab}
        setCurrentTab={(tab) => {
          if (tab !== 'workflow') setEditingArticle(null);
          setActiveTab(tab);
        }}
        sites={sites}
        selectedSiteId={selectedSiteId}
        setSelectedSiteId={setSelectedSiteId}
        onNewArticle={() => {
          setEditingArticle(null);
          setActiveTab('writer');
        }}
        onOpenApiAdmin={() => setIsAdminApiOpen(true)}
        apiKeys={apiKeys}
      />

      {/* Admin API Keys Modal */}
      <AdminApiControl
        apiKeys={apiKeys}
        setApiKeys={setApiKeys}
        defaultProvider={defaultProvider}
        setDefaultProvider={setDefaultProvider}
        isOpen={isAdminApiOpen}
        onClose={() => setIsAdminApiOpen(false)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Tab 1: Direct Article Writer (Primary request) */}
        {activeTab === 'writer' && (
          <DirectArticleWriter
            sites={sites}
            selectedSiteId={selectedSiteId}
            apiKeys={apiKeys}
            defaultProvider={defaultProvider}
            onOpenApiAdmin={() => setIsAdminApiOpen(true)}
            onArticlePublished={handleArticlePublished}
          />
        )}

        {/* Tab 2: 7-Step SEO Studio Deep Workflow */}
        {activeTab === 'workflow' && (
          <ArticleGenerator
            sites={sites}
            selectedSiteId={selectedSiteId}
            onArticlePublished={handleArticlePublished}
            initialArticleData={editingArticle}
          />
        )}

        {/* Tab 3: Batch Processing */}
        {activeTab === 'batch' && (
          <BatchProcessing
            sites={sites}
            selectedSiteId={selectedSiteId}
            onViewArticle={handleViewArticleInWorkflow}
            onArticlePublished={handleArticlePublished}
          />
        )}

        {/* Tab 4: Schedule Queue & Calendar */}
        {activeTab === 'calendar' && (
          <ScheduleCalendar
            articles={articles}
            sites={sites}
            onViewArticle={handleViewArticleInWorkflow}
            onPublishImmediately={handlePublishImmediatelyFromCalendar}
          />
        )}

        {/* Tab 5: Analytics & Audit Logs */}
        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            articles={articles}
            sites={sites}
            auditLogs={auditLogs}
            onRefreshLogs={fetchAuditLogs}
          />
        )}

        {/* Tab 6: Connected WordPress Sites Manager */}
        {activeTab === 'websites' && (
          <WebsitesManager
            sites={sites}
            setSites={setSites}
            selectedSiteId={selectedSiteId}
            setSelectedSiteId={setSelectedSiteId}
          />
        )}
      </main>

      {/* Global Footer */}
      <footer className="border-t border-stone-200 bg-white py-4 mt-auto text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-stone-700">AI Article Publisher</span>
            <span>•</span>
            <span className="text-stone-600">Multi-AI Connected (Gemini, ChatGPT, Claude, DeepSeek, Perplexity)</span>
            <span>•</span>
            <span className="text-emerald-700 font-medium">Watermark Studio &amp; Verified WordPress Sync</span>
          </div>
          <div className="text-[11px] text-stone-400">
            Keyword → Intent Research → Comprehensive SEO Article → Branded Asset → Direct Sync
          </div>
        </div>
      </footer>
    </div>
  );
}
