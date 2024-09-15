import { create } from 'zustand';
import { TestResult } from '@yasumu/core';

export interface ITest {
  results: TestResult[];
  add: (log: TestResult | TestResult[]) => void;
  clear: () => void;
}

export const useTest = create<ITest>((set) => ({
  results: [],
  add: (log: TestResult | TestResult[]) =>
    set((state) => ({ results: [...state.results, ...(Array.isArray(log) ? log : [log])] })),
  clear: () => set({ results: [] }),
}));
