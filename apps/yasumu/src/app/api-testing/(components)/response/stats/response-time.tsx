import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Separator } from '@/components/ui/separator';
import { useResponse } from '@/stores/api-testing/response.store';
import { useScriptTime } from '@/stores/api-testing/script-time.store';
import { useCallback } from 'react';
import { Info } from './network-info';

export function ResponseTime() {
  const { responseTime } = useResponse();
  const { postResponse, preRequest, testScript } = useScriptTime();

  const formatTime = useCallback((num: number) => {
    if (isNaN(num)) return 'N/A';
    const times = ['ms', 's', 'm', 'h'];

    let i = 0;
    let time = num;

    while (time > 1000) {
      time /= 1000;
      i++;
    }

    return `${time.toFixed(2)} ${times[i]}`;
  }, []);

  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger>
        <span className="text-green-500 cursor-pointer">{formatTime(responseTime)}</span>
      </HoverCardTrigger>
      <HoverCardContent className="w-fit">
        <h1 className="font-bold text-sm">Response Time</h1>
        <Separator orientation="horizontal" />
        <div className="flex flex-col gap-2 mt-2 text-xs">
          <Info title="Http Request" value={formatTime(responseTime)} />
          <Separator orientation="horizontal" />
          <Info title="Pre-Request Script" value={formatTime(preRequest)} />
          <Info title="Post-Response Script" value={formatTime(postResponse)} />
          <Info title="Test Script" value={formatTime(testScript)} />
          <Separator orientation="horizontal" />
          <Info title="Total" value={formatTime(testScript + preRequest + postResponse + responseTime)} />
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
