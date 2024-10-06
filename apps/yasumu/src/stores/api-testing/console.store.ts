import { create } from 'zustand';

export const ConsoleLogScope = {
  PreRequest: 'PreRequest',
  PostResponse: 'PostResponse',
  Test: 'Test',
} as const;
export type ConsoleLogScope = (typeof ConsoleLogScope)[keyof typeof ConsoleLogScope];

export interface ConsoleLogStream extends LogStream {
  scope: ConsoleLogScope;
}

export interface IConsole {
  logs: ConsoleLogStream[];
  add: (log: ConsoleLogStream | ConsoleLogStream[]) => void;
  clear: () => void;
}

export const useConsole = create<IConsole>((set) => ({
  logs: [],
  add: (log: ConsoleLogStream | ConsoleLogStream[]) =>
    set((state) => ({ logs: [...state.logs, ...(Array.isArray(log) ? log : [log])] })),
  clear: () => set({ logs: [] }),
}));
