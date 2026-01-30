'use client';

import { ArbitrageOpportunity } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatOdds } from '@/lib/utils/odds';
import { Clock, Copy, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

interface ArbitrageCardProps {
  opportunity: ArbitrageOpportunity;
}

export function ArbitrageCard({ opportunity }: ArbitrageCardProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
  };

  const formatBetText = (bet: typeof opportunity.bets[0]) => {
    return `${bet.sportsbook}: ${bet.outcome} ${formatOdds(bet.odds)} - Stake: $${bet.stake.toFixed(2)}`;
  };

  return (
    <Card className="hover:shadow-xl transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="success">{opportunity.sport}</Badge>
              <Badge variant="outline">{opportunity.marketType.toUpperCase()}</Badge>
            </div>
            <CardTitle className="text-xl">
              {opportunity.awayTeam} @ {opportunity.homeTeam}
            </CardTitle>
            <p className="text-sm text-foreground/60">
              {format(new Date(opportunity.commenceTime), 'MMM dd, h:mm a')}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-500">
              {opportunity.profitPercentage.toFixed(2)}%
            </div>
            <div className="text-sm text-foreground/60">Profit</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Bet Details */}
        <div className="space-y-2">
          {opportunity.bets.map((bet, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-lg bg-foreground/5"
            >
              <div>
                <div className="font-semibold">{bet.sportsbook}</div>
                <div className="text-sm text-foreground/60">
                  {bet.outcome} {bet.point && `(${bet.point})`}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">{formatOdds(bet.odds)}</div>
                <div className="text-sm text-foreground/60">
                  Stake: ${bet.stake.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/20">
          <div>
            <div className="text-sm text-foreground/60">Total Stake</div>
            <div className="text-lg font-bold">${opportunity.totalStake.toFixed(2)}</div>
          </div>
          <TrendingUp className="h-6 w-6 text-green-500" />
          <div className="text-right">
            <div className="text-sm text-foreground/60">Guaranteed Profit</div>
            <div className="text-lg font-bold text-green-500">
              ${opportunity.guaranteedProfit.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Time Indicator */}
        <div className="flex items-center gap-2 text-sm text-foreground/60">
          <Clock className="h-4 w-4" />
          <span>Available for {opportunity.ageMinutes} minutes</span>
        </div>

        {/* Copy Buttons */}
        <div className="flex gap-2">
          {opportunity.bets.map((bet, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(formatBetText(bet))}
              className="flex-1"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy {bet.sportsbook}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
