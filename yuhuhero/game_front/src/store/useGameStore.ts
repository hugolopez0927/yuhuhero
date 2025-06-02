import { create } from 'zustand';
import { getGameProgress, updateGameProgress } from '../services/api';

interface GameState {
  currentLevel: number;
  coins: number;
  completedLevels: string[];
  loading: boolean;
  error: string | null;
  
  // Acciones
  incrementLevel: () => void;
  addCoins: (amount: number) => void;
  completeLevel: (levelId: string) => void;
  fetchGameProgress: () => Promise<void>;
  syncWithServer: () => Promise<void>;
}

export const useGameStore = create<GameState>((set, get) => ({
  currentLevel: 1,
  coins: 0,
  completedLevels: [],
  loading: false,
  error: null,
  
  incrementLevel: () => {
    set((state) => ({ 
      currentLevel: state.currentLevel + 1 
    }));
    get().syncWithServer();
  },
  
  addCoins: (amount) => {
    set((state) => ({ 
      coins: state.coins + amount 
    }));
    get().syncWithServer();
  },
  
  completeLevel: (levelId) => {
    set((state) => {
      // Verificar si ya está completado para no duplicar
      if (state.completedLevels.includes(levelId)) {
        return state;
      }
      return { 
        completedLevels: [...state.completedLevels, levelId] 
      };
    });
    get().syncWithServer();
  },
  
  fetchGameProgress: async () => {
    try {
      set({ loading: true, error: null });
      const progress = await getGameProgress();
      set({ 
        currentLevel: progress.current_level,
        coins: progress.coins,
        completedLevels: progress.completed_levels,
        loading: false 
      });
    } catch (error) {
      console.error("Error fetching game progress:", error);
      set({ 
        loading: false, 
        error: 'Error al cargar el progreso del juego' 
      });
    }
  },
  
  syncWithServer: async () => {
    const { currentLevel, coins, completedLevels } = get();
    try {
      await updateGameProgress({
        current_level: currentLevel,
        coins,
        completed_levels: completedLevels
      });
    } catch (error) {
      console.error("Error syncing with server:", error);
      set({ error: 'Error al sincronizar con el servidor' });
    }
  }
})); 