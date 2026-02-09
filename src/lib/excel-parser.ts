import * as XLSX from 'xlsx';

export interface ParsedColumn {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  samples: (string | number | boolean | Date)[];
  uniqueCount: number;
  nullCount: number;
  inferredRole?: 'measure' | 'dimension' | 'date' | 'id';
}

export interface ParsedSheet {
  name: string;
  columns: ParsedColumn[];
  data: Record<string, unknown>[];
  rowCount: number;
}

export interface ParsedFile {
  fileName: string;
  sheets: ParsedSheet[];
  uploadedAt: Date;
}

// Insurance-specific column patterns for auto-detection
const COLUMN_PATTERNS = {
  premium: /premium|gwp|gross.*written|policy.*amount/i,
  claims: /claim|loss|payout|settlement/i,
  policies: /polic(y|ies)|count|volume/i,
  lossRatio: /loss.*ratio|lr/i,
  dealer: /dealer|agent|broker|partner|distributor/i,
  region: /region|area|zone|territory|city|emirate/i,
  product: /product|plan|type|coverage|package/i,
  date: /date|month|year|period|quarter/i,
  vehicle: /vehicle|car|brand|make|model/i,
  customer: /customer|client|insured|policyholder/i,
  id: /id|code|number|ref|key/i,
};

/**
 * Parse an Excel or CSV file and extract structured data
 */
export async function parseExcelFile(file: File): Promise<ParsedFile> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array', cellDates: true });
  
  const sheets: ParsedSheet[] = [];
  
  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { 
      defval: null,
      raw: false 
    });
    
    if (jsonData.length === 0) continue;
    
    const columns = analyzeColumns(jsonData);
    
    sheets.push({
      name: sheetName,
      columns,
      data: jsonData,
      rowCount: jsonData.length,
    });
  }
  
  return {
    fileName: file.name,
    sheets,
    uploadedAt: new Date(),
  };
}

/**
 * Analyze columns to detect types and roles
 */
function analyzeColumns(data: Record<string, unknown>[]): ParsedColumn[] {
  if (data.length === 0) return [];
  
  const columnNames = Object.keys(data[0]);
  const columns: ParsedColumn[] = [];
  
  for (const name of columnNames) {
    const values = data.map(row => row[name]);
    const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
    
    const type = inferType(nonNullValues);
    const role = inferRole(name, type, nonNullValues);
    
    columns.push({
      name,
      type,
      samples: nonNullValues.slice(0, 5) as (string | number | boolean | Date)[],
      uniqueCount: new Set(nonNullValues.map(String)).size,
      nullCount: values.length - nonNullValues.length,
      inferredRole: role,
    });
  }
  
  return columns;
}

/**
 * Infer the data type of a column
 */
function inferType(values: unknown[]): 'string' | 'number' | 'date' | 'boolean' {
  if (values.length === 0) return 'string';
  
  const sample = values.slice(0, 100);
  
  // Check if all values are dates
  const dateCount = sample.filter(v => v instanceof Date || isDateString(String(v))).length;
  if (dateCount > sample.length * 0.8) return 'date';
  
  // Check if all values are numbers
  const numberCount = sample.filter(v => !isNaN(Number(v)) && v !== '' && v !== null).length;
  if (numberCount > sample.length * 0.8) return 'number';
  
  // Check if all values are booleans
  const boolCount = sample.filter(v => 
    typeof v === 'boolean' || 
    ['true', 'false', 'yes', 'no', '1', '0'].includes(String(v).toLowerCase())
  ).length;
  if (boolCount > sample.length * 0.8) return 'boolean';
  
  return 'string';
}

/**
 * Check if a string looks like a date
 */
function isDateString(value: string): boolean {
  if (!value || value.length < 6) return false;
  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}/,  // ISO date
    /^\d{2}\/\d{2}\/\d{4}/,  // US date
    /^\d{2}-\d{2}-\d{4}/,  // EU date
    /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i,  // Month name
  ];
  return datePatterns.some(pattern => pattern.test(value));
}

/**
 * Infer the semantic role of a column for insurance analytics
 */
