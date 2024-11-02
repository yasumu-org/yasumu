'use client';

import { useCallback } from 'react';
import { useHorizontalScroll } from '@/hooks/use-horizontal-scroll';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HttpMethods } from './HttpMethodSelector';

const history = [
  {
    name: 'Authenticate',
    method: 'POST',
  },
  {
    name: 'Current user',
    method: 'GET',
  },
  {
    name: 'List comments',
    method: 'GET',
  },
  {
    name: 'Create comment',
    method: 'POST',
  },
  {
    name: 'Update comment',
    method: 'PUT',
  },
  {
    name: 'Delete comment',
    method: 'DELETE',
  },
  {
    name: 'Update current user',
    method: 'PATCH',
  },
  {
    name: 'Login',
    method: 'POST',
  },
  {
    name: 'Logout',
    method: 'POST',
  },
  {
    name: 'Register',
    method: 'POST',
  },
];

const HttpMethodColors = HttpMethods.reduce(
  (acc, method) => {
    acc[method.name] = method.color;
    return acc;
  },
  {} as Record<string, string>,
);

export function RequestTabs() {
  const ref = useHorizontalScroll();

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
    <div className="flex items-center gap-2">
      <div ref={ref} className="flex flex-row items-center overflow-x-auto max-w-full w-fit zw-scrollbar">
        {history.map((tab) => {
          return <RequestTab tab={tab} key={tab.name} />;
        })}
      </div>
    </div>
  );
}

function RequestTab({ tab }: { tab: { name: string; method: string } }) {
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
      <span>
        <span className={cn('font-semibold', HttpMethodColors[tab.method])}>{tab.method}</span> {tab.name}
      </span>
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
