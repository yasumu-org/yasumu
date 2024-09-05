import { ConsoleStream } from '@/lib/scripts/script';
import { create } from 'zustand';

export interface IConsole {
  logs: ConsoleStream[];
  add: (log: ConsoleStream | ConsoleStream[]) => void;
  clear: () => void;
}

export const useConsole = create<IConsole>((set) => ({
  logs: [],
  add: (log: ConsoleStream | ConsoleStream[]) =>
    set((state) => ({ logs: [...state.logs, ...(Array.isArray(log) ? log : [log])] })),
  clear: () => set({ logs: [] }),
}));
