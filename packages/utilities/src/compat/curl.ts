import type { BodyType, KeyValue } from '@yasumu/core';

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

  // Handle CMD specific escape sequences (removes `^` used for escaping in CMD)
  const cleanedSrc = src
    .replace(/\r?\n/g, '') // Merge lines
    .replace(/\^/g, '') // Remove CMD-specific `^` characters
    .replace(/\\\r?\n/g, ''); // Handle Bash-style line continuations

  // Extract URL from curl command
  const urlMatch = cleanedSrc.match(/curl\s+["']([^"']+)["']/);
  if (urlMatch) {
    result.url = urlMatch[1];
  }

  // Extract method (e.g., -X POST)
  const methodMatch = cleanedSrc.match(/-X\s+([A-Z]+)/);
  if (methodMatch) {
    result.method = methodMatch[1];
  }

  // Extract headers (e.g., -H 'HeaderName: HeaderValue')
  const headerRegex = /-H\s+["']([^:]+):\s*([^"']+)["']/g;
  let headerMatch;
  while ((headerMatch = headerRegex.exec(cleanedSrc)) !== null) {
    result.headers.push({
      key: headerMatch[1],
      value: headerMatch[2],
    });
  }

  // Extract body (either --data or --data-raw)
  const bodyRawMatch = cleanedSrc.match(/--data-raw\s+["']([^"']+)["']/);
  if (bodyRawMatch) {
    result.body = {
      text: bodyRawMatch[1],
    };
  }

  const bodyJsonMatch = cleanedSrc.match(/--data\s+["']([^"']+)["']/);
  if (bodyJsonMatch) {
    result.body = {
      json: bodyJsonMatch[1],
    };
  }

  return result;
}

export function stringifyCurl(src: CurlParsedResult, cmd = false) {
  let result = `curl '${src.url}'`;

  if (src.method !== 'GET') {
    result += ` -X ${src.method}`;
  }

  for (const header of src.headers) {
    result += ` -H '${header.key}: ${header.value}'`;
  }

  if (src.body) {
    if (src.body.text) {
      result += ` --data-raw '${src.body.text}'`;
    } else if (src.body.json) {
      result += ` --data '${src.body.json}'`;
    }
  }

  if (cmd) {
    result = result.replace(/'/g, '^"');
    result = result.replace(/\r?\n/g, ' ^\n');
  }

  return result;
}
