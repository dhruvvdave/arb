import { ArbitrageOpportunity, PlayerProp, PlayerStats, TeamStats, Sportsbook } from '@/types';

// Mock Arbitrage Opportunities
export const mockArbitrageOpportunities: ArbitrageOpportunity[] = [
  {
    id: 'arb-1',
    sport: 'NBA',
    homeTeam: 'Toronto Raptors',
    awayTeam: 'Boston Celtics',
    marketType: 'h2h',
    commenceTime: new Date(Date.now() + 3600000 * 2).toISOString(),
    bets: [
      {
        sportsbook: 'bet365',
        outcome: 'Boston Celtics',
        odds: -150,
        stake: 600,
      },
      {
        sportsbook: 'FanDuel',
        outcome: 'Toronto Raptors',
        odds: 180,
        stake: 400,
      },
    ],
    profitPercentage: 2.38,
    guaranteedProfit: 23.80,
    totalStake: 1000,
    ageMinutes: 5,
  },
  {
    id: 'arb-2',
    sport: 'NHL',
    homeTeam: 'Toronto Maple Leafs',
    awayTeam: 'Montreal Canadiens',
    marketType: 'totals',
    commenceTime: new Date(Date.now() + 3600000 * 4).toISOString(),
    bets: [
      {
        sportsbook: 'DraftKings',
        outcome: 'Over 6.5',
        odds: -105,
        stake: 525,
        point: 6.5,
      },
      {
        sportsbook: 'BetMGM',
        outcome: 'Under 6.5',
        odds: 110,
        stake: 475,
        point: 6.5,
      },
    ],
    profitPercentage: 1.43,
    guaranteedProfit: 14.30,
    totalStake: 1000,
    ageMinutes: 12,
  },
  {
    id: 'arb-3',
    sport: 'NBA',
    homeTeam: 'Los Angeles Lakers',
    awayTeam: 'Golden State Warriors',
    marketType: 'spreads',
    commenceTime: new Date(Date.now() + 3600000 * 6).toISOString(),
    bets: [
      {
        sportsbook: 'Caesars',
        outcome: 'Lakers -5.5',
        odds: -108,
        stake: 520,
        point: -5.5,
      },
      {
        sportsbook: 'PointsBet',
        outcome: 'Warriors +5.5',
        odds: 115,
        stake: 480,
        point: 5.5,
      },
    ],
    profitPercentage: 1.85,
    guaranteedProfit: 18.50,
    totalStake: 1000,
    ageMinutes: 3,
  },
];

// Mock Player Props
export const mockPlayerProps: PlayerProp[] = [
  {
    id: 'prop-1',
    sport: 'NBA',
    player: 'Scottie Barnes',
    team: 'Toronto Raptors',
    opponent: 'Boston Celtics',
    category: 'points',
    line: 20.5,
    overOdds: [
      { sportsbook: 'bet365', odds: -115 },
      { sportsbook: 'DraftKings', odds: -110 },
      { sportsbook: 'FanDuel', odds: -120 },
      { sportsbook: 'BetMGM', odds: -108 },
    ],
    underOdds: [
      { sportsbook: 'bet365', odds: -105 },
      { sportsbook: 'DraftKings', odds: -110 },
      { sportsbook: 'FanDuel', odds: 100 },
      { sportsbook: 'BetMGM', odds: -112 },
    ],
    bestOver: { sportsbook: 'BetMGM', odds: -108 },
    bestUnder: { sportsbook: 'FanDuel', odds: 100 },
    arbOpportunity: false,
    commenceTime: new Date(Date.now() + 3600000 * 2).toISOString(),
  },
  {
    id: 'prop-2',
    sport: 'NBA',
    player: 'RJ Barrett',
    team: 'Toronto Raptors',
    opponent: 'Boston Celtics',
    category: 'pra',
    line: 32.5,
    overOdds: [
      { sportsbook: 'bet365', odds: -110 },
      { sportsbook: 'Caesars', odds: 105 },
      { sportsbook: 'theScore Bet', odds: -115 },
    ],
    underOdds: [
      { sportsbook: 'bet365', odds: -110 },
      { sportsbook: 'Caesars', odds: -125 },
      { sportsbook: 'theScore Bet', odds: -105 },
    ],
    bestOver: { sportsbook: 'Caesars', odds: 105 },
    bestUnder: { sportsbook: 'theScore Bet', odds: -105 },
    arbOpportunity: true,
    commenceTime: new Date(Date.now() + 3600000 * 2).toISOString(),
  },
  {
    id: 'prop-3',
    sport: 'NHL',
    player: 'Auston Matthews',
    team: 'Toronto Maple Leafs',
    opponent: 'Montreal Canadiens',
    category: 'goals',
    line: 0.5,
    overOdds: [
      { sportsbook: 'bet365', odds: 180 },
      { sportsbook: 'DraftKings', odds: 175 },
      { sportsbook: 'FanDuel', odds: 185 },
      { sportsbook: 'Betway', odds: 190 },
    ],
    underOdds: [
      { sportsbook: 'bet365', odds: -220 },
      { sportsbook: 'DraftKings', odds: -215 },
      { sportsbook: 'FanDuel', odds: -225 },
      { sportsbook: 'Betway', odds: -230 },
    ],
    bestOver: { sportsbook: 'Betway', odds: 190 },
    bestUnder: { sportsbook: 'DraftKings', odds: -215 },
    arbOpportunity: false,
    commenceTime: new Date(Date.now() + 3600000 * 4).toISOString(),
  },
  {
    id: 'prop-4',
    sport: 'NHL',
    player: 'Mitch Marner',
    team: 'Toronto Maple Leafs',
    opponent: 'Montreal Canadiens',
    category: 'assists_nhl',
    line: 0.5,
    overOdds: [
      { sportsbook: 'bet365', odds: 140 },
      { sportsbook: 'BetMGM', odds: 145 },
      { sportsbook: 'Unibet', odds: 150 },
    ],
    underOdds: [
      { sportsbook: 'bet365', odds: -170 },
      { sportsbook: 'BetMGM', odds: -165 },
      { sportsbook: 'Unibet', odds: -180 },
    ],
    bestOver: { sportsbook: 'Unibet', odds: 150 },
    bestUnder: { sportsbook: 'BetMGM', odds: -165 },
    arbOpportunity: false,
    commenceTime: new Date(Date.now() + 3600000 * 4).toISOString(),
  },
];

