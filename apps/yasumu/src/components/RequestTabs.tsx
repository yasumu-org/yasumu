'use client';

import { useHorizontalScroll } from '@/hooks/use-horizontal-scroll';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export interface RequestTab {
  name: string;
  icon?: () => React.ReactNode;
}

export function RequestTabs({ tabs }: { tabs: RequestTab[] }) {
  const ref = useHorizontalScroll();

  if (!tabs.length) return null;

  return (
    <div className="flex items-center gap-2">
      <div ref={ref} className="flex flex-row items-center overflow-x-auto max-w-[80vw] w-fit zw-scrollbar">
        {tabs.map((tab, id) => {
          return <RequestTab tab={tab} key={id} />;
        })}
      </div>
    </div>
  );
}

function RequestTab({ tab }: { tab: RequestTab }) {
  const isActive = false;

  return (
    <button
      className={cn(
        'text-xs flex items-center gap-2 p-2 cursor-pointer hover:bg-muted/80 min-w-fit',
        isActive && 'bg-muted/80 hover:bg-muted/50',
        'border border-muted/80',
        'group',
      )}
    >
      {tab.icon && <tab.icon />} {tab.name}
      <X
        className={cn('h-3 w-3', !isActive && 'invisible group-hover:visible')}
        // onClick={async (e) => {
        //   e.stopPropagation();
        //   removeHistoryByPath(tab.path);

        //   await Yasumu.workspace?.rest.removeFromHistory(tab.path).catch(console.error);

        //   if (isActive) {
        //     const nextItem = history.filter((item) => item.path !== tab.path)[0] ?? null;
        //     const item = nextItem ? await Yasumu.workspace?.rest.open(nextItem?.path) : null;
        //     setCurrent(item ?? null);
        //     await Yasumu.workspace?.rest.setLastOpenedRequest(item ?? null).catch(console.error);
        //   }
        // }}
      />
    </button>
  );
}
