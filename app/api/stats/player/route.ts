import { NextRequest, NextResponse } from 'next/server';

const BALLDONTLIE_API_KEY = process.env.BALLDONTLIE_API_KEY;
const BALLDONTLIE_BASE_URL = 'https://api.balldontlie.io/v1';

// NHL API is free and doesn't require authentication
const NHL_API_BASE_URL = 'https://api-web.nhle.com/v1';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sport = searchParams.get('sport') || 'nba';
  const playerId = searchParams.get('playerId');
  const playerName = searchParams.get('playerName');

  if (!playerId && !playerName) {
    return NextResponse.json(
      { error: 'Either playerId or playerName is required' },
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

      // Fetch NBA player stats from balldontlie.io
      let url: string;
      
      if (playerId) {
        // Get stats for specific player by ID
        url = `${BALLDONTLIE_BASE_URL}/season_averages?player_ids[]=${playerId}`;
      } else {
        // Search for player by name first
        const searchUrl = `${BALLDONTLIE_BASE_URL}/players?search=${encodeURIComponent(playerName!)}`;
        
        const searchResponse = await fetch(searchUrl, {
          headers: {
            'Authorization': BALLDONTLIE_API_KEY,
          },
          next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!searchResponse.ok) {
          return NextResponse.json(
            { error: 'Failed to search for player' },
            { status: searchResponse.status }
          );
        }

        const searchData = await searchResponse.json();
        
        if (!searchData.data || searchData.data.length === 0) {
          return NextResponse.json(
            { error: 'Player not found' },
            { status: 404 }
          );
        }

        const player = searchData.data[0];
        url = `${BALLDONTLIE_BASE_URL}/season_averages?player_ids[]=${player.id}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': BALLDONTLIE_API_KEY,
        },
        next: { revalidate: 3600 },
      });

      if (!response.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch NBA player stats' },
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
        },
      });

    } else if (sport.toLowerCase() === 'nhl') {
      // NHL API - simpler, no auth required
      // Note: NHL API structure is different, typically uses player IDs
      if (!playerId) {
        return NextResponse.json(
          { error: 'NHL API requires playerId (numeric ID)' },
          { status: 400 }
        );
      }

      const url = `${NHL_API_BASE_URL}/player/${playerId}/landing`;

      const response = await fetch(url, {
        next: { revalidate: 3600 },
      });

      if (!response.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch NHL player stats' },
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
    console.error('Error fetching player stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
