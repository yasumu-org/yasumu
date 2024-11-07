'use client';
import { PrettyRespnseViewer } from '@/components/PrettyRespnseViewer';
import { useGraphqlResult } from '@/stores/GraphqlSchemaStore';
import React from 'react';

export default function GraphqlOutput() {
  const result = useGraphqlResult();

  return <PrettyRespnseViewer content={result} />;
}
