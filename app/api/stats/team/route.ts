import { NextRequest, NextResponse } from 'next/server';

const BALLDONTLIE_API_KEY = process.env.BALLDONTLIE_API_KEY;
const BALLDONTLIE_BASE_URL = 'https://api.balldontlie.io/v1';

// NHL API is free and doesn't require authentication
const NHL_API_BASE_URL = 'https://api-web.nhle.com/v1';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sport = searchParams.get('sport') || 'nba';
  const teamId = searchParams.get('teamId');
  const teamAbbr = searchParams.get('teamAbbr'); // Team abbreviation (e.g., 'LAL', 'TOR')

  if (!teamId && !teamAbbr) {
    return NextResponse.json(
      { error: 'Either teamId or teamAbbr is required' },
      { status: 400 }
    );
  }

  try {
    if (sport.toLowerCase() === 'nba') {
      if (!BALLDONTLIE_API_KEY) {
        return NextResponse.json(
          { error: 'BALLDONTLIE_API_KEY not configured' },
          { status: 500 }
        );
      }

      // Note: balldontlie.io v1 has limited team stats
      // Typically you'd need to aggregate player stats or use another endpoint
      // For now, return team info
      
      const url = teamId 
        ? `${BALLDONTLIE_BASE_URL}/teams/${teamId}`
        : `${BALLDONTLIE_BASE_URL}/teams`;

      const response = await fetch(url, {
        headers: {
          'Authorization': BALLDONTLIE_API_KEY,
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      });

      if (!response.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch NBA team data' },
          { status: response.status }
        );
      }

      const data = await response.json();

      return NextResponse.json({
        data: data.data,
        meta: {
          sport: 'nba',
          source: 'balldontlie.io',
          timestamp: new Date().toISOString(),
          note: 'Full team stats coming soon',
        },
      });

    } else if (sport.toLowerCase() === 'nhl') {
      // NHL API provides comprehensive team stats
      if (!teamAbbr) {
        return NextResponse.json(
          { error: 'NHL API requires teamAbbr (3-letter code like TOR, LAK)' },
          { status: 400 }
        );
      }

      const url = `${NHL_API_BASE_URL}/club-stats/${teamAbbr}/now`;

      const response = await fetch(url, {
        next: { revalidate: 3600 },
      });

      if (!response.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch NHL team stats' },
          { status: response.status }
        );
      }

      const data = await response.json();

      return NextResponse.json({
        data,
        meta: {
          sport: 'nhl',
          source: 'NHL API',
          timestamp: new Date().toISOString(),
        },
      });
    } else {
      return NextResponse.json(
        { error: 'Unsupported sport. Use "nba" or "nhl"' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error fetching team stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
