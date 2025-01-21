import { getIntrospectionQuery } from 'graphql/utilities/index.js';

// the type of introspected data
export type { IntrospectionQuery } from 'graphql/utilities';

/**
 * The introspection query for GraphQL
 */
export const INTROSPECTION_QUERY = getIntrospectionQuery();
