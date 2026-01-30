'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OpportunityCard } from '@/components/opportunity-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { generateEVOpportunities } from '@/lib/mock-data';
import { useEVOpportunities } from '@/lib/hooks/useEVOpportunities';
import { usePreferencesStore } from '@/lib/store/preferences';
import { FilterOptions, Sport, BetType, ConfidenceLevel } from '@/lib/types';
import { Filter, RefreshCw, AlertCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function ScannerPage() {
  const [filters, setFilters] = useState<FilterOptions>({
    minEV: 3,
  });
  const { useMockData } = usePreferencesStore();

  // Fetch real data for both NBA and NHL
  const nbaQuery = useEVOpportunities('nba', filters);
  const nhlQuery = useEVOpportunities('nhl', filters);

  // Mock data fallback
  const mockOpportunities = useMemo(() => generateEVOpportunities(20), []);
  
  const filteredMockOpportunities = useMemo(() => {
    return mockOpportunities.filter(opp => {
      if (filters.minEV && opp.estimatedEV < filters.minEV) return false;
      if (filters.sport && opp.sport !== filters.sport) return false;
      if (filters.betType && opp.betType !== filters.betType) return false;
      if (filters.confidence && !filters.confidence.includes(opp.confidence)) return false;
      return true;
    });
  }, [mockOpportunities, filters]);

  // Use mock or real data based on preference
  const isLoading = useMockData ? false : (nbaQuery.isLoading || nhlQuery.isLoading);
  const error = useMockData ? null : (nbaQuery.error || nhlQuery.error);
  
  const allOpportunities = useMemo(() => {
    if (useMockData) {
      return filteredMockOpportunities;
    }
    
    const combined = [
      ...(nbaQuery.opportunities || []),
      ...(nhlQuery.opportunities || []),
    ];
    
    return combined.sort((a, b) => b.estimatedEV - a.estimatedEV);
  }, [useMockData, filteredMockOpportunities, nbaQuery.opportunities, nhlQuery.opportunities]);

  const handleRefresh = () => {
    if (!useMockData) {
      nbaQuery.refetch();
      nhlQuery.refetch();
    }
  };

  const lastUpdated = useMockData ? null : (nbaQuery.lastUpdated || nhlQuery.lastUpdated);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
            +EV Scanner
          </h1>
          <p className="text-muted-foreground">
            Positive expected value opportunities across all markets
          </p>
        </div>
        <div className="flex items-center gap-2">
          {useMockData && (
            <Badge variant="secondary">Demo Mode</Badge>
          )}
          {lastUpdated && (
            <span className="text-sm text-muted-foreground">
              Updated: {new Date(lastUpdated).toLocaleTimeString()}
            </span>
          )}
          <Button onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="border-red-500/50 bg-red-500/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-red-500">Failed to fetch live data</p>
                <p className="text-muted-foreground mt-1">
                  {(error as Error)?.message || 'Unknown error occurred'}. 
                  You can enable Demo Mode in settings to continue using the app.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <CardTitle>Filters</CardTitle>
          </div>
          <CardDescription>
            Customize your opportunity search
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Sport Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Sport</label>
              <div className="flex gap-2">
                <Button
                  variant={filters.sport === undefined ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilters({ ...filters, sport: undefined })}
                >
                  All
                </Button>
                <Button
                  variant={filters.sport === 'NBA' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilters({ ...filters, sport: 'NBA' })}
                >
                  NBA
                </Button>
                <Button
                  variant={filters.sport === 'NHL' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilters({ ...filters, sport: 'NHL' })}
                >
                  NHL
                </Button>
              </div>
            </div>

            {/* Min EV Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Min EV: {filters.minEV}%
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={filters.minEV || 3}
                onChange={(e) => setFilters({ ...filters, minEV: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>

            {/* Bet Type Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Bet Type</label>
              <select
                value={filters.betType || ''}
                onChange={(e) => setFilters({ 
                  ...filters, 
                  betType: e.target.value ? e.target.value as BetType : undefined 
                })}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
              >
                <option value="">All Types</option>
                <option value="moneyline">Moneyline</option>
                <option value="spread">Spread</option>
                <option value="totals">Totals</option>
                <option value="props">Props</option>
              </select>
            </div>

            {/* Confidence Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Confidence</label>
              <select
                value={filters.confidence?.[0] || ''}
                onChange={(e) => setFilters({ 
                  ...filters, 
                  confidence: e.target.value ? [e.target.value as ConfidenceLevel] : undefined 
                })}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
              >
                <option value="">All Levels</option>
                <option value="High">High Only</option>
                <option value="Medium">Medium+</option>
                <option value="Low">All</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {isLoading ? (
              'Loading...'
            ) : (
              `Found ${allOpportunities.length} Opportunities`
            )}
          </h2>
          <Badge variant="outline">{useMockData ? 'Demo' : 'Live'}</Badge>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Fetching live odds data...
              </p>
            </CardContent>
          </Card>
        ) : allOpportunities.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No opportunities match your current filters. Try adjusting your criteria.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {allOpportunities.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        )}
      </div>

      {/* Info Card */}
      <Card className="border-blue-500/50 bg-blue-500/5">
        <CardContent className="pt-6">
          <div className="text-sm space-y-2">
            <p className="font-semibold">How +EV Detection Works</p>
            <p className="text-muted-foreground">
              We calculate expected value by comparing fair probability (estimated from historical data) 
              with bookmaker odds. Opportunities shown account for realistic slippage and volatility. 
              Stability score indicates how long the line has remained consistent.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
