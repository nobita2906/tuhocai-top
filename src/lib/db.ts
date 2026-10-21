import mysql from 'mysql2/promise';

declare global {
  var _mysqlPool: mysql.Pool | undefined;
}

const databaseUrl = process.env.DATABASE_URL || 'mysql://postgress_user:Nvdang%401@103.127.195.56:3306/tuhocai_top';

const pool = global._mysqlPool || mysql.createPool({
  uri: databaseUrl,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

if (process.env.NODE_ENV !== 'production') {
  global._mysqlPool = pool;
}

export default pool;

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const [rows] = await pool.query(sql, params);
  return rows as T[];
}

export async function execute(sql: string, params: any[] = []) {
  const [result] = await pool.execute(sql, params);
  return result as any;
}
