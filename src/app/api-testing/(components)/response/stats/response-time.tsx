import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { useResponse } from '@/stores/api-testing/response.store';
import { useMemo } from 'react';

export function ResponseTime() {
  const { responseTime } = useResponse();

  const time = useMemo(() => {
    if (isNaN(responseTime)) return 'N/A';
    const times = ['ms', 's', 'm', 'h'];

    let i = 0;
    let time = responseTime;

    while (time > 1000) {
      time /= 1000;
      i++;
    }

    return `${time.toFixed(2)} ${times[i]}`;
  }, [responseTime]);

  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger>
        <span className="text-green-500 cursor-pointer">{time}</span>
      </HoverCardTrigger>
      <HoverCardContent>Response time (TODO)</HoverCardContent>
    </HoverCard>
  );
}
