/**
 * AI Engine for Natural Language Query Processing
 * Converts user questions into data operations and chart configurations
 */

export interface QueryIntent {
  action: 'show' | 'compare' | 'filter' | 'change' | 'forecast' | 'summarize';
  metrics: string[];
  dimensions: string[];
  filters: { field: string; operator: string; value: string }[];
  chartType?: 'bar' | 'line' | 'pie' | 'table' | 'area' | 'combo';
  timeRange?: { start?: string; end?: string; period?: string };
  sortBy?: { field: string; direction: 'asc' | 'desc' };
  limit?: number;
}

export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'table' | 'area' | 'combo' | 'kpi';
  title: string;
  xAxis?: string;
  yAxis?: string[];
  series?: { name: string; dataKey: string; color: string }[];
  filters?: { field: string; value: string }[];
}

export interface SuggestedReport {
  query: string;
  icon: string;
  category: 'related' | 'deeper' | 'forecast';
}

// Pattern matching for intent detection
const INTENT_PATTERNS = {
  show: /^(show|display|give|get|what|list|view)/i,
  compare: /^(compare|versus|vs|difference|between)/i,
  filter: /^(filter|only|where|for|in|by)/i,
  change: /^(change|switch|convert|make|turn|update)/i,
  forecast: /^(forecast|predict|project|estimate|next)/i,
  summarize: /^(summarize|summary|overview|total)/i,
};

const CHART_KEYWORDS = {
  bar: /bar|column|histogram/i,
  line: /line|trend|over time/i,
  pie: /pie|donut|distribution|breakdown/i,
  table: /table|list|grid|detail/i,
  area: /area|stacked/i,
  combo: /combo|mixed|dual/i,
};

const METRIC_KEYWORDS = {
  premium: /premium|revenue|income|sales|gwp/i,
  claims: /claim|loss|payout|cost/i,
  policies: /polic(y|ies)|count|volume|number/i,
  lossRatio: /loss.*ratio|lr|profitability/i,
};

const DIMENSION_KEYWORDS = {
  dealer: /dealer|agent|partner|broker/i,
  region: /region|area|city|emirate|location/i,
  product: /product|type|plan|coverage/i,
  time: /month|year|quarter|week|day|time|date/i,
  vehicle: /vehicle|car|brand|make|model/i,
  claimType: /claim.*type|category/i,
};

const TIME_KEYWORDS = {
  lastMonth: /last month/i,
  last3Months: /last 3 months|past 3 months|three months/i,
  last6Months: /last 6 months|past 6 months|six months/i,
  lastYear: /last year|past year/i,
  thisMonth: /this month|current month/i,
  thisYear: /this year|current year|ytd/i,
};

/**
 * Parse a natural language query into structured intent
 */
export function parseQuery(query: string): QueryIntent {
  const normalizedQuery = query.toLowerCase().trim();
  
  // Detect primary action
  let action: QueryIntent['action'] = 'show';
  for (const [act, pattern] of Object.entries(INTENT_PATTERNS)) {
    if (pattern.test(normalizedQuery)) {
      action = act as QueryIntent['action'];
      break;
    }
  }
  
  // Detect metrics
  const metrics: string[] = [];
  for (const [metric, pattern] of Object.entries(METRIC_KEYWORDS)) {
    if (pattern.test(normalizedQuery)) {
      metrics.push(metric);
    }
  }
  if (metrics.length === 0) metrics.push('premium'); // Default metric
  
  // Detect dimensions
  const dimensions: string[] = [];
  for (const [dim, pattern] of Object.entries(DIMENSION_KEYWORDS)) {
    if (pattern.test(normalizedQuery)) {
      dimensions.push(dim);
    }
  }
  
  // Detect chart type
  let chartType: QueryIntent['chartType'];
  for (const [chart, pattern] of Object.entries(CHART_KEYWORDS)) {
    if (pattern.test(normalizedQuery)) {
      chartType = chart as QueryIntent['chartType'];
      break;
    }
  }
  
  // Auto-select chart type if not specified
  if (!chartType) {
    if (dimensions.includes('time')) {
      chartType = 'line';
    } else if (metrics.length > 1) {
      chartType = 'combo';
    } else if (dimensions.length === 1 && metrics.length === 1) {
      chartType = 'bar';
    } else {
      chartType = 'bar';
    }
  }
  
  // Detect time range
  let timeRange: QueryIntent['timeRange'];
  for (const [period, pattern] of Object.entries(TIME_KEYWORDS)) {
    if (pattern.test(normalizedQuery)) {
      timeRange = { period };
      break;
    }
  }
  
  // Detect filters from query
  const filters: QueryIntent['filters'] = [];
  
  // Look for "for X" or "in X" patterns
  const forMatch = normalizedQuery.match(/(?:for|in|by)\s+([a-z\s]+?)(?:\s+(?:and|or|$))/i);
  if (forMatch) {
    const filterValue = forMatch[1].trim();
    // Try to match to a dimension
    for (const [dim, pattern] of Object.entries(DIMENSION_KEYWORDS)) {
      if (!pattern.test(filterValue)) {
        filters.push({ field: 'region', operator: 'equals', value: filterValue });
        break;
      }
    }
  }
  
  return {
    action,
    metrics,
    dimensions,
    filters,
    chartType,
    timeRange,
  };
}

