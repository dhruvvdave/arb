# BetIQ - Sports Betting Intelligence Platform

> A sophisticated +EV detection and decision support tool for NBA and NHL betting on Ontario, Canada legal sportsbooks.

**Core Philosophy:** "We don't promise guaranteed profit. We surface statistically mispriced opportunities with context, confidence, and timing."

## 🎯 Features

### 1. +EV Opportunity Scanner
- Real-time detection of positive expected value opportunities
- Fair probability estimation using statistical models
- Slippage-adjusted EV calculations
- Stability and volatility scoring
- Comprehensive filtering system

### 2. Prop Intelligence Engine
- Line comparison across all Ontario sportsbooks
- Historical hit rate analysis
- Context-aware insights (defense stats, usage trends, splits)
- Player performance trends
- Back-to-back game indicators

### 3. AI-Assisted Parlay Builder
- Smart parlay suggestions with correlation analysis
- Risk tier classification (Low/Medium/High/Spicy)
- Combined EV calculations
- Correlation warnings
- AI reasoning for each parlay

### 4. Stats Analyzer
- Comprehensive player statistics
- Team performance metrics
- Trend visualizations
- Home/away splits
- Recent form analysis

### 5. Timing-Aware Notifications
- EV threshold alerts
- Stable line notifications
- Odds movement detection
- (UI ready for push notifications)

### 6. Copy-to-App Feature
- One-click bet slip copying
- Formatted bet text
- Deep link support (structure in place)

## 🏒 Ontario Legal Sportsbooks

The platform monitors these Ontario-licensed sportsbooks:
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

## 🛠 Tech Stack

- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **State Management:** Zustand
- **Data Fetching:** TanStack Query
- **Charts:** Recharts
- **Icons:** Lucide React
- **Animations:** Framer Motion

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/dhruvvdave/arb.git
cd arb
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your API keys:
```env
# The Odds API (for real odds data)
ODDS_API_KEY=your_api_key_here

# Optional: Other API keys
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
arb/
├── app/                    # Next.js 14+ App Router pages
│   ├── page.tsx           # Dashboard
│   ├── scanner/           # +EV Scanner page
│   ├── props/             # Props Intelligence page
│   ├── parlay/            # Parlay Builder page
│   ├── stats/             # Stats Analyzer page
│   └── settings/          # Settings page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   └── ...               # Feature-specific components
├── lib/                  # Utilities and core logic
│   ├── types.ts          # TypeScript type definitions
│   ├── odds-calculator.ts # Odds and EV calculations
│   ├── mock-data.ts      # Mock data generator
│   └── store/            # Zustand stores
└── public/               # Static assets
```

## 🎨 Design System

### Color Coding
- **Green:** Positive EV / Good value
- **Yellow/Gold:** Highlighted opportunities / Warnings
- **Red:** Alerts / Negative indicators
- **Blue:** Informational / Neutral

### Dark Mode
Dark mode is enabled by default for optimal viewing. Toggle between light and dark modes via the settings page or navigation bar.

## 📊 Data Sources

### Current Implementation
- **Mock Data:** Development mode uses generated mock data demonstrating all features
- **Data Structure:** Ready for integration with The Odds API

### Future Integration
To connect real odds data:

1. Sign up for [The Odds API](https://the-odds-api.com/)
2. Add your API key to `.env.local`
3. Implement API routes in `app/api/` 
4. Update data fetching hooks to use TanStack Query

Example API route structure:
```typescript
// app/api/odds/route.ts
export async function GET(request: Request) {
  const apiKey = process.env.ODDS_API_KEY;
  // Fetch from The Odds API
  // Return normalized data
}
```

## 🔒 Legal & Compliance

### Important Disclaimers

- ✅ This is a **decision support tool**, not financial advice
- ✅ Estimates based on historical data and statistical models
- ✅ Past performance does not guarantee future results
- ✅ Always bet responsibly and within your means

### Responsible Gambling Resources

If you need help:
- [ConnexOntario](https://www.connexontario.ca/en-ca)
- [Problem Gambling Institute of Ontario](https://www.problemgambling.ca/)

### Ontario Gaming Compliance

This platform:
- ✅ Only displays Ontario-licensed sportsbooks
- ✅ Does not facilitate betting transactions
- ✅ Does not store betting history
- ✅ Provides educational content only

## 🧮 How It Works

### EV Calculation
1. Convert odds to implied probability
2. Remove vig (bookmaker margin)
3. Estimate fair probability from historical data
4. Calculate expected value: `EV = (Fair Probability × Decimal Odds) - 1`
5. Apply slippage adjustment for realistic scenarios

### Stability Scoring
- Tracks how long odds have remained consistent
- Higher stability = more reliable opportunity
- Filters out volatile, short-lived opportunities

### Prop Intelligence
- Historical hit rates at various lines
- Defense vs position rankings
- Usage and minutes trends
- Home/away performance splits
- Back-to-back game fatigue factors

### Parlay Correlation
- Analyzes leg interdependencies
- Adjusts combined probability for correlation
- Provides warnings for negatively correlated legs
- Risk classification based on leg count and correlation

## 🎯 Roadmap

### Completed ✅
- [x] Project setup and infrastructure
- [x] Core UI components and layout
- [x] Dashboard with stats cards
- [x] +EV Scanner with filtering
- [x] Props Intelligence Engine
- [x] Parlay Builder with AI analysis
- [x] Stats Analyzer
- [x] Settings page with preferences
- [x] Dark/light mode theming
- [x] Mock data system

### Coming Soon 🚀
- [ ] Live odds API integration
- [ ] Real-time WebSocket updates
- [ ] Push notifications
- [ ] Historical opportunity tracking
- [ ] Performance analytics
- [ ] Bet tracking (optional, no transactions)
- [ ] Mobile app (React Native)
- [ ] Advanced filters (time of day, specific teams)
- [ ] Custom parlay builder with drag-and-drop
- [ ] Machine learning model for fair probability

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is for educational and portfolio purposes. Always comply with local gambling laws and regulations.

## 👤 Author

**Dhruv Dave**
- GitHub: [@dhruvvdave](https://github.com/dhruvvdave)

## 🙏 Acknowledgments

- Ontario Gaming Commission for regulatory guidelines
- The Odds API for odds data structure
- shadcn/ui for beautiful components
- Next.js team for the amazing framework

---

**Remember:** This is a decision support tool, not a guaranteed profit system. Always bet responsibly! 🎲
