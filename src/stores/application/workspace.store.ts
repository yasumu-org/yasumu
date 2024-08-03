import { Yasumu } from '@/lib/api/yasumu';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface IWorkspaceConfig {
  currentWorkspace: string | null;
  setCurrentWorkspace: (workspace: string) => void;
}

export const useWorkspaceStore = create<IWorkspaceConfig>((set) => ({
  currentWorkspace: null,
  setCurrentWorkspace: (workspace: string) =>
    set({ currentWorkspace: workspace }),
}));
