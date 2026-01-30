'use client';

import { useState } from 'react';
import { PropCard } from '@/components/props/PropCard';
import { mockPlayerProps } from '@/lib/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Filter, TrendingUp } from 'lucide-react';

export default function PropsPage() {
  const [sportFilter, setSportFilter] = useState<'all' | 'NBA' | 'NHL'>('all');
  const [showArbOnly, setShowArbOnly] = useState(false);

  const filteredProps = mockPlayerProps.filter(prop => {
    if (sportFilter !== 'all' && prop.sport !== sportFilter) return false;
    if (showArbOnly && !prop.arbOpportunity) return false;
    return true;
  });

  const arbCount = filteredProps.filter(p => p.arbOpportunity).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Trophy className="h-10 w-10 text-blue-500" />
          Player Props
        </h1>
        <p className="text-foreground/60 text-lg">
          Compare props across all Ontario sportsbooks and find the best odds
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5" />
            <span className="font-semibold">Filters</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* Arb Filter */}
            <div>
              <label className="text-sm text-foreground/60 mb-2 block">Show Only</label>
              <Button
                variant={showArbOnly ? 'success' : 'outline'}
                size="sm"
                onClick={() => setShowArbOnly(!showArbOnly)}
                className="w-full md:w-auto"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Arb Opportunities ({arbCount})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-base px-4 py-2">
          {filteredProps.length} props available
        </Badge>
        {arbCount > 0 && (
          <Badge variant="warning" className="text-base px-4 py-2">
            <TrendingUp className="h-4 w-4 mr-1" />
            {arbCount} with arb opportunities
          </Badge>
        )}
      </div>

      {/* Props Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredProps.map((prop) => (
          <PropCard key={prop.id} prop={prop} />
        ))}
      </div>

      {filteredProps.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-foreground/60 text-lg">
            No props match your current filters.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSportFilter('all');
              setShowArbOnly(false);
            }}
          >
            Reset Filters
          </Button>
        </Card>
      )}
    </div>
  );
}
