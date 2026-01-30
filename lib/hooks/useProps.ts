import { useQuery } from '@tanstack/react-query';
import { OddsAPIEvent } from '../api/odds-normalizer';

interface PropsResponse {
  data: OddsAPIEvent | OddsAPIEvent[];
  meta: {
    sport: string;
    eventId?: string;
    timestamp: string;
    count?: number;
    note?: string;
  };
}

export function useProps(sport: 'nba' | 'nhl', eventId?: string, enabled: boolean = true) {
  return useQuery<PropsResponse>({
    queryKey: ['props', sport, eventId],
    queryFn: async () => {
      const url = eventId
        ? `/api/props?sport=${sport}&eventId=${eventId}`
        : `/api/props?sport=${sport}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch props');
      }
      return response.json();
    },
    enabled, // Can be disabled when in mock mode
    refetchInterval: 60000,
    staleTime: 30000,
  });
}
