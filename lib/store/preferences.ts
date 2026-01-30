import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserPreferences, ONTARIO_SPORTSBOOKS } from '@/lib/types';

interface PreferencesStore extends UserPreferences {
  setSelectedBooks: (books: typeof ONTARIO_SPORTSBOOKS[number][]) => void;
  setMinEVThreshold: (threshold: number) => void;
  setSports: (sports: UserPreferences['sports']) => void;
  setBetTypes: (types: UserPreferences['betTypes']) => void;
  setNotifications: (notifications: UserPreferences['notifications']) => void;
  toggleDarkMode: () => void;
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

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      ...defaultPreferences,
      
      setSelectedBooks: (books) => set({ selectedBooks: books }),
      
      setMinEVThreshold: (threshold) => set({ minEVThreshold: threshold }),
      
      setSports: (sports) => set({ sports }),
      
      setBetTypes: (types) => set({ betTypes: types }),
      
      setNotifications: (notifications) => set({ notifications }),
      
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      
      resetPreferences: () => set(defaultPreferences),
    }),
    {
      name: 'user-preferences',
    }
  )
);
