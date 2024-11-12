import { atom } from 'nanostores';
import { useYasumu } from '@/providers/WorkspaceProvider';
import { useEffect, useSyncExternalStore } from 'react';

export interface EnvVar {
  id: string;
  key: string;
  value: string;
}

const $envVars = atom<Array<EnvVar>>([]);
const $envSecrets = atom<Array<EnvVar>>([]);

function setEnvVars(vars: Array<EnvVar>) {
  $envVars.set(vars);
}

function setEnvSecrets(secrets: Array<EnvVar>) {
  $envSecrets.set(secrets);
}

function subscribe(store: typeof $envVars, callback: () => void) {
  const unsubscribe = store.listen(callback);
  return () => unsubscribe();
}

export function useEnvVars() {
  return useSyncExternalStore(
    (cb) => subscribe($envVars, cb),
    () => $envVars.get(),
  );
}

export function useEnvSecrets() {
  return useSyncExternalStore(
    (cb) => subscribe($envSecrets, cb),
    () => $envSecrets.get(),
  );
}

export function useEnvironment(envId?: string | null) {
  const yasumu = useYasumu();
  const envVars = useEnvVars();
  const envSecrets = useEnvSecrets();
  const env = yasumu.workspace?.environments.getEnvironment(envId ?? '');

  useEffect(() => {
    if (!env) return;

    const vars = env.variables.map((v) => ({
      id: v.key,
      key: v.key,
      value: v.value,
    }));

    setEnvVars(vars);

    env.getSecretsWithValues().then((secrets) => {
      const s = secrets.map((v) => ({
        id: v.key,
        key: v.key,
        value: v.value,
      }));

      setEnvSecrets(s);
    }, console.error);
  }, [env]);

  return { env, envVars, envSecrets, setEnvVars, setEnvSecrets };
}
