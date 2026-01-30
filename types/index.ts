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

export type Sportsbook = typeof ONTARIO_SPORTSBOOKS[number];

export type Sport = 'NBA' | 'NHL';

export type BetType = 'moneyline' | 'spread' | 'totals' | 'prop';

export type MarketType = 'h2h' | 'spreads' | 'totals';

// Odds structure
export interface OddsData {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Bookmaker[];
}

export interface Bookmaker {
  key: string;
  title: string;
  last_update: string;
  markets: Market[];
}

export interface Market {
  key: MarketType;
  last_update: string;
  outcomes: Outcome[];
}

export interface Outcome {
  name: string;
  price: number;
  point?: number;
}

// Arbitrage opportunity
export interface ArbitrageOpportunity {
  id: string;
  sport: Sport;
  homeTeam: string;
  awayTeam: string;
  marketType: MarketType;
  commenceTime: string;
  bets: ArbitrageBet[];
  profitPercentage: number;
  guaranteedProfit: number;
  totalStake: number;
  ageMinutes: number;
}

export interface ArbitrageBet {
  sportsbook: Sportsbook;
  outcome: string;
  odds: number;
  stake: number;
  point?: number;
}

// Player Props
export interface PlayerProp {
  id: string;
  sport: Sport;
  player: string;
  team: string;
  opponent: string;
  category: PropCategory;
  line: number;
  overOdds: PropOdds[];
  underOdds: PropOdds[];
  bestOver?: PropOdds;
  bestUnder?: PropOdds;
  arbOpportunity?: boolean;
  commenceTime: string;
}

export interface PropOdds {
  sportsbook: Sportsbook;
  odds: number;
}

export type PropCategory =
  // NBA
  | 'points'
  | 'rebounds'
  | 'assists'
  | 'threes'
  | 'steals'
  | 'blocks'
  | 'turnovers'
  | 'pra'
  | 'points_rebounds'
  | 'points_assists'
  // NHL
  | 'goals'
  | 'assists_nhl'
  | 'points_nhl'
  | 'shots'
  | 'saves'
  | 'powerplay_points';

// Player Statistics
export interface PlayerStats {
  playerId: string;
  playerName: string;
  team: string;
  sport: Sport;
  seasonAverages: StatAverages;
  last5Games: StatAverages;
  last10Games: StatAverages;
  last20Games: StatAverages;
  homeStats: StatAverages;
  awayStats: StatAverages;
  vsOpponent?: StatAverages;
  propHitRates: PropHitRate[];
}

export interface StatAverages {
  gamesPlayed: number;
  [key: string]: number;
}

export interface PropHitRate {
  category: PropCategory;
  line: number;
  hitRate: number;
  overCount: number;
  underCount: number;
  distribution: number[];
}

// Team Statistics
export interface TeamStats {
  teamId: string;
  teamName: string;
  sport: Sport;
  offensiveRating: number;
  defensiveRating: number;
  pace: number;
  recentForm: string[];
  homeRecord: string;
  awayRecord: string;
}

// Parlay
export interface Parlay {
  id: string;
  bets: ParlayBet[];
  combinedOdds: number;
  stake: number;
  potentialPayout: number;
  risk: 'low' | 'medium' | 'high';
  bestSportsbook?: Sportsbook;
}

export interface ParlayBet {
  type: 'game' | 'prop';
  description: string;
  odds: number;
  selection: string;
}

// Settings & Preferences
export interface UserSettings {
  selectedSportsbooks: Sportsbook[];
  favoritePlayers: string[];
  favoriteTeams: string[];
  minProfitPercentage: number;
  notifications: boolean;
  bankroll?: number;
}

// Bet History
export interface BetRecord {
  id: string;
  date: string;
  type: BetType;
  description: string;
  stake: number;
  odds: number;
  result?: 'win' | 'loss' | 'push' | 'pending';
  profit?: number;
  sportsbook: Sportsbook;
}

// Copy to App Format
export interface CopyFormat {
  sportsbook: Sportsbook;
  text: string;
  deepLink?: string;
}
