# `@yasumu/core`

Yasumu core is a library that provides the core functionality of Yasumu. It is a set of utilities that are used to interact with the Yasumu workspace programmatically. It is designed to work in any javascript environment, such as web browsers, node.js, tauri or electron.

This library is very flexible in terms of how it interacts with the underlying system. It is designed to be used with a set of bindings that provide the necessary functionality to interact with the system. For example, it can be used with node.js bindings to interact with the file system, or with web browser bindings to interact with the local storage.

## Installation

```bash
npm install @yasumu/core
```

## Usage

```typescript
import { createYasumu } from '@yasumu/core';

// this object is a factory for creating yasumu instances
// it exposes *everything* that you need to interact with yasumu
const yasumu = createYasumu({
  createStore(path) {
    return resolveStoreSomehow(); // key-value store bindings
  },
  fs: resolveFsSomehow(), // file system bindings, like node:fs
  path: resolvePathSomehow(), // path utilities bindings, like node:path
  commands: resolveCommandsSomehow(), // command bindings to manage workspace commands
  ...
});

// open a workspace (by default, it will create a new workspace if it doesn't exist)
const workspace = await yasumu.openWorkspace({
  path: '/path/to/workspace',
});

// create a new http request (this creates necessary files in the workspace)
const request = await workspace.rest.create({
  name: 'My Request',
  method: 'GET',
  url: 'https://example.com',
});

// send the request
const { response } = await request.send();

console.log(await response.text());

// visualize the file tree object for rest module
const tree = await workspace.rest.generateTree();

console.log(tree);

// create a graphql request
const graphql = await workspace.graphql.create({
  name: 'My Request',
  url: 'https://example.com/graphql',
});

await graphql.setQuery(`
  query {
    hello
  }
`);

// introspect the schema
await graphql.introspect();

// send the request
const result = await graphql.send();
console.log(await result.json());
```

## Workspace structure

A workspace is a directory on which yasumu operates. You can think of it as a project directory. Yasumu creates a set of files and directories in the workspace to store the data. The workspace structure is as follows:

```bash
/workspace-root # workspace dir
  yasumu-workspace.ysl # workspace config file
  /rest # rest module dir
    My Request--1731690201714.ysl # rest entity file
    index.ysi # rest module index file
    /users # rest entity dir
      Get User--1731690201714.ysl # rest entity file
      Get User By Id--1731690201714.ysl # rest entity file
      index.ysi # rest entity index file
  /graphql # graphql module dir
    My Request--1731690201714.ysl # graphql entity file
    index.ysi # graphql module index file
    /users # graphql entity dir
      Get User--1731690201714.ysl # graphql entity file
      Get User By Id--1731690201714.ysl # graphql entity file
      index.ysi # graphql entity index file
  ...
```

The `.ysl` files are written in Yasumu Schema Language, which is a simple, typesafe language that describes the structure of the data. The `.ysi` files are index files that store the metadata about the entities in the module, which is basically a json file.
