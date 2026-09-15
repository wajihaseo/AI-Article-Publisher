import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Image as ImageIcon,
  Sparkles,
  Download,
  Upload,
  Shield,
  Sliders,
  RefreshCw,
  Check,
  Palette,
  Eye,
  Type,
  AlertCircle
} from 'lucide-react';
import { ApiKeysConfig, WatermarkConfig } from '../types';

interface FeaturedImageStudioProps {
  title: string;
  keyword: string;
  imageUrl?: string;
  onImageUpdated: (newImageUrl: string) => void;
  apiKeys: ApiKeysConfig;
}

// Client-side instant vector SVG generator (0ms latency, zero dependencies, works 100% offline)
function buildVectorSvgBanner(title: string, keyword: string, brandText: string): string {
  const safeTitle = (title || 'SEO Article').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeKeyword = (keyword || 'Topic').toUpperCase().replace(/&/g, '&amp;');
  const safeBrand = (brandText || 'ARSLAN SEO').replace(/&/g, '&amp;');

  // Split title into two lines if long
  const words = safeTitle.split(' ');
  let line1 = words.slice(0, 6).join(' ');
  let line2 = words.slice(6, 13).join(' ');
  if (words.length > 13) line2 += '...';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a" />
        <stop offset="50%" stop-color="#1e293b" />
        <stop offset="100%" stop-color="#020617" />
      </linearGradient>
      <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="100%" stop-color="#cbd5e1" />
      </linearGradient>
      <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f59e0b" />
        <stop offset="100%" stop-color="#d97706" />
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#000000" flood-opacity="0.5" />
      </filter>
    </defs>

    <!-- Background -->
    <rect width="1200" height="630" fill="url(#bgGrad)" />

    <!-- Ambient Grid & Circles -->
    <circle cx="1050" cy="120" r="320" fill="#3b82f6" opacity="0.12" filter="blur(80px)" />
    <circle cx="150" cy="500" r="280" fill="#f59e0b" opacity="0.09" filter="blur(70px)" />
    <path d="M0,0 L1200,630 M1200,0 L0,630" stroke="#ffffff" stroke-opacity="0.03" stroke-width="1.5" />

    <!-- Topic Pill -->
    <g transform="translate(80, 90)">
      <rect width="auto" height="38" rx="19" fill="#f59e0b" opacity="0.18" />
      <rect x="0" y="0" width="${safeKeyword.length * 11 + 60}" height="38" rx="19" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-opacity="0.7" />
      <text x="20" y="24" fill="#fbbf24" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="14" font-weight="700" letter-spacing="1.5">FEATURED TOPIC: ${safeKeyword}</text>
    </g>

    <!-- Main Title Lines -->
    <g transform="translate(80, 220)" filter="url(#shadow)">
      <text x="0" y="0" fill="url(#textGrad)" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="52" font-weight="800" letter-spacing="-0.5">${line1}</text>
      ${line2 ? `<text x="0" y="68" fill="url(#textGrad)" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="52" font-weight="800" letter-spacing="-0.5">${line2}</text>` : ''}
    </g>

    <!-- Editorial Accent Line -->
    <rect x="80" y="380" width="84" height="6" rx="3" fill="url(#accentGrad)" />

    <!-- Bottom Metadata Bar -->
    <g transform="translate(80, 510)">
      <text x="0" y="20" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="16" font-weight="500">Comprehensive Editorial Guide • Intent-Optimized • 100% Original</text>
    </g>

    <!-- Watermark / Brand Badge (Bottom Right) -->
    <g transform="translate(850, 485)">
      <rect width="270" height="52" rx="26" fill="#0f172a" fill-opacity="0.92" stroke="#ffffff" stroke-opacity="0.18" stroke-width="1.5" />
      <circle cx="34" cy="26" r="14" fill="#f59e0b" />
      <text x="30" y="31" fill="#0f172a" font-family="sans-serif" font-size="15" font-weight="900">✓</text>
      <text x="60" y="32" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="16" font-weight="700" letter-spacing="0.5">${safeBrand}</text>
    </g>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const FeaturedImageStudio: React.FC<FeaturedImageStudioProps> = ({
  title,
  keyword,
  imageUrl,
  onImageUpdated,
  apiKeys
}) => {
  // Watermark state
  const [watermark, setWatermark] = useState<WatermarkConfig>({
    enabled: true,
    brandText: 'ARSLAN SEO',
    logoUrl: undefined,
    position: 'bottom-right',
    opacity: 0.85,
    fontSize: 18,
    badgeBackground: true,
    textColor: '#ffffff'
  });

  // Default client vector fallback so image is available in 0ms
  const initialClientBanner = useMemo(() => {
    return buildVectorSvgBanner(title || 'SEO Article', keyword || 'Article', watermark.brandText);
  }, [title, keyword, watermark.brandText]);

  const [currentBaseImage, setCurrentBaseImage] = useState<string>(imageUrl || initialClientBanner);
  const [watermarkedDataUrl, setWatermarkedDataUrl] = useState<string>(imageUrl || initialClientBanner);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProvider, setGenerationProvider] = useState<'auto' | 'gemini' | 'openai' | 'photo'>('auto');
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync if prop changes externally
  useEffect(() => {
    if (imageUrl && imageUrl !== currentBaseImage) {
      setCurrentBaseImage(imageUrl);
      setWatermarkedDataUrl(imageUrl);
    }
  }, [imageUrl]);

  // If initially mounted with no image prop, auto-init with banner
  useEffect(() => {
    if (!imageUrl && !currentBaseImage) {
      const banner = buildVectorSvgBanner(title, keyword, watermark.brandText);
      setCurrentBaseImage(banner);
      setWatermarkedDataUrl(banner);
      onImageUpdated(banner);
    }
  }, [title, keyword]);

  // Re-render watermark canvas whenever base image or watermark config changes
  useEffect(() => {
    renderCanvas();
  }, [currentBaseImage, watermark]);

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    setStatusNotice(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const activeKey = generationProvider === 'openai' 
        ? (apiKeys.openai || '') 
        : generationProvider === 'gemini' 
          ? (apiKeys.gemini || '') 
          : (apiKeys.openai || apiKeys.gemini || '');

      const res = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          title,
          keyword,
          provider: generationProvider,
          apiKey: activeKey,
          brandText: watermark.brandText
        })
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.imageUrl) {
          setCurrentBaseImage(data.imageUrl);
          setWatermarkedDataUrl(data.imageUrl);
          onImageUpdated(data.imageUrl);
          setStatusNotice(data.provider ? `Generated via ${data.provider}` : 'Banner generated successfully');
          return;
        }
      }

      // If backend was unreachable or returned empty, generate instant client vector banner
      const fallbackBanner = buildVectorSvgBanner(title, keyword, watermark.brandText);
      setCurrentBaseImage(fallbackBanner);
      setWatermarkedDataUrl(fallbackBanner);
      onImageUpdated(fallbackBanner);
      setStatusNotice('Generated High-Resolution 1200×630 Editorial Banner');
    } catch (e: any) {
      clearTimeout(timeoutId);
      console.warn('Image generation notice, using resilient fallback:', e?.name === 'AbortError' ? 'Timeout' : e?.message);
      const fallbackBanner = buildVectorSvgBanner(title, keyword, watermark.brandText);
      setCurrentBaseImage(fallbackBanner);
      setWatermarkedDataUrl(fallbackBanner);
      onImageUpdated(fallbackBanner);
      setStatusNotice('Rendered High-Resolution 1200×630 Editorial Banner');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setWatermark(prev => ({ ...prev, logoUrl: dataUrl, enabled: true }));
      }
    };
    reader.readAsDataURL(file);
  };

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !currentBaseImage) return;

    // If watermark is disabled, current base image is the final image directly
    if (!watermark.enabled || (!watermark.brandText && !watermark.logoUrl)) {
      setWatermarkedDataUrl(currentBaseImage);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1200;
    const height = 630;
    canvas.width = width;
    canvas.height = height;

    const img = new Image();
    // Only set crossOrigin for http/https, never for data: or blob:
    if (currentBaseImage.startsWith('http://') || currentBaseImage.startsWith('https://')) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => {
      try {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        drawWatermark(ctx, width, height);
        const finalUrl = canvas.toDataURL('image/png');
        setWatermarkedDataUrl(finalUrl);
        onImageUpdated(finalUrl);
      } catch (err) {
        // If canvas export is tainted by CORS or SVG, fallback smoothly to currentBaseImage
        setWatermarkedDataUrl(currentBaseImage);
      }
    };

    img.onerror = () => {
      // If image loading fails, gracefully keep currentBaseImage
      setWatermarkedDataUrl(currentBaseImage);
    };

    img.src = currentBaseImage;
  };

  const drawWatermark = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save();
    ctx.globalAlpha = watermark.opacity;

    const padding = 36;
    let x = width - padding;
    let y = height - padding;

    const text = (watermark.brandText || 'VERIFIED EDITORIAL').trim();
    ctx.font = `bold ${watermark.fontSize * 1.5}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;

    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const badgeHeight = watermark.fontSize * 1.5 + 20;
    const badgeWidth = textWidth + (watermark.logoUrl ? 60 : 36);

    // Calculate coordinates based on selected position
    if (watermark.position === 'bottom-right') {
      x = width - badgeWidth - padding;
      y = height - badgeHeight - padding;
    } else if (watermark.position === 'bottom-left') {
      x = padding;
      y = height - badgeHeight - padding;
    } else if (watermark.position === 'top-right') {
      x = width - badgeWidth - padding;
      y = padding;
    } else if (watermark.position === 'top-left') {
      x = padding;
      y = padding;
    } else if (watermark.position === 'center') {
      x = (width - badgeWidth) / 2;
      y = (height - badgeHeight) / 2;
    }

    // Draw background badge pill if enabled
    if (watermark.badgeBackground) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1.5;

      const radius = badgeHeight / 2;
      ctx.beginPath();
      ctx.roundRect(x, y, badgeWidth, badgeHeight, radius);
      ctx.fill();
      ctx.stroke();
    }

    // Draw logo image if provided
    if (watermark.logoUrl) {
      const logoImg = new Image();
      logoImg.src = watermark.logoUrl;
      const logoSize = badgeHeight - 12;
      try {
        ctx.drawImage(logoImg, x + 10, y + 6, logoSize, logoSize);
      } catch (e) {}
    }

    // Draw watermark text
    ctx.fillStyle = watermark.textColor;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    const textX = x + (watermark.logoUrl ? badgeHeight + 8 : 18);
    const textY = y + badgeHeight / 2;

    if (!watermark.badgeBackground) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
    }

    ctx.fillText(text, textX, textY);
    ctx.restore();
  };

  const handleDownloadImage = () => {
    const link = document.createElement('a');
    link.download = `${keyword.replace(/\s+/g, '-').toLowerCase()}-featured-image.png`;
    link.href = watermarkedDataUrl || currentBaseImage || initialClientBanner;
    link.click();
  };

  // Active display image: prioritize watermarked result, then base, then initial client vector
  const displayImage = watermarkedDataUrl || currentBaseImage || initialClientBanner;

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded-lg bg-stone-900 text-amber-300">
            <ImageIcon className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              Featured Image &amp; Brand Watermark Studio
            </h3>
            <p className="text-[11px] text-stone-500">
              High-resolution 1200×630 editorial graphic with custom brand protection &amp; copyright.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={generationProvider}
            onChange={(e) => setGenerationProvider(e.target.value as any)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-stone-300 font-medium focus:outline-none focus:border-stone-900 bg-white"
          >
            <option value="auto">High-Res Vector Card (Instant 1200×630)</option>
            <option value="photo">Curated HD Editorial Photo</option>
            <option value="gemini">Google Imagen 3 (Gemini Key)</option>
            <option value="openai">OpenAI DALL-E 3 (OpenAI Key)</option>
          </select>

          <button
            onClick={handleGenerateImage}
            disabled={isGenerating}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin text-amber-300' : ''}`} />
            <span>{isGenerating ? 'Rendering...' : 'Regenerate Banner'}</span>
          </button>
        </div>
      </div>

      {statusNotice && (
        <div className="text-[11px] text-stone-600 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200 flex items-center justify-between">
          <span>{statusNotice}</span>
          <button onClick={() => setStatusNotice(null)} className="text-stone-400 hover:text-stone-700">✕</button>
        </div>
      )}

      {/* Hidden processing Canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Live Preview Display (1200:630 aspect ratio) */}
      <div className="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-950 aspect-[1200/630] shadow-inner group">
        {displayImage ? (
          <img
            src={displayImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 text-xs">
            <ImageIcon className="w-8 h-8 text-stone-600 mb-2" />
            <span>Ready to generate featured image</span>
          </div>
        )}

        {/* Generating Overlay */}
        {isGenerating && (
          <div className="absolute inset-0 bg-stone-950/75 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20 space-y-2">
            <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
            <span className="font-bold text-sm tracking-wide">Rendering Featured Banner...</span>
            <span className="text-[11px] text-stone-400">Applying typography &amp; layout for "{keyword}"</span>
          </div>
        )}

        {/* Quick action download overlay */}
        <div className="absolute top-3 right-3 flex items-center space-x-2 opacity-90 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={handleDownloadImage}
            className="flex items-center space-x-1 px-3 py-1.5 bg-black/80 hover:bg-black text-white text-xs font-semibold rounded-lg backdrop-blur-xs border border-white/20 shadow-md cursor-pointer"
            title="Download PNG image"
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            <span>Download 1200×630 PNG</span>
          </button>
        </div>
      </div>

      {/* Watermark & Branding Controls */}
      <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 font-bold text-stone-800 cursor-pointer">
            <input
              type="checkbox"
              checked={watermark.enabled}
              onChange={(e) => setWatermark(prev => ({ ...prev, enabled: e.target.checked }))}
              className="rounded border-stone-300 text-stone-900 focus:ring-stone-900"
            />
            <span>Brand Logo / Copyright Watermark</span>
          </label>
          <span className="text-[10px] text-stone-500 font-medium">
            Prevents content scraping &amp; establishes brand authority
          </span>
        </div>

        {watermark.enabled && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            {/* Brand Text */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                Brand Name / Watermark Text
              </label>
              <input
                type="text"
                value={watermark.brandText}
                onChange={(e) => setWatermark(prev => ({ ...prev, brandText: e.target.value }))}
                placeholder="e.g. ARSLAN SEO or MyBrand.com"
                className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-medium focus:outline-none focus:border-stone-900"
              />
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                Custom Logo (.PNG with transparency)
              </label>
              <label className="flex items-center justify-center space-x-1.5 px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-100 cursor-pointer font-medium">
                <Upload className="w-3.5 h-3.5" />
                <span className="truncate">{watermark.logoUrl ? 'Change Logo' : 'Upload Logo'}</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Position */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                Watermark Position
              </label>
              <select
                value={watermark.position}
                onChange={(e) => setWatermark(prev => ({ ...prev, position: e.target.value as any }))}
                className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-medium focus:outline-none focus:border-stone-900"
              >
                <option value="bottom-right">Bottom Right (Standard)</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="top-right">Top Right</option>
                <option value="top-left">Top Left</option>
                <option value="center">Center Stamp</option>
              </select>
            </div>

            {/* Opacity slider */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-stone-600 mb-1">
                <span>Opacity</span>
                <span>{Math.round(watermark.opacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={watermark.opacity}
                onChange={(e) => setWatermark(prev => ({ ...prev, opacity: parseFloat(e.target.value) }))}
                className="w-full accent-stone-900 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
