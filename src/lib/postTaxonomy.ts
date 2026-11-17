export interface PostCategoryDef {
  value: string;
  label: string;
  desc: string;
  badgeColor: string;
}

export const POST_CATEGORIES: PostCategoryDef[] = [
  {
    value: 'NEWS',
    label: 'Bản Tin AI & Xu Hướng (Tech News)',
    desc: 'Tin vắn công nghệ, mô hình mới (Claude 3.7, GPT, Midjourney, Kling AI)',
    badgeColor: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-300 border-cyan-300 dark:border-cyan-500/30',
  },
  {
    value: 'TUTORIAL',
    label: 'Hướng Dẫn Thực Chiến (Playbooks & Tutorials)',
    desc: 'Bài viết hướng dẫn từng bước, quy trình làm video AI, giải pháp cầm tay chỉ việc',
    badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300 border-purple-300 dark:border-purple-500/30',
  },
  {
    value: 'WORKFLOW',
    label: 'Quy Trình & Workflow n8n',
    desc: 'Tự động hóa bán hàng, đăng bài đa kênh, webhook, khớp đơn VietQR',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30',
  },
  {
    value: 'PROMPT',
    label: 'Mã Lệnh & Kỹ Thuật Prompt',
    desc: 'Công thức prompt thương mại FLUX, Midjourney, ChatGPT, Claude',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border-amber-300 dark:border-amber-500/30',
  },
  {
    value: 'SKILL',
    label: 'Kỹ Năng & AI Agent Coding',
    desc: 'Subagent, Cursor, Claude Code, Antigravity, MCP Server',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300 border-blue-300 dark:border-blue-500/30',
  },
];

export interface TagGroup {
  groupName: string;
  tags: string[];
}

export const PRESET_TAG_GROUPS: TagGroup[] = [
  {
    groupName: 'Nền tảng & Công cụ AI',
    tags: [
      'n8n',
      'Claude 3.7',
      'ChatGPT',
      'FLUX',
      'Midjourney',
      'Kling AI',
      'Hedra',
      'ElevenLabs',
      'Cursor',
      'Antigravity',
      'SePay',
      'Telegram Bot',
    ],
  },
  {
    groupName: 'Nghiệp vụ & Mục tiêu',
    tags: [
      'Làm Video AI',
      'TikTok & Reels',
      'Tự Động Hóa',
      'Đăng Bài Đa Kênh',
      'Khớp Đơn VietQR',
      'Prompt Thương Mại',
      'Kiếm Tiền AI',
      'No-Code',
      'SEO Kỹ Thuật',
    ],
  },
  {
    groupName: 'Cấp độ & Đối tượng',
    tags: ['Người Mới Bắt Đầu', 'Thực Chiến 1-Chạm', 'Doanh Nghiệp SME', 'Agentic Coding'],
  },
];

