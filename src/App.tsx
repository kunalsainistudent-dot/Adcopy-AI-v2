import React, { useState } from 'react';
import { ScreenTab, CampaignProject, ActiveCreativeState, CreativeAsset } from './types';
import { INITIAL_PROJECTS } from './data/mockData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { StudioUploadScreen } from './components/StudioUploadScreen';
import { MultiPlatformGeneratorScreen } from './components/MultiPlatformGeneratorScreen';
import { ABMatrixScreen } from './components/ABMatrixScreen';
import { AssetLibraryScreen } from './components/AssetLibraryScreen';
import { VoiceParametersModal } from './components/Modals/VoiceParametersModal';
import { NewCreativeModal } from './components/Modals/NewCreativeModal';

const DEFAULT_ACTIVE_CREATIVE: ActiveCreativeState = {
  id: 'creative-default',
  title: 'Pulse Hero Banner Q3',
  fileName: 'pulse_hero_banner_q3_v2.png',
  imageUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCU-Z0dEBn_XKZGfgdNlNhILl6ByiCsafVqAOfRSUc6E5ArAYmD_6Ha7G9G2LnYi2WcIvl4afiJACCRjNOIso6U5U3F4MLS-qu-sarJhzC-SS71M4lD0DmX_zmz0UShC3zRdb8OY1PvOMk9ewXfJn2QHDVXTCd1qrC2aKlP2sS0zsF5u_qBy-1Dvga6D8J7kUdkx8LFHkSGY_8iKXCqSjmPEWymVSMCbx9oOQWbudJJoY3YSkuhvXlM',
  aspectRatio: '1:1 Square • Meta & LinkedIn',
  ocrText: 'Scale your revenue 10x with real-time intelligence',
  hookScore: 96.2,
  visualAnalysis:
    'High focal contrast on value headline badge. Clean negative space maintains instant message comprehension across mobile and desktop feeds.',
  detectedElements: [
    'SaaS Dashboard UI Preview',
    '35% Off Special Offer Badge',
    'High Contrast Dark UI',
    'Predictive Churn Analytics Graph',
  ],
  detectedProduct: 'PulseMetrics 3.0 Enterprise Launch',
  detectedValueProp:
    'Real-time revenue intelligence that predicts churn 30 days before it happens.',
  targetAudience: 'VP of Growth, Head of Marketing, RevOps',
  recommendedCta: 'Start Free Trial / Book Demo',
  dominantColors: [
    { hex: '#4F46E5', name: 'Electric Indigo', percent: 45 },
    { hex: '#06B6D4', name: 'Cyan Glow', percent: 30 },
    { hex: '#0F172A', name: 'Deep Slate', percent: 25 },
  ],
  emotionalVectors: {
    productivity: 94,
    urgency: 88,
    curiosity: 82,
    trust: 94,
  },
  recommendedCopyAngles: [
    'Cut Ad Creative Costs by 73%',
    'Your A/B Testing Strategy is Dead',
    'Scale Ad ROAS by +140%',
  ],
  generatedCopies: [
    {
      id: 'var-a',
      name: 'Variation A (Champion)',
      angle: 'Problem-Agitate-Solve (PAS)',
      primaryText:
        'Still spending 20+ hours hand-drafting ad variations that burn budget? Stop burning spend. Let autonomous AI craft high-converting copy in seconds.',
      headline: 'Cut Ad Creative Costs by 73%',
      linkDescription:
        'Join 1,200+ venture-backed SaaS teams scaling revenue with autonomous creative iteration.',
      cta: 'Claim Free Trial',
      hookScore: 9.8,
      urgencyScore: 8.9,
      predictedCtr: '4.8%',
      characterCount: 148,
      keyBenefit: '73% lower CAC in 14 days',
    },
    {
      id: 'var-b',
      name: 'Variation B (Contrarian)',
      angle: 'Curiosity / Contrarian',
      primaryText:
        'A/B testing 2 variations is why your CAC is doubling. Elite marketing teams test 50+ angles in real-time. Here is what they know.',
      headline: 'Your A/B Testing Strategy is Dead',
      linkDescription:
        'The autonomous ad intelligence formula used by top 1% growth marketers.',
      cta: 'Claim Free Trial',
      hookScore: 9.4,
      urgencyScore: 8.5,
      predictedCtr: '4.2%',
      characterCount: 138,
      keyBenefit: 'Breakout winner discovery',
    },
    {
      id: 'var-c',
      name: 'Variation C (Data Proof)',
      angle: 'Social Proof & Metrics',
      primaryText:
        '140% ROAS increase in 14 days. We analyzed 4.2 million impressions across 25 B2B SaaS accounts to build this exact copy formula.',
      headline: 'Scale Ad ROAS by +140%',
      linkDescription:
        'Backed by 4.2M analyzed impressions and verified ad network telemetry.',
      cta: 'Claim Free Trial',
      hookScore: 9.6,
      urgencyScore: 9.1,
      predictedCtr: '4.5%',
      characterCount: 145,
      keyBenefit: 'Audited 140% ROAS lift',
    },
  ],
  selectedVariationId: 'var-a',
};

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<ScreenTab>('studio-upload');
  const [credits, setCredits] = useState<number>(14250);
  const maxCredits = 20000;
  const [currentProject, setCurrentProject] = useState<CampaignProject>(INITIAL_PROJECTS[0]);
  const [projects] = useState<CampaignProject[]>(INITIAL_PROJECTS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active creative state shared across Studio, Generator, and Library
  const [activeCreative, setActiveCreative] = useState<ActiveCreativeState>(DEFAULT_ACTIVE_CREATIVE);

  // Modals
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isNewCreativeModalOpen, setIsNewCreativeModalOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  const deductCredits = (amount: number) => {
    setCredits((prev) => Math.max(0, prev - amount));
  };

  const handleUpdateCreative = (updated: ActiveCreativeState) => {
    setActiveCreative(updated);
  };

  const handleLoadAssetIntoStudio = (asset: CreativeAsset) => {
    const loadedState: ActiveCreativeState = {
      id: asset.id,
      title: asset.title,
      fileName: `${asset.id.toLowerCase()}_asset.png`,
      imageUrl: asset.imageUrl,
      aspectRatio: asset.aspectRatio,
      ocrText: asset.winningAngleSnippet,
      hookScore: asset.aiScore,
      visualAnalysis: `Archived performance creative (${asset.cohort}). Verified ROAS: ${asset.roas}, CTR: ${asset.ctr}.`,
      detectedElements: [
        'Verified Winner Creative',
        'Direct Conversion Trigger',
        'Multi-network optimized',
      ],
      detectedProduct: asset.title,
      detectedValueProp: asset.winningAngleSnippet,
      targetAudience: 'High-intent prospective buyers',
      recommendedCta: 'Shop Now / Learn More',
      dominantColors: [
        { hex: '#4F46E5', name: 'Electric Indigo', percent: 45 },
        { hex: '#06B6D4', name: 'Cyan Glow', percent: 30 },
        { hex: '#0F172A', name: 'Deep Slate', percent: 25 },
      ],
      emotionalVectors: { productivity: 90, urgency: 85, curiosity: 80, trust: 92 },
      recommendedCopyAngles: asset.generatedAngles.map((a) => a.text),
      generatedCopies: asset.generatedAngles.map((a, idx) => ({
        id: `var-${idx === 0 ? 'a' : idx === 1 ? 'b' : 'c'}`,
        name: `Variation ${String.fromCharCode(65 + idx)} (${a.label})`,
        angle: a.label,
        primaryText: a.text,
        headline: asset.title.slice(0, 32),
        linkDescription: `Verified ${asset.roas} performance creative on active networks.`,
        cta: 'Learn More',
        hookScore: asset.aiScore / 10,
        urgencyScore: 8.8,
        predictedCtr: asset.ctr,
        characterCount: a.charCount,
        keyBenefit: a.metrics,
      })),
      selectedVariationId: 'var-a',
    };
    setActiveCreative(loadedState);
    setCurrentTab('studio-upload');
    showToast(`Loaded "${asset.title}" into Studio`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      {/* Top Main Navigation */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        credits={credits}
        maxCredits={maxCredits}
        currentProject={currentProject}
        projects={projects}
        onProjectChange={(proj) => setCurrentProject(proj)}
        onNewCreativeClick={() => setIsNewCreativeModalOpen(true)}
        onShowToast={showToast}
      />

      {/* Main Screen Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {currentTab === 'studio-upload' && (
          <StudioUploadScreen
            onNavigate={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onShowToast={showToast}
            onDeductCredits={deductCredits}
            activeCreative={activeCreative}
            onUpdateCreative={handleUpdateCreative}
          />
        )}

        {currentTab === 'multi-platform' && (
          <MultiPlatformGeneratorScreen
            onNavigate={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onShowToast={showToast}
            onDeductCredits={deductCredits}
            activeCreative={activeCreative}
            onUpdateCreative={handleUpdateCreative}
          />
        )}

        {currentTab === 'ab-matrix' && (
          <ABMatrixScreen
            onShowToast={showToast}
            onDeductCredits={deductCredits}
          />
        )}

        {currentTab === 'creative-library' && (
          <AssetLibraryScreen
            onNavigate={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onShowToast={showToast}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
            onOpenNewCreativeModal={() => setIsNewCreativeModalOpen(true)}
            onSelectAssetForStudio={handleLoadAssetIntoStudio}
          />
        )}
      </main>

      {/* Light Bottom Footer */}
      <Footer />

      {/* Global Toast */}
      <Toast message={toastMessage} />

      {/* Modals */}
      <VoiceParametersModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSave={(params) => {
          showToast(`Saved brand voice parameters (Formality: ${params.formality}%, Urgency: ${params.urgency}%)`);
        }}
      />

      <NewCreativeModal
        isOpen={isNewCreativeModalOpen}
        onClose={() => setIsNewCreativeModalOpen(false)}
        onSuccess={(uploadedData) => {
          const freshCreative: ActiveCreativeState = {
            id: `creative-${Date.now()}`,
            title: uploadedData.title,
            fileName: uploadedData.fileName,
            imageUrl: uploadedData.imageUrl || DEFAULT_ACTIVE_CREATIVE.imageUrl,
            aspectRatio: uploadedData.aspectRatio,
            productName: uploadedData.title,
            valueProp: '',
            ocrText: '',
            hookScore: 95.5,
            visualAnalysis: '',
            detectedElements: [],
            dominantColors: [
              { hex: '#4F46E5', name: 'Electric Indigo', percent: 45 },
              { hex: '#06B6D4', name: 'Cyan Glow', percent: 30 },
              { hex: '#0F172A', name: 'Deep Slate', percent: 25 },
            ],
            emotionalVectors: { productivity: 85, urgency: 80, curiosity: 82, trust: 92 },
            recommendedCopyAngles: [],
            generatedCopies: [],
          };
          setActiveCreative(freshCreative);
          showToast(`Ingested "${uploadedData.title}" — Analyzing visual hooks & writing ad copy in Studio!`);
          setCurrentTab('studio-upload');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
};

export default App;
