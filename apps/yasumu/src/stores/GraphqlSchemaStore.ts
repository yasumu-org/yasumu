import { useStore } from '@nanostores/react';
import { IntrospectionQuery } from '@yasumu/core';
import { atom } from 'nanostores';

export const $graphqlSchema = atom<IntrospectionQuery | null>(null);
export const $graphqlResult = atom<string>('');
export const $graphqlDocument = atom<string>('');

export function setGraphqlSchema(schema: IntrospectionQuery | null) {
  $graphqlSchema.set(schema);
}

export function useGraphqlSchema() {
  return useStore($graphqlSchema);
}

export function setGraphqlResult(result: string) {
  $graphqlResult.set(typeof result !== 'string' ? JSON.stringify(result, null, 2) : result);
}

export function useGraphqlResult() {
  return useStore($graphqlResult);
}

export function setGraphqlDocument(result: string) {
  $graphqlDocument.set(typeof result !== 'string' ? '' : result);
}

export function useGraphqlDocument() {
  return useStore($graphqlDocument);
}
