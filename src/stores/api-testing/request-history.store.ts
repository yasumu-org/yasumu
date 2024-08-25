import { YasumuRestEntity } from '@yasumu/core';
import { create } from 'zustand';

export interface IRequestHistory {
  history: YasumuRestEntity[];
  addHistory: (history: YasumuRestEntity) => void;
  removeHistory: (history: YasumuRestEntity) => void;
  removeHistoryByPath: (path: string) => void;
  clearHistory: () => void;
}

export const useRequestHistory = create<IRequestHistory>((set) => ({
  history: [],
  addHistory: (history: YasumuRestEntity) =>
    set((state) => {
      if (state.history.some((h) => h.getPath() === history.getPath())) return state;
      return { history: [...state.history, history] };
    }),
  removeHistory: (history: YasumuRestEntity) =>
    set((state) => {
      const index = state.history.findIndex((h) => h.getPath() === history.getPath());
      if (index === -1) return state;
      state.history.splice(index, 1);
      return { history: [...state.history] };
    }),
  removeHistoryByPath: (path: string) => {
    set((state) => {
      const index = state.history.findIndex((h) => h.getPath() === path);
      if (index === -1) return state;
      state.history.splice(index, 1);
      return { history: [...state.history] };
    });
  },
  clearHistory: () => set({ history: [] }),
}));
