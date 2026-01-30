import { NextRequest, NextResponse } from 'next/server';

const ODDS_API_KEY = process.env.ODDS_API_KEY;
const ODDS_API_BASE_URL = 'https://api.the-odds-api.com/v4';

// Ontario-legal bookmakers
const ONTARIO_BOOKMAKERS = [
  'bet365',
  'betmgm',
  'draftkings',
  'fanduel',
  'pointsbetus',
  'betway',
  'williamhill_us',
  'unibet_us',
  '888sport',
  'betrivers',
];

// Player prop markets by sport
const NBA_PROP_MARKETS = [
  'player_points',
  'player_rebounds',
  'player_assists',
  'player_threes',
  'player_blocks',
  'player_steals',
  'player_points_rebounds_assists',
  'player_points_rebounds',
  'player_points_assists',
  'player_rebounds_assists',
];

const NHL_PROP_MARKETS = [
  'player_goals',
  'player_assists',
  'player_shots_on_goal',
  'player_saves',
];

export async function GET(request: NextRequest) {
  if (!ODDS_API_KEY) {
    return NextResponse.json(
      { error: 'ODDS_API_KEY not configured' },
      { status: 500 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const sport = searchParams.get('sport') || 'basketball_nba';
  const eventId = searchParams.get('eventId');

  // Map our sport names to API sport keys
  const sportMap: Record<string, string> = {
    'nba': 'basketball_nba',
    'nhl': 'icehockey_nhl',
    'basketball_nba': 'basketball_nba',
    'icehockey_nhl': 'icehockey_nhl',
  };

  const sportKey = sportMap[sport.toLowerCase()] || sport;

  // Select prop markets based on sport
  const propMarkets =
    sportKey === 'basketball_nba' ? NBA_PROP_MARKETS : NHL_PROP_MARKETS;

  try {
    if (eventId) {
      // Fetch props for a specific event
      const url = new URL(
        `${ODDS_API_BASE_URL}/sports/${sportKey}/events/${eventId}/odds/`
      );
      url.searchParams.set('apiKey', ODDS_API_KEY);
      url.searchParams.set('regions', 'us');
      url.searchParams.set('markets', propMarkets.join(','));
      url.searchParams.set('oddsFormat', 'decimal');
      url.searchParams.set('bookmakers', ONTARIO_BOOKMAKERS.join(','));

      const response = await fetch(url.toString(), {
        next: { revalidate: 30 },
      });

      if (!response.ok) {
        if (response.status === 429) {
          return NextResponse.json(
            { error: 'API rate limit exceeded. Please try again later.' },
            { status: 429 }
          );
        }

        return NextResponse.json(
          { error: 'Failed to fetch prop data' },
          { status: response.status }
        );
      }

      const data = await response.json();

      return NextResponse.json({
        data,
        meta: {
          sport: sportKey,
          eventId,
          timestamp: new Date().toISOString(),
        },
      });
    } else {
      // Fetch events first, then we can get props for each
      const eventsUrl = new URL(`${ODDS_API_BASE_URL}/sports/${sportKey}/events/`);
      eventsUrl.searchParams.set('apiKey', ODDS_API_KEY);

      const eventsResponse = await fetch(eventsUrl.toString(), {
        next: { revalidate: 60 },
      });

      if (!eventsResponse.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch events' },
          { status: eventsResponse.status }
        );
      }

      const events = await eventsResponse.json();

      // For demo, return events with metadata
      // In production, you might want to fetch props for each event
      return NextResponse.json({
        data: events,
        meta: {
          sport: sportKey,
          timestamp: new Date().toISOString(),
          count: events.length,
          note: 'Use eventId parameter to fetch props for specific games',
        },
      });
    }
  } catch (error) {
    console.error('Error fetching props:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
