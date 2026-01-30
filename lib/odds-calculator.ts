import { Odds } from './types';

/**
 * Convert American odds to decimal odds
 */
export function americanToDecimal(american: number): number {
  if (american > 0) {
    return (american / 100) + 1;
  } else {
    return (100 / Math.abs(american)) + 1;
  }
}

/**
 * Convert decimal odds to American odds
 */
export function decimalToAmerican(decimal: number): number {
  if (decimal >= 2) {
    return Math.round((decimal - 1) * 100);
  } else {
    return Math.round(-100 / (decimal - 1));
  }
}

/**
 * Convert American odds to implied probability (with vig)
 */
export function americanToImpliedProbability(american: number): number {
  if (american > 0) {
    return 100 / (american + 100);
  } else {
    return Math.abs(american) / (Math.abs(american) + 100);
  }
}

/**
 * Convert decimal odds to implied probability
 */
export function decimalToImpliedProbability(decimal: number): number {
  return 1 / decimal;
}

/**
 * Remove vig from implied probabilities to get fair odds
 * Uses multiplicative method
 */
export function removeVig(impliedProbs: number[]): number[] {
  const totalProb = impliedProbs.reduce((sum, prob) => sum + prob, 0);
  const vigFactor = 1 / totalProb;
  return impliedProbs.map(prob => prob * vigFactor);
}

/**
 * Calculate expected value (EV) as a percentage
 * @param fairProbability - True probability of the outcome
 * @param odds - Decimal odds offered
 * @returns EV as a percentage
 */
export function calculateEV(fairProbability: number, odds: number): number {
  const expectedReturn = fairProbability * odds;
  return (expectedReturn - 1) * 100;
}

/**
 * Calculate EV with slippage adjustment
 * Assumes odds could move against us by a certain amount
 */
export function calculateSlippageAdjustedEV(
  fairProbability: number,
  currentOdds: number,
  slippagePercent: number = 2 // Default 2% slippage
): number {
  const worstCaseOdds = currentOdds * (1 - slippagePercent / 100);
  return calculateEV(fairProbability, worstCaseOdds);
}

/**
 * Convert odds to full Odds object
 */
export function createOddsObject(american: number): Odds {
  const decimal = americanToDecimal(american);
  const impliedProbability = americanToImpliedProbability(american);
  
  return {
    american,
    decimal,
    impliedProbability,
    noVigProbability: impliedProbability, // Will be adjusted when comparing lines
  };
}

/**
 * Calculate no-vig probabilities for a set of sportsbook lines
 */
export function calculateNoVigOdds(lines: Array<{ odds: Odds }>): Odds[] {
  const impliedProbs = lines.map(line => line.odds.impliedProbability);
  const noVigProbs = removeVig(impliedProbs);
  
  return lines.map((line, index) => ({
    ...line.odds,
    noVigProbability: noVigProbs[index],
  }));
}

/**
 * Calculate standard deviation of lines to measure disagreement
 */
export function calculateLineDisagreement(lines: number[]): number {
  const mean = lines.reduce((sum, line) => sum + line, 0) / lines.length;
  const variance = lines.reduce((sum, line) => sum + Math.pow(line - mean, 2), 0) / lines.length;
  return Math.sqrt(variance);
}

/**
 * Estimate fair probability using historical data
 * @param historicalHits - Number of times the outcome occurred
 * @param historicalTotal - Total number of games
 * @param adjustmentFactor - Optional adjustment based on context (0.9-1.1)
 */
export function estimateFairProbability(
  historicalHits: number,
  historicalTotal: number,
  adjustmentFactor: number = 1.0
): number {
  if (historicalTotal === 0) return 0.5; // Default to 50% if no data
  
  // Apply Laplace smoothing to avoid extreme probabilities
  const smoothedProbability = (historicalHits + 1) / (historicalTotal + 2);
  
  return Math.min(0.95, Math.max(0.05, smoothedProbability * adjustmentFactor));
}

/**
 * Calculate combined odds for a parlay
 */
export function calculateParlayOdds(legOdds: number[]): number {
  return legOdds.reduce((product, odds) => product * odds, 1);
}

/**
 * Calculate parlay EV considering correlation
 * @param fairProbabilities - Array of fair probabilities for each leg
 * @param parlayOdds - Combined decimal odds for the parlay
 * @param correlationFactor - Adjustment for correlation (0.8-1.0, lower = more negative correlation)
 */
export function calculateParlayEV(
  fairProbabilities: number[],
  parlayOdds: number,
  correlationFactor: number = 1.0
): number {
  const combinedProbability = fairProbabilities.reduce((product, prob) => product * prob, 1);
  const adjustedProbability = combinedProbability * correlationFactor;
  
  return calculateEV(adjustedProbability, parlayOdds);
}

/**
 * Format odds for display
 */
export function formatOdds(odds: Odds, format: 'american' | 'decimal' = 'american'): string {
  if (format === 'decimal') {
    return odds.decimal.toFixed(2);
  }
  
  return odds.american > 0 ? `+${odds.american}` : `${odds.american}`;
}

/**
 * Format EV percentage for display
 */
export function formatEV(ev: number): string {
  const sign = ev >= 0 ? '+' : '';
  return `${sign}${ev.toFixed(1)}%`;
}

/**
 * Format probability as percentage
 */
export function formatProbability(probability: number): string {
  return `${(probability * 100).toFixed(1)}%`;
}
