import React, { useState, useRef, useEffect } from 'react';
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
  Type
} from 'lucide-react';
import { ApiKeysConfig, WatermarkConfig } from '../types';

interface FeaturedImageStudioProps {
  title: string;
  keyword: string;
  imageUrl?: string;
  onImageUpdated: (newImageUrl: string) => void;
  apiKeys: ApiKeysConfig;
}

export const FeaturedImageStudio: React.FC<FeaturedImageStudioProps> = ({
  title,
  keyword,
  imageUrl,
  onImageUpdated,
  apiKeys
}) => {
  const [currentBaseImage, setCurrentBaseImage] = useState<string>(imageUrl || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProvider, setGenerationProvider] = useState<'auto' | 'openai' | 'gemini'>('auto');

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

  const [watermarkedDataUrl, setWatermarkedDataUrl] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync if prop changes
  useEffect(() => {
    if (imageUrl && imageUrl !== currentBaseImage) {
      setCurrentBaseImage(imageUrl);
    }
  }, [imageUrl]);

  // If no initial image, generate one automatically based on Title & Keyword
  useEffect(() => {
    if (!currentBaseImage && title && keyword) {
      handleGenerateImage();
    }
  }, []);

  // Redraw canvas whenever base image or watermark config changes
  useEffect(() => {
    renderCanvas();
  }, [currentBaseImage, watermark]);

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          keyword,
          provider: generationProvider,
          apiKey: apiKeys.openai || apiKeys.gemini || '',
          brandText: watermark.brandText
        })
      });

      const data = await res.json();
      if (res.ok && data.imageUrl) {
        setCurrentBaseImage(data.imageUrl);
        onImageUpdated(data.imageUrl);
      }
    } catch (e) {
      console.warn('Image generation error:', e);
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
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1200;
    const height = 630;
    canvas.width = width;
    canvas.height = height;

    if (!currentBaseImage) {
      // Placeholder backdrop
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No image selected', width / 2, height / 2);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = currentBaseImage;

    img.onload = () => {
      // Draw base image covering the canvas
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      // If watermark is enabled, draw watermark
      if (watermark.enabled && (watermark.brandText || watermark.logoUrl)) {
        drawWatermark(ctx, width, height);
      }

      try {
        const finalUrl = canvas.toDataURL('image/png');
        setWatermarkedDataUrl(finalUrl);
        onImageUpdated(finalUrl);
      } catch (e) {
        // Cross-origin tainted canvas fallback
        setWatermarkedDataUrl(currentBaseImage);
      }
    };

    img.onerror = () => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(title.slice(0, 45), width / 2, height / 2);
      if (watermark.enabled) {
        drawWatermark(ctx, width, height);
      }
      setWatermarkedDataUrl(canvas.toDataURL('image/png'));
    };
  };

  const drawWatermark = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save();
    ctx.globalAlpha = watermark.opacity;

    const padding = 36;
    let x = width - padding;
    let y = height - padding;

    const text = watermark.brandText.trim();
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
      ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
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
    link.href = watermarkedDataUrl || currentBaseImage;
    link.click();
  };

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
              Tailored to title &amp; keyword with optional brand logo &amp; copyright watermark.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={generationProvider}
            onChange={(e) => setGenerationProvider(e.target.value as any)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-stone-300 font-medium focus:outline-none focus:border-stone-900"
          >
            <option value="auto">Auto Vector (Instant 1200x630)</option>
            {apiKeys.openai && <option value="openai">OpenAI DALL-E 3</option>}
          </select>

          <button
            onClick={handleGenerateImage}
            disabled={isGenerating}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin text-amber-300' : ''}`} />
            <span>{isGenerating ? 'Generating...' : 'Regenerate'}</span>
          </button>
        </div>
      </div>

      {/* Hidden processing Canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Live Preview Display (16:9 aspect) */}
      <div className="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-900 aspect-[1200/630] shadow-inner group">
        {watermarkedDataUrl ? (
          <img
            src={watermarkedDataUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 text-xs">
            <ImageIcon className="w-8 h-8 text-stone-600 mb-2" />
            <span>Generating featured image...</span>
          </div>
        )}

        {/* Quick action overlay */}
        <div className="absolute top-3 right-3 flex items-center space-x-2 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleDownloadImage}
            className="flex items-center space-x-1 px-3 py-1.5 bg-black/75 hover:bg-black text-white text-xs font-medium rounded-lg backdrop-blur-xs border border-white/20 shadow-md"
            title="Download PNG image"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PNG</span>
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
            Protects against scraping &amp; strengthens brand recognition
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
                className="w-full accent-stone-900"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
