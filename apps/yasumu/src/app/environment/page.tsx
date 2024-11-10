'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { type EnvVar, EnvVarsTable } from './(components)/env-table';
import { useYasumu } from '@/providers/WorkspaceProvider';

export default function Environment() {
  const [envVars, setEnvVars] = useState<Array<EnvVar>>([]);
  const [envSecrets, setEnvSecrets] = useState<Array<EnvVar>>([]);
  const params = useSearchParams();
  const envId = params.get('env');
  const yasumu = useYasumu();
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

  if (!env) return null;

  return (
    <main className="p-7 h-full overflow-auto">
      <div className="pb-4 border-b">
        <h2 className="text-foreground/95">{env.id}</h2>
        <h3 className="text-foreground/70 text-sm">{env.name} environment</h3>
      </div>
      <Label className="flex gap-3 items-center mt-4">
        <Checkbox className="size-4" />
        <span className="text-foreground/90">Use this environment in this workspace.</span>
      </Label>

      <div className="space-y-12">
        <div>
          <h3 className="text-foreground/90 text-sm">Variable</h3>
          <p className="text-foreground/70 text-sm mt-1">Variable will be publicly exported in the workspace.</p>
          <div className="my-7">
            <EnvVarsTable envVars={envVars} setEnvVars={setEnvVars} />
          </div>
        </div>

        <div>
          <h3 className="text-foreground/90 text-sm">Secrets</h3>
          <p className="text-foreground/70 text-sm mt-1">Secret will not be exported in the workspace.</p>
          <div className="my-7">
            <EnvVarsTable envVars={envSecrets} setEnvVars={setEnvSecrets} />
          </div>
        </div>
      </div>
    </main>
  );
}
