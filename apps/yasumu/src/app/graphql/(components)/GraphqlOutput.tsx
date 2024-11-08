'use client';
import { OutputLayout } from '@/components/OutputLayout';
import { PrettyResponseViewer } from '@/components/PrettyRespnseViewer';
import { useGraphqlResult } from '@/stores/GraphqlSchemaStore';
import React from 'react';

export default function GraphqlOutput() {
  const result = useGraphqlResult();

  return (
    <OutputLayout statusbar={<>status</>}>
      <PrettyResponseViewer content={result} />
    </OutputLayout>
  );
}
