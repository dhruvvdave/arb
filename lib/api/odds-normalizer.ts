import {
  OntarioSportsbook,
  ONTARIO_SPORTSBOOKS,
  Sport,
  GameInfo,
  SportsbookLine,
  EVOpportunity,
  BetType,
  ConfidenceLevel,
} from '../types';
import {
  createOddsObject,
  calculateEV,
  estimateFairProbability,
  removeVig,
  decimalToAmerican,
} from '../odds-calculator';

// Slippage buffer percentage
const SLIPPAGE_BUFFER = 0.85; // 15% slippage

// Confidence thresholds
const HIGH_CONFIDENCE_EV_THRESHOLD = 10;
const MEDIUM_CONFIDENCE_EV_THRESHOLD = 5;
const HIGH_CONFIDENCE_MIN_BOOKS = 5;
const MEDIUM_CONFIDENCE_MIN_BOOKS = 3;
const LOW_DISAGREEMENT_THRESHOLD = 0.05;

// Stability and volatility scaling
const STABILITY_MAX_MINUTES = 60; // 60+ minutes = 0 stability
const VOLATILITY_SCALE_FACTOR = 500; // 0.20 disagreement = 100 volatility

// Map The Odds API bookmaker keys to our Ontario sportsbook names
const BOOKMAKER_MAP: Record<string, OntarioSportsbook | null> = {
  'bet365': 'bet365',
  'betmgm': 'BetMGM',
  'draftkings': 'DraftKings',
  'fanduel': 'FanDuel',
  'pointsbetus': 'PointsBet',
  'betway': 'Betway',
  'williamhill_us': 'Caesars', // William Hill = Caesars
  'unibet_us': 'Unibet',
  '888sport': '888sport',
  'betrivers': 'BetRivers',
  'thescore_bet': 'theScore Bet',
  'betano': 'Betano',
  'si_sportsbook': 'Sports Interaction',
};

// Ontario legal bookmakers from The Odds API
const ONTARIO_BOOKMAKER_KEYS = Object.keys(BOOKMAKER_MAP);

export interface OddsAPIEvent {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers?: OddsAPIBookmaker[];
}

export interface OddsAPIBookmaker {
  key: string;
  title: string;
  markets: OddsAPIMarket[];
  last_update?: string;
}

export interface OddsAPIMarket {
  key: string; // h2h, spreads, totals, player_points, etc.
  outcomes: OddsAPIOutcome[];
}

export interface OddsAPIOutcome {
  name: string;
  price: number; // Decimal odds
  point?: number; // For spreads/totals
}

/**
 * Convert The Odds API sport key to our Sport enum
 */
export function normalizeSport(sportKey: string): Sport | null {
  const map: Record<string, Sport> = {
    'basketball_nba': 'NBA',
    'icehockey_nhl': 'NHL',
  };
  return map[sportKey] || null;
}

/**
 * Convert The Odds API event to our GameInfo type
 */
export function normalizeGame(event: OddsAPIEvent): GameInfo | null {
  const sport = normalizeSport(event.sport_key);
  if (!sport) return null;

  return {
    id: event.id,
    sport,
    homeTeam: event.home_team,
    awayTeam: event.away_team,
    startTime: new Date(event.commence_time),
  };
}

/**
 * Filter bookmakers to only Ontario-legal ones
 */
export function filterOntarioBookmakers(
  bookmakers: OddsAPIBookmaker[]
): OddsAPIBookmaker[] {
  return bookmakers.filter((bm) => ONTARIO_BOOKMAKER_KEYS.includes(bm.key));
}

/**
 * Convert bookmaker key to our OntarioSportsbook type
 */
export function normalizeBookmaker(key: string): OntarioSportsbook | null {
  return BOOKMAKER_MAP[key] || null;
}

/**
 * Convert The Odds API outcomes to our SportsbookLine format
 */
