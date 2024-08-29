import { TooltipContent, Tooltip as TooltipPrimitive, TooltipTrigger } from '@/components/ui/tooltip';

export function Tooltip({
  title,
  children,
  side,
}: React.PropsWithChildren<{
  title: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
}>) {
  return (
    <TooltipPrimitive delayDuration={50}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>{title}</TooltipContent>
    </TooltipPrimitive>
  );
}
