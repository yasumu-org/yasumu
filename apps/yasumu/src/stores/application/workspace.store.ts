import { create } from 'zustand';

export interface IWorkspaceConfig {
  currentWorkspace: string | null;
  currentWorkspaceName: string | null;
  setCurrentWorkspace: (workspace: string) => void;
  setCurrentWorkspaceName: (workspace: string) => void;
}

export const useWorkspaceStore = create<IWorkspaceConfig>((set) => ({
  currentWorkspace: null,
  currentWorkspaceName: null,
  setCurrentWorkspace: (workspace: string) => set({ currentWorkspace: workspace }),
  setCurrentWorkspaceName: (workspace: string) => set({ currentWorkspaceName: workspace }),
}));
