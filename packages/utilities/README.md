# `@yasumu/utilities`

Yasumu utilities api

## Installation

```bash
npm install @yasumu/utilities
```

## Usage

```typescript
import { parseCurl } from '@yasumu/utilities';

const curl = `curl "https://api.example.com/v1/users/123" -X GET`;
const result = parseCurl(curl);

console.log(result);
```

Returns

```js
{
  url: 'https://api.example.com/v1/users/123',
  method: 'GET',
  headers: []
}
```
