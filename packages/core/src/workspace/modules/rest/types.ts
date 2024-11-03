import type { WorkspaceModuleType } from '../common/constants.js';

export interface YasumuRawRestEntity extends RestIndex {
  /**
   * The type of the entity.
   */
  $$typeof: (typeof WorkspaceModuleType)['Rest'];

  /**
   * The time when this entity was created.
   */
  createdAt: number;

  /**
   * The request object.
   */
  request: {
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
  response: {
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
   * The scripts of the entity.
   */
  scripts: {
    /**
     * The pre-request script.
     */
    preRequest: YasumuEntityScript;
    /**
     * The post-response script.
     */
    postResponse: YasumuEntityScript;
    /**
     * The test script.
     */
    test: YasumuEntityScript;
  };
}

export interface YasumuEntityScript {
  /**
   * The script file name.
   */
  name: string;
  /**
   * The script content.
   */
  content: string;
}

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
  method: string;
  /**
   * The path to the REST entity without the file name.
   */
  path: string;
}
