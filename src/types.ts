export type SearchIntent = 'Informational' | 'Commercial' | 'Transactional' | 'Navigational';

export type PublishStatus = 'draft' | 'scheduled' | 'published' | 'failed';

export type NavigationTab = 'writer' | 'workflow' | 'batch' | 'calendar' | 'analytics' | 'websites';

export interface WordPressSite {
  id: string;
  name: string;
  url: string;
  username: string;
  appPassword: string;
  isSandbox?: boolean;
  status: 'connected' | 'error' | 'untested';
  lastTestedAt?: string;
  wpVersion?: string;
  userDisplayName?: string;
  defaultCategory?: string;
  defaultPostStatus?: 'publish' | 'draft' | 'future';
}

export interface KeywordResearch {
  keyword: string;
  searchIntent: SearchIntent;
  intentExplanation: string;
  searchVolumeEst: string;
  difficulty: 'Low' | 'Medium' | 'High';
  suggestedTitle: string;
  userQuestions: string[];
  lsiKeywords: string[];
  competitorAngle: string;
  recommendedWordCount: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface HeadingItem {
  level: 'h2' | 'h3';
  heading: string;
}

export interface SEOCheckItem {
  id: string;
  label: string;
  passed: boolean;
  details: string;
  importance: 'critical' | 'recommended' | 'optional';
}

export interface SEOCheckResult {
  overallScore: number;
  passedChecks: number;
  totalChecks: number;
  items: SEOCheckItem[];
  keywordDensity: number;
  readabilityScore: number;
  readabilityGrade: string;
  fillerDetection: {
    detected: boolean;
    score: number;
    notes: string;
  };
}

export interface ArticleVerificationProof {
  verifiedAt: string;
  httpStatus: number;
  apiEndpoint: string;
  serverSignature: string;
  wpResponseId: number;
  wpResponseLink: string;
}

export interface Article {
  id: string;
  keyword: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  h2h3Structure: HeadingItem[];
  contentHtml: string;
  contentMarkdown: string;
  faqs: FAQItem[];
  relatedKeywords: string[];
  imageAltText: string;
  imagePrompt: string;
  imageUrl?: string;
  featuredImageUrl?: string;
  watermarkedImageUrl?: string;
  providerUsed?: string;
  searchIntent: SearchIntent;
  wordCount: number;
  readingTime: number;
  seoAudit: SEOCheckResult;
  siteId: string;
  publishStatus: PublishStatus;
  scheduledFor?: string;
  wpPostId?: number;
  wpPostUrl?: string;
  wpVerificationProof?: ArticleVerificationProof;
  lastError?: string;
  createdAt: string;
  updatedAt: string;
}

export type AiProvider = 'gemini' | 'openai' | 'claude' | 'deepseek' | 'perplexity' | 'ensemble';

export interface ApiKeysConfig {
  gemini?: string;
  openai?: string;
  claude?: string;
  deepseek?: string;
  perplexity?: string;
}

export interface WatermarkConfig {
  enabled: boolean;
  brandText: string;
  logoUrl?: string;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
  opacity: number;
  fontSize: number;
  badgeBackground: boolean;
  textColor: string;
}

export interface ContentParameters {
  tone: string;
  targetWordCount: number;
  searchIntent: SearchIntent;
  audience: string;
  includeFaq: boolean;
  additionalInstructions: string;
}

export interface BatchKeywordItem {
  id: string;
  keyword: string;
  siteId: string;
  status: 'queued' | 'researching' | 'generating' | 'auditing' | 'ready' | 'publishing' | 'published' | 'failed';
  article?: Article;
  error?: string;
  progress: number;
  scheduledDate?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  siteId: string;
  siteName: string;
  articleTitle: string;
  action: 'test_connection' | 'publish_post' | 'schedule_post' | 'verify_post';
  httpStatus: number;
  statusText: string;
  success: boolean;
  responsePayloadExcerpt: string;
  requestUrl: string;
  latencyMs: number;
}
