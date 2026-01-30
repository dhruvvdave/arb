/**
 * Convert American odds to decimal odds
 */
export function americanToDecimal(americanOdds: number): number {
  if (americanOdds > 0) {
    return (americanOdds / 100) + 1;
  } else {
    return (100 / Math.abs(americanOdds)) + 1;
  }
}

/**
 * Convert decimal odds to American odds
 */
export function decimalToAmerican(decimalOdds: number): number {
  if (decimalOdds >= 2) {
    return Math.round((decimalOdds - 1) * 100);
  } else {
    return Math.round(-100 / (decimalOdds - 1));
  }
}

/**
 * Calculate implied probability from decimal odds
 */
export function impliedProbability(decimalOdds: number): number {
  return (1 / decimalOdds) * 100;
}

/**
 * Calculate arbitrage opportunity
 */
export function calculateArbitrage(odds1: number, odds2: number): {
  hasArbitrage: boolean;
  profitPercentage: number;
  stake1Percentage: number;
  stake2Percentage: number;
} {
  const decimal1 = americanToDecimal(odds1);
  const decimal2 = americanToDecimal(odds2);
  
  const totalImpliedProb = impliedProbability(decimal1) + impliedProbability(decimal2);
  
  const hasArbitrage = totalImpliedProb < 100;
  const profitPercentage = hasArbitrage ? 100 - totalImpliedProb : 0;
  
  const stake1Percentage = (100 / decimal1) / (100 / decimal1 + 100 / decimal2) * 100;
  const stake2Percentage = (100 / decimal2) / (100 / decimal1 + 100 / decimal2) * 100;
  
  return {
    hasArbitrage,
    profitPercentage,
    stake1Percentage,
    stake2Percentage,
  };
}

/**
 * Calculate stakes for arbitrage betting
 */
export function calculateArbitrageStakes(
  totalStake: number,
  odds1: number,
  odds2: number
): {
  stake1: number;
  stake2: number;
  guaranteedProfit: number;
} {
  const { stake1Percentage, stake2Percentage } = calculateArbitrage(odds1, odds2);
  
  const stake1 = (totalStake * stake1Percentage) / 100;
  const stake2 = (totalStake * stake2Percentage) / 100;
  
  const decimal1 = americanToDecimal(odds1);
  const payout1 = stake1 * decimal1;
  const guaranteedProfit = payout1 - totalStake;
  
  return {
    stake1: Math.round(stake1 * 100) / 100,
    stake2: Math.round(stake2 * 100) / 100,
    guaranteedProfit: Math.round(guaranteedProfit * 100) / 100,
  };
}

/**
 * Calculate parlay odds
 */
export function calculateParlayOdds(oddsArray: number[]): number {
  const decimalOdds = oddsArray.map(americanToDecimal);
  const combinedDecimal = decimalOdds.reduce((acc, odds) => acc * odds, 1);
  return decimalToAmerican(combinedDecimal);
}

/**
 * Calculate parlay payout
 */
export function calculateParlayPayout(stake: number, oddsArray: number[]): number {
  const combinedOdds = calculateParlayOdds(oddsArray);
  const decimalOdds = americanToDecimal(combinedOdds);
  return Math.round(stake * decimalOdds * 100) / 100;
}

/**
 * Format odds for display
 */
export function formatOdds(odds: number): string {
  return odds > 0 ? `+${odds}` : `${odds}`;
}

/**
 * Calculate potential profit
 */
export function calculateProfit(stake: number, odds: number): number {
  const decimalOdds = americanToDecimal(odds);
  return Math.round((stake * decimalOdds - stake) * 100) / 100;
}
