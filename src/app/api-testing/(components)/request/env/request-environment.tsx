import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function RequestEnvironment() {
  return (
    <Select>
      <SelectTrigger className="w-[130px] h-8 rounded-none px-2 py-1 select-none border-none bg-inherit">
        <SelectValue placeholder="Environment" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="production">Production</SelectItem>
        <SelectItem value="staging">Staging</SelectItem>
        <SelectItem value="nightly">Nightly</SelectItem>
        <SelectItem value="local">Local</SelectItem>
      </SelectContent>
    </Select>
  );
}
