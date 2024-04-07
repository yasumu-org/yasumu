import { HttpMethod, useRequestStore } from '@/store/requestStore';
import { ScrollArea } from '../ui/scroll-area';
import { useEffect, useState } from 'react';
import { RequestMethod } from '../tables/RequestMethod';
import { cn } from '@/lib/utils';

const defaults = [
  {
    method: HttpMethod.GET,
    name: 'Get request',
    url: 'https://example.com',
  },
  {
    method: HttpMethod.POST,
    name: 'Post request',
    url: 'https://example.com/post',
  },
  {
    method: HttpMethod.PUT,
    name: 'Put request',
    url: 'https://example.com/put',
  },
  {
    method: HttpMethod.DELETE,
    name: 'Delete request',
    url: 'https://example.com/delete',
  },
  {
    method: HttpMethod.PATCH,
    name: 'Patch request',
    url: 'https://example.com/patch',
  },
  {
    method: HttpMethod.OPTIONS,
    name: 'Options request',
    url: 'https://example.com/options',
  },
  {
    method: HttpMethod.HEAD,
    name: 'Head request',
    url: 'https://example.com/head',
  },
];

export function RequestedRoutes() {
  const { setURL, setMethod, setTitle } = useRequestStore();
  const [selected, setSelected] = useState(defaults[0]);

  useEffect(() => {
    const { method, url, name } = selected;
    setTitle(name);
    setMethod(method);
    setURL(url);
  }, [selected]);

  return (
    <div>
      <h4 className="mb-2 text-base font-medium leading-none pl-2 pt-2">
        Routes
      </h4>
      <ScrollArea className="h-screen flex flex-col items-center">
        {defaults.map((req) => (
          <div
            onClick={() => setSelected(req)}
            key={req.name}
            className={cn(
              'text-xs p-2 select-none cursor-pointer hover:bg-muted-foreground/10',
              {
                'bg-muted-foreground/10 hover:bg-muted-foreground/20':
                  selected.method === req.method,
              }
            )}
          >
            <RequestMethod method={req.method} />{' '}
            <span className="text-muted-foreground">{req.name}</span>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
