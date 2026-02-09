/**
 * Data Linker - Detect and manage relationships between multiple data sources
 */

import type { ParsedFile, ParsedColumn, ParsedSheet } from './excel-parser';

export interface DataRelationship {
  sourceFile: string;
  sourceSheet: string;
  sourceColumn: string;
  targetFile: string;
  targetSheet: string;
  targetColumn: string;
  confidence: number;
  matchType: 'exact-name' | 'normalized-name' | 'value-overlap';
}

export interface UnifiedDataModel {
  tables: {
    id: string;
    name: string;
    source: { file: string; sheet: string };
    columns: ParsedColumn[];
    rowCount: number;
  }[];
  relationships: DataRelationship[];
  facts: string[]; // Tables that contain measures (fact tables)
  dimensions: string[]; // Tables that contain dimensions (dimension tables)
}

/**
 * Build a unified data model from multiple files
 */
export function buildDataModel(files: ParsedFile[]): UnifiedDataModel {
  const tables: UnifiedDataModel['tables'] = [];
  
  // Create table entries for each sheet
  for (const file of files) {
    for (const sheet of file.sheets) {
      const tableId = generateTableId(file.fileName, sheet.name);
      tables.push({
        id: tableId,
        name: `${file.fileName.replace(/\.(xlsx|csv)$/i, '')} - ${sheet.name}`,
        source: { file: file.fileName, sheet: sheet.name },
        columns: sheet.columns,
        rowCount: sheet.rowCount,
      });
    }
  }
  
  // Detect relationships
  const relationships = detectAllRelationships(files);
  
  // Classify tables as facts or dimensions
  const { facts, dimensions } = classifyTables(tables);
  
  return { tables, relationships, facts, dimensions };
}

function generateTableId(fileName: string, sheetName: string): string {
  return `${fileName.replace(/[^a-zA-Z0-9]/g, '_')}_${sheetName.replace(/[^a-zA-Z0-9]/g, '_')}`;
}

/**
 * Detect relationships between all sheets across all files
 */
function detectAllRelationships(files: ParsedFile[]): DataRelationship[] {
  const relationships: DataRelationship[] = [];
  
  // Collect all columns with context
  const allColumns: {
    file: string;
    sheet: string;
    column: ParsedColumn;
    data: unknown[];
  }[] = [];
  
  for (const file of files) {
    for (const sheet of file.sheets) {
      for (const column of sheet.columns) {
        allColumns.push({
          file: file.fileName,
          sheet: sheet.name,
          column,
          data: sheet.data.map(row => row[column.name]),
        });
      }
    }
  }
  
  // Compare each pair of columns
  for (let i = 0; i < allColumns.length; i++) {
    for (let j = i + 1; j < allColumns.length; j++) {
      const col1 = allColumns[i];
      const col2 = allColumns[j];
      
      // Skip if same file and sheet
      if (col1.file === col2.file && col1.sheet === col2.sheet) continue;
      
      // Check for exact name match
      if (col1.column.name === col2.column.name) {
        relationships.push({
          sourceFile: col1.file,
          sourceSheet: col1.sheet,
          sourceColumn: col1.column.name,
          targetFile: col2.file,
          targetSheet: col2.sheet,
          targetColumn: col2.column.name,
          confidence: 0.95,
          matchType: 'exact-name',
        });
        continue;
      }
      
      // Check for normalized name match
      if (normalizeName(col1.column.name) === normalizeName(col2.column.name)) {
        relationships.push({
          sourceFile: col1.file,
          sourceSheet: col1.sheet,
          sourceColumn: col1.column.name,
          targetFile: col2.file,
          targetSheet: col2.sheet,
          targetColumn: col2.column.name,
          confidence: 0.85,
          matchType: 'normalized-name',
        });
        continue;
      }
      
      // Check for value overlap (only for ID/dimension columns)
      if (col1.column.inferredRole === 'id' || col1.column.inferredRole === 'dimension') {
        if (col2.column.inferredRole === 'id' || col2.column.inferredRole === 'dimension') {
          const overlap = calculateValueOverlap(col1.data, col2.data);
          if (overlap > 0.7) {
            relationships.push({
              sourceFile: col1.file,
              sourceSheet: col1.sheet,
              sourceColumn: col1.column.name,
              targetFile: col2.file,
              targetSheet: col2.sheet,
              targetColumn: col2.column.name,
              confidence: overlap,
              matchType: 'value-overlap',
            });
          }
        }
      }
    }
  }
  
  // Remove duplicate relationships (keep highest confidence)
  return deduplicateRelationships(relationships);
}

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[_\-\s]+/g, '')
    .replace(/(id|code|number|key|ref)$/i, '')
    .replace(/^(fk|pk)_?/i, '');
}

