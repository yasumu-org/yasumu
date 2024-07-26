import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner({
  className,
  ...rest
}: React.ComponentProps<'div'>) {
  return (
    <div
      {...rest}
      className={cn(
        'h-[90vh] overflow-hidden grid place-items-center select-none',
        className
      )}
    >
      <Loader2 className="h-16 w-16 text-primary animate-spin" />
    </div>
  );
}
