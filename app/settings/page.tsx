'use client';

import { useAppStore } from '@/lib/stores/appStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon, Bell, DollarSign, Star } from 'lucide-react';
import { ONTARIO_SPORTSBOOKS } from '@/types';

export default function SettingsPage() {
  const { settings, updateSettings } = useAppStore();

  const toggleSportsbook = (sportsbook: typeof ONTARIO_SPORTSBOOKS[number]) => {
    const current = settings.selectedSportsbooks;
    const updated = current.includes(sportsbook)
      ? current.filter(s => s !== sportsbook)
      : [...current, sportsbook];
    updateSettings({ selectedSportsbooks: updated });
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <SettingsIcon className="h-10 w-10 text-blue-500" />
          Settings
        </h1>
        <p className="text-foreground/60 text-lg">
          Configure your preferences and sportsbook selections
        </p>
      </div>

      {/* Sportsbook Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Ontario Sportsbooks</CardTitle>
          <CardDescription>
            Select which sportsbooks to include in arbitrage and prop searches
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ONTARIO_SPORTSBOOKS.map((book) => (
              <Button
                key={book}
                variant={settings.selectedSportsbooks.includes(book) ? 'default' : 'outline'}
                onClick={() => toggleSportsbook(book)}
                className="justify-start"
              >
                {book}
              </Button>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateSettings({ selectedSportsbooks: [...ONTARIO_SPORTSBOOKS] })}
            >
              Select All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateSettings({ selectedSportsbooks: [] })}
            >
              Deselect All
            </Button>
            <Badge variant="outline" className="ml-auto">
              {settings.selectedSportsbooks.length} / {ONTARIO_SPORTSBOOKS.length} selected
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Arbitrage Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Arbitrage Settings
          </CardTitle>
          <CardDescription>
            Set minimum profit thresholds for arbitrage opportunities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">
                Minimum Profit Percentage
              </label>
              <span className="text-sm font-bold">
                {settings.minProfitPercentage.toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={settings.minProfitPercentage}
              onChange={(e) =>
                updateSettings({ minProfitPercentage: parseFloat(e.target.value) })
              }
              className="w-full"
            />
            <p className="text-xs text-foreground/60 mt-1">
              Only show opportunities with at least this profit percentage
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Bankroll (Optional)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/60">$</span>
              <input
                type="number"
                value={settings.bankroll || ''}
                onChange={(e) =>
                  updateSettings({ bankroll: parseFloat(e.target.value) || undefined })
                }
                placeholder="Enter your bankroll"
                className="w-full pl-7 pr-3 py-2 rounded-lg border border-foreground/20 bg-background"
                min="0"
              />
            </div>
            <p className="text-xs text-foreground/60 mt-1">
              Track your available betting funds for better stake recommendations
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Get alerted about new arbitrage opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Enable Notifications</div>
              <p className="text-sm text-foreground/60">
                Receive alerts when new arbitrage opportunities are found
              </p>
            </div>
            <Button
              variant={settings.notifications ? 'success' : 'outline'}
              onClick={() => updateSettings({ notifications: !settings.notifications })}
            >
              {settings.notifications ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Favorites */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Favorites
          </CardTitle>
          <CardDescription>
            Manage your favorite players and teams for quick access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-2">Favorite Players</div>
              <div className="flex flex-wrap gap-2">
                {settings.favoritePlayers.length === 0 ? (
                  <p className="text-sm text-foreground/60">No favorite players yet</p>
                ) : (
                  settings.favoritePlayers.map((player) => (
                    <Badge key={player} variant="outline">
                      {player}
                    </Badge>
                  ))
                )}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Favorite Teams</div>
              <div className="flex flex-wrap gap-2">
                {settings.favoriteTeams.length === 0 ? (
                  <p className="text-sm text-foreground/60">No favorite teams yet</p>
                ) : (
                  settings.favoriteTeams.map((team) => (
                    <Badge key={team} variant="outline">
                      {team}
                    </Badge>
                  ))
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
        <CardHeader>
          <CardTitle>About Ontario Arb Finder</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/80 mb-3">
            This application helps you find arbitrage betting opportunities and compare prop odds
            across all Ontario-licensed sportsbooks. All data is for informational purposes only.
          </p>
          <p className="text-sm text-foreground/60">
            Please gamble responsibly. Visit{' '}
            <a
              href="https://www.connexontario.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 hover:underline"
            >
              ConnexOntario
            </a>{' '}
            for support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
