import { create } from 'zustand';

interface GameState {
  currentLevel: number;
  coins: number;
  completedLevels: string[];
  incrementLevel: () => void;
  addCoins: (amount: number) => void;
  completeLevel: (levelId: string) => void;
}

export const useGameStore = create<GameState>()((set) => ({
  currentLevel: 1,
  coins: 0,
  completedLevels: [],
  incrementLevel: () => set((state) => ({ currentLevel: state.currentLevel + 1 })),
  addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
  completeLevel: (levelId) => set((state) => ({ 
    completedLevels: [...state.completedLevels, levelId] 
  })),
})); 