export function normalizeSportsbookLines(
  bookmakers: OddsAPIBookmaker[],
  marketKey: string,
  outcomeFilter?: (outcome: OddsAPIOutcome) => boolean
): SportsbookLine[] {
  const lines: SportsbookLine[] = [];

  for (const bookmaker of bookmakers) {
    const sportsbookName = normalizeBookmaker(bookmaker.key);
    if (!sportsbookName) continue;

    const market = bookmaker.markets.find((m) => m.key === marketKey);
    if (!market) continue;

    for (const outcome of market.outcomes) {
      if (outcomeFilter && !outcomeFilter(outcome)) continue;

      lines.push({
        sportsbook: sportsbookName,
        odds: createOddsObject(decimalToAmerican(outcome.price)),
        line: outcome.point,
        lastUpdated: bookmaker.last_update
          ? new Date(bookmaker.last_update)
          : new Date(),
      });
    }
  }

  return lines;
}

/**
 * Calculate fair probability from multiple sportsbook lines by removing vig
 */
export function calculateFairProbability(lines: SportsbookLine[]): number {
  if (lines.length === 0) return 0;

  // Use the no-vig probabilities from all books
  const noVigProbs = lines.map((line) => line.odds.noVigProbability);
  
  // Return the average
  return noVigProbs.reduce((sum, prob) => sum + prob, 0) / noVigProbs.length;
}

/**
 * Determine bet type from market key
 */
export function getBetType(marketKey: string): BetType {
  if (marketKey === 'h2h') return 'moneyline';
  if (marketKey === 'spreads') return 'spread';
  if (marketKey === 'totals') return 'totals';
  return 'props';
}

/**
 * Calculate confidence level based on factors
 */
export function calculateConfidence(
  ev: number,
  lineCount: number,
  lineDisagreement: number
): ConfidenceLevel {
  // High confidence: High EV, many books, low disagreement
  if (ev >= HIGH_CONFIDENCE_EV_THRESHOLD && lineCount >= HIGH_CONFIDENCE_MIN_BOOKS && lineDisagreement < LOW_DISAGREEMENT_THRESHOLD) return 'High';
  
  // Medium confidence: Moderate EV and book count
  if (ev >= MEDIUM_CONFIDENCE_EV_THRESHOLD && lineCount >= MEDIUM_CONFIDENCE_MIN_BOOKS) return 'Medium';
  
  // Low confidence: Lower EV or fewer books
  return 'Low';
}

/**
 * Calculate line disagreement (standard deviation of odds)
 */
export function calculateLineDisagreement(lines: SportsbookLine[]): number {
  if (lines.length < 2) return 0;

  const probs = lines.map((line) => line.odds.impliedProbability);
  const mean = probs.reduce((sum, p) => sum + p, 0) / probs.length;
  const variance =
    probs.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / probs.length;
  
  return Math.sqrt(variance);
}

/**
 * Calculate stability score (inverse of how much odds have changed)
 * Higher score = more stable
 */
export function calculateStabilityScore(lines: SportsbookLine[]): number {
  // For now, use recency of updates as a proxy
  // More recent = more stable (less time for changes)
  const now = Date.now();
  const avgMinutesSinceUpdate =
    lines.reduce((sum, line) => {
      const minutes = (now - line.lastUpdated.getTime()) / 1000 / 60;
      return sum + minutes;
    }, 0) / lines.length;

  // Convert to 0-100 scale (lower minutes = higher score)
  // 0 minutes = 100, 60+ minutes = 0
  return Math.max(0, Math.min(100, 100 - avgMinutesSinceUpdate * (100 / STABILITY_MAX_MINUTES)));
}

/**
 * Calculate volatility score (how much lines disagree)
 * Higher score = more volatile
 */
export function calculateVolatilityScore(lines: SportsbookLine[]): number {
  const disagreement = calculateLineDisagreement(lines);
  // Convert to 0-100 scale
  // 0 disagreement = 0, 0.20+ disagreement = 100
  return Math.min(100, disagreement * VOLATILITY_SCALE_FACTOR);
}

/**
 * Find the best book (highest odds) for a given outcome
 */
