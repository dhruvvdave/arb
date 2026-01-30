import { NextRequest, NextResponse } from 'next/server';

const ODDS_API_KEY = process.env.ODDS_API_KEY;
const ODDS_API_BASE_URL = 'https://api.the-odds-api.com/v4';

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
    // Fetch upcoming events for the sport
    const url = new URL(`${ODDS_API_BASE_URL}/sports/${sportKey}/events/`);
    url.searchParams.set('apiKey', ODDS_API_KEY);

    const response = await fetch(url.toString(), {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Events API error:', response.status, errorText);
      
      if (response.status === 429) {
        return NextResponse.json(
          { error: 'API rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to fetch events data' },
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
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
