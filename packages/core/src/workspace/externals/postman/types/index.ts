import * as PostmanSchema1 from './1.0.0.js';
import * as PostmanSchema2 from './2.0.0.js';
import * as PostmanSchema21 from './2.1.0.js';

export type PostmanCollection =
  | PostmanSchema1.PostmanCollection
  | PostmanSchema2.PostmanCollection
  | PostmanSchema21.PostmanCollection;

export { PostmanSchema1, PostmanSchema2, PostmanSchema21 };
