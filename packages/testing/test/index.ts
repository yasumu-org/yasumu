import { yasumu } from '@yasumu/testing';

const dir = import.meta.dirname + '/env-workspace';

const workspace = await yasumu.openWorkspace({
  path: dir,
});

const nightly = workspace.environments.getEnvironment('Gu3HVpdIiCOgM_1DgX-Cd');

if (!nightly) {
  console.error('noooo');
} else {
  await nightly.addSecret({
    key: 'API_KEY',
    value: '123456',
  });
}

console.log(await nightly?.getSecret('API_KEY'));

// console.log(workspace.getMetadata().getRawData());

// const env = await workspace.environments.createEnvironment({
//   name: 'Nightly',
// });

// await env.addVariable({
//   key: 'API_URL',
//   value: 'https://api.example.com',
//   enabled: true,
// });
