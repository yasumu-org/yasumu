# `@yasumu/core`

Yasumu core api

## Installation

```bash
npm install @yasumu/core
```

## Usage

```typescript
import { createYasumu } from '@yasumu/core';

const Yasumu = createYasumu({
  createStore(path) {
    return resolveStoreSomehow();
  },
  fs: resolveFsSomehow(),
  path: resolvePathSomehow(),
  commands: resolveCommandsSomehow(),
  ...
});
```
