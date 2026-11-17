import { query, execute } from './db';
import { getCurrentUser } from './auth';

let auditTableChecked = false;

export async function ensureAuditTable() {
  if (auditTableChecked) return;
  try {
    await execute(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36),
        user_name VARCHAR(100),
        user_email VARCHAR(150),
        user_role VARCHAR(20) DEFAULT 'ADMIN',
        action VARCHAR(50) NOT NULL,
        target_type VARCHAR(50) NOT NULL,
        target_id VARCHAR(100),
        details TEXT,
        ip_address VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    auditTableChecked = true;
  } catch (err) {
    console.error('Failed to ensure audit_logs table:', err);
  }
}

export interface AuditLogEntry {
  id: string;
  user_id: string | null;
  user_name: string | null;
  user_email: string | null;
  user_role: string | null;
  action: string;
  target_type: string;
  target_id: string | null;
  details: string | null;
  ip_address: string | null;
  created_at: string;
}

export async function logAudit({
  action,
  targetType,
  targetId = null,
  details = null,
  req = null,
}: {
  action: string;
  targetType: string;
  targetId?: string | null;
  details?: string | object | null;
  req?: Request | null;
}) {
  try {
    await ensureAuditTable();

    const currentUser = await getCurrentUser();
    let ipAddress: string | null = null;

    if (req) {
      const forwarded = req.headers.get('x-forwarded-for');
      ipAddress = forwarded ? forwarded.split(',')[0].trim() : req.headers.get('x-real-ip');
    }

    const detailsStr = typeof details === 'object' && details !== null ? JSON.stringify(details) : details;
    const logId = 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    await execute(
      `INSERT INTO audit_logs (id, user_id, user_name, user_email, user_role, action, target_type, target_id, details, ip_address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        logId,
        currentUser?.id || null,
        currentUser?.name || 'Hệ thống',
        currentUser?.email || 'system@tuhocai.top',
        currentUser?.role || 'ADMIN',
        action,
        targetType,
        targetId,
        detailsStr,
        ipAddress,
      ]
    );
  } catch (err) {
    console.error('Error logging audit entry:', err);
  }
}

export async function getAuditLogs(limit = 50, offset = 0): Promise<AuditLogEntry[]> {
  await ensureAuditTable();
  try {
    const logs = await query<AuditLogEntry>(
      'SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return logs;
  } catch (err) {
    console.error('Error fetching audit logs:', err);
    return [];
  }
}

