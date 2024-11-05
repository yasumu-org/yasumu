'use client';
import { useGraphqlResult } from '@/stores/GraphqlSchemaStore';
import React from 'react';

export default function GraphqlOutput() {
  const result = useGraphqlResult();

  return (
    <div className="max-h-[95%] overflow-y-auto">
      <pre className="font-mono text-xs whitespace-pre-wrap break-words">{result}</pre>
    </div>
  );
}
