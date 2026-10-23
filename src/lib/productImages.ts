export function getProductCover(product: {
  pid?: string;
  slug?: string;
  category?: string;
  thumbnail?: string | null;
}): string {
  if (product.thumbnail && product.thumbnail.trim() !== '') {
    return product.thumbnail;
  }

  const pidMap: Record<string, string> = {
    'WF-THAI-099': '/images/n8n-workflow-demo.jpg',
    'WF-N8N-001': '/images/products/wf-facebook.svg',
    'SKILL-GPT-001': '/images/products/skill-chatgpt.svg',
    'SKILL-CODEX-001': '/images/products/skill-codex.svg',
    'PROMPT-IMG-001': '/images/flux-prompt-bundle.jpg',
    'WF-FLOW-001': '/images/products/wf-google-sheets.svg',
    'WF-N8N-002': '/images/products/wf-email.svg',
    'SKILL-CLAUDE-001': '/images/products/skill-claude.svg',
    'PROMPT-VIDEO-001': '/images/products/prompt-tiktok.svg',
    'SKILL-GEMINI-001': '/images/products/skill-gemini.svg',
  };

  if (product.pid && pidMap[product.pid]) {
    return pidMap[product.pid];
  }

  // Fallback by slug
  const slug = product.slug?.toLowerCase() || '';
  if (slug.includes('facebook')) return '/images/products/wf-facebook.svg';
  if (slug.includes('chatgpt')) return '/images/products/skill-chatgpt.svg';
  if (slug.includes('codex')) return '/images/products/skill-codex.svg';
  if (slug.includes('sheets')) return '/images/products/wf-google-sheets.svg';
  if (slug.includes('email')) return '/images/products/wf-email.svg';
  if (slug.includes('claude')) return '/images/products/skill-claude.svg';
  if (slug.includes('tiktok') || slug.includes('video')) return '/images/products/prompt-tiktok.svg';
  if (slug.includes('gemini')) return '/images/products/skill-gemini.svg';

  // Fallback by category
  const cat = product.category?.toLowerCase() || '';
  if (cat.includes('workflow')) return '/images/n8n-workflow-demo.jpg';
  if (cat.includes('prompt')) return '/images/flux-prompt-bundle.jpg';
  return '/images/products/skill-chatgpt.svg';
}
