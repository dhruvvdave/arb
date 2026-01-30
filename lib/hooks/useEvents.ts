import { useQuery } from '@tanstack/react-query';
import { OddsAPIEvent } from '../api/odds-normalizer';

interface EventsResponse {
  data: OddsAPIEvent[];
  meta: {
    sport: string;
    timestamp: string;
    count: number;
  };
}

export function useEvents(sport: 'nba' | 'nhl') {
  return useQuery<EventsResponse>({
    queryKey: ['events', sport],
    queryFn: async () => {
      const response = await fetch(`/api/events?sport=${sport}`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      return response.json();
    },
    refetchInterval: 60000, // Refresh every minute
    staleTime: 30000,
  });
}
