/**
 * Chart Type Selector
 * Automatically selects the best visualization based on data characteristics
 */

import type { ParsedColumn } from './excel-parser';

export type ChartType = 'bar' | 'line' | 'pie' | 'donut' | 'area' | 'combo' | 'table' | 'kpi' | 'heatmap' | 'scatter';

export interface ChartRecommendation {
  type: ChartType;
  confidence: number;
  reason: string;
  alternatives: ChartType[];
}

interface DataProfile {
  measureCount: number;
  dimensionCount: number;
  dateCount: number;
  rowCount: number;
  hasCategorical: boolean;
  hasTimeSeries: boolean;
  uniqueCategories: number;
}

/**
 * Analyze columns and recommend the best chart type
 */
export function selectChart(
  columns: ParsedColumn[],
  rowCount: number,
  userIntent?: string
): ChartRecommendation {
  const profile = buildDataProfile(columns, rowCount);
  
  // If user specified a chart type in their query, prioritize that
  if (userIntent) {
    const userChart = extractChartPreference(userIntent);
    if (userChart) {
      return {
        type: userChart,
        confidence: 0.95,
        reason: 'User requested this chart type',
        alternatives: getAlternatives(userChart, profile),
      };
    }
  }
  
  // Auto-select based on data profile
  return autoSelectChart(profile);
}

function buildDataProfile(columns: ParsedColumn[], rowCount: number): DataProfile {
  const measures = columns.filter(c => c.inferredRole === 'measure');
  const dimensions = columns.filter(c => c.inferredRole === 'dimension');
  const dates = columns.filter(c => c.inferredRole === 'date');
  
  const categoricalColumn = dimensions.find(d => d.uniqueCount <= 20);
  
  return {
    measureCount: measures.length,
    dimensionCount: dimensions.length,
    dateCount: dates.length,
    rowCount,
    hasCategorical: !!categoricalColumn,
    hasTimeSeries: dates.length > 0,
    uniqueCategories: categoricalColumn?.uniqueCount || 0,
  };
}

function extractChartPreference(intent: string): ChartType | null {
  const lower = intent.toLowerCase();
  
  if (/pie|donut|distribution/.test(lower)) return 'pie';
  if (/line|trend|over time/.test(lower)) return 'line';
  if (/bar|column/.test(lower)) return 'bar';
  if (/area|stacked area/.test(lower)) return 'area';
  if (/table|list|detail/.test(lower)) return 'table';
  if (/scatter|correlation/.test(lower)) return 'scatter';
  if (/heatmap|heat map/.test(lower)) return 'heatmap';
  if (/kpi|metric|card/.test(lower)) return 'kpi';
  
  return null;
}

function autoSelectChart(profile: DataProfile): ChartRecommendation {
  // Single measure, no dimensions → KPI card
  if (profile.measureCount === 1 && profile.dimensionCount === 0) {
    return {
      type: 'kpi',
      confidence: 0.9,
      reason: 'Single metric summary works best as a KPI card',
      alternatives: ['bar', 'line'],
    };
  }
  
  // Time series data → Line chart
  if (profile.hasTimeSeries && profile.measureCount >= 1) {
    return {
      type: 'line',
      confidence: 0.85,
      reason: 'Time series data is best visualized with a line chart',
      alternatives: ['area', 'bar', 'combo'],
    };
  }
  
  // Few categories (2-5) with one measure → Pie chart
  if (profile.hasCategorical && profile.uniqueCategories <= 5 && profile.measureCount === 1) {
    return {
      type: 'pie',
      confidence: 0.75,
      reason: 'Distribution across few categories works well as a pie chart',
      alternatives: ['bar', 'donut'],
    };
  }
  
  // Multiple measures → Combo chart
  if (profile.measureCount >= 2 && profile.dimensionCount >= 1) {
    return {
      type: 'combo',
      confidence: 0.8,
      reason: 'Multiple measures can be compared using a combo chart',
      alternatives: ['bar', 'line', 'table'],
    };
  }
  
  // Many categories → Horizontal bar chart
  if (profile.hasCategorical && profile.uniqueCategories > 5) {
    return {
      type: 'bar',
      confidence: 0.8,
      reason: 'Bar chart handles many categories effectively',
      alternatives: ['table', 'heatmap'],
    };
  }
  
  // Large dataset → Table
  if (profile.rowCount > 100 && profile.dimensionCount > 2) {
    return {
      type: 'table',
      confidence: 0.7,
      reason: 'Detailed data is best explored in a table format',
      alternatives: ['bar', 'heatmap'],
    };
  }
  
  // Default → Bar chart
  return {
    type: 'bar',
    confidence: 0.6,
    reason: 'Bar chart is a versatile default for most data',
    alternatives: ['line', 'pie', 'table'],
  };
}

function getAlternatives(current: ChartType, profile: DataProfile): ChartType[] {
  const alternatives: ChartType[] = [];
  
  if (current !== 'bar') alternatives.push('bar');
  if (current !== 'line' && profile.hasTimeSeries) alternatives.push('line');
  if (current !== 'pie' && profile.uniqueCategories <= 6) alternatives.push('pie');
  if (current !== 'table') alternatives.push('table');
  
  return alternatives.slice(0, 3);
}

/**
 * Get color palette for a chart
 */
export function getChartColors(count: number): string[] {
  const palette = [
    '#3b82f6', // Blue
    '#ef4444', // Red
    '#10b981', // Green
    '#f59e0b', // Amber
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#06b6d4', // Cyan
    '#84cc16', // Lime
    '#f97316', // Orange
    '#6366f1', // Indigo
  ];
  
  return palette.slice(0, count);
}

/**
 * Format numbers for display
 */
export function formatValue(value: number, type: 'currency' | 'percent' | 'number' = 'number'): string {
  if (type === 'currency') {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value.toFixed(0)}`;
  }
  
  if (type === 'percent') {
    return `${value.toFixed(1)}%`;
  }
  
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return value.toFixed(0);
}
