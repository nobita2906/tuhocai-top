import { marked } from 'marked';
import { slugifyVietnamese } from './slugify';
import { Post } from '@/types';

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface PreparedArticle {
  html: string;
  toc: TocItem[];
  readingMinutes: number;
  wordCount: number;
}

export function prepareArticleContent(content: string): PreparedArticle {
  if (!content) {
    return { html: '', toc: [], readingMinutes: 1, wordCount: 0 };
  }

  // Calculate word count and reading time
  const plainText = content.replace(/<[^>]+>/g, ' ').replace(/[#*_`~>-]/g, ' ').trim();
  const words = plainText ? plainText.split(/\s+/).length : 0;
  const readingMinutes = Math.max(1, Math.ceil(words / 220));

  // Determine if content is Markdown or pure HTML
  // If content has markdown markers (headings, code blocks, tables, bold, lists), always parse with marked
  const hasMarkdownMarkers = /(?:^|\n)(?:#{1,6}\s|```|\|[\s\S]*\||[\*\-]\s|\d+\.\s)/.test(content);
  const isPureHtml = !hasMarkdownMarkers && /^\s*<(?:!DOCTYPE|html|div|p|article|main|section|h[1-6])/i.test(content.trim());
  const rawHtml = isPureHtml ? content : (marked.parse(content, { breaks: true, gfm: true }) as string);

  // Extract headings (H2, H3) and inject anchor IDs for Table of Contents
  const toc: TocItem[] = [];
  const idCounts: Record<string, number> = {};

  const decodeHtmlEntities = (str: string) => {
    return str
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec));
  };

  const processedHtml = rawHtml.replace(/<h([23])(.*?)>(.*?)<\/h\1>/gi, (match, levelStr, attrs, innerText) => {
    const level = parseInt(levelStr, 10);
    const cleanText = decodeHtmlEntities(innerText.replace(/<[^>]+>/g, '').trim());
    if (!cleanText) return match;

    let baseId = slugifyVietnamese(cleanText);
    if (!baseId) baseId = `muc-${toc.length + 1}`;

    // Ensure unique ID
    if (idCounts[baseId]) {
      idCounts[baseId]++;
      baseId = `${baseId}-${idCounts[baseId]}`;
    } else {
      idCounts[baseId] = 1;
    }

    toc.push({ id: baseId, text: cleanText, level });

    // Preserve any existing classes or attributes, add id and scroll margin
    return `<h${level} id="${baseId}" class="scroll-mt-24 group relative ${level === 2 ? 'text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-10 mb-4 border-b border-slate-200 dark:border-slate-800 pb-3 tracking-tight' : 'text-xl sm:text-2xl font-bold text-indigo-700 dark:text-indigo-300 mt-8 mb-3 tracking-tight'}"><span class="text-indigo-500 mr-2 text-base select-none">#</span>${innerText}</h${level}>`;
  });

  // Wrap code blocks with Mac-style header & quick copy button
  let codeBlockCounter = 0;
  const finalHtml = processedHtml.replace(/<pre(?:\s+[^>]*)?><code(.*?)>([\s\S]*?)<\/code><\/pre>/gi, (match, codeAttrs, codeContent) => {
    codeBlockCounter++;
    const codeId = `code-block-${codeBlockCounter}`;

    // Detect language or label
    let langLabel = 'PROMPT / CODE';
    const langMatch = (codeAttrs || '').match(/class="(?:[^"]*\s)?language-([a-zA-Z0-9_-]+)/i);
    if (langMatch) {
      const rawLang = langMatch[1].toLowerCase();
      if (['text', 'prompt', 'txt', 'plaintext'].includes(rawLang)) {
        langLabel = 'PROMPT';
      } else if (['bash', 'sh', 'shell', 'zsh', 'terminal', 'powershell', 'cmd'].includes(rawLang)) {
        langLabel = 'TERMINAL / BASH';
      } else if (['python', 'py'].includes(rawLang)) {
        langLabel = 'PYTHON';
      } else if (['javascript', 'js'].includes(rawLang)) {
        langLabel = 'JAVASCRIPT';
      } else if (['typescript', 'ts'].includes(rawLang)) {
        langLabel = 'TYPESCRIPT';
      } else if (['json', 'html', 'css', 'sql', 'yaml', 'yml'].includes(rawLang)) {
        langLabel = rawLang.toUpperCase();
      } else {
        langLabel = rawLang.toUpperCase();
      }
    }

    return `<div class="code-block-container relative group my-6 rounded-2xl overflow-hidden border border-slate-700/60 bg-[#09090f] shadow-xl">
  <div class="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs font-mono text-slate-400 select-none">
    <div class="flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
      <span class="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
      <span class="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
      <span class="ml-1 text-[11px] font-bold text-slate-300 uppercase tracking-wider">${langLabel}</span>
    </div>
    <button type="button" class="copy-code-btn inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600 active:scale-95 text-slate-300 hover:text-white transition-all text-xs font-semibold cursor-pointer border border-slate-700 hover:border-indigo-500 shadow-sm" data-code-id="${codeId}" title="Sao chép câu lệnh">
      <svg class="copy-icon w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
      <svg class="check-icon w-3.5 h-3.5 hidden text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      <span class="btn-text">Sao chép</span>
    </button>
  </div>
  <pre class="m-0! p-4! border-0! rounded-none! overflow-x-auto bg-[#09090f]!"><code${codeAttrs || ''}>${codeContent}</code></pre>
</div>`;
  });

  return {
    html: finalHtml,
    toc,
    readingMinutes,
    wordCount: words,
  };
}

export function generateArticleSchema(post: Post, siteUrl: string = 'https://www.tuhocai.top') {
  const postUrl = `${siteUrl}/bai-viet/${post.slug}`;
  const defaultThumbnail = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
  const imageUrl = post.thumbnail && post.thumbnail.startsWith('http') ? post.thumbnail : defaultThumbnail;
  const keywords = post.tags ? post.tags.split(',').map((t) => t.trim()).filter(Boolean) : ['AI', 'Tự Học AI', 'Công Nghệ'];

  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    headline: post.title,
    description: post.summary || post.title,
    image: [imageUrl],
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    author: {
      '@type': 'Person',
      name: 'Nguyễn Văn Đăng',
      jobTitle: 'AI Solution Architect & Founder',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Tự Học AI',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/favicon.ico`,
      },
    },
    keywords: keywords.join(', '),
    articleSection: post.category,
    inLanguage: 'vi-VN',
  };
}
