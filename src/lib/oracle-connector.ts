/**
 * Oracle Database Connector
 * Handles real-time connection to Oracle DB for live data sync
 */

export interface OracleConfig {
  user: string;
  password: string;
  connectString: string; // host:port/service_name
  poolMin?: number;
  poolMax?: number;
  poolIncrement?: number;
}

export interface QueryResult<T = Record<string, unknown>> {
  rows: T[];
  metadata: { name: string; dbType: number }[];
  rowCount: number;
  executionTime: number;
}

export interface TableSchema {
  tableName: string;
  columns: {
    name: string;
    type: string;
    nullable: boolean;
    isPrimaryKey: boolean;
  }[];
  rowCount: number;
}

export interface ConnectionStatus {
  connected: boolean;
  poolSize: number;
  activeConnections: number;
  lastSync: Date | null;
  error?: string;
}

// Simulated connection for frontend preview
// In production, this would use node-oracledb
let mockConnectionStatus: ConnectionStatus = {
  connected: false,
  poolSize: 0,
  activeConnections: 0,
  lastSync: null,
};

/**
 * Initialize Oracle connection pool
 */
export async function initializeConnection(config: OracleConfig): Promise<ConnectionStatus> {
  // In production, use:
  // const oracledb = require('oracledb');
  // const pool = await oracledb.createPool(config);
  
  console.log('Initializing Oracle connection to:', config.connectString);
  
  // Simulate connection delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  mockConnectionStatus = {
    connected: true,
    poolSize: config.poolMax || 10,
    activeConnections: 1,
    lastSync: new Date(),
  };
  
  return mockConnectionStatus;
}

/**
 * Execute a SQL query
 */
export async function executeQuery<T = Record<string, unknown>>(
  sql: string,
  params: Record<string, unknown> = {}
): Promise<QueryResult<T>> {
  const startTime = Date.now();
  
  // In production, use:
  // const connection = await pool.getConnection();
  // const result = await connection.execute(sql, params);
  // await connection.close();
  
  console.log('Executing query:', sql);
  
  // Simulate query delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data based on query pattern
  const mockData = generateMockQueryResult(sql);
  
  return {
    rows: mockData as T[],
    metadata: [],
    rowCount: mockData.length,
    executionTime: Date.now() - startTime,
  };
}

/**
 * Get database schema information
 */
export async function getTableSchema(tableName: string): Promise<TableSchema> {
  // In production, query Oracle data dictionary
  const schemaQuery = `
    SELECT column_name, data_type, nullable, 
           CASE WHEN constraint_type = 'P' THEN 1 ELSE 0 END as is_pk
    FROM user_tab_columns utc
    LEFT JOIN user_cons_columns ucc ON utc.column_name = ucc.column_name
    LEFT JOIN user_constraints uc ON ucc.constraint_name = uc.constraint_name AND uc.constraint_type = 'P'
    WHERE utc.table_name = :tableName
  `;
  
  console.log('Fetching schema for:', tableName);
  
  // Mock schema based on common insurance tables
  const mockSchemas: Record<string, TableSchema> = {
    'POLICIES': {
      tableName: 'POLICIES',
      columns: [
        { name: 'POLICY_ID', type: 'VARCHAR2', nullable: false, isPrimaryKey: true },
        { name: 'CUSTOMER_ID', type: 'VARCHAR2', nullable: false, isPrimaryKey: false },
        { name: 'PRODUCT_TYPE', type: 'VARCHAR2', nullable: false, isPrimaryKey: false },
        { name: 'PREMIUM_AMOUNT', type: 'NUMBER', nullable: false, isPrimaryKey: false },
        { name: 'START_DATE', type: 'DATE', nullable: false, isPrimaryKey: false },
        { name: 'END_DATE', type: 'DATE', nullable: false, isPrimaryKey: false },
        { name: 'DEALER_ID', type: 'VARCHAR2', nullable: true, isPrimaryKey: false },
        { name: 'REGION', type: 'VARCHAR2', nullable: true, isPrimaryKey: false },
      ],
      rowCount: 15420,
    },
    'CLAIMS': {
      tableName: 'CLAIMS',
      columns: [
        { name: 'CLAIM_ID', type: 'VARCHAR2', nullable: false, isPrimaryKey: true },
        { name: 'POLICY_ID', type: 'VARCHAR2', nullable: false, isPrimaryKey: false },
        { name: 'CLAIM_TYPE', type: 'VARCHAR2', nullable: false, isPrimaryKey: false },
        { name: 'CLAIM_AMOUNT', type: 'NUMBER', nullable: false, isPrimaryKey: false },
        { name: 'CLAIM_DATE', type: 'DATE', nullable: false, isPrimaryKey: false },
        { name: 'STATUS', type: 'VARCHAR2', nullable: false, isPrimaryKey: false },
        { name: 'SETTLEMENT_DATE', type: 'DATE', nullable: true, isPrimaryKey: false },
      ],
      rowCount: 8245,
    },
    'DEALERS': {
      tableName: 'DEALERS',
      columns: [
        { name: 'DEALER_ID', type: 'VARCHAR2', nullable: false, isPrimaryKey: true },
        { name: 'DEALER_NAME', type: 'VARCHAR2', nullable: false, isPrimaryKey: false },
        { name: 'REGION', type: 'VARCHAR2', nullable: false, isPrimaryKey: false },
        { name: 'COMMISSION_RATE', type: 'NUMBER', nullable: false, isPrimaryKey: false },
        { name: 'ACTIVE', type: 'NUMBER', nullable: false, isPrimaryKey: false },
      ],
      rowCount: 28,
    },
  };
  
  return mockSchemas[tableName.toUpperCase()] || {
    tableName,
    columns: [],
    rowCount: 0,
  };
}

