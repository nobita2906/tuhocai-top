/**
 * Notion Content & Export Parser
 * Hỗ trợ bóc tách tệp .md xuất từ Notion hoặc nội dung sao chép từ Notion
 */

export interface ParsedNotionDoc {
  title: string;
  icon: string;
  category: string;
  tags: string;
  drive_url: string;
  content: string;
}

/**
 * Chuyển đổi mã HTML sao chép từ Notion sang định dạng Markdown chuẩn
 */
export function convertNotionHtmlToMarkdown(htmlString: string): string {
  if (typeof window === 'undefined') return htmlString;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    // Chuyển đổi các thẻ cơ bản
    function walk(node: Node): string {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent || '';
      }

      if (node.nodeType !== Node.ELEMENT_NODE) {
        return '';
      }

      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();
      let childrenText = Array.from(el.childNodes).map(walk).join('');

      switch (tag) {
        case 'h1':
          return `\n\n# ${childrenText.trim()}\n\n`;
        case 'h2':
          return `\n\n## ${childrenText.trim()}\n\n`;
        case 'h3':
          return `\n\n### ${childrenText.trim()}\n\n`;
        case 'h4':
          return `\n\n#### ${childrenText.trim()}\n\n`;
        case 'p':
        case 'div':
          // Kiểm tra xem có phải callout Notion không
          if (el.classList.contains('notion-callout-block') || el.style.backgroundColor) {
            return `\n\n> 💡 ${childrenText.trim()}\n\n`;
          }
          return `\n\n${childrenText.trim()}\n\n`;
        case 'strong':
        case 'b':
          return `**${childrenText.trim()}**`;
        case 'em':
        case 'i':
          return `*${childrenText.trim()}*`;
        case 's':
        case 'del':
        case 'strike':
          return `~~${childrenText.trim()}~~`;
        case 'code':
          return `\`${childrenText}\``;
        case 'pre':
          return `\n\n\`\`\`\n${childrenText.trim()}\n\`\`\`\n\n`;
        case 'blockquote':
          return `\n\n> ${childrenText.trim().replace(/\n/g, '\n> ')}\n\n`;
        case 'ul':
          return `\n\n${childrenText}\n\n`;
        case 'ol':
          return `\n\n${childrenText}\n\n`;
        case 'li': {
          // Kiểm tra checkbox của to-do list Notion
          const checkbox = el.querySelector('input[type="checkbox"]');
          if (checkbox) {
            const isChecked = (checkbox as HTMLInputElement).checked;
            const text = childrenText.replace(/^[\s\u200B]+/, '');
            return `- [${isChecked ? 'x' : ' '}] ${text}\n`;
          }
          return `- ${childrenText.trim()}\n`;
        }
        case 'a': {
          const href = el.getAttribute('href') || '';
          return `[${childrenText.trim()}](${href})`;
        }
        case 'hr':
          return `\n\n---\n\n`;
        case 'br':
          return `\n`;
        case 'table':
          return `\n\n${childrenText}\n\n`;
        case 'tr': {
          const cells = Array.from(el.querySelectorAll('th, td')).map((c) =>
            (c.textContent || '').trim().replace(/\|/g, '\\|')
          );
          if (cells.length === 0) return '';
          return `| ${cells.join(' | ')} |\n`;
        }
        default:
          return childrenText;
      }
    }

    let markdown = walk(doc.body);

    // Chuẩn hóa khoảng trống và xuống dòng liên tiếp
    markdown = markdown
      .replace(/\n{3,}/g, '\n\n')
      .replace(/&nbsp;/g, ' ')
      .trim();

    return markdown;
  } catch (err) {
    console.error('Lỗi khi convert HTML Notion:', err);
    return htmlString;
  }
}

/**
 * Phân tích chuỗi Markdown xuất từ Notion hoặc sao chép từ Notion
 */