// Mock Player Statistics
export const mockPlayerStats: Record<string, PlayerStats> = {
  'scottie-barnes': {
    playerId: 'scottie-barnes',
    playerName: 'Scottie Barnes',
    team: 'Toronto Raptors',
    sport: 'NBA',
    seasonAverages: {
      gamesPlayed: 45,
      points: 19.8,
      rebounds: 8.4,
      assists: 6.1,
      steals: 1.2,
      blocks: 0.8,
      threes: 1.3,
    },
    last5Games: {
      gamesPlayed: 5,
      points: 22.4,
      rebounds: 9.2,
      assists: 6.8,
      steals: 1.4,
      blocks: 1.0,
      threes: 1.6,
    },
    last10Games: {
      gamesPlayed: 10,
      points: 21.1,
      rebounds: 8.8,
      assists: 6.5,
      steals: 1.3,
      blocks: 0.9,
      threes: 1.5,
    },
    last20Games: {
      gamesPlayed: 20,
      points: 20.3,
      rebounds: 8.6,
      assists: 6.3,
      steals: 1.25,
      blocks: 0.85,
      threes: 1.4,
    },
    homeStats: {
      gamesPlayed: 22,
      points: 21.2,
      rebounds: 9.1,
      assists: 6.5,
    },
    awayStats: {
      gamesPlayed: 23,
      points: 18.5,
      rebounds: 7.8,
      assists: 5.7,
    },
    propHitRates: [
      {
        category: 'points',
        line: 20.5,
        hitRate: 54,
        overCount: 24,
        underCount: 21,
        distribution: [2, 5, 8, 12, 10, 6, 2],
      },
    ],
  },
  'auston-matthews': {
    playerId: 'auston-matthews',
    playerName: 'Auston Matthews',
    team: 'Toronto Maple Leafs',
    sport: 'NHL',
    seasonAverages: {
      gamesPlayed: 38,
      goals: 0.79,
      assists: 0.68,
      points: 1.47,
      shots: 4.2,
    },
    last5Games: {
      gamesPlayed: 5,
      goals: 1.2,
      assists: 0.8,
      points: 2.0,
      shots: 5.0,
    },
    last10Games: {
      gamesPlayed: 10,
      goals: 0.9,
      assists: 0.7,
      points: 1.6,
      shots: 4.5,
    },
    last20Games: {
      gamesPlayed: 20,
      goals: 0.85,
      assists: 0.7,
      points: 1.55,
      shots: 4.3,
    },
    homeStats: {
      gamesPlayed: 19,
      goals: 0.89,
      assists: 0.74,
      points: 1.63,
    },
    awayStats: {
      gamesPlayed: 19,
      goals: 0.68,
      assists: 0.63,
      points: 1.31,
    },
    propHitRates: [
      {
        category: 'goals',
        line: 0.5,
        hitRate: 68,
        overCount: 26,
        underCount: 12,
        distribution: [12, 15, 8, 3],
      },
    ],
  },
};

// Mock Team Statistics
export const mockTeamStats: TeamStats[] = [
  {
    teamId: 'tor-raptors',
    teamName: 'Toronto Raptors',
    sport: 'NBA',
    offensiveRating: 112.4,
    defensiveRating: 115.8,
    pace: 98.5,
    recentForm: ['W', 'L', 'W', 'W', 'L'],
    homeRecord: '15-8',
    awayRecord: '10-13',
  },
  {
    teamId: 'tor-maple-leafs',
    teamName: 'Toronto Maple Leafs',
    sport: 'NHL',
    offensiveRating: 3.41,
    defensiveRating: 2.89,
    pace: 60.2,
    recentForm: ['W', 'W', 'L', 'W', 'W'],
    homeRecord: '15-6-2',
    awayRecord: '12-8-3',
  },
];

// Helper function to get sportsbook logo (placeholder)
export function getSportsbookLogo(sportsbook: Sportsbook): string {
  // In a real app, these would be actual logo URLs
  return `/logos/${sportsbook.toLowerCase().replace(/\s+/g, '-')}.png`;
}

// Helper function to get random sportsbook
export function getRandomSportsbook(): Sportsbook {
  const sportsbooks: Sportsbook[] = [
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
  ];
  return sportsbooks[Math.floor(Math.random() * sportsbooks.length)];
}
