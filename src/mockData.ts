import { WordPressSite, Article, AuditLogEntry } from './types';

export const INITIAL_SITES: WordPressSite[] = [
  {
    id: 'site-sandbox-1',
    name: 'Staging Tech Hub (WP Sandbox)',
    url: 'sandbox://techhub.wp-sandbox.internal',
    username: 'wp_admin',
    appPassword: 'sand box1 2345 demo',
    isSandbox: true,
    status: 'connected',
    lastTestedAt: new Date().toISOString(),
    wpVersion: '6.7.2',
    userDisplayName: 'Editorial Lead (Verified)',
    defaultCategory: 'Technology & SEO',
    defaultPostStatus: 'publish'
  },
  {
    id: 'site-marketing-blog',
    name: 'GrowthPulse Magazine (Live WP)',
    url: 'https://growthpulse-demo.com',
    username: 'growth_editor',
    appPassword: 'xxxx xxxx xxxx xxxx',
    isSandbox: false,
    status: 'untested',
    defaultCategory: 'Marketing Strategy',
    defaultPostStatus: 'draft'
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-101',
    keyword: 'programmatic seo strategies',
    title: 'Programmatic SEO Strategies: How to Scale High-Intent Search Traffic Safely',
    metaTitle: 'Programmatic SEO Strategies: Scale Organic Traffic Safely (2026)',
    metaDescription: 'Master programmatic SEO without low-quality spam penalties. Learn database architecture, template design, search intent mapping, and quality gates.',
    slug: 'programmatic-seo-strategies',
    searchIntent: 'Informational',
    h2h3Structure: [
      { level: 'h2', heading: 'The Evolution of Programmatic SEO in Modern Search' },
      { level: 'h3', heading: 'Why Thin Pages Get De-indexed Quickly' },
      { level: 'h2', heading: 'Core Architecture of a High-Value Programmatic Campaign' },
      { level: 'h3', heading: '1. Structured Data Sourcing & Unique Data Points' },
      { level: 'h3', heading: '2. Dynamic Template Logic and Search Intent Matching' },
      { level: 'h2', heading: 'Quality Gates to Prevent Keyword Cannibalization' },
      { level: 'h2', heading: 'Frequently Asked Questions About Programmatic SEO' }
    ],
    contentMarkdown: `## The Evolution of Programmatic SEO in Modern Search\n\nProgrammatic SEO has evolved from simple keyword permutations into sophisticated entity-based databases. Rather than publishing thousands of generic landing pages with swapped city names, successful creators now combine proprietary datasets with editorial quality controls.\n\n### Why Thin Pages Get De-indexed Quickly\n\nSearch engines now use advanced semantic evaluation to identify duplicate intent. If 500 pages on your website answer the exact same underlying question with identical sentence structures, your crawl budget deteriorates.\n\n---\n\n## Core Architecture of a High-Value Programmatic Campaign\n\nTo build scalable content that sustains rankings, your programmatic framework requires three distinct layers:\n\n### 1. Structured Data Sourcing & Unique Data Points\nEvery programmatic page must deliver data that cannot be found on rival search results. This includes internal benchmark stats, localized pricing benchmarks, or customer review rollups.\n\n### 2. Dynamic Template Logic and Search Intent Matching\nRather than static text placeholders, implement conditional modules based on search intent.\n\n---\n\n## Frequently Asked Questions About Programmatic SEO\n\n**Q: How do you protect a site from thin content penalties?**  \nA: Implement indexation thresholds: only index pages that contain at least 3 unique data attributes not present anywhere else on the site.\n\n**Q: What is the ideal frequency for publishing programmatic batches?**  \nA: Stagger deployments at 10–25 verified posts per week to monitor search crawl patterns and indexation velocity before scaling.`,
    contentHtml: `<h2>The Evolution of Programmatic SEO in Modern Search</h2><p>Programmatic SEO has evolved from simple keyword permutations into sophisticated entity-based databases. Rather than publishing thousands of generic landing pages with swapped city names, successful creators now combine proprietary datasets with editorial quality controls.</p><h3>Why Thin Pages Get De-indexed Quickly</h3><p>Search engines now use advanced semantic evaluation to identify duplicate intent. If 500 pages on your website answer the exact same underlying question with identical sentence structures, your crawl budget deteriorates.</p><hr/><h2>Core Architecture of a High-Value Programmatic Campaign</h2><p>To build scalable content that sustains rankings, your programmatic framework requires three distinct layers:</p><h3>1. Structured Data Sourcing & Unique Data Points</h3><p>Every programmatic page must deliver data that cannot be found on rival search results. This includes internal benchmark stats, localized pricing benchmarks, or customer review rollups.</p><h3>2. Dynamic Template Logic and Search Intent Matching</h3><p>Rather than static text placeholders, implement conditional modules based on search intent.</p><hr/><h2>Frequently Asked Questions About Programmatic SEO</h2><div class="faq-container"><p><strong>Q: How do you protect a site from thin content penalties?</strong><br/>A: Implement indexation thresholds: only index pages that contain at least 3 unique data attributes not present anywhere else on the site.</p><p><strong>Q: What is the ideal frequency for publishing programmatic batches?</strong><br/>A: Stagger deployments at 10–25 verified posts per week to monitor search crawl patterns and indexation velocity before scaling.</p></div>`,
    faqs: [
      {
        question: 'How do you protect a site from thin content penalties?',
        answer: 'Implement indexation thresholds: only index pages that contain at least 3 unique data attributes not present anywhere else on the site.'
      },
      {
        question: 'What is the ideal frequency for publishing programmatic batches?',
        answer: 'Stagger deployments at 10–25 verified posts per week to monitor search crawl patterns and indexation velocity before scaling.'
      }
    ],
    relatedKeywords: [
      'programmatic content architecture',
      'dataset seo automation',
      'search intent cluster',
      'canonical url structure',
      'long tail keyword scaling'
    ],
    imageAltText: 'Modern diagram showcasing programmatic SEO database pipeline and editorial verification',
    imagePrompt: 'Clean minimalist architectural flowchart displaying a database feeding into verified WordPress publishing, warm graphite and slate accents, crisp vector style',
    wordCount: 1280,
    readingTime: 6,
    seoAudit: {
      overallScore: 94,
      passedChecks: 8,
      totalChecks: 8,
      items: [
        { id: 'kw_in_title', label: 'Keyword in H1 Title', passed: true, details: 'Primary keyword is placed at the front of the headline.', importance: 'critical' },
        { id: 'meta_title_len', label: 'Meta Title Optimal Length', passed: true, details: '59 characters (Optimal SERP fit).', importance: 'critical' },
        { id: 'meta_desc_len', label: 'Meta Description Optimal Length', passed: true, details: '154 characters with active action verb.', importance: 'critical' },
        { id: 'kw_density', label: 'Keyword Density Balance', passed: true, details: '1.4% density without keyword stuffing.', importance: 'critical' },
        { id: 'heading_hierarchy', label: 'H2/H3 Structure & Subheadings', passed: true, details: '7 balanced headings with logical flow.', importance: 'recommended' },
        { id: 'faq_section', label: 'Structured FAQ Section', passed: true, details: '2 QA items with Google schema readiness.', importance: 'recommended' },
        { id: 'filler_check', label: 'AI Filler & Repetition Guard', passed: true, details: '0 filler buzzwords detected.', importance: 'critical' },
        { id: 'word_count_check', label: 'Depth & Word Count', passed: true, details: '1,280 words meets topical authority depth.', importance: 'recommended' }
      ],
      keywordDensity: 1.4,
      readabilityScore: 72,
      readabilityGrade: 'Standard Editorial (Grade 8)',
      fillerDetection: {
        detected: false,
        score: 98,
        notes: 'Human editorial cadence verified'
      }
    },
    siteId: 'site-sandbox-1',
    publishStatus: 'published',
    wpPostId: 101,
    wpPostUrl: 'https://sandbox.press/seo-best-practices-2026/',
    wpVerificationProof: {
      verifiedAt: new Date(Date.now() - 86400000).toISOString(),
      httpStatus: 201,
      apiEndpoint: 'sandbox://techhub.wp-sandbox.internal/wp-json/wp/v2/posts',
      serverSignature: 'wp-auth-verified-101-9238472',
      wpResponseId: 101,
      wpResponseLink: 'https://sandbox.press/seo-best-practices-2026/'
    },
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'art-102',
    keyword: 'headless cms for seo',
    title: 'Headless CMS for SEO: Core Web Vitals, Rendering & Crawlability Benchmarks',
    metaTitle: 'Headless CMS for SEO: Performance & Rendering Guide',
    metaDescription: 'Explore how headless CMS architectures impact search rankings. Compare SSG vs ISR, Core Web Vitals scores, and crawl budget optimizations.',
    slug: 'headless-cms-for-seo',
    searchIntent: 'Commercial',
    h2h3Structure: [
      { level: 'h2', heading: 'Why Technical Teams Shift to Headless CMS' },
      { level: 'h3', heading: 'The Core Web Vitals Advantage' },
      { level: 'h2', heading: 'Common Technical SEO Hurdles in Decoupled Sites' },
      { level: 'h3', heading: 'Hydration Errors and Client-Side Metadata Pitfalls' },
      { level: 'h2', heading: 'Best Practices for Headless SEO Architecture' }
    ],
    contentMarkdown: `## Why Technical Teams Shift to Headless CMS\n\nDecoupling the frontend presentation layer from content management gives engineering teams unparalleled control over caching, TTFB, and asset minification.\n\n### The Core Web Vitals Advantage\nBy rendering pages on the edge via Static Site Generation (SSG) or Incremental Static Regeneration (ISR), headless architectures can achieve sub-100ms Largest Contentful Paint (LCP) benchmarks.\n\n---\n\n## Common Technical SEO Hurdles in Decoupled Sites\n\n- **Client-Side Rendering (CSR) Traps:** Relying on client-side JS to inject meta tags often causes search bots to see blank shells.\n- **Sitemap Latency:** Failing to purge cache headers when new articles are published.`,
    contentHtml: `<h2>Why Technical Teams Shift to Headless CMS</h2><p>Decoupling the frontend presentation layer from content management gives engineering teams unparalleled control over caching, TTFB, and asset minification.</p><h3>The Core Web Vitals Advantage</h3><p>By rendering pages on the edge via Static Site Generation (SSG) or Incremental Static Regeneration (ISR), headless architectures can achieve sub-100ms Largest Contentful Paint (LCP) benchmarks.</p><hr/><h2>Common Technical SEO Hurdles in Decoupled Sites</h2><ul><li><strong>Client-Side Rendering (CSR) Traps:</strong> Relying on client-side JS to inject meta tags often causes search bots to see blank shells.</li><li><strong>Sitemap Latency:</strong> Failing to purge cache headers when new articles are published.</li></ul>`,
    faqs: [
      {
        question: 'Does Googlebot execute JavaScript reliably on headless sites?',
        answer: 'While Googlebot renders JavaScript, dynamic rendering can lead to delays in indexation. Server-side or static rendering remains the gold standard.'
      }
    ],
    relatedKeywords: ['next.js seo', 'static site generation', 'core web vitals headless', 'server side rendering seo'],
    imageAltText: 'Technical diagram of headless CMS decoupling backend data from edge CDN rendering',
    imagePrompt: 'Technical schematic of a headless CMS pipeline with edge CDN nodes, clean isometric blueprint style with electric blue accents',
    wordCount: 890,
    readingTime: 4,
    seoAudit: {
      overallScore: 91,
      passedChecks: 7,
      totalChecks: 8,
      items: [
        { id: 'kw_in_title', label: 'Keyword in H1 Title', passed: true, details: 'Present in H1.', importance: 'critical' },
        { id: 'meta_title_len', label: 'Meta Title Optimal Length', passed: true, details: '52 characters.', importance: 'critical' },
        { id: 'meta_desc_len', label: 'Meta Description Optimal Length', passed: true, details: '148 characters.', importance: 'critical' },
        { id: 'kw_density', label: 'Keyword Density Balance', passed: true, details: '1.2% healthy density.', importance: 'critical' },
        { id: 'heading_hierarchy', label: 'H2/H3 Structure & Subheadings', passed: true, details: '5 headings structured.', importance: 'recommended' },
        { id: 'faq_section', label: 'Structured FAQ Section', passed: true, details: '1 FAQ included (2 recommended).', importance: 'recommended' },
        { id: 'filler_check', label: 'AI Filler & Repetition Guard', passed: true, details: 'No AI filler detected.', importance: 'critical' },
        { id: 'word_count_check', label: 'Depth & Word Count', passed: true, details: '890 words.', importance: 'recommended' }
      ],
      keywordDensity: 1.2,
      readabilityScore: 66,
      readabilityGrade: 'College Level Technical',
      fillerDetection: {
        detected: false,
        score: 95,
        notes: 'Technical precision high'
      }
    },
    siteId: 'site-sandbox-1',
    publishStatus: 'scheduled',
    scheduledFor: new Date(Date.now() + 86400000 * 2).toISOString(),
    wpPostId: 102,
    wpPostUrl: 'https://sandbox.press/headless-cms-for-seo/',
    wpVerificationProof: {
      verifiedAt: new Date().toISOString(),
      httpStatus: 201,
      apiEndpoint: 'sandbox://techhub.wp-sandbox.internal/wp-json/wp/v2/posts',
      serverSignature: 'wp-auth-verified-102-1849102',
      wpResponseId: 102,
      wpResponseLink: 'https://sandbox.press/headless-cms-for-seo/'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-seed-1',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    siteId: 'site-sandbox-1',
    siteName: 'Staging Tech Hub (WP Sandbox)',
    articleTitle: 'Programmatic SEO Strategies: How to Scale High-Intent Search Traffic Safely',
    action: 'publish_post',
    httpStatus: 201,
    statusText: 'Created',
    success: true,
    responsePayloadExcerpt: '{"id":101,"status":"publish","slug":"programmatic-seo-strategies","link":"https://sandbox.press/seo-best-practices-2026/"}',
    requestUrl: 'sandbox://techhub.wp-sandbox.internal/wp-json/wp/v2/posts',
    latencyMs: 142
  },
  {
    id: 'aud-seed-2',
    timestamp: new Date().toISOString(),
    siteId: 'site-sandbox-1',
    siteName: 'Staging Tech Hub (WP Sandbox)',
    articleTitle: 'Headless CMS for SEO: Core Web Vitals, Rendering & Crawlability Benchmarks',
    action: 'schedule_post',
    httpStatus: 201,
    statusText: 'Created',
    success: true,
    responsePayloadExcerpt: '{"id":102,"status":"future","slug":"headless-cms-for-seo","link":"https://sandbox.press/headless-cms-for-seo/"}',
    requestUrl: 'sandbox://techhub.wp-sandbox.internal/wp-json/wp/v2/posts',
    latencyMs: 128
  }
];
