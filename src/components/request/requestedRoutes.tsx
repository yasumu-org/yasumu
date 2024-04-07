import { ScrollArea } from '../ui/scroll-area';

export function RequestedRoutes() {
  return (
    <ScrollArea className="h-screen w-48 p-2">
      <h4 className="mb-2 text-base font-medium leading-none">Routes</h4>
      <div className="text-sm font-semibold">
        <span className="text-green-500">GET</span>{' '}
        <span className="text-muted-foreground">/</span>
      </div>
    </ScrollArea>
  );
}
