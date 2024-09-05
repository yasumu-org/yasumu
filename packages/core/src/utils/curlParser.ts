import type { BodyType, KeyValue } from '@/core/index.js';

export interface CurlParsedResult {
  url: string;
  method: string;
  headers: Array<KeyValue<string, string>>;
  body?: BodyType;
}

export function parseCurl(src: string): CurlParsedResult {
  const result: CurlParsedResult = {
    url: '',
    method: 'GET',
    headers: [],
  };

  const lines = src.split('\n');
  for (const line of lines) {
    if (line.startsWith('curl')) {
      const url = line.match(/'([^']+)'/);
      if (url) {
        result.url = url[1];
      }
    } else if (line.startsWith('-X')) {
      const method = line.match(/-X ([A-Z]+)/);
      if (method) {
        result.method = method[1];
      }
    } else if (line.startsWith('-H')) {
      const header = line.match(/-H '([^:]+): ([^']+)'/);
      if (header) {
        result.headers.push({
          key: header[1],
          value: header[2],
        });
      }
    } else if (line.startsWith('--data-raw')) {
      const body = line.match(/--data-raw '([^']+)'/);
      if (body) {
        result.body = {
          text: body[1],
        };
      }
    } else if (line.startsWith('--data')) {
      const body = line.match(/--data '([^']+)'/);
      if (body) {
        result.body = {
          json: body[1],
        };
      }
    }
  }

  return result;
}
