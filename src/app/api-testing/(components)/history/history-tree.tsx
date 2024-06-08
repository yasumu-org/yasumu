'use client';
import { Button } from '@/components/ui/button';
import { HttpMethodColors, HttpMethods } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useRequestConfig } from '@/stores/api-testing/request-config.store';
import { useResponse } from '@/stores/api-testing/response.store';

interface IRequestHistory {
  method: HttpMethods;
  url: string;
  name: string;
}

const history: IRequestHistory[] = [
  {
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/posts',
    name: 'Get all posts',
  },
  {
    method: 'POST',
    url: 'https://jsonplaceholder.typicode.com/posts',
    name: 'Create a post',
  },
  {
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    name: 'Get a post',
  },
  {
    method: 'PUT',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    name: 'Update a post',
  },
  {
    method: 'DELETE',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    name: 'Delete a post',
  },
];

export default function HistoryTree() {
  const { setUrl, setMethod, setBody, url, method } = useRequestConfig();
  const { setBody: setResponseBody } = useResponse();

  return (
    <div className="max-h-[96.5vh] overflow-y-auto flex flex-col">
      <h3 className="text-base font-semibold">Requests</h3>
      {history.map((req) => {
        return (
          <Button
            key={req.name}
            className={cn(
              'flex items-center justify-start gap-2 mt-2 text-left w-[95%]',
              req.url === url && req.method === method
                ? 'bg-accent text-accent-foreground'
                : ''
            )}
            variant="ghost"
            size="sm"
            onClick={() => {
              setUrl(req.url);
              setMethod(req.method);
              setResponseBody('');

              if (req.method === 'POST') {
                setBody(
                  JSON.stringify({ title: 'foo', body: 'bar', userId: 1 })
                );
              }
            }}
          >
            <span
              className={cn('text-xs font-bold', HttpMethodColors[req.method])}
            >
              {req.method}
            </span>
            <span className="text-xs">{req.name}</span>
          </Button>
        );
      })}
    </div>
  );
}
