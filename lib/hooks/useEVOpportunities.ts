import { useMemo } from 'react';
import { useOdds } from './useOdds';
import { EVOpportunity, Sport, FilterOptions } from '../types';
import { extractEVOpportunities } from '../api/odds-normalizer';

export function useEVOpportunities(
  sport: 'nba' | 'nhl',
  filters?: FilterOptions
) {
  const { data: oddsData, isLoading, error, refetch } = useOdds(sport);

  const opportunities = useMemo(() => {
    if (!oddsData?.data) return [];

    // Extract +EV opportunities from odds data
    const allOpportunities = extractEVOpportunities(
      oddsData.data,
      filters?.minEV || 2
    );

    // Apply additional filters
    let filtered = allOpportunities;

    if (filters?.sport) {
      const sportMap: Record<string, Sport> = {
        'nba': 'NBA',
        'nhl': 'NHL',
      };
      filtered = filtered.filter((opp) => opp.sport === sportMap[filters.sport!.toLowerCase() as 'nba' | 'nhl']);
    }

    if (filters?.betType) {
      filtered = filtered.filter((opp) => opp.betType === filters.betType);
    }

    if (filters?.confidence && filters.confidence.length > 0) {
      filtered = filtered.filter((opp) =>
        filters.confidence!.includes(opp.confidence)
      );
    }

    if (filters?.sportsbooks && filters.sportsbooks.length > 0) {
      filtered = filtered.filter((opp) =>
        filters.sportsbooks!.includes(opp.bestBook)
      );
    }

    return filtered;
  }, [oddsData, filters]);

  return {
    opportunities,
    isLoading,
    error,
    refetch,
    lastUpdated: oddsData?.meta.timestamp,
  };
}
