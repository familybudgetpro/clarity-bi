/**
 * Predictive Analytics Engine
 * Provides forecasting and predictive claims analysis
 */

export interface ForecastResult {
  period: string;
  predicted: number;
  lowerBound: number;
  upperBound: number;
  confidence: number;
}

export interface RiskAnalysis {
  segment: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  predictedClaims: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  recommendation: string;
}

export interface StrategyRecommendation {
  id: string;
  type: 'pricing' | 'marketing' | 'operations' | 'risk';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  confidence: number;
  actions: string[];
}

/**
 * Simple Moving Average forecast
 */
function calculateSMA(data: number[], periods: number): number {
  if (data.length < periods) return data[data.length - 1] || 0;
  const slice = data.slice(-periods);
  return slice.reduce((sum, val) => sum + val, 0) / periods;
}

/**
 * Linear regression for trend analysis
 */
function linearRegression(data: number[]): { slope: number; intercept: number } {
  const n = data.length;
  if (n === 0) return { slope: 0, intercept: 0 };
  
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += data[i];
    sumXY += i * data[i];
    sumX2 += i * i;
  }
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  return { slope, intercept };
}

/**
 * Calculate standard deviation
 */
function standardDeviation(data: number[]): number {
  const n = data.length;
  if (n === 0) return 0;
  
  const mean = data.reduce((sum, val) => sum + val, 0) / n;
  const squaredDiffs = data.map(val => Math.pow(val - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((sum, val) => sum + val, 0) / n;
  
  return Math.sqrt(avgSquaredDiff);
}

/**
 * Generate forecasts for the next N periods
 */
export function generateForecast(
  historicalData: number[],
  periods: number = 3,
  monthNames: string[] = ['Jul', 'Aug', 'Sep']
): ForecastResult[] {
  const { slope, intercept } = linearRegression(historicalData);
  const stdDev = standardDeviation(historicalData);
  const n = historicalData.length;
  
  const forecasts: ForecastResult[] = [];
  
  for (let i = 0; i < periods; i++) {
    const futureIndex = n + i;
    const predicted = intercept + slope * futureIndex;
    
    // 95% confidence interval
    const margin = 1.96 * stdDev;
    
    forecasts.push({
      period: monthNames[i] || `Period ${i + 1}`,
      predicted: Math.max(0, predicted),
      lowerBound: Math.max(0, predicted - margin),
      upperBound: predicted + margin,
      confidence: 0.85 - (i * 0.05), // Confidence decreases for further predictions
    });
  }
  
  return forecasts;
}

/**
 * Analyze risk levels for different segments
 */
export function analyzeRisk(
  segmentData: { name: string; premium: number; claims: number; trend: number[] }[]
): RiskAnalysis[] {
  return segmentData.map(segment => {
    const lossRatio = segment.claims / segment.premium;
    const { slope } = linearRegression(segment.trend);
    
    // Calculate risk score (0-100)
    let riskScore = lossRatio * 100;
    if (slope > 0) riskScore += slope * 10; // Increasing claims add risk
    riskScore = Math.min(100, Math.max(0, riskScore));
    
    // Determine risk level
    let riskLevel: RiskAnalysis['riskLevel'];
    if (riskScore >= 70) riskLevel = 'critical';
    else if (riskScore >= 55) riskLevel = 'high';
    else if (riskScore >= 40) riskLevel = 'medium';
    else riskLevel = 'low';
    
    // Determine trend
    let trend: RiskAnalysis['trend'];
    if (slope > 0.05) trend = 'increasing';
    else if (slope < -0.05) trend = 'decreasing';
    else trend = 'stable';
    
    // Generate recommendation
    let recommendation: string;
    if (riskLevel === 'critical') {
      recommendation = `Immediate review required. Consider premium adjustment of 15-20% or restricting new policies.`;
    } else if (riskLevel === 'high') {
      recommendation = `Monitor closely. Recommend premium increase of 5-10% and enhanced claim verification.`;
    } else if (riskLevel === 'medium') {
      recommendation = `Standard monitoring. Consider targeted marketing to maintain profitable mix.`;
    } else {
      recommendation = `Performing well. Opportunity for market expansion in this segment.`;
    }
    
    // Predict next month's claims
    const predictedClaims = segment.claims * (1 + slope);
    
    return {
      segment: segment.name,
      riskLevel,
      riskScore: Math.round(riskScore),
      predictedClaims: Math.round(predictedClaims),
      trend,
      recommendation,
    };
  });
}

/**
 * Generate AI-powered business strategy recommendations
 */
export function generateStrategyRecommendations(
  data: {
    totalPremium: number;
    totalClaims: number;
    lossRatio: number;
    topDealers: { name: string; lossRatio: number }[];
    topRegions: { name: string; premium: number; claims: number }[];
    productMix: { name: string; premium: number; claims: number }[];
  }
): StrategyRecommendation[] {
  const recommendations: StrategyRecommendation[] = [];
  
  // Loss Ratio Analysis
  if (data.lossRatio > 65) {
    recommendations.push({
      id: 'lr-critical',
      type: 'pricing',
      priority: 'high',
      title: 'Critical: Loss Ratio Exceeds Target',
      description: `Current loss ratio of ${data.lossRatio.toFixed(1)}% is above the 65% threshold.`,
      impact: 'Potential annual loss of $' + ((data.totalClaims - data.totalPremium * 0.65) / 1000).toFixed(0) + 'k',
      confidence: 0.92,
      actions: [
        'Review and increase premiums by 8-12% across high-risk segments',
        'Implement stricter underwriting criteria',
        'Audit top 10 high-claim policies',
        'Negotiate better repair rates with workshops'
      ]
    });
  } else if (data.lossRatio < 45) {
    recommendations.push({
      id: 'lr-opportunity',
      type: 'marketing',
      priority: 'medium',
      title: 'Growth Opportunity: Strong Profitability',
      description: `Loss ratio of ${data.lossRatio.toFixed(1)}% indicates room for competitive pricing.`,
      impact: 'Potential to capture 15-20% more market share',
      confidence: 0.78,
      actions: [
        'Launch competitive pricing campaign',
        'Increase marketing spend in profitable segments',
        'Offer loyalty discounts to retain customers',
        'Expand dealer network in performing regions'
      ]
    });
  }
  
  // Dealer Performance Analysis
  const problematicDealers = data.topDealers.filter(d => d.lossRatio > 60);
  if (problematicDealers.length > 0) {
    recommendations.push({
      id: 'dealer-risk',
      type: 'operations',
      priority: problematicDealers.length > 2 ? 'high' : 'medium',
      title: `${problematicDealers.length} Dealer(s) with High Loss Ratio`,
      description: `Dealers ${problematicDealers.map(d => d.name).join(', ')} have loss ratios above 60%.`,
      impact: 'Reducing their loss ratio by 10% could save $' + (data.totalClaims * 0.1 / 1000).toFixed(0) + 'k annually',
      confidence: 0.85,
      actions: [
        'Schedule performance review meetings',
        'Implement claim verification for these dealers',
        'Consider adjusting commission structures',
        'Provide training on risk assessment'
      ]
    });
  }
  
  // Regional Analysis
  const underperformingRegions = data.topRegions.filter(r => (r.claims / r.premium) > 0.6);
  if (underperformingRegions.length > 0) {
    recommendations.push({
      id: 'region-focus',
      type: 'risk',
      priority: 'medium',
      title: 'Regional Performance Imbalance',
      description: `Region(s) ${underperformingRegions.map(r => r.name).join(', ')} underperforming.`,
      impact: 'Targeted intervention could improve regional profitability by 12-18%',
      confidence: 0.80,
      actions: [
        'Conduct regional market analysis',
        'Adjust pricing by region',
        'Review local dealer performance',
        'Consider marketing campaign in profitable regions'
      ]
    });
  }
  
  // Product Mix Optimization
  const mostProfitableProduct = [...data.productMix].sort((a, b) => 
    (a.claims / a.premium) - (b.claims / b.premium)
  )[0];
  
  if (mostProfitableProduct) {
    recommendations.push({
      id: 'product-focus',
      type: 'marketing',
      priority: 'low',
      title: `Expand ${mostProfitableProduct.name} Sales`,
      description: `${mostProfitableProduct.name} has the best loss ratio in your portfolio.`,
      impact: 'Increasing share by 10% could add $' + (mostProfitableProduct.premium * 0.1 / 1000).toFixed(0) + 'k in premium',
      confidence: 0.75,
      actions: [
        `Create dealer incentives for ${mostProfitableProduct.name}`,
        'Develop targeted marketing materials',
        'Train sales team on product benefits',
        'Bundle with complementary products'
      ]
    });
  }
  
  // Forecasting Insight
  recommendations.push({
    id: 'forecast-alert',
    type: 'operations',
    priority: 'medium',
    title: 'Q3 Claims Forecast Alert',
    description: 'Based on historical patterns, Q3 typically sees 15% higher claims due to summer travel.',
    impact: 'Prepare reserves of $' + (data.totalClaims * 0.15 / 1000).toFixed(0) + 'k for Q3',
    confidence: 0.72,
    actions: [
      'Increase claim reserve allocation',
      'Pre-negotiate with repair workshops',
      'Staff up claims processing team',
      'Launch safe driving awareness campaign'
    ]
  });
  
  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

/**
 * Calculate predicted loss ratio for next period
 */
export function predictLossRatio(
  historicalLossRatios: number[]
): { predicted: number; trend: 'improving' | 'stable' | 'worsening' } {
  const { slope, intercept } = linearRegression(historicalLossRatios);
  const predicted = intercept + slope * historicalLossRatios.length;
  
  let trend: 'improving' | 'stable' | 'worsening';
  if (slope < -0.5) trend = 'improving';
  else if (slope > 0.5) trend = 'worsening';
  else trend = 'stable';
  
  return {
    predicted: Math.max(0, Math.min(100, predicted)),
    trend,
  };
}

/**
 * Detect anomalies in data
 */
export function detectAnomalies(
  data: { period: string; value: number }[],
  threshold: number = 2
): { period: string; value: number; zscore: number; type: 'spike' | 'drop' }[] {
  const values = data.map(d => d.value);
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const stdDev = standardDeviation(values);
  
  const anomalies: { period: string; value: number; zscore: number; type: 'spike' | 'drop' }[] = [];
  
  data.forEach((d, i) => {
    const zscore = (d.value - mean) / stdDev;
    if (Math.abs(zscore) > threshold) {
      anomalies.push({
        period: d.period,
        value: d.value,
        zscore,
        type: zscore > 0 ? 'spike' : 'drop',
      });
    }
  });
  
  return anomalies;
}
