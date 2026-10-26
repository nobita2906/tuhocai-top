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

  // Determine if content is Markdown or HTML
  // If it doesn't look like rich HTML (<p>, <div>, etc.), parse with marked
  const isHtml = /<[a-z][\s\S]*>/i.test(content) && !content.trim().startsWith('#');
  let rawHtml = isHtml ? content : (marked.parse(content, { breaks: true, gfm: true }) as string);

  // Extract headings (H2, H3) and inject anchor IDs for Table of Contents
  const toc: TocItem[] = [];
  const idCounts: Record<string, number> = {};

  const processedHtml = rawHtml.replace(/<h([23])(.*?)>(.*?)<\/h\1>/gi, (match, levelStr, attrs, innerText) => {
    const level = parseInt(levelStr, 10);
    const cleanText = innerText.replace(/<[^>]+>/g, '').trim();
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

  return {
    html: processedHtml,
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
