import { useQuery } from '@tanstack/react-query';
import { OddsAPIEvent } from '../api/odds-normalizer';

interface OddsResponse {
  data: OddsAPIEvent[];
  meta: {
    sport: string;
    timestamp: string;
    count: number;
  };
}

export function useOdds(sport: 'nba' | 'nhl') {
  return useQuery<OddsResponse>({
    queryKey: ['odds', sport],
    queryFn: async () => {
      const response = await fetch(`/api/odds?sport=${sport}`);
      if (!response.ok) {
        throw new Error('Failed to fetch odds');
      }
      return response.json();
    },
    refetchInterval: 60000, // Refresh every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  });
}
