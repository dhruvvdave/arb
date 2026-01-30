'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePreferencesStore } from '@/lib/store/preferences';
import { ONTARIO_SPORTSBOOKS } from '@/lib/types';
import { Settings as SettingsIcon, Bell, Moon, Sun } from 'lucide-react';

export default function SettingsPage() {
  const {
    selectedBooks,
    minEVThreshold,
    sports,
    betTypes,
    notifications,
    darkMode,
    setSelectedBooks,
    setMinEVThreshold,
    setSports,
    setBetTypes,
    setNotifications,
    toggleDarkMode,
    resetPreferences,
  } = usePreferencesStore();

  const toggleBook = (book: typeof ONTARIO_SPORTSBOOKS[number]) => {
    if (selectedBooks.includes(book)) {
      setSelectedBooks(selectedBooks.filter(b => b !== book));
    } else {
      setSelectedBooks([...selectedBooks, book]);
    }
  };

  const toggleSport = (sport: 'NBA' | 'NHL') => {
    if (sports.includes(sport)) {
      setSports(sports.filter(s => s !== sport));
    } else {
      setSports([...sports, sport]);
    }
  };

  const toggleBetType = (type: 'moneyline' | 'spread' | 'totals' | 'props') => {
    if (betTypes.includes(type)) {
      setBetTypes(betTypes.filter(t => t !== type));
    } else {
      setBetTypes([...betTypes, type]);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-500 to-gray-700 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Customize your betting intelligence experience
        </p>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            <CardTitle>Appearance</CardTitle>
          </div>
          <CardDescription>
            Customize how BetIQ looks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Dark Mode</div>
              <div className="text-sm text-muted-foreground">
                Use dark theme for better night viewing
              </div>
            </div>
            <Button
              variant={darkMode ? 'default' : 'outline'}
              onClick={toggleDarkMode}
            >
              {darkMode ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sportsbooks */}
      <Card>
        <CardHeader>
          <CardTitle>Ontario Sportsbooks</CardTitle>
          <CardDescription>
            Select which legal Ontario sportsbooks to monitor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                {selectedBooks.length} of {ONTARIO_SPORTSBOOKS.length} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (selectedBooks.length === ONTARIO_SPORTSBOOKS.length) {
                    setSelectedBooks([]);
                  } else {
                    setSelectedBooks([...ONTARIO_SPORTSBOOKS]);
                  }
                }}
              >
                {selectedBooks.length === ONTARIO_SPORTSBOOKS.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {ONTARIO_SPORTSBOOKS.map((book) => (
                <Button
                  key={book}
                  variant={selectedBooks.includes(book) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleBook(book)}
                  className="justify-start"
                >
                  {book}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* EV Threshold */}
      <Card>
        <CardHeader>
          <CardTitle>EV Threshold</CardTitle>
          <CardDescription>
            Minimum expected value to show opportunities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Minimum EV</span>
              <Badge variant="outline" className="text-lg">
                {minEVThreshold}%
              </Badge>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={minEVThreshold}
              onChange={(e) => setMinEVThreshold(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1%</span>
              <span>10%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sports */}
      <Card>
        <CardHeader>
          <CardTitle>Sports</CardTitle>
          <CardDescription>
            Select which sports to monitor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={sports.includes('NBA') ? 'default' : 'outline'}
              onClick={() => toggleSport('NBA')}
            >
              NBA
            </Button>
            <Button
              variant={sports.includes('NHL') ? 'default' : 'outline'}
              onClick={() => toggleSport('NHL')}
            >
              NHL
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bet Types */}
      <Card>
        <CardHeader>
          <CardTitle>Bet Types</CardTitle>
          <CardDescription>
            Select which bet types to show
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={betTypes.includes('moneyline') ? 'default' : 'outline'}
              onClick={() => toggleBetType('moneyline')}
            >
              Moneyline
            </Button>
            <Button
              variant={betTypes.includes('spread') ? 'default' : 'outline'}
              onClick={() => toggleBetType('spread')}
            >
              Spread
            </Button>
            <Button
              variant={betTypes.includes('totals') ? 'default' : 'outline'}
              onClick={() => toggleBetType('totals')}
            >
              Totals
            </Button>
            <Button
              variant={betTypes.includes('props') ? 'default' : 'outline'}
              onClick={() => toggleBetType('props')}
            >
              Props
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>
            Configure alert preferences (UI only - push notifications coming soon)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">EV Threshold Alerts</div>
              <div className="text-sm text-muted-foreground">
                Alert when opportunities cross your EV threshold
              </div>
            </div>
            <Button
              variant={notifications.evThreshold ? 'default' : 'outline'}
              size="sm"
              onClick={() => setNotifications({ ...notifications, evThreshold: !notifications.evThreshold })}
            >
              {notifications.evThreshold ? 'On' : 'Off'}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Stable Line Alerts</div>
              <div className="text-sm text-muted-foreground">
                Alert when lines stabilize for 15+ minutes
              </div>
            </div>
            <Button
              variant={notifications.stableLine ? 'default' : 'outline'}
              size="sm"
              onClick={() => setNotifications({ ...notifications, stableLine: !notifications.stableLine })}
            >
              {notifications.stableLine ? 'On' : 'Off'}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Odds Movement Alerts</div>
              <div className="text-sm text-muted-foreground">
                Alert when odds move significantly
              </div>
            </div>
            <Button
              variant={notifications.oddsMovement ? 'default' : 'outline'}
              size="sm"
              onClick={() => setNotifications({ ...notifications, oddsMovement: !notifications.oddsMovement })}
            >
              {notifications.oddsMovement ? 'On' : 'Off'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reset */}
      <Card>
        <CardHeader>
          <CardTitle>Reset Preferences</CardTitle>
          <CardDescription>
            Restore all settings to default values
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={resetPreferences}
          >
            Reset to Defaults
          </Button>
        </CardContent>
      </Card>

      {/* Responsible Gambling */}
      <Card className="border-yellow-500/50 bg-yellow-500/5">
        <CardContent className="pt-6">
          <div className="text-sm space-y-2">
            <p className="font-semibold">Responsible Gambling Resources</p>
            <p className="text-muted-foreground">
              BetIQ is a decision support tool, not financial advice. Always bet responsibly and within your means. 
              If you need help, visit:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>
                <a 
                  href="https://www.connexontario.ca/en-ca" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  ConnexOntario
                </a>
              </li>
              <li>
                <a 
                  href="https://www.problemgambling.ca/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Problem Gambling Institute of Ontario
                </a>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
