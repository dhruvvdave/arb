'use client';

import { PlayerProp } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatOdds } from '@/lib/utils/odds';
import { Trophy, Copy, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

interface PropCardProps {
  prop: PlayerProp;
}

export function PropCard({ prop }: PropCardProps) {
  const copyPropText = (type: 'over' | 'under', odds: number, sportsbook: string) => {
    const text = `Player: ${prop.player} | Prop: ${prop.category} | Line: ${type} ${prop.line} | Odds: ${formatOdds(odds)} | Book: ${sportsbook}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <Card className="hover:shadow-xl transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="success">{prop.sport}</Badge>
              <Badge variant="outline">{prop.category.toUpperCase()}</Badge>
              {prop.arbOpportunity && (
                <Badge variant="warning">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  ARB
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              {prop.player}
            </CardTitle>
            <p className="text-sm text-foreground/60">
              {prop.team} vs {prop.opponent}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{prop.line}</div>
            <div className="text-sm text-foreground/60">Line</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Over Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground/80">OVER {prop.line}</span>
            {prop.bestOver && (
              <Badge variant="success" className="text-xs">
                Best: {prop.bestOver.sportsbook}
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {prop.overOdds.map((odd, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg border ${
                  prop.bestOver?.sportsbook === odd.sportsbook
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-foreground/10 bg-foreground/5'
                }`}
              >
                <div className="text-xs text-foreground/60">{odd.sportsbook}</div>
                <div className="font-bold">{formatOdds(odd.odds)}</div>
              </div>
            ))}
          </div>
          {prop.bestOver && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyPropText('over', prop.bestOver!.odds, prop.bestOver!.sportsbook)}
              className="w-full"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy Best Over
            </Button>
          )}
        </div>

        {/* Under Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground/80">UNDER {prop.line}</span>
            {prop.bestUnder && (
              <Badge variant="success" className="text-xs">
                Best: {prop.bestUnder.sportsbook}
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {prop.underOdds.map((odd, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg border ${
                  prop.bestUnder?.sportsbook === odd.sportsbook
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-foreground/10 bg-foreground/5'
                }`}
              >
                <div className="text-xs text-foreground/60">{odd.sportsbook}</div>
                <div className="font-bold">{formatOdds(odd.odds)}</div>
              </div>
            ))}
          </div>
          {prop.bestUnder && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyPropText('under', prop.bestUnder!.odds, prop.bestUnder!.sportsbook)}
              className="w-full"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy Best Under
            </Button>
          )}
        </div>

        {/* Game Time */}
        <div className="text-xs text-foreground/60 text-center pt-2 border-t border-foreground/10">
          {format(new Date(prop.commenceTime), 'MMM dd, h:mm a')}
        </div>
      </CardContent>
    </Card>
  );
}
