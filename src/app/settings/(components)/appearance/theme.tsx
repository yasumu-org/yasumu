import { cn } from '@/lib/utils';

interface IProps {
  dark?: boolean;
}

export function Theme({ dark }: IProps) {
  return (
    <>
      <div
        className={cn(
          'items-center rounded-md border-2 border-muted p-1 cursor-pointer',
          dark
            ? 'bg-popover hover:bg-accent hover:text-accent-foreground'
            : 'hover:border-accent'
        )}
      >
        <div
          className={cn(
            'space-y-2 rounded-sm p-2',
            dark ? 'bg-slate-950' : 'bg-[#ecedef]'
          )}
        >
          <div
            className={cn(
              'space-y-2 rounded-md p-2 shadow-sm',
              dark ? 'bg-slate-800' : 'bg-white'
            )}
          >
            <div
              className={cn(
                'h-2 w-[80px] rounded-lg',
                dark ? 'bg-slate-400' : 'bg-[#ecedef]'
              )}
            />
            <div
              className={cn(
                'h-2 w-[100px] rounded-lg',
                dark ? 'bg-slate-400' : 'bg-[#ecedef]'
              )}
            />
          </div>
          <div
            className={cn(
              'flex items-center space-x-2 rounded-md p-2 shadow-sm',
              dark ? 'bg-slate-800' : 'bg-white'
            )}
          >
            <div
              className={cn(
                'h-4 w-4 rounded-full',
                dark ? 'bg-slate-400' : 'bg-[#ecedef]'
              )}
            />
            <div
              className={cn(
                'h-2 w-[100px] rounded-lg',
                dark ? 'bg-slate-400' : 'bg-[#ecedef]'
              )}
            />
          </div>
          <div
            className={cn(
              'flex items-center space-x-2 rounded-md p-2 shadow-sm',
              dark ? 'bg-slate-800' : 'bg-white'
            )}
          >
            <div
              className={cn(
                'h-4 w-4 rounded-full',
                dark ? 'bg-slate-400' : 'bg-[#ecedef]'
              )}
            />
            <div
              className={cn(
                'h-2 w-[100px] rounded-lg',
                dark ? 'bg-slate-400' : 'bg-[#ecedef]'
              )}
            />
          </div>
        </div>
      </div>
      <span className="block w-full p-2 text-center font-normal">
        {dark ? 'Dark' : 'Light'}
      </span>
    </>
  );
}
