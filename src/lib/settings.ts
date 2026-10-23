import { query, execute } from './db';

export interface SiteSettings {
  bank_id: string;
  account_no: string;
  account_name: string;
  hotline: string;
  zalo_group_url: string;
  support_email: string;
  telegram_bot_token: string;
  telegram_chat_id: string;
  banner_enabled: boolean;
  banner_text: string;
  banner_url: string;
  gemini_api_key?: string;
  openai_api_key?: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  bank_id: 'VPB',
  account_no: '0934434101',
  account_name: 'NGUYEN VAN DANG',
  hotline: '0934.434.101',
  zalo_group_url: 'https://zalo.me/g/tuhocai',
  support_email: 'dang@tuhocai.top',
  telegram_bot_token: process.env.TELEGRAM_BOT_TOKEN || '8781006384:AAHDfcnSsIiwDpycoY9G-fd7ug5-Ne2Oq0Y',
  telegram_chat_id: process.env.TELEGRAM_CHAT_ID || '6580812076',
  banner_enabled: false,
  banner_text: '🔥 Ưu đãi đặc biệt: Giảm 50% trọn bộ Prompt & Workflow AI Automation!',
  banner_url: '/san-pham',
  gemini_api_key: process.env.GEMINI_API_KEY || '',
  openai_api_key: process.env.OPENAI_API_KEY || '',
};

let tableChecked = false;

async function ensureTable() {
  if (tableChecked) return;
  try {
    await execute(`
      CREATE TABLE IF NOT EXISTS site_settings (
        skey VARCHAR(100) PRIMARY KEY,
        svalue TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    tableChecked = true;
  } catch (err) {
    console.error('Failed to ensure site_settings table:', err);
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  await ensureTable();

  try {
    const rows = await query<{ skey: string; svalue: string }>(
      'SELECT skey, svalue FROM site_settings'
    );

    const map: Record<string, string> = {};
    for (const row of rows) {
      map[row.skey] = row.svalue;
    }

    return {
      bank_id: map.bank_id || DEFAULT_SETTINGS.bank_id,
      account_no: map.account_no || DEFAULT_SETTINGS.account_no,
      account_name: map.account_name || DEFAULT_SETTINGS.account_name,
      hotline: map.hotline || DEFAULT_SETTINGS.hotline,
      zalo_group_url: map.zalo_group_url || DEFAULT_SETTINGS.zalo_group_url,
      support_email: map.support_email || DEFAULT_SETTINGS.support_email,
      telegram_bot_token: map.telegram_bot_token || DEFAULT_SETTINGS.telegram_bot_token,
      telegram_chat_id: map.telegram_chat_id || DEFAULT_SETTINGS.telegram_chat_id,
      banner_enabled: map.banner_enabled !== undefined ? map.banner_enabled === 'true' || map.banner_enabled === '1' : DEFAULT_SETTINGS.banner_enabled,
      banner_text: map.banner_text || DEFAULT_SETTINGS.banner_text,
      banner_url: map.banner_url || DEFAULT_SETTINGS.banner_url,
      gemini_api_key: map.gemini_api_key || DEFAULT_SETTINGS.gemini_api_key || '',
      openai_api_key: map.openai_api_key || DEFAULT_SETTINGS.openai_api_key || '',
    };
  } catch (err) {
    console.error('Error reading site_settings:', err);
    return { ...DEFAULT_SETTINGS };
  }
}

export async function saveSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  await ensureTable();

  for (const [key, val] of Object.entries(settings)) {
    if (val === undefined) continue;
    const stringVal = typeof val === 'boolean' ? (val ? 'true' : 'false') : String(val);
    await execute(
      `INSERT INTO site_settings (skey, svalue) 
       VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE svalue = VALUES(svalue)`,
      [key, stringVal]
    );
  }
}
