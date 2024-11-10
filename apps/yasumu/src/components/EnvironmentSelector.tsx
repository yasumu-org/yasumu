'use client';
import React, { useEffect } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useYasumu } from '@/providers/WorkspaceProvider';
import { YasumuEnvironment } from '@yasumu/core/dist/workspace/environments/YasumuEnvironment';

export default function EnvironmentSelector() {
  const yasumu = useYasumu();
  const [selectedEnvironment, setSelectedEnvironment] = React.useState<string | null>(null);
  const [environments, setEnvironments] = React.useState<YasumuEnvironment[]>([]);
  const currentEnvironment = yasumu.workspace?.environments.getSelectedEnvironment();

  useEffect(() => {
    if (selectedEnvironment) {
      yasumu.workspace?.environments.selectEnvironment(selectedEnvironment).catch(Object);
    }
  }, [yasumu.workspace?.environments, selectedEnvironment]);

  useEffect(() => {
    setEnvironments(yasumu.workspace?.environments.getEnvironments() ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Select
      value={currentEnvironment?.id}
      onValueChange={(id) => {
        setSelectedEnvironment(id);
      }}
    >
      <SelectTrigger className="w-[180px] h-8">
        <SelectValue placeholder="Environment" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {environments.map((env) => (
            <SelectItem key={env.id} value={env.id}>
              {env.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
