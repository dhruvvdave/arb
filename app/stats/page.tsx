'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { generatePlayerStats, generateTeamStats } from '@/lib/mock-data';
import { usePreferencesStore } from '@/lib/store/preferences';
import { BarChart3, User, Users, AlertCircle, RefreshCw } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function StatsPage() {
  const [activeTab, setActiveTab] = useState<'players' | 'teams'>('players');
  const { useMockData } = usePreferencesStore();
  
  // Mock data for demo mode
  const playerStats = useMemo(() => generatePlayerStats('player_lebron_james', 'NBA'), []);
  const teamStats = useMemo(() => generateTeamStats('lakers', 'NBA'), []);

  // For live mode, we would fetch real stats here
  // Currently showing demo data with a notice
  const isLoading = false;
  const error = null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent">
            Stats Analyzer
          </h1>
          <p className="text-muted-foreground">
            Deep dive into player and team statistics
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
                <p className="font-semibold text-red-500">Failed to fetch live stats</p>
                <p className="text-muted-foreground mt-1">
                  {(error as Error)?.message || 'Unknown error occurred'}. 
                  Enable Demo Mode in settings to continue using the app.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Notice */}
      {!useMockData && (
        <Card className="border-blue-500/50 bg-blue-500/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-blue-500">Stats Data Notice</p>
                <p className="text-muted-foreground mt-1">
                  Stats page is currently in development. Live stats integration with balldontlie.io (NBA) and NHL-API will be available soon.
                  Showing demo data for now.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab Controls */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === 'players' ? 'default' : 'outline'}
          onClick={() => setActiveTab('players')}
        >
          <User className="h-4 w-4 mr-2" />
          Players
        </Button>
        <Button
          variant={activeTab === 'teams' ? 'default' : 'outline'}
          onClick={() => setActiveTab('teams')}
        >
          <Users className="h-4 w-4 mr-2" />
          Teams
        </Button>
      </div>

      {/* Player Stats */}
      {activeTab === 'players' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>LeBron James</CardTitle>
              <CardDescription>Los Angeles Lakers • Forward</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Season Averages */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Season Averages</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(playerStats.season.averages).map(([stat, value]) => (
                    <div key={stat} className="p-3 rounded-lg bg-muted">
                      <div className="text-sm text-muted-foreground uppercase">{stat}</div>
                      <div className="text-2xl font-bold">{value.toFixed(1)}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {playerStats.season.gamesPlayed} games played
                </div>
              </div>

              {/* Recent Form */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Recent Form</h3>
                <div className="space-y-2">
                  {['last5', 'last10', 'last20'].map((period) => {
                    const periodName = period === 'last5' ? 'Last 5' : period === 'last10' ? 'Last 10' : 'Last 20';
                    return (
                      <Card key={period}>
                        <CardContent className="pt-4">
                          <div className="text-sm font-medium mb-2">{periodName} Games</div>
                          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                            {Object.entries(playerStats.splits[period as 'last5' | 'last10' | 'last20']).slice(0, 6).map(([stat, value]) => (
                              <div key={stat} className="text-center">
                                <div className="text-xs text-muted-foreground uppercase">{stat}</div>
                                <div className="font-semibold">{value.toFixed(1)}</div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Home/Away Splits */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Home vs Away</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-sm font-medium mb-2">Home</div>
                      <div className="space-y-1">
                        {Object.entries(playerStats.splits.home).slice(0, 4).map(([stat, value]) => (
                          <div key={stat} className="flex justify-between text-sm">
                            <span className="text-muted-foreground uppercase">{stat}</span>
                            <span className="font-semibold">{value.toFixed(1)}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-sm font-medium mb-2">Away</div>
                      <div className="space-y-1">
                        {Object.entries(playerStats.splits.away).slice(0, 4).map(([stat, value]) => (
                          <div key={stat} className="flex justify-between text-sm">
                            <span className="text-muted-foreground uppercase">{stat}</span>
                            <span className="font-semibold">{value.toFixed(1)}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Button className="w-full">
                View Betting Opportunities for This Player
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Team Stats */}
      {activeTab === 'teams' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Los Angeles Lakers</CardTitle>
              <CardDescription>NBA</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Key Metrics */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Key Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 rounded-lg bg-muted">
                    <div className="text-sm text-muted-foreground">Pace</div>
                    <div className="text-2xl font-bold">{teamStats.pace.toFixed(1)}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <div className="text-sm text-muted-foreground">Off Rating</div>
                    <div className="text-2xl font-bold">{teamStats.offensiveRating.toFixed(1)}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <div className="text-sm text-muted-foreground">Def Rating</div>
                    <div className="text-2xl font-bold">{teamStats.defensiveRating.toFixed(1)}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <div className="text-sm text-muted-foreground">Last 10</div>
                    <div className="text-2xl font-bold">{teamStats.recentForm.last10}</div>
                  </div>
                </div>
              </div>

              {/* Points Allowed by Position */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Points Allowed by Position</h3>
                <div className="space-y-2">
                  {Object.entries(teamStats.pointsAllowedByPosition).map(([position, points]) => (
                    <div key={position} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                      <span className="font-medium">{position}</span>
                      <span className="text-lg font-bold">{points.toFixed(1)} PPG</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full">
                View Betting Opportunities for This Team
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Info Card */}
      <Card className="border-blue-500/50 bg-blue-500/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <BarChart3 className="h-5 w-5 text-blue-400 mt-0.5" />
            <div className="text-sm space-y-2">
              <p className="font-semibold">Stats Connected to Opportunities</p>
              <p className="text-muted-foreground">
                All statistics are integrated with our betting opportunity detection. Click "View Betting Opportunities" 
                to see props and bets informed by these stats and trends.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
