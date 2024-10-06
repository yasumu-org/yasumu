import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEnvironment } from '@/stores/environment/environment.store';
import { Eye, EyeOff, Trash } from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Yasumu } from '@/lib/yasumu';
import { YasumuEnvironmentVariableType } from '@yasumu/core';
import { toast } from 'sonner';
import { useEnvironmentLoader } from '@/hooks/use-environment-loader';

interface VariableEditorProps {
  name: string;
  type: YasumuEnvironmentVariableType;
}

export default function VariableEditor({ name, type }: VariableEditorProps) {
  const { focused, updateVariable, deleteVariable, addVariable, environments } = useEnvironment();
  const { reloadEnv } = useEnvironmentLoader();

  const values = useMemo(() => {
    if (!focused) return [];
    const target = environments.find((e) => e.id === focused.id);
    if (!target) return [];

    return target.variables.filter((v) => v.type === type);
  }, [focused, environments, type]);

  const onSave = useCallback(() => {
    const workspace = Yasumu.workspace;
    if (!workspace || !focused) return;

    const target = environments.find((e) => e.id === focused.id);
    if (!target) return;

    workspace.environments.setEnvironments(environments).then(
      () => {
        toast.success('Environment saved successfully.');
        reloadEnv().catch(console.error);
      },
      (e) => {
        toast.error('Failed to save the environment.', {
          description: String(e),
        });
      },
    );
  }, [environments, type, focused]);

  return (
    <div className="border p-4 rounded-sm">
      <h1 className="font-medium">{name}</h1>
      {type === YasumuEnvironmentVariableType.Secret ? (
        <p className="text-sm">{name} will not be exported in the workspace.</p>
      ) : (
        <p className="text-sm">{name} will be publicly exported in the workspace.</p>
      )}
      <div className="mt-4 space-y-4">
        <div className="flex gap-4 items-center">
          <Button
            size="sm"
            onClick={() =>
              addVariable({
                enabled: true,
                id: crypto.randomUUID(),
                name: '',
                type,
                value: '',
              })
            }
          >
            Add {type}
          </Button>
          <Button size="sm" onClick={onSave}>
            Save
          </Button>
        </div>
        {values.length > 0 && (
          <Table className="border rounded-sm">
            <TableHeader className="border bg-secondary/30">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {values.map((variable) => (
                <TableRow key={variable.id} className="border">
                  <TableCell className="border-r">
                    <Input
                      defaultValue={variable.name}
                      placeholder="Name..."
                      onChange={(e) => updateVariable({ ...variable, name: e.target.value, type })}
                    />
                  </TableCell>
                  <TableCell className="border-r">
                    <VariableInputField
                      value={variable.value}
                      type={variable.type}
                      secret={variable.type === YasumuEnvironmentVariableType.Secret}
                      onChange={(value) => updateVariable({ ...variable, value, type })}
                    />
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Switch
                      checked={variable.enabled}
                      onCheckedChange={(checked) => {
                        updateVariable({
                          ...variable,
                          enabled: checked,
                        });
                      }}
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        deleteVariable(variable);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

function VariableInputField({
  value,
  type,
  onChange,
  secret,
}: {
  value: string;
  type: YasumuEnvironmentVariableType;
  onChange: (value: string) => void;
  secret: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [show, setShow] = useState(false);

  const handleToggleType = useCallback(() => {
    setShow((p) => !p);
  }, []);

  if (secret) {
    return (
      <div className="relative flex items-center">
        <Input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Value..."
          className="pr-10"
        />
        <button className="absolute right-2 cursor-pointer" onClick={handleToggleType}>
          {!show && <Eye className="h-5 w-5" />}
          {show && <EyeOff className="h-5 w-5" />}
        </button>
      </div>
    );
  }

  return (
    <Input ref={inputRef} type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Value..." />
  );
}
