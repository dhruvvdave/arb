import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserSettings, BetRecord } from '@/types';

interface AppState {
  // Settings
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
  
  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  
  // Bet History
  betHistory: BetRecord[];
  addBet: (bet: BetRecord) => void;
  updateBet: (id: string, updates: Partial<BetRecord>) => void;
  
  // Favorites
  favoritePlayers: string[];
  favoriteTeams: string[];
  toggleFavoritePlayer: (player: string) => void;
  toggleFavoriteTeam: (team: string) => void;
  
  // Filters
  selectedSport: 'NBA' | 'NHL' | 'both';
  setSelectedSport: (sport: 'NBA' | 'NHL' | 'both') => void;
  minProfitFilter: number;
  setMinProfitFilter: (percent: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Settings
      settings: {
        selectedSportsbooks: [
          'bet365',
          'BetMGM',
          'DraftKings',
          'FanDuel',
          'PointsBet',
          'Betway',
          'Caesars',
          'theScore Bet',
          'Unibet',
          '888sport',
          'BetRivers',
          'Betano',
          'Sports Interaction',
        ],
        favoritePlayers: [],
        favoriteTeams: [],
        minProfitPercentage: 1.0,
        notifications: true,
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      
      // Theme
      theme: 'dark',
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
        })),
      
      // Bet History
      betHistory: [],
      addBet: (bet) =>
        set((state) => ({
          betHistory: [bet, ...state.betHistory],
        })),
      updateBet: (id, updates) =>
        set((state) => ({
          betHistory: state.betHistory.map((bet) =>
            bet.id === id ? { ...bet, ...updates } : bet
          ),
        })),
      
      // Favorites
      favoritePlayers: [],
      favoriteTeams: [],
      toggleFavoritePlayer: (player) =>
        set((state) => ({
          favoritePlayers: state.favoritePlayers.includes(player)
            ? state.favoritePlayers.filter((p) => p !== player)
            : [...state.favoritePlayers, player],
        })),
      toggleFavoriteTeam: (team) =>
        set((state) => ({
          favoriteTeams: state.favoriteTeams.includes(team)
            ? state.favoriteTeams.filter((t) => t !== team)
            : [...state.favoriteTeams, team],
        })),
      
      // Filters
      selectedSport: 'both',
      setSelectedSport: (sport) => set({ selectedSport: sport }),
      minProfitFilter: 1.0,
      setMinProfitFilter: (percent) => set({ minProfitFilter: percent }),
    }),
    {
      name: 'arb-storage',
    }
  )
);
