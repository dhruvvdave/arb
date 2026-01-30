'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockPlayerStats, mockTeamStats } from '@/lib/data/mockData';
import { BarChart3, TrendingUp, Users } from 'lucide-react';

export default function StatsPage() {
  const playerStatsArray = Object.values(mockPlayerStats);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <BarChart3 className="h-10 w-10 text-purple-500" />
          Stats & Analytics
        </h1>
        <p className="text-foreground/60 text-lg">
          Player and team statistics to inform your betting decisions
        </p>
      </div>

      {/* Player Stats Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="h-6 w-6" />
          Featured Players
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {playerStatsArray.map((player) => (
            <Card key={player.playerId}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{player.playerName}</CardTitle>
                    <p className="text-sm text-foreground/60">{player.team}</p>
                  </div>
                  <Badge variant="success">{player.sport}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Season Averages */}
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-foreground/80">Season Averages</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(player.seasonAverages)
                      .filter(([key]) => key !== 'gamesPlayed')
                      .map(([key, value]) => (
                        <div key={key} className="bg-foreground/5 rounded p-2">
                          <div className="text-xs text-foreground/60 uppercase">{key}</div>
                          <div className="text-lg font-bold">{value.toFixed(1)}</div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Recent Form */}
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-foreground/80">Last 5 Games</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(player.last5Games)
                      .filter(([key]) => key !== 'gamesPlayed')
                      .slice(0, 3)
                      .map(([key, value]) => (
                        <div key={key} className="bg-green-500/10 rounded p-2 border border-green-500/20">
                          <div className="text-xs text-foreground/60 uppercase">{key}</div>
                          <div className="text-lg font-bold">{value.toFixed(1)}</div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Home vs Away */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-blue-500/10 rounded p-2 border border-blue-500/20">
                    <div className="text-xs text-foreground/60 mb-1">Home</div>
                    {Object.entries(player.homeStats)
                      .filter(([key]) => key !== 'gamesPlayed')
                      .slice(0, 2)
                      .map(([key, value]) => (
                        <div key={key} className="text-xs">
                          {key}: <span className="font-bold">{value.toFixed(1)}</span>
                        </div>
                      ))}
                  </div>
                  <div className="bg-orange-500/10 rounded p-2 border border-orange-500/20">
                    <div className="text-xs text-foreground/60 mb-1">Away</div>
                    {Object.entries(player.awayStats)
                      .filter(([key]) => key !== 'gamesPlayed')
                      .slice(0, 2)
                      .map(([key, value]) => (
                        <div key={key} className="text-xs">
                          {key}: <span className="font-bold">{value.toFixed(1)}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Team Stats Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Users className="h-6 w-6" />
          Team Statistics
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {mockTeamStats.map((team) => (
            <Card key={team.teamId}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle>{team.teamName}</CardTitle>
                  <Badge variant="success">{team.sport}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-500/10 rounded p-3 border border-green-500/20">
                    <div className="text-xs text-foreground/60">Offensive Rating</div>
                    <div className="text-2xl font-bold">{team.offensiveRating.toFixed(1)}</div>
                  </div>
                  <div className="bg-red-500/10 rounded p-3 border border-red-500/20">
                    <div className="text-xs text-foreground/60">Defensive Rating</div>
                    <div className="text-2xl font-bold">{team.defensiveRating.toFixed(1)}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-foreground/60">Home Record</div>
                    <div className="font-bold">{team.homeRecord}</div>
                  </div>
                  <div>
                    <div className="text-xs text-foreground/60">Away Record</div>
                    <div className="font-bold">{team.awayRecord}</div>
                  </div>
                  <div>
                    <div className="text-xs text-foreground/60">Recent Form</div>
                    <div className="flex gap-1">
                      {team.recentForm.map((result, idx) => (
                        <Badge
                          key={idx}
                          variant={result === 'W' ? 'success' : 'destructive'}
                          className="text-xs px-1.5"
                        >
                          {result}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
