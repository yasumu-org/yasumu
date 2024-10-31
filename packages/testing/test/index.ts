import { Yasumu } from '@yasumu/testing';

const dir = import.meta.dirname + '/__data__';

const workspace = await Yasumu.openWorkspace({
  path: dir,
});

const metadata = workspace.getMetadata();

console.log(metadata.toJSON());

/*
{
  createdAt: '2024-10-31T06:48:39.100Z',
  version: '0.0',
  name: 'Untitled Workspace',
  id: 'f5c15f16-a718-4101-a5c3-8ef53ad843b4'
}
*/
