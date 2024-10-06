import { YasumuPartialRestEntity } from '@yasumu/core';
import { create } from 'zustand';

export interface IRequestHistory {
  history: YasumuPartialRestEntity[];
  addHistory: (history: YasumuPartialRestEntity) => void;
  removeHistory: (history: YasumuPartialRestEntity) => void;
  removeHistoryByPath: (path: string) => void;
  clearHistory: () => void;
  setHistory: (history: YasumuPartialRestEntity[]) => void;
}

export const useRequestHistory = create<IRequestHistory>((set) => ({
  history: [],
  setHistory: (history: YasumuPartialRestEntity[]) => set({ history }),
  addHistory: (history: YasumuPartialRestEntity) =>
    set((state) => {
      if (state.history.some((h) => h.path === history.path)) return state;
      return { history: [history, ...state.history] };
    }),
  removeHistory: (history: YasumuPartialRestEntity) =>
    set((state) => {
      const index = state.history.findIndex((h) => h.path === history.path);
      if (index === -1) return state;
      state.history.splice(index, 1);
      return { history: [...state.history] };
    }),
  removeHistoryByPath: (path: string) => {
    set((state) => {
      const index = state.history.findIndex((h) => h.path === path);
      if (index === -1) return state;
      state.history.splice(index, 1);
      return { history: [...state.history] };
    });
  },
  clearHistory: () => set({ history: [] }),
}));
