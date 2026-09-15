import React, { useState } from 'react';
import {
  Globe,
  Plus,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Trash2,
  ExternalLink,
  Shield,
  Key,
  Info,
  Server
} from 'lucide-react';
import { WordPressSite } from '../types';

interface WebsitesManagerProps {
  sites: WordPressSite[];
  setSites: React.Dispatch<React.SetStateAction<WordPressSite[]>>;
  selectedSiteId: string;
  setSelectedSiteId: (id: string) => void;
}

export const WebsitesManager: React.FC<WebsitesManagerProps> = ({
  sites,
  setSites,
  selectedSiteId,
  setSelectedSiteId
}) => {
  const [isAddingSite, setIsAddingSite] = useState(false);
  const [testingSiteId, setTestingSiteId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{
    siteId: string;
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  // New site form state
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    username: '',
    appPassword: '',
    isSandbox: false,
    defaultCategory: 'General SEO',
    defaultPostStatus: 'publish' as 'publish' | 'draft'
  });

  const handleTestConnection = async (site: WordPressSite) => {
    setTestingSiteId(site.id);
    setTestResult(null);

    try {
      const res = await fetch('/api/wordpress/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ site })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setTestResult({
          siteId: site.id,
          success: true,
          message: data.message || 'REST API Handshake Verified Successfully (200 OK)',
          details: data.details
        });

        // Update site status in state
        setSites(prev => prev.map(s => s.id === site.id ? {
          ...s,
          status: 'connected',
          lastTestedAt: new Date().toISOString(),
          wpVersion: data.details?.wpVersion || 'Detected',
          userDisplayName: data.details?.userDisplayName || site.username
        } : s));
      } else {
        setTestResult({
          siteId: site.id,
          success: false,
          message: data.error || `HTTP ${res.status}: Verification failed.`,
          details: data.details
        });

        setSites(prev => prev.map(s => s.id === site.id ? {
          ...s,
          status: 'error',
          lastTestedAt: new Date().toISOString()
        } : s));
      }
    } catch (err: any) {
      setTestResult({
        siteId: site.id,
        success: false,
        message: err?.message || 'Network error reaching WordPress API endpoint.'
      });
      setSites(prev => prev.map(s => s.id === site.id ? { ...s, status: 'error' } : s));
    } finally {
      setTestingSiteId(null);
    }
  };

  const handleSaveNewSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.url) return;

    const newSite: WordPressSite = {
      id: 'site-' + Math.random().toString(36).substring(2, 9),
      name: formData.name.trim(),
      url: formData.url.trim(),
      username: formData.username.trim(),
      appPassword: formData.appPassword.trim(),
      isSandbox: formData.isSandbox,
      status: 'untested',
      defaultCategory: formData.defaultCategory,
      defaultPostStatus: formData.defaultPostStatus
    };

    setSites(prev => [...prev, newSite]);
    setIsAddingSite(false);
    setFormData({
      name: '',
      url: '',
      username: '',
      appPassword: '',
      isSandbox: false,
      defaultCategory: 'General SEO',
      defaultPostStatus: 'publish'
    });

    // Auto-test connection for convenience
    handleTestConnection(newSite);
  };

  const handleDeleteSite = (id: string) => {
    if (sites.length <= 1) {
      alert('You must keep at least one WordPress site configured.');
      return;
    }
    setSites(prev => prev.filter(s => s.id !== id));
    if (selectedSiteId === id) {
      const remaining = sites.filter(s => s.id !== id);
      if (remaining[0]) setSelectedSiteId(remaining[0].id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Integrations
            </span>
            <span className="text-xs text-stone-500">
              WordPress REST API Authentication
            </span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mt-1">
            Connected WordPress Sites
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Connect multiple authorized WordPress websites. Every site requires an official WordPress Application Password to guarantee authorized, non-repudiated REST posting.
          </p>
        </div>

        <button
          onClick={() => setIsAddingSite(true)}
          className="flex items-center space-x-2 bg-stone-900 hover:bg-stone-800 text-white px-4 py-2.5 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Connect New Website</span>
        </button>
      </div>

      {/* Add Site Modal / Form */}
      {isAddingSite && (
        <div className="bg-white border-2 border-stone-900 rounded-xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div className="flex items-center space-x-2">
              <Key className="w-4 h-4 text-stone-900" />
              <h3 className="text-sm font-bold text-stone-900">
                Connect Authorized WordPress Website
              </h3>
            </div>
            <button
              onClick={() => setIsAddingSite(false)}
              className="text-stone-400 hover:text-stone-700 text-xs font-semibold"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSaveNewSite} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Site Name (Label)
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. My Tech Review Blog"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  WordPress URL
                </label>
                <input
                  type="text"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com or sandbox://mysite.internal"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  WordPress Username
                </label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="e.g. editorial_admin"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Application Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.appPassword}
                  onChange={(e) => setFormData({ ...formData, appPassword: e.target.value })}
                  placeholder="xxxx xxxx xxxx xxxx"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900 font-mono"
                />
              </div>
            </div>

            {/* Application Password Helper Info */}
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg flex items-start space-x-2 text-[11px] text-stone-600">
              <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
              <span>
                <strong>How to generate an Application Password in WordPress:</strong> In your WordPress WP-Admin, navigate to <strong>Users &gt; Profile</strong>, scroll down to the <strong>Application Passwords</strong> section, enter a name (e.g. &quot;AI Article Publisher&quot;), click &quot;Add New Application Password&quot;, and paste the 24-character token above.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Default Category
                </label>
                <input
                  type="text"
                  value={formData.defaultCategory}
                  onChange={(e) => setFormData({ ...formData, defaultCategory: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Default Post Status
                </label>
                <select
                  value={formData.defaultPostStatus}
                  onChange={(e) => setFormData({ ...formData, defaultPostStatus: e.target.value as 'publish' | 'draft' })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900"
                >
                  <option value="publish">Publish Live</option>
                  <option value="draft">Save as Draft</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsAddingSite(false)}
                className="px-4 py-2 border border-stone-300 rounded-lg font-semibold hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold shadow-xs"
              >
                Save & Run Test Handshake
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sites List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sites.map((site) => {
          const isSelected = site.id === selectedSiteId;
          const isTesting = testingSiteId === site.id;
          const siteTest = testResult?.siteId === site.id ? testResult : null;

          return (
            <div
              key={site.id}
              className={`bg-white border rounded-xl p-5 shadow-xs transition-all space-y-4 ${
                isSelected ? 'border-stone-900 ring-1 ring-stone-900' : 'border-stone-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-stone-900 text-sm">{site.name}</h3>
                    {site.isSandbox && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200 font-bold uppercase">
                        Sandbox
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 font-mono truncate max-w-xs">{site.url}</p>
                </div>

                <div className="flex items-center space-x-1.5">
                  {site.status === 'connected' ? (
                    <span className="flex items-center space-x-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified</span>
                    </span>
                  ) : site.status === 'error' ? (
                    <span className="flex items-center space-x-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Error</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 text-[11px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                      <span>Untested</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-stone-50 p-3 rounded-lg border border-stone-200 text-stone-600">
                <div>
                  <span className="text-stone-400 block">AUTHORIZED USER</span>
                  <span className="font-medium text-stone-900">{site.userDisplayName || site.username}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">WORDPRESS VERSION</span>
                  <span className="font-medium text-stone-900">{site.wpVersion || 'Standard'}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">DEFAULT CATEGORY</span>
                  <span className="font-medium text-stone-900">{site.defaultCategory || 'Uncategorized'}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">POST STATUS</span>
                  <span className="font-medium text-stone-900 capitalize">{site.defaultPostStatus || 'Publish'}</span>
                </div>
              </div>

              {/* Test Connection Output Box */}
              {siteTest && (
                <div className={`p-3 rounded-lg text-xs space-y-1 ${
                  siteTest.success ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
                }`}>
                  <div className="font-semibold flex items-center gap-1">
                    {siteTest.success ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                    <span>{siteTest.message}</span>
                  </div>
                  {siteTest.details?.latencyMs && (
                    <div className="text-[10px] font-mono text-stone-500">
                      Handshake Latency: {siteTest.details.latencyMs}ms • Endpoint: {siteTest.details.endpointVerified}
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <button
                  onClick={() => setSelectedSiteId(site.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    isSelected ? 'bg-stone-900 text-white' : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                  }`}
                >
                  {isSelected ? '✓ Active Default Site' : 'Set as Active'}
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleTestConnection(site)}
                    disabled={isTesting}
                    className="flex items-center space-x-1.5 px-3 py-1.5 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 font-semibold"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                    <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
                  </button>

                  <button
                    onClick={() => handleDeleteSite(site.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded"
                    title="Remove website"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
