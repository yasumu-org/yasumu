import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

export function ResponseTime() {
  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger>
        <span className="text-green-500 cursor-pointer">915 ms</span>
      </HoverCardTrigger>
      <HoverCardContent>Response time (TODO)</HoverCardContent>
    </HoverCard>
  );
}
