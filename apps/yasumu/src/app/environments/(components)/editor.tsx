'use client';
import { Separator } from '@/components/ui/separator';
import { useEnvironment } from '@/stores/environment/environment.store';
import VariableEditor from './variable-editor';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { YasumuEnvironmentVariableType } from '@yasumu/core';
import { Yasumu } from '@/lib/yasumu';

export default function EnvironmentEditor({ total }: { total: number }) {
  const { setSelected, selected: selectedEnv, focused } = useEnvironment();

  if (!focused) {
    if (total < 1) return <h1>Create an environment to get started.</h1>;
    return <h1>Select an environment to modify its contents.</h1>;
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium">{focused.name}</h3>
      {focused.description && <p className="text-sm text-muted-foreground">{focused.description}</p>}
      <div className="flex items-center gap-2 my-2">
        <Checkbox
          checked={selectedEnv?.id === focused.id}
          onCheckedChange={(checked) => {
            if (checked === 'indeterminate') checked = false;
            setSelected(checked ? focused : null);
            Yasumu.workspace?.environments.selectEnvironment(focused?.id ?? null).catch(console.error);
          }}
        />
        <Label>Use this environment in this workspace.</Label>
      </div>
      <Separator className="my-4" />
      <div className="space-y-4">
        <VariableEditor name="Variables" type={YasumuEnvironmentVariableType.Variable} />
        <VariableEditor name="Secrets" type={YasumuEnvironmentVariableType.Secret} />
      </div>
    </div>
  );
}
