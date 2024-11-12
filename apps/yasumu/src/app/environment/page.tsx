'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { EnvVarsTable } from './(components)/env-table';
import { useEnvironment } from '@/stores/EnvStore';

export default function Environment() {
  const params = useSearchParams();
  const envId = params.get('env');
  const { env, envVars, envSecrets, setEnvVars, setEnvSecrets } = useEnvironment(envId);

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
