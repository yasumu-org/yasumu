'use client';

import { cn } from '@/lib/utils';
import { useConsole } from '@/stores/api-testing/console.store';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import { ConsoleStream } from '@/lib/scripts/script';
import { useEffect, useRef } from 'react';

export function YasumuConsole() {
  const { logs, clear } = useConsole();

  return (
    <div className="relative min-h-44 overflow-auto max-h-[18rem]">
      <div className="absolute top-0 right-0">
        <Button variant="ghost" size="icon" onClick={clear}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
      <div className="p-2 text-white">
        {logs.map((log, index, array) => (
          <LogStream key={log.timestamp} log={log} scroll={index === array.length - 1} />
        ))}
      </div>
    </div>
  );
}

function LogStream({ log, scroll = false }: { log: ConsoleStream; scroll?: boolean }) {
  const ref = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (scroll && ref.current) {
      ref.current.scrollIntoView({ behavior: 'instant' });
    }
  }, [scroll]);

  return (
    <pre
      ref={ref}
      className={cn(
        'border-b py-2 text-xs font-bold font-mono',
        {
          'text-red-500': log.type === 'error',
          'text-yellow-500': log.type === 'warn',
          'text-blue-500': log.type === 'info',
          'text-green-500': log.type === 'log',
        },
        'whitespace-pre-wrap break-all',
      )}
    >
      {log.args.join(' ')}
    </pre>
  );
}
