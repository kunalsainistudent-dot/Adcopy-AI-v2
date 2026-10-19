export type ScreenTab = 'studio-upload' | 'multi-platform' | 'ab-matrix' | 'creative-library';

export interface CampaignProject {
  id: string;
  name: string;
  client: string;
  activeVariantCount: number;
}

export interface CreativeAsset {
  id: string;
  title: string;
  aspectRatio: string;
  platforms: string[];
  platformPills: { name: string; count: number; color: string }[];
  status: 'WINNER' | 'TESTING' | 'STAGING' | 'SCALING';
  statusColor: string;
  badgeLabel?: string;
  ctr: string;
  roas: string;
  clicks?: string;
  impressions?: string;
  leads?: string;
  cpl?: string;
  cvr?: string;
  arrAdded?: string;
  cac?: string;
  payback?: string;
  imageUrl: string;
  winningAngleSnippet: string;
  winningAngleCategory: string;
  accentBorder?: string;
  aiScore: number;
  cohort: string;
  generatedAngles: GeneratedAngle[];
  connectedNetworks: {
    metaId: string;
    googleId: string;
    linkedinId: string;
  };
}

export interface GeneratedAngle {
  id: string;
  label: string;
  badgeColor: string;
  charCount: number;
  maxChars: number;
  text: string;
  metrics: string;
}

export interface MatrixVariant {
  id: string;
  name: string;
  hookType: string;
  hookScore: number;
  isChampion?: boolean;
  audienceResonance: string;
  meta: {
    primaryText: string;
    charCount: number;
    maxChars: number;
    headline: string;
    headlineChars: number;
    cta: string;
    estCtr: string;
  };
  google: {
    headlines: string[];
    headlineLengths: number[];
    maxHeadline: number;
    headlineRating: string;
    description: string;
    cpcEst: string;
    quality: string;
  };
  linkedin: {
    narrative: string;
    charCount: number;
    hashtags: string[];
    projectedCvr: string;
  };
  selected: boolean;
}

export interface BudgetSplit {
  variantId: string;
  name: string;
  hookType: string;
  weight: number;
  spend: number;
  conversions: number;
  cpa: number;
  roas: number;
  color: string;
}

export interface AdVariation {
  id: string;
  name: string;
  angle: string;
  primaryText: string;
  headline: string;
  linkDescription: string;
  cta: string;
  hookScore: number;
  urgencyScore: number;
  predictedCtr: string;
  characterCount: number;
  keyBenefit?: string;
}

export interface ActiveCreativeState {
  id: string;
  title: string;
  fileName: string;
  imageUrl: string;
  aspectRatio: string;
  ocrText: string;
  hookScore: number;
  visualAnalysis: string;
  detectedElements: string[];
  detectedBrand?: string;
  detectedProduct?: string;
  detectedValueProp?: string;
  targetAudience?: string;
  recommendedCta?: string;
  productName?: string;
  valueProp?: string;
  dominantColors: Array<{ hex: string; name: string; percent: number }>;
  emotionalVectors: {
    productivity: number;
    urgency: number;
    curiosity: number;
    trust: number;
  };
  recommendedCopyAngles: string[];
  generatedCopies: AdVariation[];
  selectedVariationId?: string;
}