export function parseNotionContent(rawText: string, fileName?: string): ParsedNotionDoc {
  let text = (rawText || '').trim();
  let title = '';
  let icon = '📘';
  let driveUrl = '';
  let tags = '';
  let category = 'QUY_TRINH';

  // 1. Tự động tìm Google Drive link bất kỳ trong văn bản
  const driveRegex = /https:\/\/(?:drive|docs)\.google\.com\/[^\s\)\]\"'<>]+/i;
  const driveMatch = text.match(driveRegex);
  if (driveMatch) {
    driveUrl = driveMatch[0].trim();
  }

  // 2. Tách tên file nếu có (ví dụ: "Huong dan n8n 8f729b12d3...md" -> "Huong dan n8n")
  if (fileName) {
    let cleanName = fileName.replace(/\.md$/i, '').trim();
    // Xóa UUID hash Notion hay gắn vào đuôi file xuất: e.g. " 32charhex"
    cleanName = cleanName.replace(/\s+[a-f0-9]{32}$/i, '');
    if (cleanName) {
      title = cleanName;
    }
  }

  // 3. Phân tích từng dòng của văn bản
  const lines = text.split('\n');
  const remainingLines: string[] = [];
  let foundTitle = Boolean(title);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Tìm tiêu đề # Title nếu chưa có
    if (!foundTitle && (trimmed.startsWith('# ') || (!trimmed.startsWith('#') && trimmed.length > 0 && i === 0))) {
      let rawTitle = trimmed.replace(/^#\s*/, '').trim();
      // Bóc tách emoji ở đầu tiêu đề nếu có (ví dụ: "⚡ Quy trình n8n" -> icon = ⚡)
      const emojiMatch = rawTitle.match(/^([\p{Extended_Pictographic}\u200d\uFE0F]+)\s*(.*)$/u);
      if (emojiMatch) {
        icon = emojiMatch[1];
        rawTitle = emojiMatch[2] || rawTitle;
      }
      title = rawTitle.trim();
      foundTitle = true;
      continue;
    }

    // Bóc tách thuộc tính Notion Export
    const tagMatch = trimmed.match(/^(?:Tags|Thẻ|Chủ đề|Keywords):\s*(.*)$/i);
    if (tagMatch) {
      tags = tagMatch[1].replace(/\[|\]/g, '').trim();
      continue;
    }

    const catMatch = trimmed.match(/^(?:Category|Chuyên mục|Loại):\s*(.*)$/i);
    if (catMatch) {
      const val = catMatch[1].toUpperCase();
      if (val.includes('DRIVE') || val.includes('LINK')) category = 'DRIVE_LINKS';
      else if (val.includes('SOP') || val.includes('QUY TRINH') || val.includes('QUY_TRINH')) category = 'QUY_TRINH';
      else if (val.includes('KHOA HOC') || val.includes('VIDEO')) category = 'KHOA_HOC';
      else if (val.includes('NOTE') || val.includes('GHI CHU')) category = 'GHI_CHU';
      else if (val.includes('ACCOUNT') || val.includes('TAI KHOAN') || val.includes('TOOL')) category = 'TAI_KHOAN';
      continue;
    }

    const urlMatch = trimmed.match(/^(?:URL|Link|Drive URL|Google Drive):\s*(https?:\/\/[^\s]+)$/i);
    if (urlMatch && !driveUrl) {
      driveUrl = urlMatch[1].trim();
      continue;
    }

    // Bỏ qua các dòng siêu dữ liệu ngày tháng Notion tự sinh
    if (/^(?:Created|Date|Thời gian|Created time|Last edited time|Author|Tác giả):\s*.*$/i.test(trimmed)) {
      continue;
    }

    remainingLines.push(line);
  }

  // Nếu tiêu đề vẫn có emoji ở đầu
  if (title) {
    const emojiMatch = title.match(/^([\p{Extended_Pictographic}\u200d\uFE0F]+)\s*(.*)$/u);
    if (emojiMatch) {
      icon = emojiMatch[1];
      title = emojiMatch[2] || title;
    }
  }

  // Tự động phân loại danh mục thông minh
  const fullContentSample = (title + ' ' + tags + ' ' + text).toLowerCase();
  if (category === 'QUY_TRINH') {
    if (
      driveUrl &&
      (fullContentSample.includes('drive') ||
        fullContentSample.includes('tổng hợp') ||
        fullContentSample.includes('master') ||
        fullContentSample.includes('kho file') ||
        fullContentSample.includes('thư mục'))
    ) {
      category = 'DRIVE_LINKS';
      if (icon === '📘') icon = '📂';
    } else if (
      fullContentSample.includes('khóa học') ||
      fullContentSample.includes('video') ||
      fullContentSample.includes('bài giảng') ||
      fullContentSample.includes('hướng dẫn cài')
    ) {
      category = 'KHOA_HOC';
      if (icon === '📘') icon = '🎓';
    } else if (
      fullContentSample.includes('tài khoản') ||
      fullContentSample.includes('api key') ||
      fullContentSample.includes('cấu hình') ||
      fullContentSample.includes('vps') ||
      fullContentSample.includes('token')
    ) {
      category = 'TAI_KHOAN';
      if (icon === '📘') icon = '🔐';
    } else if (fullContentSample.includes('ghi chú') || fullContentSample.includes('ý tưởng') || fullContentSample.includes('note')) {
      category = 'GHI_CHU';
      if (icon === '📘') icon = '💡';
    } else {
      if (icon === '📘') icon = '⚡';
    }
  }

  return {
    title: title || 'Tài liệu không tên từ Notion',
    icon: icon || '📘',
    category,
    tags: tags || 'Notion, Import',
    drive_url: driveUrl,
    content: remainingLines.join('\n').trim(),
  };
}
