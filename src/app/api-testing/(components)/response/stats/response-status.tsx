import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Separator } from '@/components/ui/separator';
import { getResponse } from '@/lib/response-status';
import { cn } from '@/lib/utils';

const getStatusColor = (statusCode: number) => {
  switch (true) {
    case statusCode < 200:
      return 'text-blue-500';
    case statusCode >= 200 && statusCode < 300:
      return 'text-green-500';
    case statusCode >= 300 && statusCode < 400:
      return 'text-yellow-500';
    case statusCode >= 400 && statusCode < 500:
      return 'text-orange-500';
    case statusCode >= 500:
      return 'text-red-500';
    default:
      return 'text-muted-foreground';
  }
};

export function ResponseStatus({
  statusCode,
  statusText,
}: {
  statusCode: number;
  statusText?: string;
}) {
  const description = getResponse(statusCode);

  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger>
        <span
          className={cn('uppercase cursor-pointer', getStatusColor(statusCode))}
        >
          {statusCode} {statusText || description.text}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-fit">
        <h1 className="font-bold text-sm">
          {description.code} {description.text}
        </h1>
        <Separator orientation="horizontal" />
        <p className="mt-2 font-medium text-xs">{description.description}</p>
      </HoverCardContent>
    </HoverCard>
  );
}
