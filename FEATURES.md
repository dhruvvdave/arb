# Ontario Sports Betting App - Feature Documentation

## Core Features

### 1. Arbitrage Betting Finder
**Location**: `/arbitrage`

**Features**:
- Real-time arbitrage opportunity detection across all Ontario legal sportsbooks
- Automatic calculation of:
  - Guaranteed profit percentage
  - Exact stake amounts for each bet
  - Total investment and return
  - Time sensitivity (how long the opportunity has been available)

**Filters**:
- Sport (NBA, NHL, or All)
- Bet Type (Moneyline, Spread, Totals)
- Minimum profit percentage (slider from 0-5%)

**Example Arb Opportunity**:
```
Boston Celtics @ Toronto Raptors
- bet365: Celtics -150 → Stake $600
- FanDuel: Raptors +180 → Stake $400
- Total: $1000 → Guaranteed Profit: $23.80 (2.38%)
```

### 2. Props Finder
**Location**: `/props`

**NBA Props**:
- Points, Rebounds, Assists
- 3-Pointers Made
- Steals, Blocks, Turnovers
- Combinations (PRA, Points+Rebounds, Points+Assists)

**NHL Props**:
- Goals, Assists, Points
- Shots on Goal
- Saves (goalies)
- Power Play Points

**Features**:
- Side-by-side odds comparison from all sportsbooks
- Best odds highlighting (green border)
- Arbitrage opportunity detection for props
- Quick copy buttons for best over/under odds
- Filter by sport and arb opportunities

### 3. Stats Checker & Analyzer
**Location**: `/stats`

**Player Statistics**:
- Season averages
- Recent form (Last 5, 10, 20 games)
- Home vs Away splits
- Opponent-specific performance
- Prop hit rate tracking

**Team Statistics**:
- Offensive/Defensive ratings
- Pace of play
- Recent form (W/L record)
- Home/Away records
- Head-to-head performance

**Visual Indicators**:
- Color-coded performance metrics
- Trend indicators
- Distribution charts (ready for Recharts integration)

### 4. Parlay Builder
**Location**: `/parlay`

**Features**:
- Add multiple legs to create custom parlays
- Real-time combined odds calculation
- Potential payout calculator
- Risk assessment:
  - Low Risk: 1-3 legs
  - Medium Risk: 4-5 legs
  - High Risk: 6+ legs
- Sportsbook recommendations for best parlay odds
- Interactive stake amount input

**Calculations**:
- Combined decimal odds multiplication
- American odds conversion
- Payout and profit display

### 5. Settings & Preferences
**Location**: `/settings`

**Configurable Options**:
- Sportsbook selection (choose from 13 Ontario books)
- Minimum profit percentage threshold
- Bankroll tracking (optional)
- Notification preferences
- Favorite players and teams
- Dark/Light mode toggle

**Persistence**:
- Settings saved to localStorage via Zustand
- Survives page refreshes and browser sessions

### 6. Copy-to-App Feature

**Available on**:
- Every arbitrage opportunity card
- Every prop comparison
- Parlay builder results

**Format**:
```
Player: Scottie Barnes | Prop: Points | Line: Over 20.5 | Odds: -108 | Book: BetMGM
```

**Implementation**:
- Individual buttons for each sportsbook
- Formatted text ready to paste into betting apps
- One-click copy to clipboard
- Future: Deep linking support for direct app opening

## Technical Implementation

### Type Safety
All features are fully typed with TypeScript:
- `ArbitrageOpportunity` type
- `PlayerProp` type
- `PlayerStats` & `TeamStats` types
- `Parlay` & `ParlayBet` types
- `Sportsbook` union type (13 Ontario books)

### State Management
Zustand stores handle:
- User settings and preferences
- Theme (dark/light mode)
- Bet history
- Favorites
- Filter states

### Utilities

**Odds Calculations** (`lib/utils/odds.ts`):
- `americanToDecimal()` - Convert American odds to decimal
- `decimalToAmerican()` - Convert decimal odds to American
- `impliedProbability()` - Calculate implied probability from odds
- `calculateArbitrage()` - Detect arb and calculate stakes
- `calculateParlayOdds()` - Combine multiple odds
- `formatOdds()` - Display formatting

**Styling** (`lib/utils/cn.ts`):
- `cn()` - Tailwind class merger with clsx

### Mock Data
Comprehensive demo data in `lib/data/mockData.ts`:
- 3 arbitrage opportunities (NBA/NHL mix)
- 4 player props with realistic odds
- Player statistics for featured players
- Team statistics for Toronto teams

### Responsive Design
- **Desktop**: Sidebar navigation, multi-column layouts
- **Tablet**: Adapted grid layouts
- **Mobile**: Bottom navigation bar, single-column layouts

## Ontario Legal Sportsbooks

The app exclusively supports these 13 Ontario-licensed sportsbooks:

1. **bet365** - International leader
2. **BetMGM** - MGM Resorts brand
3. **DraftKings** - Daily fantasy leader
4. **FanDuel** - Major US operator
5. **PointsBet** - Australian sportsbook
6. **Betway** - European operator
7. **Caesars** - Casino giant's sportsbook
8. **theScore Bet** - Canadian sports media brand
9. **Unibet** - Kindred Group brand
10. **888sport** - British operator
11. **BetRivers** - Rush Street Interactive
12. **Betano** - Kaizen Gaming brand
13. **Sports Interaction** - Canadian pioneer

All are regulated by the Alcohol and Gaming Commission of Ontario (AGCO).

## Future Enhancements

### Ready to Implement
1. **Live Odds Integration**
   - Connect to The Odds API
   - Real-time odds updates
   - Automatic arb detection

2. **Push Notifications**
   - Alert on new arb opportunities
   - Favorite player prop updates
   - Bankroll milestones

3. **Advanced Analytics**
   - Machine learning for prop predictions
   - Historical trend analysis
   - Bet tracking and ROI calculation

4. **Social Features**
   - Share parlays with friends
   - Community prop discussions
   - Expert picks integration

### Infrastructure in Place
- TanStack Query configured for data fetching
- Recharts ready for advanced visualizations
- Zustand middleware for complex state
- API route structure prepared

## Responsible Gambling

The app includes:
- Prominent responsible gambling messaging
- Link to ConnexOntario support
- Optional bankroll tracking
- Risk indicators on parlays
- Educational content about gambling

**Remember**: This is for entertainment and educational purposes. Always gamble responsibly.
