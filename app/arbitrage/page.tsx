'use client';

import { useState } from 'react';
import { ArbitrageCard } from '@/components/arbitrage/ArbitrageCard';
import { mockArbitrageOpportunities } from '@/lib/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Filter } from 'lucide-react';

export default function ArbitragePage() {
  const [sportFilter, setSportFilter] = useState<'all' | 'NBA' | 'NHL'>('all');
  const [marketFilter, setMarketFilter] = useState<'all' | 'h2h' | 'spreads' | 'totals'>('all');
  const [minProfit, setMinProfit] = useState(0);

  const filteredOpportunities = mockArbitrageOpportunities.filter(opp => {
    if (sportFilter !== 'all' && opp.sport !== sportFilter) return false;
    if (marketFilter !== 'all' && opp.marketType !== marketFilter) return false;
    if (opp.profitPercentage < minProfit) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <TrendingUp className="h-10 w-10 text-green-500" />
          Arbitrage Opportunities
        </h1>
        <p className="text-foreground/60 text-lg">
          Guaranteed profit opportunities across Ontario legal sportsbooks
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5" />
            <span className="font-semibold">Filters</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sport Filter */}
            <div>
              <label className="text-sm text-foreground/60 mb-2 block">Sport</label>
              <div className="flex gap-2">
                <Button
                  variant={sportFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSportFilter('all')}
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

            {/* Market Type Filter */}
            <div>
              <label className="text-sm text-foreground/60 mb-2 block">Bet Type</label>
              <div className="flex gap-2">
                <Button
                  variant={marketFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMarketFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={marketFilter === 'h2h' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMarketFilter('h2h')}
                >
                  ML
                </Button>
                <Button
                  variant={marketFilter === 'spreads' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMarketFilter('spreads')}
                >
                  Spread
                </Button>
                <Button
                  variant={marketFilter === 'totals' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMarketFilter('totals')}
                >
                  Totals
                </Button>
              </div>
            </div>

            {/* Min Profit Filter */}
            <div>
              <label className="text-sm text-foreground/60 mb-2 block">
                Min Profit: {minProfit.toFixed(1)}%
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={minProfit}
                onChange={(e) => setMinProfit(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-base px-4 py-2">
          {filteredOpportunities.length} opportunities found
        </Badge>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredOpportunities.map((opp) => (
          <ArbitrageCard key={opp.id} opportunity={opp} />
        ))}
      </div>

      {filteredOpportunities.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-foreground/60 text-lg">
            No arbitrage opportunities match your current filters.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSportFilter('all');
              setMarketFilter('all');
              setMinProfit(0);
            }}
          >
            Reset Filters
          </Button>
        </Card>
      )}
    </div>
  );
}
