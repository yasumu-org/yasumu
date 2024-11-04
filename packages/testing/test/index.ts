import { YasumuGraphqlEntity, YasumuRestEntity } from '@yasumu/core';
import { Yasumu } from '@yasumu/testing';

const dir = import.meta.dirname + '/sample-workspace';

const workspace = await Yasumu.openWorkspace({
  path: dir,
});

const target = Object.keys(workspace.getMetadata().getRawData().blocks.GraphQL.entities)[0];

let graphql: YasumuGraphqlEntity;
if (!target)
  graphql = await workspace.graphql.create({
    name: 'GraphQL Demo',
    url: 'https://readonlydemo.vendure.io/shop-api',
  });
else graphql = await workspace.graphql.open(target);

console.log(await graphql.introspect());

// let entity: YasumuRestEntity;

// if (!target)
//   entity = await workspace.rest.create({
//     name: 'Get todo by id',
//     url: 'https://jsonplaceholder.typicode.com/todos/1',
//   });
// else entity = await workspace.rest.open(target);

// const request = entity.createInteractiveWebRequest();

// setTimeout(() => request.cancel(), 500);

// await entity.execute({ request });

// console.log(entity.toJSON());

// await entity.delete();

// console.log(entity.toJSON());

// await entity.setPath('/updated-path');
// await entity.rename('New Name');

// console.log(entity.toJSON());
