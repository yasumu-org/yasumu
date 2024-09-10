'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { DialogTrigger } from '@/components/ui/dialog';
import { CreateEnvDialog } from './create-env';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

enum VariableType {
  DEFAULT = 'DEFAULT',
  SECRET = 'SECRET',
}

type EnvironmentVariable = {
  id: string;
  key: string;
  type: VariableType;
  value: string;
  enabled: boolean;
};

type Environment = {
  id: string;
  name: string;
  variables: EnvironmentVariable[];
};

const Environments: React.FC = () => {
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [selectedEnv, setSelectedEnv] = useState<Environment | null>(null);

  console.log('Environments', environments);
  console.log('SelectedEnv', selectedEnv);

  const handleCreate = (name: string) => {
    const newEnv: Environment = {
      id: Math.random().toString(),
      name,
      variables: [],
    };
    setEnvironments([...environments, newEnv]);
  };

  const onAddVariable = () => {
    if (!selectedEnv) return;
    const newVariable: EnvironmentVariable = {
      id: Math.random().toString(),
      key: '',
      type: VariableType.DEFAULT,
      value: '',
      enabled: true,
    };
    setSelectedEnv({
      ...selectedEnv,
      variables: [...selectedEnv.variables, newVariable],
    });
  };

  const onEdit = (variable: EnvironmentVariable) => {
    console.log('Edit', variable);
    if (!selectedEnv) return;
    console.log('Edit', variable);
    setSelectedEnv({
      ...selectedEnv,
      variables: selectedEnv.variables.map((v) => {
        if (v.id === variable.id) {
          return variable;
        }
        return v;
      }),
    });
  };

  const onDelete = (variable: EnvironmentVariable) => {
    if (!selectedEnv) return;
    setSelectedEnv({
      ...selectedEnv,
      variables: selectedEnv.variables.filter((v) => v.id !== variable.id),
    });
  };

  const saveEnv = () => {
    // Save the environment to file
  };

  return (
    <div>
      <div className="flex gap-4">
        <CreateEnvDialog onCreate={handleCreate} value="">
          <DialogTrigger asChild>
            <Button>Add Environment</Button>
          </DialogTrigger>
        </CreateEnvDialog>

        <Select
          value={selectedEnv?.name}
          onValueChange={(value) => {
            const env = environments.find((env) => env.name === value);
            if (env) {
              setSelectedEnv(env);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Environment" />
          </SelectTrigger>
          <SelectContent>
            {environments.map((env) => (
              <SelectItem key={env.id} value={env.name}>
                {env.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={saveEnv} disabled={!selectedEnv}>
          Save
        </Button>
      </div>
      <div className="mt-5 overflow-y-auto border-y">
        <Table className="border-x">
          <TableHeader>
            <TableRow>
              <TableHead>Variable</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedEnv?.variables.map((variable) => (
              <EnvironmentVariableRow
                key={variable.id}
                variable={variable}
                onEdit={onEdit}
                onDelete={() => onDelete(variable)}
              />
            ))}
          </TableBody>
        </Table>
        <Button className="mt-2" size="sm" onClick={onAddVariable}>
          Add new variable
        </Button>
      </div>
    </div>
  );
};

function EnvironmentVariableRow({
  variable,
  onEdit,
  onDelete,
}: {
  variable: EnvironmentVariable;
  onEdit: (env: EnvironmentVariable) => void;
  onDelete: () => void;
}) {
  return (
    <TableRow>
      <VariableInput value={variable.key} placeholder="Variable" onChange={(key) => onEdit({ ...variable, key })} />
      <VariableSelect value={variable.type} onChange={(type) => onEdit({ ...variable, type })} />

      <VariableInput
        value={variable.value}
        placeholder="Value"
        type={variable.type === 'SECRET' ? 'password' : 'text'}
        onChange={(value) => onEdit({ ...variable, value })}
      />
      <TableCell className="flex items-center gap-2">
        <Checkbox
          checked={variable.enabled}
          onCheckedChange={(checked: boolean) => onEdit({ ...variable, enabled: checked })}
        />
        <Button
          variant="ghost"
          size={'sm'}
          className="hover:bg-destructive hover:text-destructive-foreground"
          onClick={onDelete}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

function VariableInput({
  onChange,
  value,
  placeholder,
  type = 'text',
}: {
  onChange: (value: string) => void;
  value: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <TableCell className="font-medium">
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </TableCell>
  );
}

function VariableSelect({ value, onChange }: { value: VariableType; onChange: (value: VariableType) => void }) {
  return (
    <TableCell className="font-medium">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={VariableType.DEFAULT}>Default</SelectItem>
          <SelectItem value={VariableType.SECRET}>Secret</SelectItem>
        </SelectContent>
      </Select>
    </TableCell>
  );
}

export default Environments;
