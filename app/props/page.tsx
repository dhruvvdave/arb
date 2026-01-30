'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EVBadge } from '@/components/ev-badge';
import { generatePropOpportunities } from '@/lib/mock-data';
import { usePreferencesStore } from '@/lib/store/preferences';
import { PropOpportunity, Sport, PropCategory } from '@/lib/types';
import { formatOdds } from '@/lib/odds-calculator';
import { Target, TrendingUp, Activity, Copy, ChevronDown, RefreshCw, AlertCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

function PropCard({ prop }: { prop: PropOpportunity }) {
  const [expanded, setExpanded] = useState(false);

  const handleCopy = () => {
    const text = `Player: ${prop.player.name}
Prop: ${prop.category} Over ${prop.line}
Book: ${prop.lines[0].sportsbook}
Odds: ${formatOdds(prop.lines[0].odds)}
Est. EV: ${prop.estimatedEV > 0 ? '+' : ''}${prop.estimatedEV.toFixed(1)}%`;
    
    navigator.clipboard.writeText(text);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{prop.player.name}</CardTitle>
            <CardDescription>
              {prop.game.awayTeam} @ {prop.game.homeTeam}
            </CardDescription>
          </div>
          <Badge variant="outline">{prop.game.sport}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground uppercase tracking-wide">
              {prop.category}
            </div>
            <div className="text-2xl font-bold">
              Over {prop.line}
            </div>
          </div>
          <EVBadge 
            ev={prop.estimatedEV} 
            confidence={prop.confidence}
            showConfidence 
          />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Best Odds</div>
            <div className="font-semibold font-mono">
              {formatOdds(prop.lines[0].odds)} @ {prop.lines[0].sportsbook}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Hit Rate</div>
            <div className="font-semibold">{(prop.historicalHitRate.atLine * 100).toFixed(0)}%</div>
          </div>
        </div>

        {/* Context Preview */}
        {!expanded && (
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Last 5 Avg:</span>
              <span className="font-semibold">{prop.context.recentGames.last5Avg.toFixed(1)}</span>
            </div>
            {prop.context.defenseVsPosition && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Opp Defense Rank:</span>
                <span className="font-semibold">#{prop.context.defenseVsPosition}</span>
              </div>
            )}
          </div>
        )}

        {/* Expanded Context */}
        {expanded && (
          <div className="space-y-3 text-sm border-t pt-3">
            <div>
              <div className="font-semibold mb-2">Recent Performance</div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last 5 games:</span>
                  <span className="font-mono">{prop.context.recentGames.last5Avg.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last 10 games:</span>
                  <span className="font-mono">{prop.context.recentGames.last10Avg.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last 20 games:</span>
                  <span className="font-mono">{prop.context.recentGames.last20Avg.toFixed(1)}</span>
                </div>
              </div>
            </div>

            {prop.context.homeAwaySplit && (
              <div>
                <div className="font-semibold mb-2">Home/Away Split</div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Home:</span>
                    <span className="font-mono">{prop.context.homeAwaySplit.home.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Away:</span>
                    <span className="font-mono">{prop.context.homeAwaySplit.away.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            )}

            <div>
              <div className="font-semibold mb-2">Additional Context</div>
              <div className="space-y-1">
                {prop.context.defenseVsPosition && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Opponent Defense vs Pos:</span>
                    <span className="font-mono">#{prop.context.defenseVsPosition}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Usage Trend:</span>
                  <Badge variant={
                    prop.context.usageTrend === 'increasing' ? 'success' :
                    prop.context.usageTrend === 'stable' ? 'secondary' : 'outline'
                  } className="text-xs">
                    {prop.context.usageTrend}
                  </Badge>
                </div>
                {prop.context.isBackToBack && (
                  <div className="flex items-center gap-2">
                    <Badge variant="warning" className="text-xs">
                      Back-to-back game
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* All Lines */}
            <div>
              <div className="font-semibold mb-2">All Sportsbooks</div>
              <div className="space-y-1">
                {prop.lines.slice(0, 5).map((line) => (
                  <div key={line.sportsbook} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{line.sportsbook}</span>
                    <span className="font-mono">{formatOdds(line.odds)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {prop.insight && (
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm">
            <div className="font-semibold mb-1 text-blue-400">Key Insight</div>
            <p className="text-muted-foreground">{prop.insight}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            className="flex-1" 
            size="sm"
            variant="outline"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Show Less' : 'Show More'}
            <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PropsPage() {
  const [sportFilter, setSportFilter] = useState<Sport | undefined>();
  const [categoryFilter, setCategoryFilter] = useState<PropCategory | undefined>();
  const { useMockData } = usePreferencesStore();

  // Mock data only for now (real props API needs event-specific calls)
  const allProps = useMemo(() => generatePropOpportunities(20), []);
  
  const filteredProps = useMemo(() => {
    return allProps.filter(prop => {
      if (sportFilter && prop.game.sport !== sportFilter) return false;
      if (categoryFilter && prop.category !== categoryFilter) return false;
      return true;
    });
  }, [allProps, sportFilter, categoryFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
            Prop Intelligence
          </h1>
          <p className="text-muted-foreground">
            Player prop analysis with historical context and insights
          </p>
        </div>
        <Badge variant="secondary">Demo Data</Badge>
      </div>

      {/* Info Notice */}
      <Card className="border-blue-500/50 bg-blue-500/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-blue-500">Demo Data Notice</p>
              <p className="text-muted-foreground mt-1">
                Player props require event-specific API calls. Currently showing demo data. 
                Live props will be available once specific games are selected.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Sport</label>
              <div className="flex gap-2">
                <Button
                  variant={sportFilter === undefined ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSportFilter(undefined)}
                >
                  All
                </Button>
                <Button
                  variant={sportFilter === 'NBA' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSportFilter('NBA')}
                >
                  NBA
                </Button>
                <Button
                  variant={sportFilter === 'NHL' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSportFilter('NHL')}
                >
                  NHL
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {filteredProps.length} Props Available
          </h2>
          <Badge variant="outline">Live</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredProps.map((prop) => (
            <PropCard key={prop.id} prop={prop} />
          ))}
        </div>
      </div>
    </div>
  );
}
