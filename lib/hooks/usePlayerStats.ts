import { useQuery } from '@tanstack/react-query';

interface PlayerStatsResponse {
  data: any;
  meta: {
    sport: string;
    source: string;
    timestamp: string;
  };
}

export function usePlayerStats(
  sport: 'nba' | 'nhl',
  playerId?: string,
  playerName?: string
) {
  return useQuery<PlayerStatsResponse>({
    queryKey: ['player-stats', sport, playerId, playerName],
    queryFn: async () => {
      const params = new URLSearchParams({ sport });
      if (playerId) params.append('playerId', playerId);
      if (playerName) params.append('playerName', playerName);

      const response = await fetch(`/api/stats/player?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch player stats');
      }
      return response.json();
    },
    enabled: !!(playerId || playerName),
    refetchInterval: 3600000, // 1 hour
    staleTime: 1800000, // 30 minutes
  });
}
