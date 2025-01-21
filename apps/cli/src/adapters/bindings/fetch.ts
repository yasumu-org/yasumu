import { FetchCommon } from '@yasumu/core';
import { version } from '../../version.js';

export function createFetch(): FetchCommon {
  const fn: FetchCommon = (req, opt) => {
    return fetch(req, {
      headers: {
        // default header
        'User-Agent': `Yasumu/${version} (cli)`,
        ...opt?.headers,
      },
    });
  };

  return fn;
}
