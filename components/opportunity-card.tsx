import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EVBadge } from './ev-badge';
import { EVOpportunity } from '@/lib/types';
import { formatOdds, formatProbability } from '@/lib/odds-calculator';
import { Clock, TrendingUp, Activity, Copy } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface OpportunityCardProps {
  opportunity: EVOpportunity;
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const handleCopy = () => {
    const text = `${opportunity.description}
Book: ${opportunity.bestBook}
Odds: ${formatOdds(opportunity.lines[0].odds)}
Est. EV: ${opportunity.estimatedEV > 0 ? '+' : ''}${opportunity.estimatedEV.toFixed(1)}%`;
    
    navigator.clipboard.writeText(text);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{opportunity.description}</CardTitle>
            <CardDescription>
              {opportunity.game.awayTeam} @ {opportunity.game.homeTeam}
            </CardDescription>
          </div>
          <EVBadge 
            ev={opportunity.estimatedEV} 
            confidence={opportunity.confidence}
            showConfidence 
          />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Best Book</div>
            <div className="font-semibold">{opportunity.bestBook}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Odds</div>
            <div className="font-semibold font-mono">
              {formatOdds(opportunity.lines[0].odds)}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Fair Probability</div>
            <div className="font-semibold">{formatProbability(opportunity.fairProbability)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Slippage-Adjusted EV</div>
            <div className="font-semibold">
              {opportunity.slippageAdjustedEV > 0 ? '+' : ''}
              {opportunity.slippageAdjustedEV.toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>Stability: {opportunity.stabilityScore}/100</span>
          </div>
          <div className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            <span>Volatility: {opportunity.volatilityScore}/100</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatDistanceToNow(opportunity.detectedAt, { addSuffix: true })}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button className="flex-1" size="sm">
            View Details
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-xs text-muted-foreground italic">
          Estimates based on historical data and statistical models. Bet responsibly.
        </div>
      </CardContent>
    </Card>
  );
}