/**
 * Get list of available tables
 */
export async function listTables(): Promise<string[]> {
  // In production: SELECT table_name FROM user_tables
  return ['POLICIES', 'CLAIMS', 'DEALERS', 'CUSTOMERS', 'PRODUCTS', 'REGIONS'];
}

/**
 * Close connection pool
 */
export async function closeConnection(): Promise<void> {
  // In production: await pool.close();
  mockConnectionStatus = {
    connected: false,
    poolSize: 0,
    activeConnections: 0,
    lastSync: mockConnectionStatus.lastSync,
  };
}

/**
 * Get connection status
 */
export function getConnectionStatus(): ConnectionStatus {
  return mockConnectionStatus;
}

/**
 * Subscribe to real-time data changes (using Oracle Change Notification)
 */
export function subscribeToChanges(
  tableName: string,
  callback: (changes: { operation: 'INSERT' | 'UPDATE' | 'DELETE'; rowId: string }[]) => void
): () => void {
  // In production, use Oracle Continuous Query Notification (CQN)
  // This is a mock implementation
  
  console.log('Subscribing to changes on:', tableName);
  
  const interval = setInterval(() => {
    // Simulate occasional data changes
    if (Math.random() > 0.7) {
      callback([
        { operation: 'INSERT', rowId: `ROW_${Date.now()}` }
      ]);
    }
  }, 10000);
  
  return () => clearInterval(interval);
}

/**
 * Generate mock query results based on query pattern
 */
function generateMockQueryResult(sql: string): Record<string, unknown>[] {
  const lowerSql = sql.toLowerCase();
  
  if (lowerSql.includes('policy') || lowerSql.includes('premium')) {
    return [
      { month: 'Jan', premium: 420000, claims: 280000, policies: 1200 },
      { month: 'Feb', premium: 380000, claims: 220000, policies: 980 },
      { month: 'Mar', premium: 520000, claims: 310000, policies: 1450 },
      { month: 'Apr', premium: 490000, claims: 290000, policies: 1380 },
      { month: 'May', premium: 580000, claims: 350000, policies: 1620 },
      { month: 'Jun', premium: 610000, claims: 380000, policies: 1750 },
    ];
  }
  
  if (lowerSql.includes('dealer')) {
    return [
      { name: 'Al Futtaim Motors', premium: 850000, claims: 420000, lossRatio: 49.4 },
      { name: 'Juma Al Majid', premium: 720000, claims: 380000, lossRatio: 52.8 },
      { name: 'Trading Enterprises', premium: 680000, claims: 290000, lossRatio: 42.6 },
    ];
  }
  
  if (lowerSql.includes('claim')) {
    return [
      { type: 'Collision', count: 450, amount: 1800000 },
      { type: 'Theft', count: 180, amount: 720000 },
      { type: 'Total Loss', count: 120, amount: 480000 },
    ];
  }
  
  return [];
}

/**
 * Build SQL query from natural language (simplified)
 */
export function buildQueryFromIntent(intent: {
  metrics: string[];
  dimensions: string[];
  filters: { field: string; value: string }[];
  timeRange?: string;
}): string {
  const metricMap: Record<string, string> = {
    premium: 'SUM(PREMIUM_AMOUNT) as premium',
    claims: 'SUM(CLAIM_AMOUNT) as claims',
    policies: 'COUNT(*) as policies',
    lossRatio: 'ROUND(SUM(CLAIM_AMOUNT) / SUM(PREMIUM_AMOUNT) * 100, 2) as loss_ratio',
  };
  
  const dimMap: Record<string, string> = {
    month: "TO_CHAR(START_DATE, 'Mon') as month",
    region: 'REGION',
    dealer: 'DEALER_ID',
    product: 'PRODUCT_TYPE',
  };
  
  const selectParts: string[] = [];
  const groupByParts: string[] = [];
  
  // Add dimensions
  intent.dimensions.forEach(dim => {
    if (dimMap[dim]) {
      selectParts.push(dimMap[dim]);
      groupByParts.push(dimMap[dim].split(' as ')[0]);
    }
  });
  
  // Add metrics
  intent.metrics.forEach(metric => {
    if (metricMap[metric]) {
      selectParts.push(metricMap[metric]);
    }
  });
  
  let sql = `SELECT ${selectParts.join(', ')}\nFROM POLICIES p\nLEFT JOIN CLAIMS c ON p.POLICY_ID = c.POLICY_ID`;
  
  // Add filters
  const whereClauses: string[] = [];
  intent.filters.forEach(filter => {
    whereClauses.push(`${filter.field.toUpperCase()} = '${filter.value}'`);
  });
  
  if (whereClauses.length > 0) {
    sql += `\nWHERE ${whereClauses.join(' AND ')}`;
  }
  
  if (groupByParts.length > 0) {
    sql += `\nGROUP BY ${groupByParts.join(', ')}`;
  }
  
  return sql;
}