function inferRole(name: string, type: string, values: unknown[]): 'measure' | 'dimension' | 'date' | 'id' {
  const lowerName = name.toLowerCase();
  
  // Check for date columns
  if (type === 'date' || COLUMN_PATTERNS.date.test(name)) {
    return 'date';
  }
  
  // Check for ID columns
  if (COLUMN_PATTERNS.id.test(name) && type === 'string') {
    return 'id';
  }
  
  // Check for measure columns (numeric with insurance keywords)
  if (type === 'number') {
    if (COLUMN_PATTERNS.premium.test(name) ||
        COLUMN_PATTERNS.claims.test(name) ||
        COLUMN_PATTERNS.policies.test(name) ||
        COLUMN_PATTERNS.lossRatio.test(name)) {
      return 'measure';
    }
    
    // If numeric with many unique values, likely a measure
    const uniqueRatio = new Set(values.map(String)).size / values.length;
    if (uniqueRatio > 0.5) {
      return 'measure';
    }
  }
  
  // Default to dimension for categorical data
  return 'dimension';
}

/**
 * Detect relationships between multiple parsed files
 */
export function detectRelationships(files: ParsedFile[]): Map<string, string[]> {
  const relationships = new Map<string, string[]>();
  
  // Collect all columns with their file/sheet context
  const allColumns: { file: string; sheet: string; column: ParsedColumn }[] = [];
  
  for (const file of files) {
    for (const sheet of file.sheets) {
      for (const column of sheet.columns) {
        allColumns.push({ file: file.fileName, sheet: sheet.name, column });
      }
    }
  }
  
  // Find columns that could be join keys (ID columns or shared names)
  for (let i = 0; i < allColumns.length; i++) {
    for (let j = i + 1; j < allColumns.length; j++) {
      const col1 = allColumns[i];
      const col2 = allColumns[j];
      
      // Skip if same file and sheet
      if (col1.file === col2.file && col1.sheet === col2.sheet) continue;
      
      // Check for matching column names
      if (normalizeColumnName(col1.column.name) === normalizeColumnName(col2.column.name)) {
        const key = `${col1.file}::${col1.sheet}`;
        const target = `${col2.file}::${col2.sheet}::${col2.column.name}`;
        
        if (!relationships.has(key)) {
          relationships.set(key, []);
        }
        relationships.get(key)!.push(target);
      }
    }
  }
  
  return relationships;
}

/**
 * Normalize column name for comparison
 */
function normalizeColumnName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[_\-\s]+/g, '')
    .replace(/id$/i, '')
    .replace(/number$/i, '')
    .replace(/code$/i, '');
}

/**
 * Generate auto-summary statistics for a parsed file
 */
export function generateSummary(file: ParsedFile): {
  totalRows: number;
  measures: { name: string; sum: number; avg: number; min: number; max: number }[];
  dimensions: { name: string; topValues: { value: string; count: number }[] }[];
  dates: { name: string; min: Date; max: Date }[];
} {
  const measures: { name: string; sum: number; avg: number; min: number; max: number }[] = [];
  const dimensions: { name: string; topValues: { value: string; count: number }[] }[] = [];
  const dates: { name: string; min: Date; max: Date }[] = [];
  
  let totalRows = 0;
  
  for (const sheet of file.sheets) {
    totalRows += sheet.rowCount;
    
    for (const column of sheet.columns) {
      if (column.inferredRole === 'measure' && column.type === 'number') {
        const values = sheet.data
          .map(row => Number(row[column.name]))
          .filter(v => !isNaN(v));
        
        if (values.length > 0) {
          measures.push({
            name: column.name,
            sum: values.reduce((a, b) => a + b, 0),
            avg: values.reduce((a, b) => a + b, 0) / values.length,
            min: Math.min(...values),
            max: Math.max(...values),
          });
        }
      } else if (column.inferredRole === 'dimension') {
        const counts = new Map<string, number>();
        for (const row of sheet.data) {
          const val = String(row[column.name] || '');
          counts.set(val, (counts.get(val) || 0) + 1);
        }
        
        const topValues = Array.from(counts.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([value, count]) => ({ value, count }));
        
        dimensions.push({ name: column.name, topValues });
      } else if (column.inferredRole === 'date') {
        const dateValues = sheet.data
          .map(row => new Date(row[column.name] as string))
          .filter(d => !isNaN(d.getTime()));
        
        if (dateValues.length > 0) {
          dates.push({
            name: column.name,
            min: new Date(Math.min(...dateValues.map(d => d.getTime()))),
            max: new Date(Math.max(...dateValues.map(d => d.getTime()))),
          });
        }
      }
    }
  }
  
  return { totalRows, measures, dimensions, dates };
}