/**
 * Generate chart configuration from query intent
 */
export function generateChartConfig(intent: QueryIntent): ChartConfig {
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
  
  // Build title from intent
  const metricLabels = intent.metrics.map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(' vs ');
  const dimLabels = intent.dimensions.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(' by ');
  const title = `${metricLabels}${dimLabels ? ` by ${dimLabels}` : ''}`;
  
  // Build series
  const series = intent.metrics.map((metric, idx) => ({
    name: metric.charAt(0).toUpperCase() + metric.slice(1),
    dataKey: metric,
    color: colors[idx % colors.length],
  }));
  
  return {
    type: intent.chartType || 'bar',
    title,
    xAxis: intent.dimensions[0] || 'category',
    yAxis: intent.metrics,
    series,
    filters: intent.filters.map(f => ({ field: f.field, value: f.value })),
  };
}

/**
 * Process a chart edit command
 */
export function processEditCommand(
  currentConfig: ChartConfig,
  command: string
): ChartConfig {
  const lowerCommand = command.toLowerCase();
  const newConfig = { ...currentConfig };
  
  // Change chart type
  for (const [chart, pattern] of Object.entries(CHART_KEYWORDS)) {
    if (pattern.test(lowerCommand)) {
      newConfig.type = chart as ChartConfig['type'];
      break;
    }
  }
  
  // Add/remove filters
  if (/filter|only|for/.test(lowerCommand)) {
    const filterMatch = lowerCommand.match(/(?:filter|only|for)\s+(.+)/i);
    if (filterMatch) {
      const filterValue = filterMatch[1].trim();
      newConfig.filters = [...(newConfig.filters || []), { field: 'region', value: filterValue }];
    }
  }
  
  // Remove filter
  if (/remove filter|clear filter|show all/i.test(lowerCommand)) {
    newConfig.filters = [];
  }
  
  // Add trend line (for line charts)
  if (/trend|trendline/i.test(lowerCommand)) {
    newConfig.type = 'line';
  }
  
  // Change title
  const titleMatch = lowerCommand.match(/(?:title|rename|call)\s+(?:it\s+)?["']?(.+?)["']?$/i);
  if (titleMatch) {
    newConfig.title = titleMatch[1];
  }
  
  return newConfig;
}

/**
 * Generate related report suggestions based on current query
 */
export function generateSuggestions(intent: QueryIntent): SuggestedReport[] {
  const suggestions: SuggestedReport[] = [];
  
  // Related comparisons
  if (intent.dimensions.includes('dealer')) {
    suggestions.push({
      query: 'Compare dealer performance vs. industry average',
      icon: '📊',
      category: 'related',
    });
  }
  
  if (intent.metrics.includes('claims')) {
    suggestions.push({
      query: 'Show claims by claim type',
      icon: '⚠️',
      category: 'related',
    });
    suggestions.push({
      query: 'Forecast claims for next month',
      icon: '🔮',
      category: 'forecast',
    });
  }
  
  if (intent.metrics.includes('premium')) {
    suggestions.push({
      query: 'Calculate loss ratio by dealer',
      icon: '📉',
      category: 'deeper',
    });
    suggestions.push({
      query: 'Show revenue trend over time',
      icon: '📈',
      category: 'related',
    });
  }
  
  // Time-based suggestions
  if (!intent.timeRange) {
    suggestions.push({
      query: 'Compare with last month',
      icon: '📅',
      category: 'related',
    });
  }
  
  // Dimension-based suggestions
  if (!intent.dimensions.includes('region')) {
    suggestions.push({
      query: 'Break down by region',
      icon: '🗺️',
      category: 'deeper',
    });
  }
  
  if (!intent.dimensions.includes('product')) {
    suggestions.push({
      query: 'View by product type',
      icon: '📦',
      category: 'deeper',
    });
  }
  
  return suggestions.slice(0, 4);
}

/**
 * Generate an AI response for the chat interface
 */
export function generateResponse(query: string, intent: QueryIntent): string {
  const { action, metrics, dimensions, chartType } = intent;
  
  const metricStr = metrics.join(' and ');
  const dimStr = dimensions.length > 0 ? ` by ${dimensions.join(' and ')}` : '';
  const chartStr = chartType ? ` as a ${chartType} chart` : '';
  
  switch (action) {
    case 'show':
      return `Done! I've generated a report showing ${metricStr}${dimStr}${chartStr}. You can say "Change to pie chart" or "Filter by Dubai" to modify it.`;
    
    case 'compare':
      return `Here's your comparison of ${metricStr}${dimStr}. The visualization highlights the differences. Would you like to add a trend line or see the raw data?`;
    
    case 'filter':
      return `Applied the filter. The dashboard now shows only the selected data. Say "Clear filters" to see all data again.`;
    
    case 'change':
      return `Updated! I've changed the visualization${chartStr}. Let me know if you'd like any other adjustments.`;
    
    case 'forecast':
      return `I've generated a forecast based on historical patterns. The prediction shows the expected trend for the next period. Note: This is based on past data and may not account for unusual events.`;
    
    case 'summarize':
      return `Here's your summary of ${metricStr}. Key insights are highlighted in the KPI cards above. Ask me to drill down into any specific area.`;
    
    default:
      return `I've processed your request for ${metricStr}${dimStr}. Let me know if you need any changes!`;
  }
}
