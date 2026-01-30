'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArbitrageCard } from '@/components/arbitrage/ArbitrageCard';
import { PropCard } from '@/components/props/PropCard';
import { mockArbitrageOpportunities, mockPlayerProps } from '@/lib/data/mockData';
import { TrendingUp, Trophy, BarChart3, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const topArbs = mockArbitrageOpportunities.slice(0, 2);
  const topProps = mockPlayerProps.filter(p => p.arbOpportunity).slice(0, 2);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            Welcome to Ontario Arb Finder
          </span>
        </h1>
        <p className="text-foreground/60 text-lg">
          Find the best arbitrage opportunities and prop bets across all Ontario legal sportsbooks
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground/60">
              Active Arbs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{mockArbitrageOpportunities.length}</div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground/60">
              Best Profit %
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-green-500">
                {Math.max(...mockArbitrageOpportunities.map(a => a.profitPercentage)).toFixed(2)}%
              </div>
              <Sparkles className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground/60">
              Available Props
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{mockPlayerProps.length}</div>
              <Trophy className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground/60">
              Prop Arbs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                {mockPlayerProps.filter(p => p.arbOpportunity).length}
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Arbitrage Opportunities */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Top Arbitrage Opportunities</h2>
          <Link href="/arbitrage">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {topArbs.map((arb) => (
            <ArbitrageCard key={arb.id} opportunity={arb} />
          ))}
        </div>
      </div>

      {/* Featured Props with Arb Opportunities */}
      {topProps.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              Featured Props
              <Badge variant="warning">Arb Opportunities</Badge>
            </h2>
            <Link href="/props">
              <Button variant="outline" size="sm">
                View All Props
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {topProps.map((prop) => (
              <PropCard key={prop.id} prop={prop} />
            ))}
          </div>
        </div>
      )}

      {/* Info Banner */}
      <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
        <CardHeader>
          <CardTitle>Ontario Legal Sportsbooks Only</CardTitle>
          <CardDescription className="text-foreground/80">
            This app exclusively works with sportsbooks licensed in Ontario, Canada including
            bet365, BetMGM, DraftKings, FanDuel, and more. All odds are updated in real-time.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
