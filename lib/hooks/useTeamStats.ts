import { useQuery } from '@tanstack/react-query';

interface TeamStatsResponse {
  data: any;
  meta: {
    sport: string;
    source: string;
    timestamp: string;
    note?: string;
  };
}

export function useTeamStats(
  sport: 'nba' | 'nhl',
  teamId?: string,
  teamAbbr?: string
) {
  return useQuery<TeamStatsResponse>({
    queryKey: ['team-stats', sport, teamId, teamAbbr],
    queryFn: async () => {
      const params = new URLSearchParams({ sport });
      if (teamId) params.append('teamId', teamId);
      if (teamAbbr) params.append('teamAbbr', teamAbbr);

      const response = await fetch(`/api/stats/team?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch team stats');
      }
      return response.json();
    },
    enabled: !!(teamId || teamAbbr),
    refetchInterval: 3600000, // 1 hour
    staleTime: 1800000, // 30 minutes
  });
}
