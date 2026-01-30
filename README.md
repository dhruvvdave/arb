# Ontario Sports Betting - Arbitrage & Props Finder

A comprehensive, modern sports betting application focused on **Ontario, Canada legal sportsbooks only**. Find arbitrage opportunities, compare player props, analyze stats, and build parlays across NBA and NHL games.

![Ontario Arb Finder](https://img.shields.io/badge/Ontario-Legal%20Sportsbooks-green)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## 🎯 Features

### 1. **Arbitrage Betting Finder**
- Real-time scanning across all Ontario-legal sportsbooks
- Calculate guaranteed profit opportunities
- Display exact stake amounts and profit percentages
- Filter by sport (NBA/NHL), bet type, and minimum profit
- Time sensitivity indicators

### 2. **Props Finder**
- Aggregate player props across all Ontario sportsbooks
- NBA: Points, Rebounds, Assists, 3PM, Steals, Blocks, Combos (PRA, etc.)
- NHL: Goals, Assists, Points, Shots, Saves, Power Play Points
- Compare odds side-by-side
- Identify prop arbitrage opportunities
- Best odds highlighting

### 3. **Stats Checker & Analyzer**
- Player statistics dashboard with season averages
- Recent form (Last 5, 10, 20 games)
- Home vs Away splits
- Prop hit rate tracking
- Team statistics and ratings

### 4. **Parlay Builder**
- Build custom parlays with multiple legs
- Auto-calculate combined odds and potential payouts
- Risk assessment indicators
- Sportsbook recommendations for best odds
- Copy formatted bet text

### 5. **Copy-to-App Feature**
- Individual copy buttons for each sportsbook
- Formatted bet text for easy pasting
- Quick copy for arbitrage opportunities

## 🏒🏀 Ontario Legal Sportsbooks

The app **exclusively** works with Ontario-licensed sportsbooks:
- bet365
- BetMGM
- DraftKings
- FanDuel
- PointsBet
- Betway
- Caesars
- theScore Bet
- Unibet
- 888sport
- BetRivers
- Betano
- Sports Interaction

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query) ready
- **UI Components**: Custom components with modern design
- **Icons**: Lucide React
- **Charts**: Recharts (ready to use)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dhruvvdave/arb.git
   cd arb
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```
   NEXT_PUBLIC_ODDS_API_KEY=your_odds_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 API Setup

### The Odds API

This app is designed to work with [The Odds API](https://the-odds-api.com/) for live odds data.

1. Sign up for a free API key at https://the-odds-api.com/
2. Add your API key to `.env.local`
3. The free tier includes 500 requests per month

### Mock Data

The app comes with comprehensive mock data for development and demo purposes. You can use the app immediately without an API key to see all features.

## 📁 Project Structure

```
arb/
├── app/                    # Next.js app directory
│   ├── arbitrage/         # Arbitrage finder page
│   ├── props/             # Props comparison page
│   ├── stats/             # Stats analyzer page
│   ├── parlay/            # Parlay builder page
│   ├── settings/          # Settings page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Dashboard (home page)
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # Reusable UI components
│   ├── layout/            # Layout components (Navigation)
│   ├── arbitrage/         # Arbitrage-specific components
│   ├── props/             # Props-specific components
│   └── stats/             # Stats-specific components
├── lib/
│   ├── utils/             # Utility functions (odds calculations, etc.)
│   ├── api/               # API integration (ready for live data)
│   ├── hooks/             # Custom React hooks
│   ├── stores/            # Zustand stores
│   └── data/              # Mock data
└── types/                 # TypeScript type definitions
```

## 🎨 Features in Detail

### Arbitrage Calculator
The arbitrage finder uses sophisticated algorithms to:
- Calculate implied probability from American odds
- Detect arbitrage opportunities across multiple sportsbooks
- Compute optimal stake distribution
- Calculate guaranteed profit

### Odds Utilities
Built-in utilities for:
- Converting American odds to decimal and vice versa
- Calculating implied probability
- Computing parlay odds
- Determining potential profits

### Dark Mode
- Dark mode enabled by default
- Light mode available via toggle
- Smooth theme transitions
- System preference detection

## 🔒 Responsible Gambling

This application is for informational purposes only. Please gamble responsibly.

**Ontario Resources:**
- [ConnexOntario](https://www.connexontario.ca) - Problem gambling support
- [Alcohol and Gaming Commission of Ontario (AGCO)](https://www.agco.ca/)

## 📱 Responsive Design

The app is fully responsive and works seamlessly on:
- Desktop browsers
- Tablets
- Mobile devices

Mobile-first design with optimized navigation for small screens.

## 🚧 Future Enhancements

- [ ] Live odds integration with The Odds API
- [ ] Push notifications for new arbitrage opportunities
- [ ] Advanced filtering and search
- [ ] Bet tracking and history
- [ ] ROI calculator and bankroll management
- [ ] Export data to CSV
- [ ] Same-game parlay suggestions
- [ ] Machine learning for prop predictions

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ⚠️ Disclaimer

This application is not affiliated with any sportsbook. All logos and trademarks are property of their respective owners. Odds and data are for informational purposes only. Please verify all information with the sportsbook before placing any bets.

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ for Ontario sports bettors**
