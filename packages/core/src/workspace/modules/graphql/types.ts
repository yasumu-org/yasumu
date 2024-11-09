import type { GraphqlHttpMethod } from '@yasumu/common';
import type { CommonEntityMetadata } from '../common/types.js';

export interface GraphqlIndex extends CommonEntityMetadata {
  /**
   * An http method of this graphql entity
   */
  method: GraphqlHttpMethod;
}
