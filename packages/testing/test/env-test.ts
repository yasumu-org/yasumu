import { yasumu } from '@yasumu/testing';

const workspace = await yasumu.openWorkspace({
  path: import.meta.dirname + '/env-workspace',
});

console.log(await workspace.environments.getEnvironments());
