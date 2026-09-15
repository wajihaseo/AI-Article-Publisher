import React from 'react';
import { 
  Sparkles, 
  FileText, 
  Layers, 
  Calendar, 
  Globe, 
  BarChart3, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Key,
  PenTool
} from 'lucide-react';
import { WordPressSite, ApiKeysConfig } from '../types';

export type AppNavTab = 'writer' | 'workflow' | 'batch' | 'calendar' | 'websites' | 'analytics';

interface NavbarProps {
  currentTab: AppNavTab;
  setCurrentTab: (tab: AppNavTab) => void;
  sites: WordPressSite[];
  selectedSiteId: string;
  setSelectedSiteId: (id: string) => void;
  onNewArticle: () => void;
  onOpenApiAdmin: () => void;
  apiKeys: ApiKeysConfig;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  sites,
  selectedSiteId,
  setSelectedSiteId,
  onNewArticle,
  onOpenApiAdmin,
  apiKeys
}) => {
  const selectedSite = sites.find(s => s.id === selectedSiteId) || sites[0];
  const connectedCount = sites.filter(s => s.status === 'connected').length;

  // Count active API keys configured by user
  const configuredKeysCount = Object.values(apiKeys).filter((k): k is string => typeof k === 'string' && k.trim().length > 0).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Product Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('writer')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-stone-900 to-stone-700 flex items-center justify-center text-white shadow-sm ring-1 ring-black/5">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-stone-900 text-lg tracking-tight">
                  AI Article Publisher
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                  Multi-AI
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">
                Keyword → Full Article + Title + Watermarked Image
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => setCurrentTab('writer')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'writer'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <PenTool className="w-4 h-4" />
              <span>Article Writer</span>
            </button>

            <button
              onClick={() => setCurrentTab('workflow')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'workflow'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>7-Step SEO Studio</span>
            </button>

            <button
              onClick={() => setCurrentTab('batch')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'batch'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Batch Campaign</span>
            </button>

            <button
              onClick={() => setCurrentTab('calendar')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'calendar'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule</span>
            </button>

            <button
              onClick={() => setCurrentTab('websites')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'websites'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Websites</span>
              {connectedCount > 0 && (
                <span className={`text-xs px-1.5 py-0.2 rounded-full font-semibold ${
                  currentTab === 'websites' ? 'bg-stone-700 text-stone-200' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {connectedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentTab('analytics')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'analytics'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </button>
          </nav>

          {/* Right Area: Admin API Control & Active Site */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Admin API Keys Control Button */}
            <button
              onClick={onOpenApiAdmin}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-stone-300 hover:border-stone-400 bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-stone-800 transition-colors shadow-2xs cursor-pointer"
              title="Manage API Keys for Gemini, ChatGPT, Claude, DeepSeek, and Perplexity"
            >
              <Key className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Admin APIs</span>
              <span className="px-1.5 py-0.2 rounded-full bg-stone-200 text-stone-700 text-[10px] font-mono">
                {configuredKeysCount > 0 ? `${configuredKeysCount} Key${configuredKeysCount > 1 ? 's' : ''}` : 'Default'}
              </span>
            </button>

            {/* Site selector */}
            <div className="hidden md:flex items-center text-xs bg-stone-50 border border-stone-200 rounded-lg p-1.5 px-2.5">
              <span className="text-stone-500 mr-2 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" /> Site:
              </span>
              <select
                value={selectedSiteId}
                onChange={(e) => setSelectedSiteId(e.target.value)}
                className="bg-transparent font-medium text-stone-800 focus:outline-none cursor-pointer text-xs"
              >
                {sites.map(site => (
                  <option key={site.id} value={site.id}>
                    {site.name} {site.status === 'connected' ? '✓' : '(unverified)'}
                  </option>
                ))}
              </select>
              {selectedSite?.status === 'connected' ? (
                <span className="ml-2 flex items-center text-emerald-600 text-[11px] font-medium" title="REST API Handshake Verified">
                  <CheckCircle2 className="w-3 h-3 mr-0.5" /> Ready
                </span>
              ) : (
                <span className="ml-2 flex items-center text-amber-600 text-[11px] font-medium" title="Click Websites tab to test handshake">
                  <AlertCircle className="w-3 h-3 mr-0.5" /> Unchecked
                </span>
              )}
            </div>

            {/* Quick New Article Button */}
            <button
              onClick={onNewArticle}
              className="flex items-center space-x-1.5 bg-stone-900 hover:bg-stone-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Article</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden items-center justify-between overflow-x-auto py-2 border-t border-stone-100 text-xs space-x-2">
          <button
            onClick={() => setCurrentTab('writer')}
            className={`px-2.5 py-1 rounded whitespace-nowrap font-medium ${
              currentTab === 'writer' ? 'bg-stone-900 text-white' : 'text-stone-600'
            }`}
          >
            Article Writer
          </button>
          <button
            onClick={() => setCurrentTab('workflow')}
            className={`px-2.5 py-1 rounded whitespace-nowrap font-medium ${
              currentTab === 'workflow' ? 'bg-stone-900 text-white' : 'text-stone-600'
            }`}
          >
            SEO Studio
          </button>
          <button
            onClick={() => setCurrentTab('batch')}
            className={`px-2.5 py-1 rounded whitespace-nowrap font-medium ${
              currentTab === 'batch' ? 'bg-stone-900 text-white' : 'text-stone-600'
            }`}
          >
            Batch
          </button>
          <button
            onClick={() => setCurrentTab('calendar')}
            className={`px-2.5 py-1 rounded whitespace-nowrap font-medium ${
              currentTab === 'calendar' ? 'bg-stone-900 text-white' : 'text-stone-600'
            }`}
          >
            Schedule
          </button>
          <button
            onClick={() => setCurrentTab('websites')}
            className={`px-2.5 py-1 rounded whitespace-nowrap font-medium ${
              currentTab === 'websites' ? 'bg-stone-900 text-white' : 'text-stone-600'
            }`}
          >
            Sites ({connectedCount})
          </button>
          <button
            onClick={() => setCurrentTab('analytics')}
            className={`px-2.5 py-1 rounded whitespace-nowrap font-medium ${
              currentTab === 'analytics' ? 'bg-stone-900 text-white' : 'text-stone-600'
            }`}
          >
            Analytics
          </button>
        </div>

      </div>
    </header>
  );
};
