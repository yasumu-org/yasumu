'use client';

import { useCallback } from 'react';
import { useHorizontalScroll } from '@/hooks/use-horizontal-scroll';
import { HttpMethodColors } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RequestEnvironment } from './request-environment';
import { useRequestStore } from '@/stores/api-testing/request-config.store';
import { useRequestHistory } from '@/stores/api-testing/request-history.store';
import { HttpMethods, YasumuPartialRestEntity, YasumuRestEntity } from '@yasumu/core';
import { Yasumu } from '@/lib/yasumu';

export function RequestTabs() {
  const ref = useHorizontalScroll();
  const { history } = useRequestHistory();

  const onScrollLeft = useCallback(() => {
    const element = ref.current;
    if (element) {
      element.scrollTo({
        left: element.scrollLeft - 100,
        behavior: 'smooth',
      });
    }
  }, [ref]);

  const onScrollRight = useCallback(() => {
    const element = ref.current;
    if (element) {
      element.scrollTo({
        left: element.scrollLeft + 100,
        behavior: 'smooth',
      });
    }
  }, [ref]);

  return (
    <div className="flex items-center gap-2 px-2 border-l-0 border">
      <Button size="sm" variant="ghost" onClick={onScrollLeft} className="border-r border-muted/80 rounded-none">
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <div ref={ref} className="flex flex-row items-center overflow-x-auto max-w-full w-fit zw-scrollbar">
        {history.map((tab) => {
          return <RequestTab tab={tab} key={tab.path} />;
        })}
      </div>
      <div className="inline-flex ml-auto">
        <Button size="sm" variant="ghost" onClick={onScrollRight} className="border-x border-muted/80 rounded-none">
          <ArrowRight className="h-4 w-4" />
        </Button>
        <RequestEnvironment />
      </div>
    </div>
  );
}

function RequestTab({ tab }: { tab: YasumuPartialRestEntity }) {
  const { current, setCurrent } = useRequestStore();
  const isActive = tab.path === current?.getPath();
  const { removeHistoryByPath, history } = useRequestHistory();

  return (
    <button
      className={cn(
        'text-xs flex items-center gap-2 p-2 cursor-pointer hover:bg-muted/80 min-w-fit',
        isActive && 'bg-muted/80 hover:bg-muted/50',
        'border-x border-muted/80',
        'group',
      )}
      onClick={async () => {
        const req = await Yasumu.workspace?.rest.open(tab.path, false);
        if (req) {
          setCurrent(req);
          await Yasumu.workspace?.rest.setLastOpenedRequest(req).catch(console.error);
        }
      }}
    >
      <span>
        <span className={cn('font-semibold', HttpMethodColors[tab.method])}>{tab.method}</span> {tab.name}
      </span>
      <X
        className={cn('h-3 w-3', !isActive && 'invisible group-hover:visible')}
        onClick={async (e) => {
          e.stopPropagation();
          removeHistoryByPath(tab.path);

          await Yasumu.workspace?.rest.removeFromHistory(tab.path).catch(console.error);

          if (isActive) {
            const nextItem = history.filter((item) => item.path !== tab.path)[0] ?? null;
            const item = nextItem ? await Yasumu.workspace?.rest.open(nextItem?.path) : null;
            setCurrent(item ?? null);
            await Yasumu.workspace?.rest.setLastOpenedRequest(item ?? null).catch(console.error);
          }
        }}
      />
    </button>
  );
}
