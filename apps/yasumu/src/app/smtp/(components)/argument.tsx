import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export function Argument({
  name,
  description,
  onChange,
  value,
}: {
  name: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col items-start">
      <Label htmlFor={name} className="text-right">
        {name}
      </Label>
      {description && <Label className="text-sm text-muted-foreground font-normal mb-2">{description}</Label>}
      <Input
        id={name}
        value={value}
        className={cn('col-span-3', description && 'mt-2')}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
