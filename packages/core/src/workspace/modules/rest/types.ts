import type { HttpMethod } from '@/common/index.js';
import type { WorkspaceModuleType } from '../common/constants.js';

export interface YasumuRawRestEntity {
  /**
   * The type of the entity.
   */
  annotation: (typeof WorkspaceModuleType)['Rest'];

  /**
   * The blocks of the entity.
   */
  blocks: {
    /**
     * The metadata of this entity.
     */
    Metadata: RestIndex & {
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
    };
    /**
     * The response object.
     */
    Response: {
      /**
       * The status code of the response.
       */
      status: number | null;
      /**
       * The time taken to complete the request.
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

export type YasumuEntityScript = string;

// export interface YasumuEntityScript {
//   /**
//    * The script file name.
//    */
//   name: string;
//   /**
//    * The script content.
//    */
//   content: string;
// }

export interface RestIndex {
  /**
   * The name of the REST entity.
   */
  name: string;
  /**
   * The path of the REST entity.
   */
  id: string;
  /**
   * The method of the REST entity.
   */
  method: HttpMethod;
  /**
   * The path to the REST entity without the file name.
   */
  path: string;
}
