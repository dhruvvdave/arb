// Ontario Legal Sportsbooks
export const ONTARIO_SPORTSBOOKS = [
  'bet365',
  'BetMGM',
  'DraftKings',
  'FanDuel',
  'PointsBet',
  'Betway',
  'Caesars',
  'theScore Bet',
  'Unibet',
  '888sport',
  'BetRivers',
  'Betano',
  'Sports Interaction',
] as const;

export type OntarioSportsbook = typeof ONTARIO_SPORTSBOOKS[number];

// Odds formats
export type OddsFormat = 'american' | 'decimal' | 'fractional';

// Sports
export type Sport = 'NBA' | 'NHL';

// Bet types
export type BetType = 'moneyline' | 'spread' | 'totals' | 'props';

// Prop categories
export type NBAProps = 'points' | 'rebounds' | 'assists' | '3pm' | 'steals' | 'blocks' | 'pra' | 'pr' | 'pa' | 'ra';
export type NHLProps = 'goals' | 'assists' | 'points' | 'shots' | 'saves' | 'pp_points';
export type PropCategory = NBAProps | NHLProps;

// Confidence levels
export type ConfidenceLevel = 'Low' | 'Medium' | 'High';

// Risk tiers
export type RiskTier = 'Low' | 'Medium' | 'High' | 'Spicy';

// Odds representation
export interface Odds {
  american: number;
  decimal: number;
  impliedProbability: number;
  noVigProbability: number;
}

// Sportsbook line
export interface SportsbookLine {
  sportsbook: OntarioSportsbook;
  odds: Odds;
  line?: number; // For spreads and totals
  lastUpdated: Date;
}

// Base opportunity
export interface BaseOpportunity {
  id: string;
  sport: Sport;
  betType: BetType;
  detectedAt: Date;
  stabilityScore: number; // 0-100
  volatilityScore: number; // 0-100
}

// +EV Opportunity
export interface EVOpportunity extends BaseOpportunity {
  description: string;
  estimatedEV: number; // percentage
  confidence: ConfidenceLevel;
  lines: SportsbookLine[];
  fairProbability: number;
  slippageAdjustedEV: number;
  bestBook: OntarioSportsbook;
  game: GameInfo;
}

// Game information
export interface GameInfo {
  id: string;
  sport: Sport;
  homeTeam: string;
  awayTeam: string;
  startTime: Date;
  homeTeamLogo?: string;
  awayTeamLogo?: string;
}

// Player information
export interface PlayerInfo {
  id: string;
  name: string;
  team: string;
  position: string;
  jerseyNumber?: string;
  photoUrl?: string;
}

// Prop opportunity
export interface PropOpportunity {
  id: string;
  player: PlayerInfo;
  game: GameInfo;
  category: PropCategory;
  line: number;
  lines: SportsbookLine[];
  lineDisagreement: number; // Standard deviation of lines
  historicalHitRate: {
    atLine: number;
    aboveLine: number;
    belowLine: number;
  };
  context: PropContext;
  estimatedEV: number;
  confidence: ConfidenceLevel;
  detectedAt: Date;
  insight?: string;
}

// Context for prop analysis
export interface PropContext {
  defenseVsPosition?: number; // Rank 1-30
  usageTrend?: 'increasing' | 'stable' | 'decreasing';
  recentGames: {
    last5Avg: number;
    last10Avg: number;
    last20Avg: number;
  };
  homeAwaySplit?: {
    home: number;
    away: number;
  };
  isBackToBack: boolean;
  opponentPace?: number; // Possessions per game
  minutesTrend?: number; // Average minutes last 5 games
}

// Parlay leg
export interface ParlayLeg {
  type: 'ev' | 'prop';
  opportunity: EVOpportunity | PropOpportunity;
  odds: Odds;
}

// Parlay
export interface Parlay {
  id: string;
  legs: ParlayLeg[];
  combinedOdds: Odds;
  estimatedEV: number;
  confidence: ConfidenceLevel;
  riskTier: RiskTier;
  correlationWarnings: string[];
  reasoning: string;
  bestBook: OntarioSportsbook;
  createdAt: Date;
}

// Player stats
export interface PlayerStats {
  playerId: string;
  season: {
    gamesPlayed: number;
    averages: Record<string, number>;
  };
  splits: {
    last5: Record<string, number>;
    last10: Record<string, number>;
    last20: Record<string, number>;
    home: Record<string, number>;
    away: Record<string, number>;
    vsDivision?: Record<string, number>;
  };
  trends: {
    stat: string;
    values: number[];
    dates: Date[];
  }[];
}

// Team stats
export interface TeamStats {
  teamId: string;
  pace: number;
  offensiveRating: number;
  defensiveRating: number;
  pointsAllowedByPosition: Record<string, number>;
  recentForm: {
    wins: number;
    losses: number;
    last10: string; // e.g., "7-3"
  };
}

// Alert/Notification
export interface Alert {
  id: string;
  type: 'ev_threshold' | 'stable_line' | 'volatility_low' | 'odds_moved';
  opportunity: EVOpportunity | PropOpportunity;
  message: string;
  timestamp: Date;
  read: boolean;
}

// User preferences
export interface UserPreferences {
  selectedBooks: OntarioSportsbook[];
  minEVThreshold: number;
  sports: Sport[];
  betTypes: BetType[];
  notifications: {
    evThreshold: boolean;
    stableLine: boolean;
    oddsMovement: boolean;
  };
  darkMode: boolean;
}

// Filter options
export interface FilterOptions {
  sport?: Sport;
  minEV?: number;
  betType?: BetType;
  stabilityWindow?: number; // minutes
  confidence?: ConfidenceLevel[];
  sportsbooks?: OntarioSportsbook[];
}
