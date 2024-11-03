import { YasumuRestEntity } from '@yasumu/core';
import { Yasumu } from '@yasumu/testing';

const dir = import.meta.dirname + '/sample-workspace';

const workspace = await Yasumu.openWorkspace({
  path: dir,
});

const target = Object.keys(workspace.getMetadata().getRawData().rest)[0];

let entity: YasumuRestEntity;

if (!target) entity = await workspace.rest.create();
else entity = await workspace.rest.open(target);

await entity.delete();

// console.log(entity.toJSON());

// await entity.setPath('/');
// await entity.rename('New Name');

// console.log(entity.toJSON());
