import React, { useState } from 'react';
import {
  Key,
  Shield,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  ExternalLink,
  Sparkles,
  Info
} from 'lucide-react';
import { ApiKeysConfig, AiProvider } from '../types';

interface AdminApiControlProps {
  apiKeys: ApiKeysConfig;
  setApiKeys: React.Dispatch<React.SetStateAction<ApiKeysConfig>>;
  defaultProvider: AiProvider;
  setDefaultProvider: (provider: AiProvider) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const AdminApiControl: React.FC<AdminApiControlProps> = ({
  apiKeys,
  setApiKeys,
  defaultProvider,
  setDefaultProvider,
  isOpen,
  onClose
}) => {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [testingProvider, setTestingProvider] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { valid: boolean; message: string }>>({});

  if (!isOpen) return null;

  const toggleVisibility = (provider: string) => {
    setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  const handleKeyChange = (provider: keyof ApiKeysConfig, val: string) => {
    // Strip leading/trailing spaces and newlines commonly introduced during copy/paste
    const cleanVal = val.trim();
    setApiKeys(prev => {
      const updated = { ...prev, [provider]: cleanVal };
      localStorage.setItem('ai_publisher_api_keys', JSON.stringify(updated));
      return updated;
    });
  };

  const testApiKey = async (provider: string, keyVal?: string) => {
    const rawKey = keyVal || apiKeys[provider as keyof ApiKeysConfig];
    const key = rawKey?.trim();
    if (!key) {
      setTestResults(prev => ({
        ...prev,
        [provider]: { valid: false, message: 'Please enter an API key first before testing.' }
      }));
      return;
    }

    setTestingProvider(provider);
    try {
      const res = await fetch('/api/ai/test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, apiKey: key })
      });

      const data = await res.json();
      if (res.ok && data.valid) {
        setTestResults(prev => ({
          ...prev,
          [provider]: { valid: true, message: `Connected: ${data.model || 'Verified & Active'}` }
        }));
      } else {
        setTestResults(prev => ({
          ...prev,
          [provider]: { valid: false, message: data.error || 'Verification failed. Please check key validity.' }
        }));
      }
    } catch (err: any) {
      setTestResults(prev => ({
        ...prev,
        [provider]: { valid: false, message: err?.message || 'Network connection failed.' }
      }));
    } finally {
      setTestingProvider(null);
    }
  };

  const providersList = [
    {
      id: 'gemini',
      name: 'Google Gemini',
      tag: 'Built-in Server Key Available',
      desc: 'Powers fast intent analysis & structured SEO article generation. Gemini 2.5 Flash.',
      link: 'https://aistudio.google.com/app/apikey',
      linkText: 'Get Gemini Key'
    },
    {
      id: 'openai',
      name: 'OpenAI / ChatGPT & DALL-E 3',
      tag: 'GPT-4o & DALL-E 3 Featured Images',
      desc: 'Generates creative narrative depth, high CTR headlines, and photorealistic DALL-E 3 banners.',
      link: 'https://platform.openai.com/api-keys',
      linkText: 'Get OpenAI Key'
    },
    {
      id: 'claude',
      name: 'Anthropic Claude',
      tag: 'Claude 3.5 Sonnet',
      desc: 'Exceptional editorial human cadence, natural tone transitions, and zero fluff articles.',
      link: 'https://console.anthropic.com/settings/keys',
      linkText: 'Get Claude Key'
    },
    {
      id: 'deepseek',
      name: 'DeepSeek',
      tag: 'DeepSeek V3 & R1 Reasoning',
      desc: 'High-density analytical deep dives and cost-effective high-volume batch drafting.',
      link: 'https://platform.deepseek.com/api_keys',
      linkText: 'Get DeepSeek Key'
    },
    {
      id: 'perplexity',
      name: 'Perplexity AI',
      tag: 'Real-time Web Research',
      desc: 'Searches the live internet to extract up-to-the-minute statistics, citations, and SERP facts.',
      link: 'https://www.perplexity.ai/settings/api',
      linkText: 'Get Perplexity Key'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-stone-200 space-y-6 my-8">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-stone-200 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-stone-900 text-amber-300">
                <Key className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-stone-900">
                Admin Control: AI API Providers &amp; Models
              </h2>
            </div>
            <p className="text-xs text-stone-500">
              Manage your personal API keys for Gemini, ChatGPT, Claude, DeepSeek, Perplexity, and Image generation. All keys are stored securely in your private workspace.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 font-bold p-1 text-sm rounded-lg hover:bg-stone-100"
          >
            ✕
          </button>
        </div>

        {/* Default Model Selector */}
        <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Preferred Primary AI Engine
            </label>
            <span className="text-[11px] text-stone-500">
              You can also switch engines anytime per article
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
            {(['gemini', 'openai', 'claude', 'deepseek', 'perplexity'] as AiProvider[]).map((p) => {
              const active = defaultProvider === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setDefaultProvider(p);
                    localStorage.setItem('ai_publisher_default_provider', p);
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold capitalize border transition-all text-center ${
                    active
                      ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                      : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                  }`}
                >
                  {p === 'openai' ? 'ChatGPT' : p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Provider Keys List */}
        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
          {providersList.map((prov) => {
            const currentVal = apiKeys[prov.id as keyof ApiKeysConfig] || '';
            const isVisible = showKeys[prov.id];
            const isTesting = testingProvider === prov.id;
            const testRes = testResults[prov.id];

            return (
              <div
                key={prov.id}
                className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs space-y-3 hover:border-stone-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-stone-900 text-sm">{prov.name}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium">
                        {prov.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">{prov.desc}</p>
                  </div>

                  <a
                    href={prov.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-amber-700 hover:text-amber-800 font-medium flex items-center gap-1 shrink-0"
                  >
                    <span>{prov.linkText}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Input with visibility toggle & test button */}
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <input
                      type={isVisible ? 'text' : 'password'}
                      value={currentVal}
                      onChange={(e) => handleKeyChange(prov.id as keyof ApiKeysConfig, e.target.value)}
                      placeholder={prov.id === 'gemini' ? 'Optional (Server default active)' : `Enter ${prov.name} API key (sk-...)`}
                      className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 pr-9 bg-stone-50/50"
                    />
                    <button
                      type="button"
                      onClick={() => toggleVisibility(prov.id)}
                      className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700"
                    >
                      {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => testApiKey(prov.id)}
                    disabled={isTesting}
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg shrink-0 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    {isTesting ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-stone-600" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    <span>{isTesting ? 'Testing...' : 'Test Key'}</span>
                  </button>
                </div>

                {/* Test Feedback */}
                {testRes && (
                  <div
                    className={`text-xs p-2 rounded-lg flex items-center space-x-2 ${
                      testRes.valid
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {testRes.valid ? (
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    )}
                    <span className="font-medium text-[11px]">{testRes.message}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer info & Save Close */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-stone-200 pt-4 text-xs">
          <div className="flex items-center space-x-1.5 text-stone-500 text-[11px]">
            <Info className="w-3.5 h-3.5 shrink-0 text-stone-400" />
            <span>Keys are securely saved and will automatically power research and writing.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl shadow-xs transition-colors"
          >
            Save &amp; Return to Writer
          </button>
        </div>

      </div>
    </div>
  );
};
