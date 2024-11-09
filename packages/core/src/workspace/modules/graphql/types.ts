import type { GraphqlHttpMethod } from '@yasumu/common';
import type { WorkspaceModuleType } from '../common/constants.js';
import type { CommonEntityMetadata, YasumuEntityScript } from '../common/types.js';
import type { GraphqlQueryVariableType } from './YasumuGraphqlEntity.js';

export interface GraphqlIndex extends CommonEntityMetadata {
  /**
   * An http method of this graphql entity
   */
  method: GraphqlHttpMethod;
}

export interface YasumuRawGraphqlEntity {
  /**
   * The type of the entity.
   */
  annotation: (typeof WorkspaceModuleType)['GraphQL'];
  /**
   * The blocks of the entity.
   */
  blocks: {
    /**
     * The metadata of this entity.
     */
    Metadata: GraphqlIndex & {
      /**
       * The time when this entity was created.
       */
      createdAt: number;
    };
    /**
     * The request object.
     */
    Request: {
      /**
       * The url of the request.
       */
      url: string;
      /**
       * The headers of the request.
       */
      headers: Array<{ key: string; value: string }>;
      /**
       * The variables of the request.
       */
      variables: Record<string, GraphqlQueryVariableType>;
      /**
       * The body of the request.
       */
      body: string | FormData | null;
    };
    /**
     * The response object.
     */
    Response: {
      /**
       * The status code of the response.
       */
      time: number | null;
      /**
       * The response size.
       */
      size: number | null;
      /**
       * The headers of the response.
       */
      headers: Array<{ key: string; value: string }>;
      /**
       * The body of the response.
       */
      body: string | null;
    };
    /**
     * The pre-request script.
     */
    BeforeRequest: YasumuEntityScript;
    /**
     * The post-response script.
     */
    AfterResponse: YasumuEntityScript;
    /**
     * The test script.
     */
    Test: YasumuEntityScript;
  };
}
