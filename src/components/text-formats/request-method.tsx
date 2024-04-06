import { HttpMethod } from '@/store/RequestContext';
import { cn } from '@/lib/utils';

interface IProps {
  method: HttpMethod;
}

export const httpMethodStyles: Record<HttpMethod, string> = {
  GET: 'text-emerald-500',
  PUT: 'text-yellow-500',
  POST: 'text-blue-500',
  PATCH: 'text-purple-500',
  DELETE: 'text-red-500',
  OPTIONS: 'text-cyan-500',
  HEAD: 'text-pink-500',
};

export function RequestMethod({ method }: IProps) {
  return (
    <span className={cn('font-semibold', httpMethodStyles[method])}>
      {method}
    </span>
  );
}
