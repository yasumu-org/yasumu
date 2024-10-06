'use client';

import { cn } from '@/lib/utils';
import { ConsoleLogScope, useConsole } from '@/stores/api-testing/console.store';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import { LogStream as ConsoleStream } from '@yasumu/core';
import { useEffect, useRef } from 'react';
import { Badge } from '../ui/badge';

export function YasumuConsole() {
  const { logs, clear } = useConsole();

  return (
    <div className="relative min-h-44 overflow-auto max-h-[18rem]">
      <div className="absolute top-0 right-0">
        <Button variant="ghost" size="icon" onClick={clear}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
      <div className="p-2 text-white select-text">
        {logs.map((log, index, array) => (
          <LogStream key={log.timestamp} log={log} scroll={index === array.length - 1} scope={log.scope} />
        ))}
      </div>
    </div>
  );
}

function LogStream({ log, scroll = false, scope }: { log: ConsoleStream; scroll?: boolean; scope: ConsoleLogScope }) {
  const ref = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (scroll && ref.current) {
      ref.current.scrollIntoView({ behavior: 'instant' });
    }
  }, [scroll]);

  return (
    <div className="flex gap-2 font-mono font-normal text-xs py-1">
      <LogScope scope={scope} />
      <pre
        ref={ref}
        className={cn('whitespace-pre-wrap break-all', {
          'text-red-500': log.type === 'error',
          'text-yellow-500': log.type === 'warn',
          'text-blue-500': log.type === 'info',
          'text-gray-500 dark:text-gray-200': log.type === 'log',
        })}
      >
        {log.args.join(' ')}
      </pre>
    </div>
  );
}

function LogScope({ scope }: { scope: ConsoleLogScope }) {
  return (
    <span
      className={cn('rounded px-2 select-none', {
        'bg-green-600 ': scope === ConsoleLogScope.PreRequest,
        'bg-blue-600': scope === ConsoleLogScope.PostResponse,
      })}
    >
      {scope}
    </span>
  );
}
