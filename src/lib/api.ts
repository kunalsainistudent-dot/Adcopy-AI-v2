/**
 * AdCopy AI Client API Service
 * Interacts with server-side Express endpoints powered by Gemini 3.8 Flash
 */

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  service: string;
  geminiConfigured: boolean;
  model: string;
}

export interface CreativeAnalysisResult {
  ocrText: string;
  hookScore: number;
  visualAnalysis: string;
  detectedBrand?: string;
  detectedProduct?: string;
  detectedValueProp?: string;
  targetAudience?: string;
  recommendedCta?: string;
  dominantColors: Array<{ hex: string; name: string; percent: number }>;
  emotionalVectors: {
    productivity: number;
    urgency: number;
    curiosity: number;
    trust: number;
  };
  detectedElements: string[];
  recommendedCopyAngles: string[];
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

export interface GenerateCopyResponse {
  variations: AdVariation[];
  alternativeHeadlines: string[];
  heuristicsSummary: string;
}

export async function checkBackendHealth(): Promise<HealthCheckResponse> {
  const res = await fetch('/api/health');
  if (!res.ok) {
    throw new Error(`Backend health check failed: ${res.statusText}`);
  }
  return res.json();
}

export async function analyzeCreativeWithVision(params: {
  imageBase64?: string;
  mimeType?: string;
  fileName?: string;
  productName?: string;
  valueProp?: string;
}): Promise<CreativeAnalysisResult> {
  const res = await fetch('/api/analyze-creative', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error(`Creative analysis failed: ${res.statusText}`);
  }

  const json = await res.json();
  return json.data;
}

export async function generatePlatformCopy(params: {
  imageBase64?: string;
  mimeType?: string;
  productName?: string;
  valueProp?: string;
  tone?: string;
  icp?: string;
  cta?: string;
  platform?: 'meta' | 'google' | 'linkedin' | 'tiktok';
  angle?: string;
  creativeFileName?: string;
  creativeContext?: string;
  ocrText?: string;
  detectedElements?: string[];
}): Promise<GenerateCopyResponse> {
  const res = await fetch('/api/generate-copy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error(`Ad copy generation failed: ${res.statusText}`);
  }

  const json = await res.json();
  return json.data;
}

export async function enhanceValueProposition(params: {
  rawValueProp: string;
  targetAudience?: string;
  tone?: string;
}): Promise<{ enhanced: string; hookAngle: string; metricsIncluded: string[] }> {
  const res = await fetch('/api/enhance-value-prop', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error(`Value prop enhancement failed: ${res.statusText}`);
  }

  return res.json();
}

export async function scrapeLandingPage(url: string) {
  const res = await fetch('/api/scrape-landing-page', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) {
    throw new Error(`Landing page scrape failed: ${res.statusText}`);
  }

  return res.json();
}

export async function syncConnectedAdAccounts(params: {
  campaignName: string;
  networks?: { meta?: boolean; google?: boolean; linkedin?: boolean };
}) {
  const res = await fetch('/api/sync-ad-accounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error(`Ad sync failed: ${res.statusText}`);
  }

  return res.json();
}
