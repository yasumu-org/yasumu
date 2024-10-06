'use client';

import { useEnvironment } from '@/stores/environment/environment.store';
import { useCallback } from 'react';
import { Yasumu } from '@/lib/yasumu';

export function useEnvironmentLoader() {
  const { setEnvironments, setFocused, setSelected, focused, selected } = useEnvironment();

  const reloadEnv = useCallback(async () => {
    const workspace = Yasumu.workspace;
    if (!workspace) return;

    const envs = await Promise.all(workspace.environments.getEnvironments().map((e) => e.getData()));

    setEnvironments(envs);

    if (selected) {
      setSelected(envs.find((e) => e.id === selected.id) ?? null);
    } else {
      const lastSelected = workspace.environments.getSelectedEnvironment();
      if (lastSelected) {
        const data = await lastSelected.getData().catch(() => null);
        if (data) setSelected(data);
      }
    }

    if (focused) {
      setFocused(envs.find((e) => e.id === focused.id) ?? null);
    }
  }, [selected, focused]);

  return { reloadEnv };
}
