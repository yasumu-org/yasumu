'use client';

import { useCallback, useMemo } from 'react';
import { useHorizontalScroll } from '@/hooks/use-horizontal-scroll';
import { HttpMethodColors, HttpMethods } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RequestEnvironment } from './request-environment';

interface ITabs {
  name: string;
  url: string;
  method: HttpMethods;
  active?: boolean;
  id: number;
}

export function RequestTabs() {
  const ref = useHorizontalScroll();

  const tabs = useMemo(() => {
    const tabs: ITabs[] = [
      {
        name: 'Get all posts',
        url: 'https://jsonplaceholder.typicode.com/posts',
        method: 'GET',
        active: true,
        id: 0,
      },
      {
        name: 'Create a post',
        url: 'https://jsonplaceholder.typicode.com/posts',
        method: 'POST',
        id: 1,
      },
      {
        name: 'Get a post',
        url: 'https://jsonplaceholder.typicode.com/posts/1',
        method: 'GET',
        id: 2,
      },
      {
        name: 'Update a post',
        url: 'https://jsonplaceholder.typicode.com/posts/1',
        method: 'PUT',
        id: 3,
      },
      {
        name: 'Delete a post',
        url: 'https://jsonplaceholder.typicode.com/posts/1',
        method: 'DELETE',
        id: 4,
      },
    ];

    return [tabs, tabs, tabs, tabs, tabs, tabs, tabs, tabs, tabs, tabs].flat();
  }, []);

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
      <Button
        size="sm"
        variant="ghost"
        onClick={onScrollLeft}
        className="border-r border-muted/80 rounded-none"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <div
        ref={ref}
        className="flex flex-row items-center overflow-x-auto max-w-full w-fit zw-scrollbar"
      >
        {tabs.map((tab, i) => {
          return <RequestTab tab={tab} key={i} />;
        })}
      </div>
      <div className="inline-flex">
        <Button
          size="sm"
          variant="ghost"
          onClick={onScrollRight}
          className="border-x border-muted/80 rounded-none"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
        <RequestEnvironment />
      </div>
    </div>
  );
}

function RequestTab({ tab }: { tab: ITabs }) {
  return (
    <div
      className={cn(
        'text-xs flex items-center gap-2 p-2 cursor-pointer hover:bg-muted/80 min-w-fit',
        tab.active && 'bg-muted/80 hover:bg-muted/50',
        'border-x border-muted/80',
        'group'
      )}
    >
      <span>
        <span className={cn('font-semibold', HttpMethodColors[tab.method])}>
          {tab.method}
        </span>{' '}
        {tab.name}
      </span>
      <X
        className={cn(
          'h-3 w-3',
          !tab.active && 'invisible group-hover:visible'
        )}
      />
    </div>
  );
}
