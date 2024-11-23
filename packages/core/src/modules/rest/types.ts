import type { HttpMethod } from '@/common/index.js';
import type { CommonEntityMetadata } from '../common/types.js';

export interface RestIndex extends CommonEntityMetadata {
  /**
   * The method of the REST entity.
   */
  method: HttpMethod;
}
