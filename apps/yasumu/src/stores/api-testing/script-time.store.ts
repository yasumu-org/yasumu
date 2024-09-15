import { create } from 'zustand';

export interface ScriptTime {
  preRequest: number;
  postResponse: number;
  testScript: number;
  setPreRequest: (preRequest: number) => void;
  setPostResponse: (postResponse: number) => void;
  setTestScript: (testScript: number) => void;
}

export const useScriptTime = create<ScriptTime>((set) => ({
  preRequest: 0,
  postResponse: 0,
  testScript: 0,
  setPreRequest: (preRequest: number) => set({ preRequest }),
  setPostResponse: (postResponse: number) => set({ postResponse }),
  setTestScript: (testScript: number) => set({ testScript }),
}));
