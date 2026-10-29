import { query } from './db';
import { getSiteSettings } from './settings';

import {
  TelegramChannel,
  TelegramTemplates,
  DEFAULT_TELEGRAM_TEMPLATES,
} from '@/types/telegram';

export type { TelegramChannel, TelegramTemplates };
export { DEFAULT_TELEGRAM_TEMPLATES };

export async function getTelegramConfig() {
  const settings = await getSiteSettings();
  let channels: TelegramChannel[] = [];
  let templates: TelegramTemplates = { ...DEFAULT_TELEGRAM_TEMPLATES };

  try {
    const rows = await query<any>('SELECT skey, svalue FROM site_settings WHERE skey IN (?, ?)', [
      'telegram_channels',
      'telegram_templates',
    ]);
    for (const r of rows) {
      if (r.skey === 'telegram_channels' && r.svalue) {
        channels = JSON.parse(r.svalue);
      }
      if (r.skey === 'telegram_templates' && r.svalue) {
        templates = { ...templates, ...JSON.parse(r.svalue) };
      }
    }
  } catch (e) {
    console.error('Error loading telegram config:', e);
  }

  // Nếu chưa có channel nào được lưu thì khởi tạo channel mặc định từ siteSettings / env
  if (channels.length === 0) {
    const defaultChatId = settings.telegram_chat_id || process.env.TELEGRAM_CHAT_ID || '6580812076';
    channels = [
      {
        id: 'chan-default-admin',
        name: 'Admin Duyệt Đơn (Cá nhân)',
        chatId: defaultChatId,
        type: 'ALL',
        enabled: true,
      },
    ];
  }

  const botToken = settings.telegram_bot_token || process.env.TELEGRAM_BOT_TOKEN || '8781006384:AAHDfcnSsIiwDpycoY9G-fd7ug5-Ne2Oq0Y';

  return { botToken, channels, templates };
}

export function renderTelegramTemplate(
  template: string,
  variables: Record<string, string | number | undefined | null>
): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{${key}}`;
    result = result.replaceAll(placeholder, String(value ?? ''));
  }
  return result;
}

export async function broadcastTelegramMessage(options: {
  type: 'order_created' | 'order_approved' | 'manual_review' | 'unmatched_payment';
  variables: Record<string, any>;
  replyMarkup?: any;
}) {
  try {
    const { botToken, channels, templates } = await getTelegramConfig();
    if (!botToken) return;

    const rawTemplate = templates[options.type] || DEFAULT_TELEGRAM_TEMPLATES[options.type] || '';
    const messageText = renderTelegramTemplate(rawTemplate, options.variables);

    const activeChannels = channels.filter((c) => {
      if (!c.enabled || !c.chatId) return false;
      if (c.type === 'ALL') return true;
      if (options.type === 'manual_review') return c.type === 'MANUAL_REVIEW_ONLY';
      if (options.type === 'order_approved') return c.type === 'SUCCESS_ONLY';
      if (options.type === 'order_created') return c.type === 'ORDERS_ONLY';
      return true;
    });

    for (const chan of activeChannels) {
      try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chan.chatId,
            text: messageText,
            parse_mode: 'Markdown',
            reply_markup: options.replyMarkup,
          }),
        });
      } catch (err) {
        console.error(`Lỗi gửi tin nhắn telegram tới kênh ${chan.name} (${chan.chatId}):`, err);
      }
    }
  } catch (err) {
    console.error('Lỗi broadcast Telegram:', err);
  }
}
