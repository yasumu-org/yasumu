import { Button } from '@/components/ui/button';
import { HttpMethods } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface IRequestHistory {
  method: string;
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
  return (
    <div className="max-h-[96.5vh] overflow-y-auto flex flex-col">
      <h3 className="text-base font-semibold">Requests</h3>
      {history.map((req) => {
        const method = HttpMethods.find((m) => m.name === req.method);

        return (
          <Button
            key={req.name}
            className="flex items-center justify-start gap-2 mt-2 text-left w-[95%]"
            variant="ghost"
            size="sm"
          >
            <span className={cn('text-sm font-semibold', method?.color)}>
              {req.method}
            </span>
            <span className="text-sm">{req.name}</span>
          </Button>
        );
      })}
    </div>
  );
}
