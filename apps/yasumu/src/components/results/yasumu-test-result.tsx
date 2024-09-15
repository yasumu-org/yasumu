'use client';

import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { CircleCheck, Trash2, TriangleAlert, X } from 'lucide-react';
import { TestResult as YasumuTest } from '@yasumu/core';
import { useEffect, useMemo, useRef } from 'react';
import { useTest } from '@/stores/api-testing/test.store';

export function YasumuTestResult() {
  const { results, clear } = useTest();

  return (
    <div className="relative min-h-44 overflow-auto max-h-[18rem]">
      <div className="absolute top-0 right-0">
        <Button variant="ghost" size="icon" onClick={clear}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
      <div className="p-2 text-white flex flex-col">
        {results.map((result, index, array) => (
          <TestResult key={result.id} result={result} scroll={index === array.length - 1} />
        ))}
      </div>
    </div>
  );
}

function TestResult({ result, scroll = false }: { result: YasumuTest; scroll?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scroll && ref.current) {
      ref.current.scrollIntoView({ behavior: 'instant' });
    }
  }, [scroll]);

  const icon = useMemo(() => {
    switch (result.status) {
      case 'fail':
        return <X className="h-4 w-4" />;
      case 'pass':
        return <CircleCheck className="h-4 w-4" />;
      case 'skip':
        return <TriangleAlert className="h-4 w-4" />;
    }
  }, [result.status]);

  const duration = useMemo(() => {
    if (result.time < 0.01) return `${String(result.time).slice(0, 7)}ms`;
    if (result.time < 1000) {
      return `${result.time.toFixed(2)}ms`;
    }

    return `${(result.time / 1000).toFixed(2)}s`;
  }, [result.time]);

  return (
    <div
      ref={ref}
      className={cn('py-1 text-sm font-normal font-mono border-b flex items-start gap-2 select-text', {
        'text-red-500': result.status === 'fail',
        'text-yellow-500': result.status === 'skip',
        'text-green-500': result.status === 'pass',
      })}
    >
      {icon}
      <div className="flex flex-col items-start">
        <h1 className="inline-flex items-center gap-2 font-bold">
          [{result.status.toUpperCase()}] {result.name} <span className="text-xs">(Time: {duration})</span>
        </h1>
        {result.message && <pre className="font-mono whitespace-pre-wrap break-all">{result.message}</pre>}
      </div>
    </div>
  );
}
