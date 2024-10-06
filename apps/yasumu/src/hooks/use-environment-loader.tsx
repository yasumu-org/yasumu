'use client';

import { useEnvironment } from '@/stores/environment/environment.store';
import { useCallback } from 'react';
import { Yasumu } from '@/lib/yasumu';

export function useEnvironmentLoader() {
  const { setEnvironments, setFocused, setSelected, focused, selected } = useEnvironment();

  const reloadEnv = useCallback(async () => {
    console.log('Reloading environments');
    const workspace = Yasumu.workspace;
    console.log('workspace', workspace?.metadata.id);
    if (!workspace) return;

    const envs = await Promise.all(workspace.environments.getEnvironments().map((e) => e.getData()));

    console.log('envs', envs);

    setEnvironments(envs);

    if (selected) {
      console.log('selected', selected.id);
      setSelected(envs.find((e) => e.id === selected.id) ?? null);
    }

    if (focused) {
      console.log('focused', focused.id);
      setFocused(envs.find((e) => e.id === focused.id) ?? null);
    }
  }, [selected, focused]);

  return { reloadEnv };
}
