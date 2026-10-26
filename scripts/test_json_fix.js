// Test robust LLM JSON parsing
function robustParseLLMJson(rawText) {
  // 1. Strip markdown code fences
  let clean = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').replace(/```/g, '').trim();

  // 2. Try standard JSON.parse
  try {
    return JSON.parse(clean);
  } catch (err1) {
    // 3. Fix unescaped control characters inside string values
    // In JSON strings, unescaped newlines/tabs (ASCII 0-31) cause "Bad control character"
    try {
      // Escape raw control characters (newline, carriage return, tab) that are inside quotes
      // A robust approach: replace literal \n and \r with escaped \\n and \\r
      const sanitized = clean.replace(/[\u0000-\u001F]+/g, (match) => {
        if (match === '\n') return '\\n';
        if (match === '\r') return '\\r';
        if (match === '\t') return '\\t';
        return '';
      });
      return JSON.parse(sanitized);
    } catch (err2) {
      // 4. Fallback: Regex extraction of keys: title, summary, category, tags, content
      const titleMatch = clean.match(/"title"\s*:\s*"((?:\\.|[^"\\])*)"/s);
      const summaryMatch = clean.match(/"summary"\s*:\s*"((?:\\.|[^"\\])*)"/s);
      const categoryMatch = clean.match(/"category"\s*:\s*"((?:\\.|[^"\\])*)"/s);
      const tagsMatch = clean.match(/"tags"\s*:\s*"((?:\\.|[^"\\])*)"/s);

      // For content: extract everything between "content": " and the final "}
      let content = '';
      const contentRegex = /"content"\s*:\s*"([\s\S]*)/i;
      const match = clean.match(contentRegex);
      if (match) {
        let remainder = match[1];
        // Strip trailing quote and curly brace if present
        remainder = remainder.replace(/"\s*}\s*$/i, '');
        content = remainder.replace(/\\n/g, '\n').replace(/\\r/g, '').replace(/\\"/g, '"');
      }

      if (titleMatch || content) {
        const rawTitle = titleMatch ? titleMatch[1].replace(/\\"/g, '"') : 'Bài viết mới từ Tự Học AI';
        const rawSummary = summaryMatch ? summaryMatch[1].replace(/\\"/g, '"') : '';
        return {
          title: rawTitle,
          summary: rawSummary,
          category: categoryMatch ? categoryMatch[1] : 'WORKFLOW',
          tags: tagsMatch ? tagsMatch[1] : 'n8n, Tu Dong Hoa, AI, tuhocai',
          content: content || 'Nội dung đang cập nhật'
        };
      }
      throw err1;
    }
  }
}

// Test with simulated bad control characters
const sample = `{\n  "title": "Phim AI Odyssey",\n  "summary": "Phan tich",\n  "category": "WORKFLOW",\n  "tags": "AI",\n  "content": "Line 1\nLine 2\nLine 3"\n}`;
const result = robustParseLLMJson(sample);
console.log('Parsed successfully:', result.title, 'Content lines:', result.content.split('\n').length);
