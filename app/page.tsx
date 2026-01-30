'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OpportunityCard } from '@/components/opportunity-card';
import { Badge } from '@/components/ui/badge';
import { generateEVOpportunities, generateAlerts } from '@/lib/mock-data';
import { useEVOpportunities } from '@/lib/hooks/useEVOpportunities';
import { usePreferencesStore } from '@/lib/store/preferences';
import { TrendingUp, Target, Zap, Bell, RefreshCw, AlertCircle } from 'lucide-react';
import { useMemo } from 'react';

export default function Dashboard() {
  const { useMockData, minEVThreshold } = usePreferencesStore();

  // Fetch real data for both NBA and NHL
  const nbaQuery = useEVOpportunities('nba', { minEV: minEVThreshold });
  const nhlQuery = useEVOpportunities('nhl', { minEV: minEVThreshold });

  // Mock data fallback
  const mockOpportunities = useMemo(() => generateEVOpportunities(6), []);
  const mockAlerts = useMemo(() => generateAlerts(3), []);

  // Use mock or real data based on preference
  const isLoading = useMockData ? false : (nbaQuery.isLoading || nhlQuery.isLoading);
  const error = useMockData ? null : (nbaQuery.error || nhlQuery.error);
  
  const opportunities = useMemo(() => {
    if (useMockData) {
      return mockOpportunities;
    }
    
    const combined = [
      ...(nbaQuery.opportunities || []),
      ...(nhlQuery.opportunities || []),
    ];
    
    return combined
      .sort((a, b) => b.estimatedEV - a.estimatedEV)
      .slice(0, 6);
  }, [useMockData, mockOpportunities, nbaQuery.opportunities, nhlQuery.opportunities]);

  const alerts = useMockData ? mockAlerts : [];
  
  const stats = {
    activeOpportunities: opportunities.length,
    avgEV: opportunities.length > 0 
      ? opportunities.reduce((sum, opp) => sum + opp.estimatedEV, 0) / opportunities.length 
      : 0,
    highConfidence: opportunities.filter(opp => opp.confidence === 'High').length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Today's best +EV opportunities and insights
          </p>
        </div>
        {useMockData && (
          <Badge variant="secondary">Demo Mode</Badge>
        )}
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
                  Enable Demo Mode in settings to continue using the app.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Opportunities
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeOpportunities}</div>
            <p className="text-xs text-muted-foreground">
              Above minimum EV threshold
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average EV
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.avgEV.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Across all opportunities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              High Confidence
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.highConfidence}</div>
            <p className="text-xs text-muted-foreground">
              Opportunities with high confidence
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Recent Alerts</CardTitle>
            </div>
            <CardDescription>
              Latest opportunities that crossed your thresholds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <div className="font-medium">{alert.message}</div>
                  <div className="text-sm text-muted-foreground">
                    {alert.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                <Badge variant={alert.read ? 'secondary' : 'default'}>
                  {alert.read ? 'Read' : 'New'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Top Opportunities */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Top Opportunities</h2>
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
        ) : opportunities.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No opportunities available at the moment. Check back soon!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {opportunities.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <Card className="border-yellow-500/50 bg-yellow-500/5">
        <CardContent className="pt-6">
          <div className="text-sm space-y-2">
            <p className="font-semibold">Important Disclaimer</p>
            <p className="text-muted-foreground">
              Estimates based on historical data and statistical models. Past performance does not guarantee future results. 
              Bet responsibly and set limits. Visit{' '}
              <a 
                href="https://www.connexontario.ca/en-ca" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                ConnexOntario
              </a>{' '}
              for gambling support resources.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
