import React, { useState, useEffect } from 'react';
import { ScreenTab, ActiveCreativeState } from '../types';
import { generatePlatformCopy } from '../lib/api';

interface MultiPlatformGeneratorScreenProps {
  onNavigate: (tab: ScreenTab) => void;
  onShowToast: (msg: string) => void;
  onDeductCredits: (amount: number) => void;
  activeCreative?: ActiveCreativeState;
  onUpdateCreative?: (updated: ActiveCreativeState) => void;
}

export const MultiPlatformGeneratorScreen: React.FC<MultiPlatformGeneratorScreenProps> = ({
  onNavigate,
  onShowToast,
  onDeductCredits,
  activeCreative,
  onUpdateCreative,
}) => {
  const [activeNetwork, setActiveNetwork] = useState<'meta' | 'google' | 'linkedin' | 'tiktok'>('meta');
  const [activeVariation, setActiveVariation] = useState<'var-a' | 'var-b' | 'var-c'>('var-a');
  const [previewTab, setPreviewTab] = useState<'meta-feed' | 'ig-story' | 'linkedin' | 'google-serp'>('meta-feed');

  // Copy States
  const currentVar =
    activeCreative?.generatedCopies?.find((v) => v.id === activeVariation) ||
    activeCreative?.generatedCopies?.[0];

  const [primaryText, setPrimaryText] = useState(
    currentVar?.primaryText ||
      'Looking for a breakthrough solution? Discover proven results backed by verified customer satisfaction.'
  );
  const [headline, setHeadline] = useState(
    currentVar?.headline || activeCreative?.productName || 'Experience Verified Quality'
  );
  const [linkDescription, setLinkDescription] = useState(
    currentVar?.linkDescription || activeCreative?.valueProp || 'Special offer available for new customers.'
  );
  const [cta, setCta] = useState(currentVar?.cta || 'Shop Now');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Sync copy when activeVariation or activeCreative changes
  useEffect(() => {
    if (activeCreative?.generatedCopies && activeCreative.generatedCopies.length > 0) {
      const match =
        activeCreative.generatedCopies.find((v) => v.id === activeVariation) ||
        activeCreative.generatedCopies[0];
      if (match) {
        setPrimaryText(match.primaryText);
        setHeadline(match.headline);
        setLinkDescription(match.linkDescription || '');
        setCta(match.cta || 'Learn More');
      }
    }
  }, [activeVariation, activeCreative]);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    const prod = activeCreative?.productName || activeCreative?.detectedProduct || 'Featured Product';
    onShowToast(`Generating ad copy for ${prod} on ${activeNetwork}...`);

    try {
      const res = await generatePlatformCopy({
        imageBase64: activeCreative?.imageUrl?.startsWith('data:') ? activeCreative.imageUrl : undefined,
        productName: prod,
        valueProp: activeCreative?.valueProp || activeCreative?.ocrText || 'Premium quality and verified results',
        tone: 'Direct & Punchy',
        icp: activeCreative?.targetAudience || 'Target Audience',
        cta,
        platform: activeNetwork,
        angle: activeVariation === 'var-b' ? 'Curiosity / Contrarian' : activeVariation === 'var-c' ? 'Social Proof & Metrics' : 'Problem-Agitate-Solve (PAS)',
        creativeFileName: activeCreative?.fileName,
        creativeContext: activeCreative?.visualAnalysis,
        ocrText: activeCreative?.ocrText,
        detectedElements: activeCreative?.detectedElements,
      });

      if (res.variations && res.variations.length > 0) {
        const updatedVar = res.variations[0];
        setPrimaryText(updatedVar.primaryText);
        setHeadline(updatedVar.headline);
        if (updatedVar.linkDescription) setLinkDescription(updatedVar.linkDescription);

        onDeductCredits(50);
        onShowToast(`Refreshed ${activeNetwork.toUpperCase()} copy for "${prod}"`);

        if (onUpdateCreative && activeCreative) {
          onUpdateCreative({
            ...activeCreative,
            generatedCopies: res.variations,
            selectedVariationId: updatedVar.id,
          });
        }
      }
    } catch {
      onShowToast(`Refreshed ad copy`);
    } finally {
      setIsRegenerating(false);
    }
  };

  const copyToClipboard = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    onShowToast(`Copied ${label}`);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleShorten = () => {
    const sentences = primaryText.split('. ');
    if (sentences.length > 1) {
      setPrimaryText(sentences[0] + '. ' + (sentences[1] ? sentences[1] : ''));
      onShowToast('Trimmed body copy for mobile');
    }
  };

  const effectiveBrand =
    activeCreative?.detectedBrand || activeCreative?.productName || 'Featured Brand';
  const effectiveImage =
    activeCreative?.imageUrl ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCU-Z0dEBn_XKZGfgdNlNhILl6ByiCsafVqAOfRSUc6E5ArAYmD_6Ha7G9G2LnYi2WcIvl4afiJACCRjNOIso6U5U3F4MLS-qu-sarJhzC-SS71M4lD0DmX_zmz0UShC3zRdb8OY1PvOMk9ewXfJn2QHDVXTCd1qrC2aKlP2sS0zsF5u_qBy-1Dvga6D8J7kUdkx8LFHkSGY_8iKXCqSjmPEWymVSMCbx9oOQWbudJJoY3YSkuhvXlM';

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">
            Multi-Platform Generator
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Format, refine, and simulate ad copy for "{activeCreative?.productName || activeCreative?.fileName}".
          </p>
        </div>

        {/* Network Selection Chips */}
        <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-lg">
          {(['meta', 'google', 'linkedin', 'tiktok'] as const).map((net) => {
            const isSelected = activeNetwork === net;
            return (
              <button
                key={net}
                type="button"
                onClick={() => {
                  setActiveNetwork(net);
                  if (net === 'meta') setPreviewTab('meta-feed');
                  if (net === 'google') setPreviewTab('google-serp');
                  if (net === 'linkedin') setPreviewTab('linkedin');
                  if (net === 'tiktok') setPreviewTab('ig-story');
                }}
                className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition cursor-pointer ${
                  isSelected ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {net === 'meta' ? 'Meta / IG' : net === 'google' ? 'Google Search' : net === 'linkedin' ? 'LinkedIn' : 'TikTok'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Copy Editor & Actions (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-4">
            {/* Variation Tabs */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <span className="text-xs font-medium text-zinc-500">Ad Angle</span>
              <div className="flex items-center gap-1">
                {(['var-a', 'var-b', 'var-c'] as const).map((varId, idx) => (
                  <button
                    key={varId}
                    type="button"
                    onClick={() => setActiveVariation(varId)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                      activeVariation === varId
                        ? 'bg-zinc-900 text-white'
                        : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    Variation {String.fromCharCode(65 + idx)}
                  </button>
                ))}
              </div>
            </div>

            {/* Headline Input */}
            <div>
              <div className="flex items-center justify-between mb-1 text-xs">
                <label className="font-medium text-zinc-700">Headline</label>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-zinc-400">{headline.length} chars</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(headline, 'h', 'Headline')}
                    className="text-zinc-400 hover:text-zinc-900 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {copiedKey === 'h' ? 'done' : 'content_copy'}
                    </span>
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-200 text-zinc-900 text-xs font-semibold focus:outline-none focus:border-zinc-900 transition"
              />
            </div>

            {/* Primary Text Input */}
            <div>
              <div className="flex items-center justify-between mb-1 text-xs">
                <label className="font-medium text-zinc-700">Primary Ad Copy</label>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-zinc-400">{primaryText.length} chars</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(primaryText, 'b', 'Body Copy')}
                    className="text-zinc-400 hover:text-zinc-900 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {copiedKey === 'b' ? 'done' : 'content_copy'}
                    </span>
                  </button>
                </div>
              </div>
              <textarea
                rows={5}
                value={primaryText}
                onChange={(e) => setPrimaryText(e.target.value)}
                className="w-full p-3 rounded-lg bg-white border border-zinc-200 text-zinc-900 text-xs leading-relaxed focus:outline-none focus:border-zinc-900 transition resize-none"
              />
            </div>

            {/* Link Description & CTA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Link Description
                </label>
                <input
                  type="text"
                  value={linkDescription}
                  onChange={(e) => setLinkDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-200 text-zinc-900 text-xs focus:outline-none focus:border-zinc-900 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Call to Action (CTA)
                </label>
                <select
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-200 text-zinc-900 text-xs font-medium focus:outline-none focus:border-zinc-900 transition cursor-pointer"
                >
                  <option>Shop Now</option>
                  <option>Learn More</option>
                  <option>Claim Offer</option>
                  <option>Start Free Trial</option>
                  <option>Book Demo</option>
                  <option>Sign Up</option>
                </select>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleShorten}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium transition cursor-pointer"
                >
                  Shorten Copy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const full = `${headline}\n\n${primaryText}\n\nCTA: ${cta}`;
                    copyToClipboard(full, 'full', 'Full Ad Copy');
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium transition cursor-pointer"
                >
                  Copy Full Ad
                </button>
              </div>

              <button
                type="button"
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                <span className={`material-symbols-outlined text-[15px] ${isRegenerating ? 'animate-spin' : ''}`}>
                  {isRegenerating ? 'progress_activity' : 'refresh'}
                </span>
                <span>Regenerate Angle</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Platform Preview Simulator (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Live Simulator
              </span>

              {/* Preview format toggle */}
              <div className="flex items-center gap-1 bg-zinc-100 p-0.5 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setPreviewTab('meta-feed')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                    previewTab === 'meta-feed' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  Meta Feed
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('ig-story')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                    previewTab === 'ig-story' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  Story / Reel
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('linkedin')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                    previewTab === 'linkedin' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  LinkedIn
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('google-serp')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                    previewTab === 'google-serp' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  Google Search
                </button>
              </div>
            </div>

            {/* Preview Canvas */}
            <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-4 flex items-center justify-center min-h-[460px]">
              {/* META FEED PREVIEW */}
              {previewTab === 'meta-feed' && (
                <div className="w-full max-w-md bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden">
                  <div className="p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-zinc-900 text-white font-bold text-xs flex items-center justify-center">
                        {effectiveBrand.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-zinc-900">{effectiveBrand}</div>
                        <div className="text-[10px] text-zinc-400">Sponsored • Paid Partner</div>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-zinc-400 text-[18px]">more_horiz</span>
                  </div>

                  <div className="px-3.5 pb-2.5 text-xs text-zinc-800 leading-relaxed font-normal">
                    {primaryText}
                  </div>

                  {/* Creative Image */}
                  <div className="aspect-[16/9] w-full bg-zinc-100 overflow-hidden">
                    <img src={effectiveImage} alt={effectiveBrand} className="w-full h-full object-cover" />
                  </div>

                  {/* Link Strip */}
                  <div className="p-3 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[10px] font-mono text-zinc-400 uppercase truncate">
                        {effectiveBrand.toLowerCase().replace(/[^a-z0-9]/g, '')}.com
                      </div>
                      <div className="text-xs font-bold text-zinc-900 truncate">{headline}</div>
                      <div className="text-[11px] text-zinc-500 truncate">{linkDescription}</div>
                    </div>
                    <button
                      type="button"
                      className="px-3.5 py-1.5 rounded-lg bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-semibold text-xs shrink-0 transition"
                    >
                      {cta}
                    </button>
                  </div>
                </div>
              )}

              {/* INSTAGRAM STORY PREVIEW */}
              {previewTab === 'ig-story' && (
                <div className="w-full max-w-[280px] aspect-[9/16] bg-zinc-950 rounded-2xl overflow-hidden relative text-white shadow-md flex flex-col justify-between p-3.5">
                  <img src={effectiveImage} alt="Story asset" className="absolute inset-0 w-full h-full object-cover opacity-85" />
                  <div className="relative z-10 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-white text-zinc-900 font-bold text-xs flex items-center justify-center">
                      {effectiveBrand.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-semibold">{effectiveBrand}</span>
                  </div>

                  <div className="relative z-10 p-3 rounded-xl bg-black/60 backdrop-blur-xs space-y-2">
                    <div className="text-xs font-bold">{headline}</div>
                    <div className="text-[11px] text-zinc-200 line-clamp-3 leading-snug">{primaryText}</div>
                    <div className="w-full py-2 rounded-lg bg-white text-zinc-900 font-bold text-xs text-center">
                      {cta}
                    </div>
                  </div>
                </div>
              )}

              {/* LINKEDIN SPONSORED PREVIEW */}
              {previewTab === 'linkedin' && (
                <div className="w-full max-w-md bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden">
                  <div className="p-3.5 flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded bg-[#0A66C2] text-white font-bold text-xs flex items-center justify-center">
                      in
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-900">{effectiveBrand}</div>
                      <div className="text-[10px] text-zinc-400">Promoted • 12,400+ followers</div>
                    </div>
                  </div>

                  <div className="px-3.5 pb-2.5 text-xs text-zinc-800 leading-relaxed">
                    {primaryText}
                  </div>

                  <div className="aspect-[1.91/1] w-full bg-zinc-100 overflow-hidden">
                    <img src={effectiveImage} alt="LinkedIn preview" className="w-full h-full object-cover" />
                  </div>

                  <div className="p-3 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-zinc-900 truncate">{headline}</div>
                      <div className="text-[10px] text-zinc-500 truncate">{effectiveBrand.toLowerCase().replace(/[^a-z0-9]/g, '')}.com</div>
                    </div>
                    <button
                      type="button"
                      className="px-3 py-1 rounded-full border border-blue-600 text-blue-600 font-semibold text-xs"
                    >
                      {cta}
                    </button>
                  </div>
                </div>
              )}

              {/* GOOGLE SEARCH AD (SERP) PREVIEW */}
              {previewTab === 'google-serp' && (
                <div className="w-full max-w-md bg-white rounded-xl border border-zinc-200 p-4 shadow-xs space-y-1.5 text-left">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                    <span className="font-bold text-zinc-900 text-[11px] px-1 rounded bg-zinc-100 border border-zinc-200">
                      Ad
                    </span>
                    <span className="text-zinc-400">•</span>
                    <span className="text-zinc-600 text-xs">
                      https://www.{effectiveBrand.toLowerCase().replace(/[^a-z0-9]/g, '')}.com
                    </span>
                  </div>

                  <div className="text-base text-blue-800 hover:underline font-medium cursor-pointer leading-tight">
                    {headline} | {effectiveBrand} Official
                  </div>

                  <div className="text-xs text-zinc-600 leading-relaxed">
                    {primaryText} {linkDescription}
                  </div>

                  <div className="pt-2 flex items-center gap-3 text-xs text-blue-700">
                    <span className="hover:underline cursor-pointer">Special Offer</span>
                    <span className="text-zinc-300">•</span>
                    <span className="hover:underline cursor-pointer">Customer Reviews</span>
                    <span className="text-zinc-300">•</span>
                    <span className="hover:underline cursor-pointer">{cta}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiPlatformGeneratorScreen;
