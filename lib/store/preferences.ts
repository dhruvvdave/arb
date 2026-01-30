import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserPreferences, ONTARIO_SPORTSBOOKS } from '@/lib/types';

interface PreferencesStore extends UserPreferences {
  useMockData: boolean;
  setSelectedBooks: (books: typeof ONTARIO_SPORTSBOOKS[number][]) => void;
  setMinEVThreshold: (threshold: number) => void;
  setSports: (sports: UserPreferences['sports']) => void;
  setBetTypes: (types: UserPreferences['betTypes']) => void;
  setNotifications: (notifications: UserPreferences['notifications']) => void;
  toggleDarkMode: () => void;
  toggleMockData: () => void;
  resetPreferences: () => void;
}

const defaultPreferences: UserPreferences = {
  selectedBooks: [...ONTARIO_SPORTSBOOKS],
  minEVThreshold: 3,
  sports: ['NBA', 'NHL'],
  betTypes: ['moneyline', 'spread', 'totals', 'props'],
  notifications: {
    evThreshold: true,
    stableLine: true,
    oddsMovement: true,
  },
  darkMode: true,
};

// Check if we should use mock data from env or default to false (live mode)
const getDefaultMockDataSetting = () => {
  const envSetting = process.env.NEXT_PUBLIC_USE_MOCK_DATA;
  return envSetting === 'true'; // Default to false (live mode) unless explicitly set to true
};

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      ...defaultPreferences,
      useMockData: getDefaultMockDataSetting(),
      
      setSelectedBooks: (books) => set({ selectedBooks: books }),
      
      setMinEVThreshold: (threshold) => set({ minEVThreshold: threshold }),
      
      setSports: (sports) => set({ sports }),
      
      setBetTypes: (types) => set({ betTypes: types }),
      
      setNotifications: (notifications) => set({ notifications }),
      
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      
      toggleMockData: () => set((state) => ({ useMockData: !state.useMockData })),
      
      resetPreferences: () => set({ ...defaultPreferences, useMockData: getDefaultMockDataSetting() }),
    }),
    {
      name: 'user-preferences',
    }
  )
);
