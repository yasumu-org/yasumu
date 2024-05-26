import { create } from 'zustand';

export interface IRequestHistory {
  method: string;
  url: string;
  body: string;
  headers: { key: string; value: string }[];
}

export const useRequestHistory = create((set) => ({
  history: [] as IRequestHistory[],
  setHistory: (history: IRequestHistory[]) => set({ history }),
}));

export const useOpenRequestHistory = create((set) => ({
  history: [] as IRequestHistory[],
  setHistory: (history: IRequestHistory[]) => set({ history }),
  close: (history: IRequestHistory) =>
    set((state: any) => ({
      history: state.history.filter((h: any) => h !== history),
    })),
  open: (history: IRequestHistory) =>
    set((state: any) => ({
      history: [...state.history, history],
    })),
}));
