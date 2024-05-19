import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RequestInput from './request-input';
import { RequestParameters } from './request-parameters';
import { RequestHeaders } from './request-headers';
import { Button } from '@/components/ui/button';
import { HttpMethods } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useMemo } from 'react';

const ReqTabs = {
  QueryParameters: 'query-parameters',
  Headers: 'headers',
  RequestBody: 'request-body',
};

interface ITabs {
  name: string;
  url: string;
  method: string;
  active?: boolean;
  id: number;
}

export default function RequestInitializer() {
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

    tabs.push(
      ...[...tabs, ...tabs, ...tabs, ...tabs].map((m) => ({
        ...m,
        active: false,
        id: Math.random(),
      }))
    );

    return tabs;
  }, []);

  return (
    <div>
      <div className="flex flex-row items-center overflow-x-auto max-w-full w-full border-b">
        {tabs.map((tab) => {
          const method = HttpMethods.find((m) => m.name === tab.method);

          return (
            <div
              className={cn(
                'text-xs flex items-center gap-2 p-2 cursor-pointer hover:bg-muted/80 min-w-fit',
                tab.active && 'bg-muted/80 hover:bg-muted/50'
              )}
            >
              <span>
                <span className={cn('font-semibold', method?.color)}>
                  {tab.method}
                </span>{' '}
                {tab.name}
              </span>
              <X className="h-3 w-3" />
            </div>
          );
        })}
      </div>
      <div className="space-y-4 px-2 mt-2">
        <RequestInput />
        <Tabs defaultValue={ReqTabs.QueryParameters}>
          <TabsList>
            <TabsTrigger value={ReqTabs.QueryParameters}>
              Parameters
            </TabsTrigger>
            <TabsTrigger value={ReqTabs.Headers}>Headers</TabsTrigger>
            <TabsTrigger value={ReqTabs.RequestBody}>Body</TabsTrigger>
          </TabsList>
          <TabsContent value={ReqTabs.QueryParameters}>
            <RequestParameters />
          </TabsContent>
          <TabsContent value={ReqTabs.Headers}>
            <RequestHeaders />
          </TabsContent>
          <TabsContent value={ReqTabs.RequestBody}>Coming Soon...</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
