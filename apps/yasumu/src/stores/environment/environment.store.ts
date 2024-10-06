import { create } from 'zustand';
import { YasumuEnvironmentVariable, YasumuEnvironmentVariableType, YasumuWorkspaceEnvironment } from '@yasumu/core';

export interface YasumuEnvironment {
  environments: YasumuWorkspaceEnvironment[];
  setEnvironments: (env: YasumuWorkspaceEnvironment[]) => void;
  addEnvironment: (env: YasumuWorkspaceEnvironment) => void;
  deleteEnvironment: (id: string) => void;
  selected: YasumuWorkspaceEnvironment | null;
  focused: YasumuWorkspaceEnvironment | null;
  setSelected: (env: YasumuWorkspaceEnvironment | null) => void;
  setFocused: (env: YasumuWorkspaceEnvironment | null) => void;
  selectById: (id: string) => void;
  addVariable(variable: YasumuEnvironmentVariable): void;
  updateVariable(variable: YasumuEnvironmentVariable): void;
  deleteVariable(variable: YasumuEnvironmentVariable): void;
}

export const useEnvironment = create<YasumuEnvironment>((set) => ({
  environments: [],
  setEnvironments: (env) => set({ environments: env }),
  addEnvironment: (env) => set((state) => ({ environments: [...state.environments, env] })),
  deleteEnvironment: (id) => set((state) => ({ environments: state.environments.filter((env) => env.id !== id) })),
  selected: null,
  focused: null,
  setSelected: (env) => set({ selected: env }),
  setFocused: (env) => set({ focused: env }),
  selectById: (id) => set((state) => ({ selected: state.environments.find((env) => env.id === id) })),
  addVariable: (variable) => {
    return set((state) => ({
      environments: state.environments.map((env) => {
        if (env.id === state.focused?.id) {
          return {
            ...env,
            variables: [...env.variables, variable],
          };
        }
        return env;
      }),
    }));
  },
  updateVariable: (variable) => {
    return set((state) => ({
      environments: state.environments.map((env) => {
        if (env.id === state.focused?.id) {
          return {
            ...env,
            variables: env.variables.map((v) => (v.id === variable.id ? variable : v)),
          };
        }
        return env;
      }),
    }));
  },
  deleteVariable: (variable) => {
    return set((state) => ({
      environments: state.environments.map((env) => {
        if (env.id === state.focused?.id) {
          return {
            ...env,
            variables: env.variables.filter((v) => v.id !== variable.id),
          };
        }
        return env;
      }),
    }));
  },
}));
