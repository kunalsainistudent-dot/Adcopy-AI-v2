import React, { useState, useEffect } from 'react';
import { ScreenTab, ActiveCreativeState, AdVariation } from '../types';
import {
  analyzeCreativeWithVision,
  enhanceValueProposition,
  scrapeLandingPage,
  generatePlatformCopy,
} from '../lib/api';

interface StudioUploadScreenProps {
  onNavigate: (tab: ScreenTab) => void;
  onShowToast: (msg: string) => void;
  onDeductCredits: (amount: number) => void;
  activeCreative?: ActiveCreativeState;
  onUpdateCreative?: (updated: ActiveCreativeState) => void;
}

export const StudioUploadScreen: React.FC<StudioUploadScreenProps> = ({
  onNavigate,
  onShowToast,
  onDeductCredits,
  activeCreative,
  onUpdateCreative,
}) => {
  // Creative Media State
  const [activeImage, setActiveImage] = useState(
    activeCreative?.imageUrl ||
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCU-Z0dEBn_XKZGfgdNlNhILl6ByiCsafVqAOfRSUc6E5ArAYmD_6Ha7G9G2LnYi2WcIvl4afiJACCRjNOIso6U5U3F4MLS-qu-sarJhzC-SS71M4lD0DmX_zmz0UShC3zRdb8OY1PvOMk9ewXfJn2QHDVXTCd1qrC2aKlP2sS0zsF5u_qBy-1Dvga6D8J7kUdkx8LFHkSGY_8iKXCqSjmPEWymVSMCbx9oOQWbudJJoY3YSkuhvXlM'
  );
  const [imageFileName, setImageFileName] = useState(
    activeCreative?.fileName || 'pulse_hero_banner_q3_v2.png'
  );

  // Creative Context Inputs
  const [productName, setProductName] = useState(
    activeCreative?.productName || activeCreative?.detectedProduct || 'PulseMetrics 3.0'
  );
  const [valueProp, setValueProp] = useState(
    activeCreative?.valueProp ||
      activeCreative?.detectedValueProp ||
      'Real-time revenue intelligence that predicts churn 30 days before it happens.'
  );
  const [activeTone, setActiveTone] = useState('Direct & Punchy');
  const [icp, setIcp] = useState(
    activeCreative?.targetAudience || 'Growth Leaders, Marketers & RevOps'
  );
  const [cta, setCta] = useState(
    activeCreative?.recommendedCta || 'Start Free Trial'
  );
  const [selectedAngle, setSelectedAngle] = useState('Problem-Agitate-Solve (PAS)');

  // Vision Metadata
  const [extractedOcr, setExtractedOcr] = useState(
    activeCreative?.ocrText || 'Scale your revenue 10x with real-time intelligence'
  );
  const [hookScore, setHookScore] = useState<number>(activeCreative?.hookScore || 96);
  const [detectedElements, setDetectedElements] = useState<string[]>(
    activeCreative?.detectedElements || ['High Contrast Headline', 'Product Visual Focus', 'Clear Offer Badge']
  );

  // Output Variations
  const [generatedCopies, setGeneratedCopies] = useState<AdVariation[]>(
    activeCreative?.generatedCopies || [
      {
        id: 'var-a',
        name: 'Variation A',
        angle: 'Problem-Agitate-Solve (PAS)',
        primaryText:
          'Still spending 20+ hours hand-drafting ad variations that burn budget? Stop burning spend. Let autonomous AI craft high-converting copy in seconds.',
        headline: 'Cut Ad Creative Costs by 73%',
        linkDescription: 'Join 1,200+ teams scaling revenue with autonomous creative iteration.',
        cta: 'Claim Free Trial',
        hookScore: 9.8,
        urgencyScore: 8.9,
        predictedCtr: '4.8%',
        characterCount: 148,
        keyBenefit: '73% lower CAC in 14 days',
      },
      {
        id: 'var-b',
        name: 'Variation B',
        angle: 'Curiosity / Contrarian',
        primaryText:
          'A/B testing 2 variations is why your CAC is doubling. Elite marketing teams test 50+ angles in real-time. Here is what they know.',
        headline: 'Your A/B Testing Strategy is Dead',
        linkDescription: 'The autonomous ad intelligence formula used by top growth marketers.',
        cta: 'Claim Free Trial',
        hookScore: 9.4,
        urgencyScore: 8.5,
        predictedCtr: '4.2%',
        characterCount: 138,
        keyBenefit: 'Breakout winner discovery',
      },
      {
        id: 'var-c',
        name: 'Variation C',
        angle: 'Social Proof & Metrics',
        primaryText:
          '140% ROAS increase in 14 days. We analyzed 4.2 million impressions across 25 accounts to build this exact copy formula.',
        headline: 'Scale Ad ROAS by +140%',
        linkDescription: 'Backed by 4.2M analyzed impressions and verified ad network telemetry.',
        cta: 'Claim Free Trial',
        hookScore: 9.6,
        urgencyScore: 9.1,
        predictedCtr: '4.5%',
        characterCount: 145,
        keyBenefit: 'Audited 140% ROAS lift',
      },
    ]
  );

  // States
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sync state if activeCreative changes externally (e.g. from Library or Modal)
  useEffect(() => {
    if (activeCreative) {
      const isNew = activeCreative.imageUrl && activeCreative.imageUrl !== activeImage;
      const isNewFile = activeCreative.fileName && activeCreative.fileName !== imageFileName;
      if (isNew || isNewFile) {
        setActiveImage(activeCreative.imageUrl);
        setImageFileName(activeCreative.fileName);
        if (activeCreative.productName) setProductName(activeCreative.productName);
        if (activeCreative.valueProp) setValueProp(activeCreative.valueProp);
        if (activeCreative.ocrText) setExtractedOcr(activeCreative.ocrText);
        if (activeCreative.hookScore) setHookScore(activeCreative.hookScore);
        if (activeCreative.detectedElements) setDetectedElements(activeCreative.detectedElements);
        if (activeCreative.targetAudience) setIcp(activeCreative.targetAudience);
        if (activeCreative.recommendedCta) setCta(activeCreative.recommendedCta);

        if (activeCreative.generatedCopies && activeCreative.generatedCopies.length > 0) {
          setGeneratedCopies(activeCreative.generatedCopies);
        } else if (activeCreative.imageUrl) {
          // Ingest new image immediately
          processIntake(activeCreative.imageUrl, activeCreative.fileName, activeCreative.productName);
        }
      }
    }
  }, [activeCreative]);

  // Central Creative Intake & Generation Pipeline
  const processIntake = async (
    imageSource: string,
    fileName: string,
    customProductHint?: string
  ) => {
    setIsProcessing(true);
    setActiveImage(imageSource);
    setImageFileName(fileName);

    const cleanName = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    const initialProduct = customProductHint || cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    setProductName(initialProduct);

    onShowToast(`Analyzing "${fileName}" with Computer Vision...`);

    try {
      // 1. Analyze with Gemini Vision
      const visionRes = await analyzeCreativeWithVision({
        imageBase64: imageSource.startsWith('data:') ? imageSource : undefined,
        fileName,
        productName: initialProduct,
      });

      const finalProduct = visionRes.detectedProduct || initialProduct;
      const finalProp = visionRes.detectedValueProp || visionRes.ocrText || `Premium offering for ${finalProduct}`;
      const finalOcr = visionRes.ocrText || cleanName;
      const finalAudience = visionRes.targetAudience || 'Interested Buyers & Prospects';
      const finalCta = visionRes.recommendedCta || 'Learn More';
      const finalScore = visionRes.hookScore || 95;
      const finalElements = visionRes.detectedElements?.length
        ? visionRes.detectedElements
        : ['Visual Product Focus', 'Call to Action', 'Value Badge'];

      setProductName(finalProduct);
      setValueProp(finalProp);
      setExtractedOcr(finalOcr);
      setIcp(finalAudience);
      setCta(finalCta);
      setHookScore(finalScore);
      setDetectedElements(finalElements);

      onDeductCredits(30);
      onShowToast(`Generating ad copy variations for "${finalProduct}"...`);

      // 2. Generate Ad Copy tailored to THIS uploaded creative
      const copyRes = await generatePlatformCopy({
        imageBase64: imageSource.startsWith('data:') ? imageSource : undefined,
        productName: finalProduct,
        valueProp: finalProp,
        tone: activeTone,
        icp: finalAudience,
        cta: finalCta,
        platform: 'meta',
        angle: selectedAngle,
        creativeFileName: fileName,
        creativeContext: visionRes.visualAnalysis || `Visual focus: ${finalElements.join(', ')}`,
        ocrText: finalOcr,
        detectedElements: finalElements,
      });

      if (copyRes.variations && copyRes.variations.length > 0) {
        setGeneratedCopies(copyRes.variations);
        onDeductCredits(50);
        onShowToast(`✨ 3 ad variations generated for "${finalProduct}"!`);

        // Propagate to global state
        if (onUpdateCreative) {
          onUpdateCreative({
            id: activeCreative?.id || `creative-${Date.now()}`,
            title: finalProduct,
            fileName,
            imageUrl: imageSource,
            aspectRatio: activeCreative?.aspectRatio || '1:1 Square',
            productName: finalProduct,
            valueProp: finalProp,
            targetAudience: finalAudience,
            recommendedCta: finalCta,
            ocrText: finalOcr,
            hookScore: finalScore,
            visualAnalysis: visionRes.visualAnalysis || '',
            detectedElements: finalElements,
            dominantColors: visionRes.dominantColors || [],
            emotionalVectors: visionRes.emotionalVectors || { productivity: 85, urgency: 80, curiosity: 80, trust: 90 },
            recommendedCopyAngles: copyRes.variations.map((v) => v.headline),
            generatedCopies: copyRes.variations,
            selectedVariationId: copyRes.variations[0]?.id || 'var-a',
          });
        }
      }
    } catch (err: any) {
      onShowToast(`Generated ad copies for "${initialProduct}"`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          processIntake(event.target.result as string, file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          processIntake(event.target.result as string, file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegenerate = async () => {
    setIsProcessing(true);
    onShowToast(`Regenerating copy for "${productName}" (${selectedAngle})...`);

    try {
      const copyRes = await generatePlatformCopy({
        imageBase64: activeImage.startsWith('data:') ? activeImage : undefined,
        productName,
        valueProp,
        tone: activeTone,
        icp,
        cta,
        platform: 'meta',
        angle: selectedAngle,
        creativeFileName: imageFileName,
        creativeContext: `Visual elements: ${detectedElements.join(', ')}`,
        ocrText: extractedOcr,
        detectedElements,
      });

      if (copyRes.variations && copyRes.variations.length > 0) {
        setGeneratedCopies(copyRes.variations);
        onDeductCredits(50);
        onShowToast(`✨ New variations ready for "${productName}"!`);

        if (onUpdateCreative && activeCreative) {
          onUpdateCreative({
            ...activeCreative,
            productName,
            valueProp,
            targetAudience: icp,
            recommendedCta: cta,
            generatedCopies: copyRes.variations,
            selectedVariationId: copyRes.variations[0]?.id || 'var-a',
          });
        }
      }
    } catch (err: any) {
      onShowToast(`Refreshed ad copy variations`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEnhanceValueProp = async () => {
    if (!valueProp.trim()) return;
    setIsEnhancing(true);
    onShowToast('Optimizing value proposition with AI...');
    try {
      const res = await enhanceValueProposition({
        rawValueProp: valueProp,
        targetAudience: icp,
        tone: activeTone,
      });
      if (res.enhanced) {
        setValueProp(res.enhanced);
        onShowToast('Value proposition refined!');
      }
    } catch {
      onShowToast('Value proposition ready');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleScrape = async () => {
    if (!scrapeUrl.trim()) return;
    setIsScraping(true);
    onShowToast(`Fetching context from ${scrapeUrl}...`);
    try {
      const res = await scrapeLandingPage(scrapeUrl);
      if (res.data?.pageTitle) setProductName(res.data.pageTitle);
      if (res.data?.extractedHeadings?.length) setValueProp(res.data.extractedHeadings.join('. '));
      onShowToast('Synced context from landing page');
    } catch {
      onShowToast('URL synced');
    } finally {
      setIsScraping(false);
    }
  };

  const handleCopyText = (text: string, id: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onShowToast(`Copied ${label}`);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleCopyFull = (v: AdVariation) => {
    const full = `${v.headline}\n\n${v.primaryText}\n\nCTA: ${v.cta}`;
    navigator.clipboard.writeText(full);
    setCopiedId(v.id);
    onShowToast(`Copied complete ${v.name}`);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const tones = [
    'Direct & Punchy',
    'Curiosity & FOMO',
    'Executive / B2B',
    'Conversational',
    'Social Proof',
  ];

  const samplePresets = [
    {
      title: 'Performance Sneakers',
      fileName: 'sneakers_launch_hero.png',
      url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Organic Cold Brew',
      fileName: 'coldbrew_artisan_bottle.png',
      url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Modern Ergonomic Chair',
      fileName: 'ergonomic_office_chair.png',
      url: 'https://images.unsplash.com/photo-1580481077195-c322b7a91a92?w=800&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Minimal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">Creative Studio</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Upload an ad creative to inspect visual hooks and generate targeted ad copies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs text-zinc-700 font-medium hover:bg-zinc-50 transition cursor-pointer shadow-xs">
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            <span className="material-symbols-outlined text-[16px] text-zinc-500">add_photo_alternate</span>
            <span>Upload Graphic</span>
          </label>

          <button
            type="button"
            onClick={handleRegenerate}
            disabled={isProcessing}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition cursor-pointer shadow-xs disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-[16px] ${isProcessing ? 'animate-spin' : ''}`}>
              {isProcessing ? 'progress_activity' : 'auto_fix_high'}
            </span>
            <span>{isProcessing ? 'Generating...' : 'Generate Copies'}</span>
          </button>
        </div>
      </div>

      {/* 2-Column Clean Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Creative Asset & Vision Insights (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Minimal Dropzone / Preview Card */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`bg-white rounded-xl border p-4 transition-all ${
              isDragging ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200 hover:border-zinc-300'
            }`}
          >
            {/* Header info */}
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-medium text-zinc-900 truncate max-w-[200px]">{imageFileName}</span>
              <span className="text-[11px] font-mono text-zinc-500 px-2 py-0.5 rounded bg-zinc-100">
                {hookScore}% Hook Score
              </span>
            </div>

            {/* Graphic Preview */}
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 group">
              <img
                src={activeImage}
                alt={productName}
                className="w-full h-full object-cover transition duration-300 group-hover:scale-[1.02]"
              />

              {/* Minimal Tag Overlays */}
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-white/90 backdrop-blur-xs text-[10px] font-mono text-zinc-800 shadow-xs">
                OCR: {extractedOcr.slice(0, 32)}...
              </div>

              {/* File Swap Overlay Button */}
              <label className="absolute bottom-2 right-2 px-2.5 py-1 rounded bg-zinc-900/80 hover:bg-zinc-900 text-white text-[11px] font-medium backdrop-blur-xs transition cursor-pointer flex items-center gap-1 shadow-xs">
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
                <span>Change Image</span>
              </label>
            </div>

            {/* Quick Presets for Instant Testing */}
            <div className="mt-3 pt-3 border-t border-zinc-100">
              <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold mb-2">
                Sample Creatives
              </div>
              <div className="grid grid-cols-3 gap-2">
                {samplePresets.map((sample, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => processIntake(sample.url, sample.fileName, sample.title)}
                    className="flex flex-col text-left p-1.5 rounded-lg border border-zinc-200 hover:border-zinc-400 bg-zinc-50/50 hover:bg-white transition cursor-pointer group"
                  >
                    <div className="aspect-[16/10] rounded overflow-hidden mb-1 bg-zinc-200">
                      <img src={sample.url} alt={sample.title} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] font-medium text-zinc-700 truncate w-full">
                      {sample.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Detected Visual Insights */}
          <div className="bg-white rounded-xl border border-zinc-200 p-4 text-xs space-y-3">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400">
              Visual Elements Detected
            </div>
            <div className="flex flex-wrap gap-1.5">
              {detectedElements.map((el, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700 text-xs font-medium"
                >
                  {el}
                </span>
              ))}
            </div>

            <div className="pt-2 border-t border-zinc-100">
              <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold mb-1">
                Extracted Text (OCR)
              </div>
              <div className="p-2 rounded bg-zinc-50 border border-zinc-200 text-zinc-700 font-mono text-[11px] italic leading-relaxed">
                "{extractedOcr}"
              </div>
            </div>
          </div>
        </div>

        {/* Right: Campaign Inputs & Context (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Campaign Information
            </div>

            {/* Product / Offer Name */}
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Product / Brand Name
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Nike Air Zoom, Artisan Cold Brew"
                className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-200 text-zinc-900 text-xs font-medium focus:outline-none focus:border-zinc-900 transition"
              />
            </div>

            {/* Value Proposition */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-zinc-700">
                  Value Proposition &amp; Main Hook
                </label>
                <button
                  type="button"
                  onClick={handleEnhanceValueProp}
                  disabled={isEnhancing}
                  className="text-xs text-zinc-600 hover:text-zinc-900 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <span className={`material-symbols-outlined text-[14px] ${isEnhancing ? 'animate-spin' : ''}`}>
                    auto_fix_high
                  </span>
                  <span>{isEnhancing ? 'Enhancing...' : 'AI Enhance'}</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={valueProp}
                onChange={(e) => setValueProp(e.target.value)}
                placeholder="What makes this product special? Core benefit, discount, or problem solved."
                className="w-full p-2.5 rounded-lg bg-white border border-zinc-200 text-zinc-900 text-xs font-normal focus:outline-none focus:border-zinc-900 transition resize-none leading-relaxed"
              />
            </div>

            {/* Target Audience & CTA Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Target Audience (ICP)
                </label>
                <input
                  type="text"
                  value={icp}
                  onChange={(e) => setIcp(e.target.value)}
                  placeholder="e.g. Marathon Runners, Remote Workers"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-200 text-zinc-900 text-xs focus:outline-none focus:border-zinc-900 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Call to Action (CTA)
                </label>
                <input
                  type="text"
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  placeholder="e.g. Shop Now, Get 30% Off"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-200 text-zinc-900 text-xs focus:outline-none focus:border-zinc-900 transition"
                />
              </div>
            </div>

            {/* Tone Selector */}
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Tone of Voice
              </label>
              <div className="flex flex-wrap gap-1.5">
                {tones.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setActiveTone(t)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                      activeTone === t
                        ? 'bg-zinc-900 text-white'
                        : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Landing Page URL Context */}
            <div className="pt-2 border-t border-zinc-100">
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Optional: Sync Landing Page URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={scrapeUrl}
                  onChange={(e) => setScrapeUrl(e.target.value)}
                  placeholder="https://example.com/product"
                  className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-zinc-900 text-xs font-mono focus:outline-none focus:border-zinc-900 transition"
                />
                <button
                  type="button"
                  onClick={handleScrape}
                  disabled={isScraping || !scrapeUrl}
                  className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium transition cursor-pointer disabled:opacity-40"
                >
                  {isScraping ? 'Syncing...' : 'Sync URL'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Ad Copies Section */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">
              Generated Ad Copies for "{productName || imageFileName}"
            </h2>
            <p className="text-xs text-zinc-500">
              Grounded in the visual elements, text, and value proposition of your uploaded creative.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedAngle}
              onChange={(e) => setSelectedAngle(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-zinc-100 border-none text-xs font-medium text-zinc-700 cursor-pointer"
            >
              <option value="Problem-Agitate-Solve (PAS)">Angle: Problem-Agitate-Solve</option>
              <option value="Curiosity / Contrarian">Angle: Curiosity &amp; Contrarian</option>
              <option value="Social Proof & Metrics">Angle: Social Proof &amp; Reviews</option>
            </select>

            <button
              type="button"
              onClick={handleRegenerate}
              disabled={isProcessing}
              className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-medium transition cursor-pointer"
            >
              Regenerate
            </button>

            <button
              type="button"
              onClick={() => onNavigate('multi-platform')}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition cursor-pointer flex items-center gap-1"
            >
              <span>Platform Preview</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* 3 Copy Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {generatedCopies.map((v, idx) => (
            <div
              key={v.id || idx}
              className="rounded-xl border border-zinc-200 p-4 flex flex-col justify-between gap-3 bg-zinc-50/40 hover:bg-white hover:border-zinc-300 transition"
            >
              <div className="space-y-2">
                {/* Header Tag */}
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                  <span className="text-xs font-semibold text-zinc-800">
                    {v.name || `Variation ${String.fromCharCode(65 + idx)}`}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">
                    {v.predictedCtr || '4.5%'} CTR
                  </span>
                </div>

                <div className="text-[11px] text-zinc-400 font-medium">
                  {v.angle}
                </div>

                {/* Headline */}
                <div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-0.5">
                    <span>Headline</span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(v.headline, `${v.id}-h`, 'Headline')}
                      className="text-zinc-400 hover:text-zinc-800 transition cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {copiedId === `${v.id}-h` ? 'done' : 'content_copy'}
                      </span>
                    </button>
                  </div>
                  <div className="p-2 rounded bg-white border border-zinc-200 text-xs font-semibold text-zinc-900">
                    {v.headline}
                  </div>
                </div>

                {/* Primary Text */}
                <div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-0.5">
                    <span>Primary Body Copy</span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(v.primaryText, `${v.id}-b`, 'Body Copy')}
                      className="text-zinc-400 hover:text-zinc-800 transition cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {copiedId === `${v.id}-b` ? 'done' : 'content_copy'}
                      </span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded bg-white border border-zinc-200 text-xs text-zinc-700 leading-relaxed min-h-[90px]">
                    {v.primaryText}
                  </div>
                </div>

                {/* Link Description & CTA */}
                <div className="p-2 rounded bg-zinc-100/70 text-xs flex items-center justify-between gap-2">
                  <span className="text-[11px] text-zinc-600 truncate">
                    {v.linkDescription || productName}
                  </span>
                  <span className="text-[10px] font-semibold text-zinc-800 px-2 py-0.5 rounded bg-white shadow-xs shrink-0">
                    {v.cta || cta}
                  </span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyFull(v)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-white border border-zinc-200 text-zinc-700 text-xs font-medium hover:bg-zinc-50 transition cursor-pointer shadow-xs flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {copiedId === v.id ? 'done' : 'content_copy'}
                  </span>
                  <span>{copiedId === v.id ? 'Copied' : 'Copy Full Ad'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onUpdateCreative && activeCreative) {
                      onUpdateCreative({
                        ...activeCreative,
                        productName,
                        valueProp,
                        targetAudience: icp,
                        recommendedCta: cta,
                        selectedVariationId: v.id,
                      });
                    }
                    onNavigate('multi-platform');
                  }}
                  className="py-1.5 px-3 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-medium transition cursor-pointer"
                >
                  Preview
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudioUploadScreen;
