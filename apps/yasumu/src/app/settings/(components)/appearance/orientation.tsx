import { cn } from '@/lib/utils';

interface IProps {
  vertical?: boolean;
  dark?: boolean;
  selected: boolean;
}

export function Orientation({ vertical = false, dark, selected }: IProps) {
  return (
    <>
      <div
        className={cn(
          'rounded-md border-2 border-muted p-2 flex flex-row gap-2 h-24 cursor-pointer',
          selected && 'border-primary',
          dark ? 'bg-popover hover:bg-accent hover:text-accent-foreground' : '',
        )}
      >
        <div className={cn('rounded-sm w-[20%] h-full', dark ? 'bg-slate-800' : 'bg-[#ecedef]')} />
        <div className={cn('flex gap-2 w-[80%] h-[75px]', vertical ? 'flex-col' : 'flex-row')}>
          <div className={cn('h-full w-full rounded-sm', dark ? 'bg-slate-800' : 'bg-[#ecedef]')} />
          <div className={cn('h-full w-full rounded-sm', dark ? 'bg-slate-800' : 'bg-[#ecedef]')} />
        </div>
      </div>
      <span className="block w-full p-2 text-center font-normal">{vertical ? 'Vertical' : 'Horizontal'}</span>
    </>
  );
}
