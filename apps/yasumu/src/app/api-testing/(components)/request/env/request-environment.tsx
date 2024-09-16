'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEnvironment } from '@/stores/application/environment.store';

export function RequestEnvironment() {
  const { environments, selected, selectById } = useEnvironment();

  return (
    <Select
      value={selected?.id}
      onValueChange={(value) => {
        selectById(value);
      }}
    >
      <SelectTrigger className="w-[130px] h-8 rounded-none px-2 py-1 select-none border-none bg-inherit">
        <SelectValue placeholder="Environment" />
      </SelectTrigger>
      <SelectContent>
        {environments.map((env) => (
          <SelectItem value={env.id} key={env.id}>
            {env.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
