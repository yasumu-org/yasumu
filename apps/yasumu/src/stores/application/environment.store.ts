import { create } from 'zustand';

export enum VariableType {
  DEFAULT = 'DEFAULT',
  SECRET = 'SECRET',
}

export type EnvironmentVariable = {
  id: string;
  key: string;
  type: VariableType;
  value: string;
  enabled: boolean;
};

export type Environment = {
  id: string;
  name: string;
  variables: EnvironmentVariable[];
};

export interface IEnvironmentStore {
  environments: Environment[];
  add: (env: Environment) => void;
  remove: (env: Environment) => void;
  update: (env: Environment) => void;
  select: (env: Environment) => void;
  selectById: (env: string) => void;
  selected: Environment | null;
  addVariable: (variable: EnvironmentVariable) => void;
  updateVariable: (variable: EnvironmentVariable) => void;
  removeVariable: (variable: EnvironmentVariable) => void;
}

export const useEnvironment = create<IEnvironmentStore>((set) => ({
  environments: [],
  add: (env: Environment) => set((state) => ({ environments: [...state.environments, env] })),
  remove: (env: Environment) => set((state) => ({ environments: state.environments.filter((e) => e.id !== env.id) })),
  update: (env: Environment) =>
    set((state) => ({
      environments: state.environments.map((e) => (e.id === env.id ? env : e)),
    })),
  select: (env: Environment) => set({ selected: env }),
  selectById: (env: string) => set((prev) => ({ selected: prev.environments.find((e) => e.id === env) || null })),
  selected: null,
  addVariable: (variable: EnvironmentVariable) =>
    set((state) => ({
      selected: state.selected
        ? {
            ...state.selected,
            variables: [...state.selected.variables, variable],
          }
        : null,
    })),
  updateVariable: (variable: EnvironmentVariable) =>
    set((state) => ({
      selected: state.selected
        ? {
            ...state.selected,
            variables: state.selected.variables.map((v) => (v.id === variable.id ? variable : v)),
          }
        : null,
    })),
  removeVariable: (variable: EnvironmentVariable) =>
    set((state) => ({
      selected: state.selected
        ? {
            ...state.selected,
            variables: state.selected.variables.filter((v) => v.id !== variable.id),
          }
        : null,
    })),
}));
