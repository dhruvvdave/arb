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
  'williamhill_us', // Caesars
  'unibet_us',
  '888sport',
  'betrivers',
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

  // Map our sport names to API sport keys
  const sportMap: Record<string, string> = {
    'nba': 'basketball_nba',
    'nhl': 'icehockey_nhl',
    'basketball_nba': 'basketball_nba',
    'icehockey_nhl': 'icehockey_nhl',
  };

  const sportKey = sportMap[sport.toLowerCase()] || sport;

  try {
    // Fetch odds for the sport
    const url = new URL(`${ODDS_API_BASE_URL}/sports/${sportKey}/odds/`);
    url.searchParams.set('apiKey', ODDS_API_KEY);
    url.searchParams.set('regions', 'us'); // US region includes Ontario books
    url.searchParams.set('markets', 'h2h,spreads,totals'); // Moneyline, spreads, totals
    url.searchParams.set('oddsFormat', 'decimal');
    url.searchParams.set('bookmakers', ONTARIO_BOOKMAKERS.join(','));

    const response = await fetch(url.toString(), {
      next: { revalidate: 30 }, // Cache for 30 seconds
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Odds API error:', response.status, errorText);
      
      if (response.status === 429) {
        return NextResponse.json(
          { error: 'API rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to fetch odds data' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Add metadata
    return NextResponse.json({
      data,
      meta: {
        sport: sportKey,
        timestamp: new Date().toISOString(),
        count: data.length,
      },
    });
  } catch (error) {
    console.error('Error fetching odds:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