export function findBestBook(lines: SportsbookLine[]): OntarioSportsbook {
  if (lines.length === 0) return 'DraftKings'; // Default fallback

  const bestLine = lines.reduce((best, line) =>
    line.odds.decimal > best.odds.decimal ? line : best
  );

  return bestLine.sportsbook;
}

/**
 * Convert The Odds API event with odds to EVOpportunity
 */
export function normalizeToEVOpportunity(
  event: OddsAPIEvent,
  marketKey: string,
  outcomeName: string
): EVOpportunity | null {
  const game = normalizeGame(event);
  if (!game) return null;

  const ontarioBookmakers = filterOntarioBookmakers(event.bookmakers || []);
  if (ontarioBookmakers.length === 0) return null;

  // Get lines for this specific outcome
  const lines = normalizeSportsbookLines(
    ontarioBookmakers,
    marketKey,
    (outcome) => outcome.name === outcomeName
  );

  if (lines.length === 0) return null;

  // Calculate metrics
  const fairProb = calculateFairProbability(lines);
  const bestBook = findBestBook(lines);
  const bestOdds = lines.find((l) => l.sportsbook === bestBook)!.odds;
  
  // Calculate EV (fairProb * odds - 1) * 100
  const ev = calculateEV(fairProb, bestOdds.decimal);

  // Only return if positive EV
  if (ev <= 0) return null;

  const lineDisagreement = calculateLineDisagreement(lines);
  const confidence = calculateConfidence(ev, lines.length, lineDisagreement);
  const stabilityScore = calculateStabilityScore(lines);
  const volatilityScore = calculateVolatilityScore(lines);

  // Apply slippage (conservative adjustment)
  const slippageAdjustedEV = ev * SLIPPAGE_BUFFER;

  return {
    id: `${event.id}_${marketKey}_${outcomeName.replace(/\s+/g, '_')}`,
    sport: game.sport,
    betType: getBetType(marketKey),
    description: `${outcomeName} vs ${
      outcomeName === game.homeTeam ? game.awayTeam : game.homeTeam
    }`,
    estimatedEV: ev,
    slippageAdjustedEV,
    confidence,
    lines,
    fairProbability: fairProb,
    bestBook,
    game,
    detectedAt: new Date(),
    stabilityScore,
    volatilityScore,
  };
}

/**
 * Process all events and extract +EV opportunities
 */
export function extractEVOpportunities(
  events: OddsAPIEvent[],
  minEV: number = 2
): EVOpportunity[] {
  const opportunities: EVOpportunity[] = [];

  for (const event of events) {
    if (!event.bookmakers || event.bookmakers.length === 0) continue;

    // Process moneyline (h2h)
    const h2hMarket = event.bookmakers[0]?.markets.find((m) => m.key === 'h2h');
    if (h2hMarket) {
      for (const outcome of h2hMarket.outcomes) {
        const opp = normalizeToEVOpportunity(event, 'h2h', outcome.name);
        if (opp && opp.estimatedEV >= minEV) {
          opportunities.push(opp);
        }
      }
    }

    // Process spreads
    const spreadsMarket = event.bookmakers[0]?.markets.find(
      (m) => m.key === 'spreads'
    );
    if (spreadsMarket) {
      for (const outcome of spreadsMarket.outcomes) {
        const opp = normalizeToEVOpportunity(event, 'spreads', outcome.name);
        if (opp && opp.estimatedEV >= minEV) {
          opportunities.push(opp);
        }
      }
    }

    // Process totals
    const totalsMarket = event.bookmakers[0]?.markets.find(
      (m) => m.key === 'totals'
    );
    if (totalsMarket) {
      for (const outcome of totalsMarket.outcomes) {
        const opp = normalizeToEVOpportunity(event, 'totals', outcome.name);
        if (opp && opp.estimatedEV >= minEV) {
          opportunities.push(opp);
        }
      }
    }
  }

  // Sort by EV descending
  return opportunities.sort((a, b) => b.estimatedEV - a.estimatedEV);
}
