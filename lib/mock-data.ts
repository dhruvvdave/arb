import {
  EVOpportunity,
  PropOpportunity,
  GameInfo,
  PlayerInfo,
  Sport,
  OntarioSportsbook,
  ONTARIO_SPORTSBOOKS,
  PlayerStats,
  TeamStats,
  PropCategory,
  Parlay,
  Alert,
} from './types';
import { createOddsObject, calculateEV, estimateFairProbability, calculateParlayOdds, calculateParlayEV } from './odds-calculator';

// Seeded random number generator for consistent SSR/client rendering
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  reset(seed: number) {
    this.seed = seed;
  }
}

const rng = new SeededRandom(12345); // Fixed seed for deterministic output

const NBA_TEAMS = [
  'Lakers', 'Celtics', 'Warriors', 'Bucks', 'Heat', 'Nuggets', 'Suns', '76ers',
  'Mavericks', 'Clippers', 'Knicks', 'Nets', 'Raptors', 'Bulls', 'Hawks', 'Cavaliers'
];

const NHL_TEAMS = [
  'Maple Leafs', 'Canadiens', 'Bruins', 'Rangers', 'Lightning', 'Avalanche', 'Golden Knights', 'Oilers',
  'Flames', 'Jets', 'Canucks', 'Senators', 'Penguins', 'Capitals', 'Panthers', 'Red Wings'
];

const NBA_PLAYERS = [
  { name: 'LeBron James', team: 'Lakers', position: 'F' },
  { name: 'Giannis Antetokounmpo', team: 'Bucks', position: 'F' },
  { name: 'Luka Doncic', team: 'Mavericks', position: 'G' },
  { name: 'Stephen Curry', team: 'Warriors', position: 'G' },
  { name: 'Kevin Durant', team: 'Suns', position: 'F' },
  { name: 'Nikola Jokic', team: 'Nuggets', position: 'C' },
  { name: 'Joel Embiid', team: '76ers', position: 'C' },
  { name: 'Jayson Tatum', team: 'Celtics', position: 'F' },
];

const NHL_PLAYERS = [
  { name: 'Connor McDavid', team: 'Oilers', position: 'C' },
  { name: 'Auston Matthews', team: 'Maple Leafs', position: 'C' },
  { name: 'Nathan MacKinnon', team: 'Avalanche', position: 'C' },
  { name: 'Leon Draisaitl', team: 'Oilers', position: 'C' },
  { name: 'David Pastrnak', team: 'Bruins', position: 'RW' },
];

