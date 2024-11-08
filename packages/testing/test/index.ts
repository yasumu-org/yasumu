import { Yasumu } from '@yasumu/testing';

const dir = import.meta.dirname + '/env-workspace';

const workspace = await Yasumu.openWorkspace({
  path: dir,
});

const nightly = workspace.environments.getEnvironment('Gu3HVpdIiCOgM_1DgX-Cd');

if (!nightly) {
  console.error('noooo');
} else {
  await nightly.addSecret({
    key: 'API_KEY',
  });
}

console.log(await nightly?.getVariable('API_URL'));

// console.log(workspace.getMetadata().getRawData());

// const env = await workspace.environments.createEnvironment({
//   name: 'Nightly',
// });

// await env.addVariable({
//   key: 'API_URL',
//   value: 'https://api.example.com',
//   enabled: true,
// });
