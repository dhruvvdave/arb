'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EVBadge } from '@/components/ev-badge';
import { generateParlays } from '@/lib/mock-data';
import { usePreferencesStore } from '@/lib/store/preferences';
import { Parlay, PropOpportunity } from '@/lib/types';
import { formatOdds } from '@/lib/odds-calculator';
import { Layers, AlertTriangle, Sparkles, Copy, AlertCircle } from 'lucide-react';
import { useMemo } from 'react';

function ParlayCard({ parlay }: { parlay: Parlay }) {
  const riskColor = {
    Low: 'text-green-600 dark:text-green-400',
    Medium: 'text-yellow-600 dark:text-yellow-400',
    High: 'text-orange-600 dark:text-orange-400',
    Spicy: 'text-red-600 dark:text-red-400',
  };

  const handleCopy = () => {
    const legs = parlay.legs
      .map((leg, i) => {
        const prop = leg.opportunity as PropOpportunity;
        return `Leg ${i + 1}: ${prop.player.name} - ${prop.category} Over ${prop.line}`;
      })
      .join('\n');
    
    const text = `${parlay.legs.length}-Leg Parlay
${legs}
Combined Odds: ${formatOdds(parlay.combinedOdds)}
Est. EV: ${parlay.estimatedEV > 0 ? '+' : ''}${parlay.estimatedEV.toFixed(1)}%
Best Book: ${parlay.bestBook}`;
    
    navigator.clipboard.writeText(text);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{parlay.legs.length}-Leg Parlay</CardTitle>
              <Badge 
                variant="outline" 
                className={riskColor[parlay.riskTier]}
              >
                {parlay.riskTier} Risk
              </Badge>
            </div>
            <CardDescription>
              {parlay.bestBook}
            </CardDescription>
          </div>
          <EVBadge 
            ev={parlay.estimatedEV} 
            confidence={parlay.confidence}
            showConfidence 
          />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Combined Odds */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
          <span className="text-sm font-medium">Combined Odds</span>
          <span className="text-xl font-bold font-mono">
            {formatOdds(parlay.combinedOdds)}
          </span>
        </div>

        {/* Legs */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Legs</div>
          {parlay.legs.map((leg, index) => {
            const prop = leg.opportunity as PropOpportunity;
            return (
              <div 
                key={index}
                className="flex items-center justify-between p-2 rounded border border-border"
              >
                <div className="flex-1">
                  <div className="font-medium text-sm">{prop.player.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {prop.category} Over {prop.line} • {formatOdds(leg.odds)}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {(prop.historicalHitRate.atLine * 100).toFixed(0)}% hit
                </Badge>
              </div>
            );
          })}
        </div>

        {/* AI Reasoning */}
        <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-semibold text-purple-400">AI Analysis</span>
          </div>
          <p className="text-sm text-muted-foreground">{parlay.reasoning}</p>
        </div>

        {/* Warnings */}
        {parlay.correlationWarnings.length > 0 && (
          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-semibold text-yellow-400">Correlation Warning</span>
            </div>
            {parlay.correlationWarnings.map((warning, index) => (
              <p key={index} className="text-sm text-muted-foreground">{warning}</p>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Button className="flex-1" size="sm">
            View Full Analysis
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ParlayPage() {
  const { useMockData } = usePreferencesStore();
  const parlays = useMemo(() => generateParlays(8), []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
            Parlay Builder
          </h1>
          <p className="text-muted-foreground">
            AI-assisted parlay suggestions with correlation analysis
          </p>
        </div>
        <Badge variant="secondary">Demo Data</Badge>
      </div>

      {/* Info Card */}
      <Card className="border-blue-500/50 bg-blue-500/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-blue-400 mt-0.5" />
            <div className="text-sm space-y-2">
              <p className="font-semibold">AI-Powered Parlay Analysis</p>
              <p className="text-muted-foreground">
                Our AI analyzes leg correlations, historical performance, and context to suggest parlays 
                with the best risk-adjusted expected value. Risk tiers help you understand the volatility 
                of each parlay. Remember: parlays are higher variance by nature.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suggested Parlays by Risk */}
      <div className="space-y-6">
        {['Low', 'Medium', 'High', 'Spicy'].map((risk) => {
          const riskParlays = parlays.filter(p => p.riskTier === risk);
          if (riskParlays.length === 0) return null;

          return (
            <div key={risk}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-2xl font-bold">{risk} Risk Parlays</h2>
                <Badge variant="outline">{riskParlays.length}</Badge>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {riskParlays.map((parlay) => (
                  <ParlayCard key={parlay.id} parlay={parlay} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Builder CTA */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            <CardTitle>Build Custom Parlay</CardTitle>
          </div>
          <CardDescription>
            Select your own legs and get AI correlation analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full">
            Open Custom Builder
          </Button>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="border-yellow-500/50 bg-yellow-500/5">
        <CardContent className="pt-6">
          <div className="text-sm space-y-2">
            <p className="font-semibold">Parlay Risk Warning</p>
            <p className="text-muted-foreground">
              Parlays are high-variance bets. Even with positive EV, the probability of hitting a parlay 
              decreases exponentially with each additional leg. These suggestions are for decision support only.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