function randomElement<T>(array: T[]): T {
  return array[Math.floor(rng.next() * array.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(rng.next() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals: number = 1): number {
  return parseFloat((rng.next() * (max - min) + min).toFixed(decimals));
}

function generateGameId(): string {
  return `game_${Date.now()}_${randomInt(1000, 9999)}`;
}

function generateGame(sport: Sport): GameInfo {
  const teams = sport === 'NBA' ? NBA_TEAMS : NHL_TEAMS;
  const homeTeam = randomElement(teams);
  let awayTeam = randomElement(teams);
  while (awayTeam === homeTeam) {
    awayTeam = randomElement(teams);
  }

  return {
    id: generateGameId(),
    sport,
    homeTeam,
    awayTeam,
    startTime: new Date(Date.now() + randomInt(1, 48) * 60 * 60 * 1000),
  };
}

function generatePlayer(sport: Sport): PlayerInfo {
  const players = sport === 'NBA' ? NBA_PLAYERS : NHL_PLAYERS;
  const player = randomElement(players);
  
  return {
    id: `player_${player.name.toLowerCase().replace(/\s+/g, '_')}`,
    name: player.name,
    team: player.team,
    position: player.position,
    jerseyNumber: randomInt(0, 99).toString(),
  };
}

function generateSportsbookLines(baseOdds: number, count: number = 5) {
  const books = [...ONTARIO_SPORTSBOOKS].sort(() => rng.next() - 0.5).slice(0, count) as OntarioSportsbook[];
  
  return books.map(book => ({
    sportsbook: book,
    odds: createOddsObject(baseOdds + randomInt(-15, 15)),
    lastUpdated: new Date(Date.now() - randomInt(1, 60) * 60 * 1000),
  }));
}

export function generateEVOpportunities(count: number = 10): EVOpportunity[] {
  rng.reset(12345); // Reset seed for consistency
  const opportunities: EVOpportunity[] = [];
  
  for (let i = 0; i < count; i++) {
    const sport = randomElement<Sport>(['NBA', 'NHL']);
    const game = generateGame(sport);
    const betType = randomElement(['moneyline', 'spread', 'totals'] as const);
    const baseOdds = randomInt(-200, 200);
    const lines = generateSportsbookLines(baseOdds, randomInt(3, 7));
    
    // Calculate fair probability and EV
    const fairProb = randomFloat(0.45, 0.65, 2);
    const bestOdds = Math.max(...lines.map(l => l.odds.decimal));
    const ev = calculateEV(fairProb, bestOdds);
    const slippageAdjustedEV = ev - randomFloat(1, 3, 1);
    
    opportunities.push({
      id: `ev_opp_${i + 1}`,
      sport,
      betType,
      description: `${game.awayTeam} @ ${game.homeTeam} - ${betType}`,
      estimatedEV: ev,
      confidence: ev > 8 ? 'High' : ev > 5 ? 'Medium' : 'Low',
      lines,
      fairProbability: fairProb,
      slippageAdjustedEV,
      bestBook: lines[0].sportsbook,
      game,
      detectedAt: new Date(Date.now() - randomInt(1, 120) * 60 * 1000),
      stabilityScore: randomInt(60, 95),
      volatilityScore: randomInt(10, 40),
    });
  }
  
  return opportunities.sort((a, b) => b.estimatedEV - a.estimatedEV);
}

export function generatePropOpportunities(count: number = 15): PropOpportunity[] {
  rng.reset(54321); // Reset seed for consistency (different from EV opps)
  const opportunities: PropOpportunity[] = [];
  
  for (let i = 0; i < count; i++) {
    const sport = randomElement<Sport>(['NBA', 'NHL']);
    const game = generateGame(sport);
    const player = generatePlayer(sport);
    
    let category: PropCategory;
    let line: number;
    
    if (sport === 'NBA') {
      category = randomElement(['points', 'rebounds', 'assists', '3pm', 'pra'] as const);
      line = category === 'points' ? randomFloat(18.5, 32.5, 1) :
             category === 'rebounds' ? randomFloat(6.5, 14.5, 1) :
             category === 'assists' ? randomFloat(4.5, 11.5, 1) :
             category === '3pm' ? randomFloat(2.5, 4.5, 1) :
             randomFloat(35.5, 55.5, 1); // PRA
    } else {
      category = randomElement(['goals', 'assists', 'points', 'shots'] as const);
      line = category === 'goals' ? randomFloat(0.5, 1.5, 1) :
             category === 'assists' ? randomFloat(0.5, 1.5, 1) :
             category === 'points' ? randomFloat(0.5, 2.5, 1) :
             randomFloat(2.5, 4.5, 1); // Shots
    }
    
    const baseOdds = randomInt(-130, -100);
    const lines = generateSportsbookLines(baseOdds, randomInt(4, 8));
    
    // Historical hit rates
    const atLineRate = randomFloat(0.45, 0.65, 2);
    const historicalHitRate = {
      atLine: atLineRate,
      aboveLine: randomFloat(atLineRate - 0.1, atLineRate + 0.1, 2),
      belowLine: 1 - atLineRate,
    };
    
    // Calculate EV
    const fairProb = estimateFairProbability(
      Math.floor(atLineRate * 100),
      100,
      randomFloat(0.95, 1.05, 2)
    );
    const bestOdds = Math.max(...lines.map(l => l.odds.decimal));
    const ev = calculateEV(fairProb, bestOdds);
    
    const context = {
      defenseVsPosition: randomInt(1, 30),
      usageTrend: randomElement(['increasing', 'stable', 'decreasing'] as const),
      recentGames: {
        last5Avg: line + randomFloat(-2, 3, 1),
        last10Avg: line + randomFloat(-1.5, 2, 1),
        last20Avg: line + randomFloat(-1, 1.5, 1),
      },
      homeAwaySplit: {
        home: line + randomFloat(-1, 2, 1),
        away: line + randomFloat(-2, 1, 1),
      },
      isBackToBack: rng.next() < 0.2,
      opponentPace: sport === 'NBA' ? randomFloat(95, 105, 1) : undefined,
      minutesTrend: sport === 'NBA' ? randomFloat(28, 38, 1) : randomFloat(16, 22, 1),
    };
    
    opportunities.push({
      id: `prop_opp_${i + 1}`,
      player,
      game,
      category,
      line,
      lines,
      lineDisagreement: randomFloat(0.1, 0.8, 2),
      historicalHitRate,
      context,
      estimatedEV: ev,
      confidence: ev > 6 ? 'High' : ev > 3 ? 'Medium' : 'Low',
      detectedAt: new Date(Date.now() - randomInt(5, 180) * 60 * 1000),
      insight: rng.next() > 0.5 ? `${player.name} has hit this in ${Math.floor(atLineRate * 10)} of last 10 games. ${context.defenseVsPosition <= 10 ? 'Opponent ranks bottom 10 vs ' + player.position + 's.' : ''}` : undefined,
    });
  }
  
  return opportunities.sort((a, b) => b.estimatedEV - a.estimatedEV);
}

export function generateParlays(count: number = 5): Parlay[] {
  rng.reset(67890); // Reset seed for consistency
  const parlays: Parlay[] = [];
  const props = generatePropOpportunities(20);
  
  for (let i = 0; i < count; i++) {
    const numLegs = randomInt(2, 4);
    const legs = props.slice(i * numLegs, (i + 1) * numLegs).map(prop => ({
      type: 'prop' as const,
      opportunity: prop,
      odds: prop.lines[0].odds,
    }));
    
    const legOdds = legs.map(leg => leg.odds.decimal);
    const combinedOdds = createOddsObject(
      decimalToAmerican(calculateParlayOdds(legOdds))
    );
    
    const fairProbs = legs.map(leg => {
      const prop = leg.opportunity as PropOpportunity;
      return prop.historicalHitRate.atLine;
    });
    
    const correlationFactor = randomFloat(0.85, 1.0, 2);
    const ev = calculateParlayEV(fairProbs, combinedOdds.decimal, correlationFactor);
    
    parlays.push({
      id: `parlay_${i + 1}`,
      legs,
      combinedOdds,
      estimatedEV: ev,
      confidence: ev > 10 ? 'High' : ev > 5 ? 'Medium' : 'Low',
      riskTier: numLegs === 2 ? 'Low' : numLegs === 3 ? 'Medium' : numLegs === 4 ? 'High' : 'Spicy',
      correlationWarnings: correlationFactor < 0.95 ? ['Some legs may be negatively correlated'] : [],
      reasoning: `This ${numLegs}-leg parlay combines high-confidence props with ${correlationFactor < 0.95 ? 'minimal' : 'low'} correlation risk.`,
      bestBook: randomElement([...ONTARIO_SPORTSBOOKS]) as OntarioSportsbook,
      createdAt: new Date(Date.now() - randomInt(10, 300) * 60 * 1000),
    });
  }
  
  return parlays.sort((a, b) => b.estimatedEV - a.estimatedEV);
}

function decimalToAmerican(decimal: number): number {
  if (decimal >= 2) {
    return Math.round((decimal - 1) * 100);
  } else {
    return Math.round(-100 / (decimal - 1));
  }
}

export function generatePlayerStats(playerId: string, sport: Sport): PlayerStats {
  rng.reset(11111); // Reset seed for consistency
  const baseStats: Record<string, number> = sport === 'NBA' 
    ? { points: 24.5, rebounds: 6.8, assists: 5.2, steals: 1.3, blocks: 0.8, '3pm': 2.1 }
    : { goals: 0.8, assists: 1.2, points: 2.0, shots: 3.5, hits: 2.8 };
  
  return {
    playerId,
    season: {
      gamesPlayed: randomInt(35, 65),
      averages: baseStats,
    },
    splits: {
      last5: Object.fromEntries(
        Object.entries(baseStats).map(([key, val]) => [key, val + randomFloat(-2, 2, 1)])
      ),
      last10: Object.fromEntries(
        Object.entries(baseStats).map(([key, val]) => [key, val + randomFloat(-1, 1, 1)])
      ),
      last20: Object.fromEntries(
        Object.entries(baseStats).map(([key, val]) => [key, val + randomFloat(-0.5, 0.5, 1)])
      ),
      home: Object.fromEntries(
        Object.entries(baseStats).map(([key, val]) => [key, val + randomFloat(-1, 2, 1)])
      ),
      away: Object.fromEntries(
        Object.entries(baseStats).map(([key, val]) => [key, val + randomFloat(-2, 1, 1)])
      ),
    },
    trends: Object.keys(baseStats).map(stat => ({
      stat,
      values: Array.from({ length: 10 }, () => baseStats[stat] + randomFloat(-3, 3, 1)),
      dates: Array.from({ length: 10 }, (_, i) => new Date(Date.now() - (9 - i) * 24 * 60 * 60 * 1000)),
    })),
  };
}

export function generateTeamStats(teamId: string, sport: Sport): TeamStats {
  rng.reset(22222); // Reset seed for consistency
  return {
    teamId,
    pace: sport === 'NBA' ? randomFloat(95, 105, 1) : randomFloat(55, 65, 1),
    offensiveRating: randomFloat(105, 120, 1),
    defensiveRating: randomFloat(105, 120, 1),
    pointsAllowedByPosition: sport === 'NBA' 
      ? { G: randomFloat(20, 30, 1), F: randomFloat(18, 28, 1), C: randomFloat(15, 25, 1) }
      : { C: randomFloat(0.7, 1.3, 1), W: randomFloat(0.6, 1.2, 1), D: randomFloat(0.3, 0.8, 1) },
    recentForm: {
      wins: randomInt(4, 8),
      losses: randomInt(2, 6),
      last10: `${randomInt(4, 8)}-${randomInt(2, 6)}`,
    },
  };
}

export function generateAlerts(count: number = 5): Alert[] {
  rng.reset(33333); // Reset seed for consistency
  const opportunities = generateEVOpportunities(count);
  
  return opportunities.map((opp, i) => ({
    id: `alert_${i + 1}`,
    type: randomElement(['ev_threshold', 'stable_line', 'volatility_low', 'odds_moved'] as const),
    opportunity: opp,
    message: `${opp.description} - ${opp.estimatedEV > 0 ? '+' : ''}${opp.estimatedEV.toFixed(1)}% EV detected`,
    timestamp: new Date(Date.now() - randomInt(1, 60) * 60 * 1000),
    read: rng.next() > 0.5,
  }));
}
