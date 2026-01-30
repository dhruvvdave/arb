'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Layers, Plus, Trash2, Calculator } from 'lucide-react';
import { calculateParlayOdds, calculateParlayPayout, formatOdds } from '@/lib/utils/odds';

interface ParlayLeg {
  id: string;
  description: string;
  odds: number;
}

export default function ParlayPage() {
  const [legs, setLegs] = useState<ParlayLeg[]>([]);
  const [stake, setStake] = useState(100);

  const addSampleLeg = () => {
    const samples = [
      { description: 'Raptors ML', odds: -150 },
      { description: 'Maple Leafs ML', odds: -120 },
      { description: 'Scottie Barnes Over 20.5 pts', odds: -110 },
      { description: 'Auston Matthews Over 0.5 goals', odds: 190 },
      { description: 'Lakers -5.5', odds: -108 },
    ];
    const sample = samples[Math.floor(Math.random() * samples.length)];
    setLegs([...legs, { ...sample, id: Date.now().toString() }]);
  };

  const removeLeg = (id: string) => {
    setLegs(legs.filter(leg => leg.id !== id));
  };

  const combinedOdds = legs.length > 0 ? calculateParlayOdds(legs.map(l => l.odds)) : 0;
  const potentialPayout = legs.length > 0 ? calculateParlayPayout(stake, legs.map(l => l.odds)) : 0;
  const profit = potentialPayout - stake;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Layers className="h-10 w-10 text-purple-500" />
          Parlay Builder
        </h1>
        <p className="text-foreground/60 text-lg">
          Build custom parlays and calculate combined odds and payouts
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Parlay Builder */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Parlay Legs</span>
                <Badge variant="outline">{legs.length} legs</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {legs.length === 0 ? (
                <div className="text-center py-8 text-foreground/60">
                  <p className="mb-4">No legs added yet</p>
                  <Button onClick={addSampleLeg} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Sample Leg
                  </Button>
                </div>
              ) : (
                legs.map((leg, idx) => (
                  <div
                    key={leg.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-foreground/5 border border-foreground/10"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">
                        {idx + 1}
                      </Badge>
                      <div>
                        <div className="font-medium">{leg.description}</div>
                        <div className="text-sm text-foreground/60">{formatOdds(leg.odds)}</div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLeg(leg.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))
              )}

              {legs.length > 0 && legs.length < 10 && (
                <Button onClick={addSampleLeg} variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Leg
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Sportsbook Recommendations */}
          {legs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Best Sportsbooks for This Parlay</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['DraftKings', 'FanDuel', 'BetMGM'].map((book, idx) => (
                    <div
                      key={book}
                      className={`p-3 rounded-lg border ${
                        idx === 0
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-foreground/10 bg-foreground/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{book}</div>
                          {idx === 0 && (
                            <Badge variant="success" className="text-xs mt-1">
                              Best Odds
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{formatOdds(combinedOdds + idx * 10)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Calculator */}
        <div className="space-y-4">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stake Input */}
              <div>
                <label className="text-sm text-foreground/60 mb-2 block">Stake Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/60">$</span>
                  <input
                    type="number"
                    value={stake}
                    onChange={(e) => setStake(parseFloat(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2 rounded-lg border border-foreground/20 bg-background"
                    min="0"
                  />
                </div>
              </div>

              {legs.length > 0 && (
                <>
                  {/* Combined Odds */}
                  <div className="p-4 rounded-lg bg-foreground/5">
                    <div className="text-sm text-foreground/60 mb-1">Combined Odds</div>
                    <div className="text-3xl font-bold">{formatOdds(combinedOdds)}</div>
                  </div>

                  {/* Potential Payout */}
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="text-sm text-foreground/60 mb-1">Potential Payout</div>
                    <div className="text-3xl font-bold text-green-500">
                      ${potentialPayout.toFixed(2)}
                    </div>
                    <div className="text-sm text-foreground/60 mt-1">
                      Profit: ${profit.toFixed(2)}
                    </div>
                  </div>

                  {/* Risk Assessment */}
                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <div className="text-sm font-semibold mb-2">Risk Assessment</div>
                    <Badge
                      variant={legs.length <= 3 ? 'success' : legs.length <= 5 ? 'warning' : 'destructive'}
                    >
                      {legs.length <= 3 ? 'Low Risk' : legs.length <= 5 ? 'Medium Risk' : 'High Risk'}
                    </Badge>
                    <p className="text-xs text-foreground/60 mt-2">
                      {legs.length <= 3
                        ? 'Shorter parlays have better win probability'
                        : legs.length <= 5
                        ? 'Moderate parlay length'
                        : 'Longer parlays are riskier but offer higher payouts'}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
