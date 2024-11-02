import { cn } from '@/lib/utils';

export default function LayoutGroup({
  children,
  className,
  ...rest
}: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
  return (
    <div className={cn('flex w-full', className)} {...rest}>
      {children}
    </div>
  );
}
