import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

export function ResponseSize() {
  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger>
        <span className="text-green-500 cursor-pointer">1.2 KB</span>
      </HoverCardTrigger>
      <HoverCardContent>Response size (TODO)</HoverCardContent>
    </HoverCard>
  );
}
