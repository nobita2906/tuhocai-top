'use client';

import React from 'react';

interface ArticleBodyProps {
  html: string;
}

export default function ArticleBody({ html }: ArticleBodyProps) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const btn = target.closest<HTMLButtonElement>('.copy-code-btn');
    if (!btn) return;

    const container = btn.closest('.code-block-container');
    const code = container?.querySelector('code');
    if (!code) return;

    const textToCopy = code.innerText || code.textContent || '';
    if (!textToCopy) return;

    // Clipboard copy with robust fallback
    const doCopy = async () => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(textToCopy.trim());
          return;
        }
      } catch (_) {
        // Fallback to execCommand if clipboard API fails (e.g. document not focused)
      }

      const textArea = document.createElement('textarea');
      textArea.value = textToCopy.trim();
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        const successful = document.execCommand('copy');
        if (!successful) {
          console.warn('execCommand copy unconfirmed');
        }
      } finally {
        textArea.remove();
      }
    };

    doCopy()
      .then(() => {
        const textSpan = btn.querySelector('.btn-text');
        const copyIcon = btn.querySelector('.copy-icon');
        const checkIcon = btn.querySelector('.check-icon');

        if (textSpan) textSpan.textContent = 'Đã sao chép!';
        if (copyIcon) copyIcon.classList.add('hidden');
        if (checkIcon) checkIcon.classList.remove('hidden');
        btn.classList.add('!bg-emerald-600', '!text-white', '!border-emerald-500');

        setTimeout(() => {
          if (textSpan) textSpan.textContent = 'Sao chép';
          if (copyIcon) copyIcon.classList.remove('hidden');
          if (checkIcon) checkIcon.classList.add('hidden');
          btn.classList.remove('!bg-emerald-600', '!text-white', '!border-emerald-500');
        }, 2200);
      })
      .catch((err) => {
        console.error('Lỗi khi sao chép:', err);
      });
  };

  return (
    <div
      className="markdown-body max-w-none text-base sm:text-lg leading-relaxed space-y-6 pt-2"
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
