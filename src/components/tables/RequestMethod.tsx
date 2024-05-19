import { HttpMethod } from '@/store/requestStore';
import { cn } from '@/lib/utils';

interface IProps {
  method: HttpMethod;
}

export const httpMethodStyles: Record<
  HttpMethod,
  {
    fg: string;
    bg: string;
  }
> = {
  GET: { fg: 'text-emerald-500', bg: 'bg-emerald-500' },
  PUT: { fg: 'text-yellow-500', bg: 'bg-yellow-500' },
  POST: { fg: 'text-blue-500', bg: 'bg-blue-500' },
  PATCH: { fg: 'text-purple-500', bg: 'bg-purple-500' },
  DELETE: { fg: 'text-red-500', bg: 'bg-red-500' },
  OPTIONS: { fg: 'text-cyan-500', bg: 'bg-cyan-500' },
  HEAD: { fg: 'text-pink-500', bg: 'bg-pink-500' },
};

export function RequestMethod({ method }: IProps) {
  return (
    <span className={cn('font-semibold', httpMethodStyles[method].fg)}>
      {method}
    </span>
  );
}
