import { useStore } from '@nanostores/react';
import { GraphqlQueryVariableType, IntrospectionQuery } from '@yasumu/core';
import { atom } from 'nanostores';

export const $graphqlSchema = atom<IntrospectionQuery | null>(null);
export const $graphqlResult = atom<string>('');
export const $graphqlDocument = atom<string>(`query GetProductList {
  products(
    options: {
      take: 10
      filter: { name: { contains: "shoe" } }
      sort: { name: ASC }
    }
  ) {
    totalItems
    items {
      id
      name
      slug
      featuredAsset {
        preview
        mimeType
        width
        height
      }
    }
  }
}`);
export const $graphqlVariables = atom<Record<string, GraphqlQueryVariableType>>({});

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

export function setGraphqlVariables(variables: Record<string, GraphqlQueryVariableType>) {
  $graphqlVariables.set(variables);
}

export function updateGraphqlVariables(variables: Record<string, GraphqlQueryVariableType>) {
  $graphqlVariables.set({ ...$graphqlVariables.get(), ...variables });
}

export function removeGraphqlVariable(key: string) {
  const variables = { ...$graphqlVariables.get() };
  delete variables[key];
  $graphqlVariables.set(variables);
}

export function clearGraphqlVariables() {
  $graphqlVariables.set({});
}

export function useGraphqlVariables() {
  return useStore($graphqlVariables);
}