function calculateValueOverlap(data1: unknown[], data2: unknown[]): number {
  const set1 = new Set(data1.filter(v => v !== null && v !== '').map(String));
  const set2 = new Set(data2.filter(v => v !== null && v !== '').map(String));
  
  if (set1.size === 0 || set2.size === 0) return 0;
  
  let overlap = 0;
  for (const value of set1) {
    if (set2.has(value)) overlap++;
  }
  
  const smaller = Math.min(set1.size, set2.size);
  return overlap / smaller;
}

function deduplicateRelationships(relationships: DataRelationship[]): DataRelationship[] {
  const seen = new Map<string, DataRelationship>();
  
  for (const rel of relationships) {
    const key = [
      `${rel.sourceFile}::${rel.sourceSheet}::${rel.sourceColumn}`,
      `${rel.targetFile}::${rel.targetSheet}::${rel.targetColumn}`,
    ].sort().join('|');
    
    if (!seen.has(key) || seen.get(key)!.confidence < rel.confidence) {
      seen.set(key, rel);
    }
  }
  
  return Array.from(seen.values());
}

/**
 * Classify tables as fact or dimension tables
 */
function classifyTables(
  tables: UnifiedDataModel['tables']
): { facts: string[]; dimensions: string[] } {
  const facts: string[] = [];
  const dimensions: string[] = [];
  
  for (const table of tables) {
    const measureCount = table.columns.filter(c => c.inferredRole === 'measure').length;
    const dimensionCount = table.columns.filter(c => c.inferredRole === 'dimension').length;
    const hasDate = table.columns.some(c => c.inferredRole === 'date');
    
    // A fact table typically has many measures and includes date
    if (measureCount >= 2 || (measureCount >= 1 && hasDate)) {
      facts.push(table.id);
    } else if (dimensionCount > measureCount) {
      dimensions.push(table.id);
    } else {
      // Default to fact if unclear
      facts.push(table.id);
    }
  }
  
  return { facts, dimensions };
}

/**
 * Execute a cross-table query
 */
export function executeJoinQuery(
  model: UnifiedDataModel,
  files: ParsedFile[],
  options: {
    metrics: string[];
    dimensions: string[];
    filters?: { field: string; value: string }[];
  }
): Record<string, unknown>[] {
  // For now, return data from the first fact table
  // In a full implementation, this would perform actual joins
  
  const factTableId = model.facts[0];
  if (!factTableId) return [];
  
  const factTable = model.tables.find(t => t.id === factTableId);
  if (!factTable) return [];
  
  // Find the source data
  const sourceFile = files.find(f => f.fileName === factTable.source.file);
  if (!sourceFile) return [];
  
  const sourceSheet = sourceFile.sheets.find(s => s.name === factTable.source.sheet);
  if (!sourceSheet) return [];
  
  let data = [...sourceSheet.data];
  
  // Apply filters
  if (options.filters) {
    for (const filter of options.filters) {
      data = data.filter(row => {
        const value = String(row[filter.field] || '').toLowerCase();
        return value.includes(filter.value.toLowerCase());
      });
    }
  }
  
  return data;
}

/**
 * Aggregate data by dimensions
 */
export function aggregateData(
  data: Record<string, unknown>[],
  options: {
    groupBy: string[];
    metrics: { field: string; aggregation: 'sum' | 'avg' | 'count' | 'min' | 'max' }[];
  }
): Record<string, unknown>[] {
  const groups = new Map<string, Record<string, unknown>[]>();
  
  // Group rows
  for (const row of data) {
    const key = options.groupBy.map(g => String(row[g] || '')).join('||');
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(row);
  }
  
  // Aggregate
  const result: Record<string, unknown>[] = [];
  
  for (const [key, rows] of groups) {
    const aggregated: Record<string, unknown> = {};
    
    // Add dimension values
    const keyParts = key.split('||');
    options.groupBy.forEach((g, i) => {
      aggregated[g] = keyParts[i];
    });
    
    // Calculate metrics
    for (const metric of options.metrics) {
      const values = rows
        .map(r => Number(r[metric.field]))
        .filter(v => !isNaN(v));
      
      switch (metric.aggregation) {
        case 'sum':
          aggregated[metric.field] = values.reduce((a, b) => a + b, 0);
          break;
        case 'avg':
          aggregated[metric.field] = values.length > 0
            ? values.reduce((a, b) => a + b, 0) / values.length
            : 0;
          break;
        case 'count':
          aggregated[metric.field] = values.length;
          break;
        case 'min':
          aggregated[metric.field] = values.length > 0 ? Math.min(...values) : 0;
          break;
        case 'max':
          aggregated[metric.field] = values.length > 0 ? Math.max(...values) : 0;
          break;
      }
    }
    
    result.push(aggregated);
  }
  
  return result;
}
