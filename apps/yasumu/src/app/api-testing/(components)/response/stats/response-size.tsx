import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useResponse } from '@/stores/api-testing/response.store';
import { useMemo } from 'react';

export function ResponseSize() {
  const { responseSize } = useResponse();

  const size = useMemo(() => {
    if (isNaN(responseSize)) return 'N/A';
    const times = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB', 'NB', 'DB', 'CB'];

    let i = 0;
    let size = responseSize;

    while (size > 1024) {
      size /= 1024;
      i++;
    }

    return `${size.toFixed(2)} ${times[i] ?? 'node_modules'}`;
  }, [responseSize]);

  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger>
        <span className="text-green-500 cursor-pointer">{size}</span>
      </HoverCardTrigger>
      <HoverCardContent>Response size</HoverCardContent>
    </HoverCard>
  );
}
