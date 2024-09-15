import { create } from 'zustand';

export interface IConsole {
  logs: LogStream[];
  add: (log: LogStream | LogStream[]) => void;
  clear: () => void;
}

export const useConsole = create<IConsole>((set) => ({
  logs: [],
  add: (log: LogStream | LogStream[]) =>
    set((state) => ({ logs: [...state.logs, ...(Array.isArray(log) ? log : [log])] })),
  clear: () => set({ logs: [] }),
}));
